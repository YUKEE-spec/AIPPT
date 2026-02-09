# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json* ./

RUN npm install --frozen-lockfile 2>/dev/null || npm install

COPY . ./

RUN npm run build

# 生产阶段
FROM nginx:alpine

RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

COPY --from=builder /app/dist .

# 创建 nginx 配置文件，监听 8080 端口
# 注意：这里我们使用 cat heredoc 直接生成配置，不再依赖外部的 nginx.conf 和 entrypoint.sh
# 这样可以简化部署流程，减少文件依赖
RUN cat > /etc/nginx/conf.d/default.conf << 'EOF'
server {
    listen 8080;
    server_name _;
    
    root /usr/share/nginx/html;
    index index.html;
    
    # 允许上传大文件
    client_max_body_size 50M;
    
    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;
    
    # 处理 SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # 代理后端 API 请求
    # 假设后端服务名为 backend，且监听 8080 端口（Zeabur 默认）
    # 如果需要动态配置，Zeabur 会自动处理服务名解析
    location /api/ {
        # 注意：这里直接写死 backend:8080，因为这是 Zeabur 的标准服务发现方式
        # 如果需要更灵活的配置，可以后续再加回 envsubst
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 300s;
        proxy_connect_timeout 300s;
    }

    # 文件服务代理
    location /files/ {
        proxy_pass http://backend:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 健康检查
    location /health {
        proxy_pass http://backend:8080/health;
        proxy_set_header Host $host;
    }
    
    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
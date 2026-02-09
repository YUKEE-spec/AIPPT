# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app

# 假设构建上下文是 frontend 目录
COPY package.json ./
COPY package-lock.json* ./

# 安装依赖
RUN npm install --frozen-lockfile 2>/dev/null || npm install

# 复制前端源代码
COPY . ./

# 构建应用
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 安装 gettext 以获取 envsubst
RUN apk add --no-cache gettext

WORKDIR /usr/share/nginx/html

# 复制构建产物
COPY --from=builder /app/dist .

# 复制 nginx 模板配置
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# 复制并设置启动脚本
COPY entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# 暴露端口
EXPOSE 80

# 启动
ENTRYPOINT ["/docker-entrypoint.sh"]

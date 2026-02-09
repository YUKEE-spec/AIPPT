#!/bin/sh

# 设置默认值
export BACKEND_HOST=${BACKEND_HOST:-backend}
export BACKEND_PORT=${BACKEND_PORT:-5000}

# 动态获取 DNS 解析器 IP (适配 Docker 和 K8s/Zeabur)
# 尝试从 /etc/resolv.conf 获取第一个 nameserver
export DNS_RESOLVER=$(awk '/^nameserver/ {print $2; exit}' /etc/resolv.conf)

# 如果没获取到，回退到 Docker 默认 DNS
if [ -z "$DNS_RESOLVER" ]; then
    export DNS_RESOLVER=127.0.0.11
    echo "Warning: Could not detect DNS resolver from /etc/resolv.conf, using default Docker DNS: $DNS_RESOLVER"
else
    echo "Detected DNS resolver: $DNS_RESOLVER"
fi

echo "BACKEND_HOST=$BACKEND_HOST"
echo "BACKEND_PORT=$BACKEND_PORT"
echo "DNS_RESOLVER=$DNS_RESOLVER"

# 替换 nginx 配置中的环境变量
# 关键修复：显式指定要替换的变量，防止 envsubst 误替换 Nginx 内置变量（如 $host, $uri 等）
# 注意：变量名列表必须用单引号包围，且不能包含 $ 符号（仅列出变量名）
# envsubst 的参数格式是 '$VAR1 $VAR2'
export EXISTING_VARS='${BACKEND_HOST} ${BACKEND_PORT} ${DNS_RESOLVER}'
envsubst "$EXISTING_VARS" < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 验证 nginx 配置
nginx -t

# 启动 nginx
exec nginx -g 'daemon off;'

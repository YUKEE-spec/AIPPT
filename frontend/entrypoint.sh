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
# 移除参数以避免潜在的解析问题，直接替换所有环境变量
envsubst < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 验证 nginx 配置
nginx -t

# 启动 nginx
exec nginx -g 'daemon off;'

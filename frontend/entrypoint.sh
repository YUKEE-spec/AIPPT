#!/bin/sh

# 设置默认值
export BACKEND_HOST=${BACKEND_HOST:-backend}
export BACKEND_PORT=${BACKEND_PORT:-5000}

# 替换 nginx 配置中的环境变量
envsubst '${BACKEND_HOST} ${BACKEND_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# 启动 nginx
exec nginx -g 'daemon off;'

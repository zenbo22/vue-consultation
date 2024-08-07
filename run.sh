#!/bin/bash

# 确保脚本在遇到错误时停止执行
set -e

# 启动 Nginx 服务
nginx -g 'daemon off;'
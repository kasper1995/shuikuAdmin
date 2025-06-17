#!/bin/bash

set -e

# 仓库账号
username='100006070300'
# 仓库密码
password='!@#utao507b'
# 仓库地址
hubAddr="ccr.ccs.tencentyun.com"
# 命名空间
namePlace="shuiku"
# 项目名
projectName="shuiku_admin_web"
# 以时间为标签
tag=$(date "+%Y%m%d%H%M%S")

docker login --username=$username -p $password $hubAddr
docker build -t $hubAddr/$namePlace/$projectName:$tag .
docker push $hubAddr/$namePlace/$projectName:$tag
docker rmi $hubAddr/$namePlace/$projectName:$tag

echo "build image success to "$hubAddr/$namePlace/$projectName:$tag

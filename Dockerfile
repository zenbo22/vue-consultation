# 使用官方 Node.js 的 Docker 镜像作为基础镜像
FROM node:18.20.1

# 设置工作目录为 /app
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package.json package-lock.json ./

# 安装项目依赖
RUN npm install

# 如果你的项目需要全局安装 Vue CLI，可以取消下面一行的注释
# RUN npm install -g @vue/cli

# 将项目文件复制到工作目录
COPY . .

# 构建项目，这里假设你的构建命令是 npm run build
RUN npm run build --no-eslint 

# 端口映射，根据你的应用配置适当端口
EXPOSE 5173

# 启动应用，根据你的应用配置适当的启动命令
CMD ["npm", "run", "serve"]
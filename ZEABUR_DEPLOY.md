# 在 Zeabur 上部署 AIPPT

本指南将帮助你将 AIPPT 项目（前后端分离架构）部署到 [Zeabur](https://zeabur.com) 平台。

## 准备工作

1. 确保你的代码已经推送到 GitHub 仓库。
2. 注册并登录 Zeabur 账号。

## 步骤 1：创建项目

1. 登录 Zeabur 控制台。
2. 点击 "Create Project" 创建一个新项目。
3. 选择区域（建议选择离你最近的区域，如香港或新加坡）。

## 步骤 2：部署后端服务 (Backend)

1. 在项目中点击 "Deploy New Service"。
2. 选择 "Git"，然后选择你的 GitHub 仓库。
3. 在分支选择后，Zeabur 会询问配置。
4. **关键配置**：
   - **Root Directory (根目录)**: 选择 `backend`
     > 我们已经针对 Zeabur 优化了 `backend/Dockerfile`，确保选择 `backend` 作为根目录即可。
4. 点击部署。
5. **修改服务名称**：
   - 部署开始后，点击该服务卡片。
   - 在 "Settings" (设置) -> "Name" (名称) 中，将服务名称修改为 `backend`。
   - *这一步很重要，因为前端通过这个名称连接后端。*
   - **注意**：后端服务通常**不需要**绑定公网域名，除非你需要直接访问 API。如果绑定了域名，访问该域名会直接看到 JSON 数据。
6. **配置持久化存储 (可选但推荐)**：
   - 为了防止数据库和上传的文件在重启后丢失，建议配置 Volume。
   - 在 "Volume" (挂载卷) 标签页，添加两个挂载点：
     - `/app/instance` (用于 SQLite 数据库)
     - `/app/uploads` (用于上传的文件)

## 步骤 3：部署前端服务 (Frontend)

1. 在同一项目中，再次点击 "Deploy New Service"。
2. 选择 "Git"，选择同一个 GitHub 仓库。
3. **关键配置**：
   - **Root Directory (根目录)**: 选择 `frontend`
4. 点击部署。
5. **配置环境变量**：
   - 点击前端服务卡片，进入 "Variables" (环境变量) 标签页。
   - 添加以下变量：
     - `BACKEND_HOST`: `backend` (对应步骤 2 设置的服务名称)
    - `BACKEND_PORT`: `5000` 或 `8080`
      > **注意**：请检查后端服务日志，看它实际监听的是哪个端口（通常是 5000，但有时 Zeabur 会分配 8080）。如果日志显示监听 8080，请将此变量设为 8080。
  - *Zeabur 会自动重新部署前端以应用环境变量。*
6. **绑定域名 (关键步骤)**：
   - **务必将域名绑定在前端服务上，而不是后端服务！**
   - 在 "Networking" (网络) 标签页，点击 "Generate Domain" 生成一个免费域名，或者绑定你自己的域名。
   - 访问该域名即可看到图形化界面。
   - 如果访问域名看到的是 JSON 数据（如 `{"name": "PPTer Customized API"...}`），说明你错误地将域名绑定到了后端服务。请解绑后重新绑定到前端服务。

## 常见问题

**Q: 部署失败，提示 "Distribution onnxruntime... can't be installed" 或 "You're using CPython 3.14"？**
A: 这是因为构建环境使用了过新的 Python 版本（如 3.14），而某些依赖库（如 onnxruntime）尚未支持。
我们已经更新了 `pyproject.toml` 限制 Python 版本为 `<3.13`。
如果问题依旧：
1. 请确保你在部署后端时，**Root Directory** 确实选为了 `backend`，这样 Zeabur 才会使用我们提供的 `Dockerfile` (基于 Python 3.10)。
2. 如果你是通过本地代码上传，尝试删除 `uv.lock` 文件后重新提交部署，让构建过程重新解析依赖。

**Q: 部署失败，提示找不到 pyproject.toml？**
A: 请确保你在部署后端时，**Root Directory** 选为了 `backend`。我们已经在 `backend` 目录下放置了 `pyproject.toml` 的副本。

**Q: 前端访问报错 "Network Error"？**
A: 请检查：
1. 后端服务是否正常运行（Health Check 通过）。
2. 前端环境变量 `BACKEND_HOST` 是否正确填写了后端服务的名称。
3. 两个服务是否在同一个 Zeabur 项目中（同一项目内可以通过服务名互通）。

**Q: 数据库数据丢了？**
A: 请确保为后端服务配置了 Volume 挂载 `/app/instance`。

**Q: 前端服务启动失败，日志显示 "host not found in upstream"？**
A: 这是因为 Nginx 启动时后端服务尚未就绪或域名解析延迟。
我们已经在最新版本中修复了这个问题（使用了动态 Resolver）。请确保你的代码是最新的，并且在 Zeabur 上点击 "Redeploy" 重新部署前端服务。

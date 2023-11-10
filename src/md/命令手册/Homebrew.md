---
title: Homebrew
---
![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-07-130641.png)

地址：https://brew.sh/

安装：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

## 1.基础操作

```bash
# 更新 Homebrew 本身和所有的公式（软件包的描述和安装脚本）
brew update

# 修复潜在的安装问题
# 这会检查并修复文件权限、清理无效的版本链接等
brew doctor
```

## 2.软件包操作

```bash
# 搜索可用的软件包
brew search [package_name]

# 安装指定的软件包
# -v 或 --verbose: 在安装过程中提供更多的输出
# --ignore-dependencies: 忽略所有依赖，只安装指定的软件包
brew install [package_name] [-v] [--ignore-dependencies]

# 卸载指定的软件包
# --force: 当指定的软件包有多个版本时，删除所有版本
brew uninstall [package_name] [--force]

# 升级所有已安装的软件包
brew upgrade

# 升级指定的软件包
brew upgrade [package_name]

# 列出所有已安装的软件包
brew list

# 显示指定软件包的信息，包括其版本、依赖等
brew info [package_name]

# 显示已安装软件包中过时的软件包（有新版本可用的软件包）
brew outdated

# 清理旧版本的软件包
# 可以释放一些磁盘空间，因为 Homebrew 不会自动删除旧版本的软件包
brew cleanup

# 用于从源代码创建新的软件包
# 这需要一个公式文件，通常由软件包的维护者提供
brew create [url]

# 检查某个公式是否有任何问题
# 公式是一个 Ruby 脚本，用于指导 Homebrew 如何安装软件包
brew audit --new-formula [formula]
```

## 3.管理服务

```bash
# 列出所有通过 brew 安装并支持使用 `brew services` 管理的服务
brew services list

# 启动指定的服务
# 当服务启动后，会在开机时自动启动
brew services start [service_name]

# 运行服务，但不设置为开机启动
# 这意味着当你重新启动计算机时，服务不会自动启动
brew services run [service_name]

# 停止指定的服务
# 也会取消该服务的开机自动启动设置
brew services stop [service_name]

# 重新启动服务
# 如果服务正在运行，它会先停止然后再启动。如果服务没有运行，它会直接启动。
brew services restart [service_name]

# 显示指定服务的状态
# 这实际上是 `brew services list` 的一部分，但可以通过 grep 来过滤指定的服务。
brew services list | grep [service_name]

# 清理已卸载的服务
# 这将清除已经不再存在但仍有 plist 文件的服务。
brew services cleanup
```

## 4.GUI 程序操作 (Cask)

Homebrew 除了支持命令行软件包，也提供了一个叫做 Cask 的扩展，允许用户方便地安装 macOS 的 GUI 程序。

```bash
# 搜索可用的 GUI 程序
brew search --casks [app_name]

# 安装指定的 GUI 程序
# --appdir=<path>: 指定安装应用的目录，默认为 /Applications
brew install --cask [app_name] [--appdir=<path>]

# 卸载指定的 GUI 程序
# --zap: 这个选项除了删除应用，还尝试删除应用的相关数据（如配置、缓存等）
brew uninstall --cask [app_name] [--zap]

# 列出所有已安装的 GUI 程序
brew list --casks

# 显示指定 GUI 程序的信息
brew info --cask [app_name]

# 更新所有的 GUI 程序到最新版本
# 注意：'brew upgrade' 命令默认已经考虑了 casks
brew upgrade --cask

# 更新指定的 GUI 程序
brew upgrade --cask [app_name]

# 显示已安装 GUI 程序中过时的程序（有新版本可用的应用）
brew outdated --cask

# 清理旧版本的 GUI 程序
# 注意：'brew cleanup' 命令默认已经考虑了 casks
brew cleanup --cask

# 安装指定版本的 GUI 程序
# 首先，需要先查找可用的版本。然后指定版本号进行安装。
brew search --casks --versions [app_name]
brew install --cask [app_name] --version=[version_number]
```


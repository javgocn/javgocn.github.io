---
title: Git
---
## 1.配置相关 (Configuration)

```bash
# 初始化一个新的 Git 仓库
git init

# 克隆并在本地创建一个远程仓库的副本
git clone <url>

# 配置全局 Git 设置
git config --global <setting_name> <value>

# 为特定仓库配置本地 Git 设置
git config --local <setting_name> <value>

# --------------- 高级配置 ------------------

# 显示您的 Git 配置设置概览
git config --list

# 为 Git 消息设置自定义文本编辑器
git config --global core.editor "<editor_command>"

# 创建一个 Git 命令别名
git config --global alias.<shortcut> <command>

# 开启 Git 输出的自动颜色化
git config --global color.ui auto

# 为特定时间缓存 Git 凭据
git config --global credential.helper 'cache --timeout=<seconds>'

# 配置 git 以检测特定类型的空白错误
git config --global core.whitespace <options>

# 在获取更新时自动修剪远程跟踪分支
git config --global fetch.prune true

# 为 Git 设置自定义差异工具
git config --global diff.tool <tool>

# 为 Git 设置自定义合并工具
git config --global merge.tool <tool>

# 使用自定义差异工具比较更改
git difftool

# 使用自定义合并工具解决合并冲突
git mergetool
```

## 2.文件操作 (File Operations)

```bash
# 显示工作树状态
git status

# 将文件添加到暂存区
git add <file(s)>

# 从工作树和暂存区中移除文件
git rm <file(s)>

# 移动或重命名文件
git mv <old_file> <new_file>

# 带有消息的提交更改
git commit -m "commit message"

# 显示工作树与上次提交之间的差异
git diff

# --------------- 高级操作 ------------------

# 假设一个被跟踪的文件没有更改
git update-index --assume-unchanged <file>

# 恢复正常跟踪更改的行为
git update-index --no-assume-unchanged <file>

# 显示两次提交之间的差异
git diff <commit_id1>..<commit_id2>

# 取消暂存一个文件，但保留在工作目录中
git rm --cached <file_name>
```

## 3.分支与合并 (Branches and Merging)

```bash
# 列出所有分支
git branch

# 创建一个新分支
git branch <branch_name>

# 切换到特定分支
git checkout <branch_name>

# 将一个分支合并到当前分支
git merge <branch_name>

# 删除特定分支
git branch -d <branch_name>

# 列出所有远程分支
git branch -r

# --------------- 高级操作 ------------------

# 列出带有额外信息的分支
git branch -vv

# 基于远程分支创建一个新分支
git checkout -b <branch_name> <remote_name>/<remote_branch>

# 在冲突的情况下取消合并
git merge --abort

# 将当前分支变基到另一个分支
git rebase <branch_name>

# 取消正在进行的变基操作
git rebase --abort

# 交互式变基，用于编辑、压缩、重新排序或删除提交
git rebase -i

# 交互式地将当前分支的提交变基到远程分支
git rebase -i <remote_name>/<remote_branch>
```

## 4.远程存储库 (Remote Repositories)

```bash
# 列出远程仓库
git remote

# 添加一个远程仓库
git remote add <name> <url>

# 从远程仓库获取
git fetch <remote_name>

# 从远程分支拉取更改
git pull <remote_name> <remote_branch>

# 将更改推送到远程仓库
git push <remote_name> <local_branch>

# 删除远程仓库
git remote rm <remote_name>

# 显示特定远程仓库的信息
git remote show <remote_name>

# 显示远程仓库的跟踪分支
git remote show <remote_name> --verbose

# --------------- 高级操作 -------------------

# 从所有远程仓库获取更新
git remote update

# 强制推送更改到远程仓库，覆盖远程历史
git push --force <remote_name> <local_branch>

# 将所有标签推送到远程仓库
git push --tags <remote_name>

# 重命名远程仓库
git remote rename <old_name> <new_name>

# 更改远程仓库的 URL
git remote set-url <name> <new_url>

# 删除过时的远程跟踪分支
git remote prune <remote_name>

# 列出所有已合并到当前分支的远程分支
git branch -r --merged

# 列出所有尚未合并到当前分支的远程分支
git branch -r --no-merged

# 从远程仓库获取更新并修剪过时的远程跟踪分支
git fetch -p

# 跟踪一个远程分支，并设置本地分支自动与之同步
git branch --track <branch_name> <remote_name>/<remote_branch>

# 设置现有本地分支跟踪远程分支
git branch -u <remote_name>/<remote_branch>

# 将分支推送到远程仓库并设置其跟踪远程分支
git push -u <remote_name> <local_branch>

# 删除本地与远程分支之间的跟踪关联
git branch --unset-upstream <branch_name>
```

## 5.提交历史记录 (Commit History)

```bash
# 显示提交历史
git log

# 显示简洁的提交历史
git log --oneline

# 显示分支的提交历史
git log --graph

# 根据作者筛选提交历史
git log --author=<author_name>

# 显示自特定日期起的提交历史
git log --since=<date>

# 显示直到特定日期的提交历史
git log --until=<date>
```

## 6.标签 (Tags)

```bash
# 列出所有标签
git tag

# 在特定提交上创建一个新标签
git tag <tag_name> <commit_id>

# 创建带有消息的注释标签
git tag -a <tag_name> -m "tag message"

# 删除特定标签
git tag -d <tag_name>

# 删除特定的远程标签
git push <remote_name> --delete <tag_name>

# 显示特定标签的信息
git show <tag_name>
```

## 7.暂存 (Stashes)

```bash
# 临时保存工作树中的更改
git stash save "stash message"

# 列出所有暂存
git stash list

# 从特定暂存中应用更改
git stash apply <stash>

# 删除特定的暂存
git stash drop <stash>

# 删除所有暂存
git stash clear
```

## 8.拣选 (Cherry-Picking)

```bash
# 将另一分支上的特定提交应用到当前分支
git cherry-pick <commit_id>
```

## 9.提交管理 (Commit Management)

```bash
# 修改最新的提交
git commit --amend

# 创建一个新的提交，以撤消先前提交的更改
git revert <commit_id>

# 丢弃更改并将 HEAD 移动到特定的提交
git reset --hard <commit_id>

# 将 HEAD 移动到特定的提交，但保留暂存的更改
git reset --soft <commit_id>

# 显示对本地仓库头所做的所有更改的记录
git reflog
```

## 10.子模块、子树和高级子模块 (Submodules, Subtrees, and Advanced Submodules)

```bash
# 将子模块添加到当前仓库
git submodule add <repository_url> <path>

# 递归地初始化并更新所有子模块
git submodule update --init --recursive

# 将子树添加到当前仓库
git subtree add --prefix=<path> <repository_url>

# 初始化仓库中的子模块
git submodule init

# 更新子模块到其最新的提交
git submodule update

# 在每个子模块中执行特定的命令
git submodule foreach <command>

# 注销一个子模块
git submodule deinit <path>
```

## 11.钩子和自动化，以及差异和合并工具 (Hooks and Automation, and Diff and Merge Tools)

```bash
# 定位 Git 仓库中的钩子目录（通常在 .git/hooks/ 中）
git hooks

# 可以添加到钩子目录的特定钩子脚本名称
pre-commit, post-commit, pre-push, post-merge, 等等.

# 使钩子脚本可执行，以确保在必要时触发
chmod +x <hook_script>
```

## 12.与补丁文件交互 (Work with Patches)

```bash
# 为特定的提交生成补丁文件
git format-patch <commit_id>

# 将补丁应用到当前分支
git apply <patch_file>

# 使用 "git am" (apply mailbox) 命令应用补丁
git am <patch_file>
```

## 13.协作 (Collaboration)

```bash
# 生成两次提交之间更改的请求拉取摘要
git request-pull <start_commit> <end_commit> <url>

# 概括提交历史，列出作者及其贡献
git shortlog

# 列出 Git 跟踪的所有文件
git ls-files

# 在 Git 跟踪的文件中搜索指定的模式
git grep <pattern>
```

## 14.二分查找、调试和性能问题 (Bisecting, Debugging, and Performance Issues)

```bash
# 开始一个二分查找会话以找到引入错误的提交
git bisect start

# 将提交标记为“坏”，表示它包含错误
git bisect bad <commit_id>

# 将提交标记为“好”，表示它不包含错误
git bisect good <commit_id>

# 结束二分查找会话并返回到原始分支/提交
git bisect reset

# 验证 Git 仓库的完整性
git fsck

# 运行垃圾收集以优化仓库的性能
git gc

# 删除未跟踪的文件和目录 (谨慎使用)
git clean -df
```

## 15.Tips and Tricks

```bash
# 交互式选择文件的部分（块）进行暂存
git add -p

# 显示特定文件的提交历史和相关的补丁
git log -p <file_name>

# 自定义 git log 输出的格式
git log --pretty=format:"%h - %an, %ar : %s"

# 在提交消息中查找文本 (用于定位特定更改)
git log --grep="<text>"

# 快速查看上次提交后工作目录中的更改
git diff --stat

# 显示带装饰的分支历史，查看分支何时分裂或合并
git log --oneline --decorate --graph

# 暂存工作树中的更改，包括未跟踪的文件
git stash save -u

# 创建一个空提交，用于测试分支保护规则
git commit --allow-empty -m "Empty commit message"

# 设置 git 输出分页器，当输出少于一个屏幕时退出，显示后不清屏
git config --global core.pager 'less -RFX'

# 使用 Git 的自动纠正功能修复误键的命令
git config --global help.autocorrect 1

# 列出 Git 命令的别名
git config --get-regexp alias

# 执行合并的演习，不真正合并分支
git merge --no-commit --no-ff <branch_name>

# 显示仓库结构的树形表示
git ls-tree --name-only -r -t HEAD
```

<hr/>

参考资料：

* 翻译自《Git Cheatsheet》：https://cs.fyi/guide/git-cheatsheet
---
title: 05-Git快速入门
---
## 1.Git 操作流程

### 1.1 代码提交 & 同步

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-25-144416.png)

Git 作为一个分布式版本控制系统，在工作流中主要涉及到五个关键的区域（或者区段）：

1. **工作区 (Working Directory)**

这个区域其实就是我们在自己计算机上看到的文件夹，包含项目的所有文件。这里面的改动（修改、新增、删除文件等）不会自动保存到 Git 版本控制中，我们需要手动使用 `git add` 选择想要跟踪的改动并添加到下个阶段，也就是暂存区。

2. **暂存区 (Staging Area 或 Index)**

当你决定工作区的某些更改值得被跟踪时，你便可以用 `git add` 命令将这些更改添加到暂存区。当然，这里并不是真正的提交，你可以简单理解为预提交你的更改。暂存区其实就是 Git 的一个中间区域，以允许你组织即将提交的更改。只有你执行 `git commit` 命令的时候，暂存区中的更改才会真的被被保存到本地仓库之中。

3. **本地仓库 (Local Repository)**

上一步我们说了，当你提交更改时 (`git commit`)，这些添加到暂存区的更改就会被保存到本地仓库中。本地仓库中包含了你的项目的所有提交历史 (`git commit` 历史)，这是你的项目的版本控制历史，但是需要注意的是此时这些更改仍然存在于你的本地计算机上。

4. **本地远程仓库 (Local Remote)**

你可以将本地仓库理解为你在本地保存的远程仓库的一个引用或快照。当你使用 `git clone` 命令从远程仓库克隆项目时，Git 会创建一个指向该远程仓库的引用（这通常被称为 "origin"）。使用命令如 `git fetch` 可以更新本地远程仓库，这样你可以看到其他人对远程仓库的更改，但这不会更改你的工作区或本地仓库。

> TIP：本地远程仓库就相当于是远程仓库在本地的一个镜像，我们的每一次 `pull / fetch` 操作都将与远程仓库保持同步。

5.  **远程仓库 (Remote Repository)**

远程仓库通常托管在像 GitHub、GitLab 或 Bitbucket 这样的服务上，在工作中这通常是团队成员共享和同步更改的地方。你可以使用 `git push` 将你的本地仓库更改推送到远程仓库，或使用 `git pull` 或 `git fetch` + `git merge` 将远程仓库的更改拉取到你的本地仓库。

### 1.2 代码撤销 & 撤销同步

我们在使用 Git 的过程中，可能会遇到需要撤销某些操作的情况。针对不同的状态（未修改、已修改、已暂存、已提交、已推送），撤销操作的方法也会有所不同。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-25-151142.png)

这里主要涉及到上面除去 “本地远程仓库” 的四个区，还有五种状态：

1. **未修改 (Unmodified)**

在这个状态下，文件与上次提交的版本相同。既然没有进行任何更改，所以没有什么需要撤销的。

2. **已修改 (Modified)**

文件已被修改但尚未通过 `git add` 添加到暂存区，即此时还在工作区中未被 Git 跟踪。

撤销方法如下：

```bash
# 方式一：撤销对指定文件的更改，使其恢复到上次 git add 提交的状态。
git checkout -- [file]

# 方式二：撤销工作区中的所有更改到上次 git add 提交的状态。
git checkout -- .
```

3. **已暂存 (Staged)**

文件已经被 `git add` 添加到暂存区，但是还没有使用 `git commit` 提交到本地仓库。

撤销方法：

```bash
# 方式一：撤销对指定文件的暂存操作，使其回到已修改状态。
git reset HEAD [file]

# 方式二：撤销对所有文件的暂存操作到已修改状态。
git reset HEAD
```

4. **已提交 (Committed)**

暂存区的更改已被 `git commit` 提交到本地仓库。

撤销方法：

```bash
# 方式一：撤销上次提交，但保留更改在暂存区。
git reset --soft HEAD~1

# 方式一：撤销上次提交并将更改放回工作区。
git reset --mixed HEAD~1

# 方式一：完全撤销上次提交，不保留任何更改。
git reset --hard HEAD~1
```

> TIP：如果需要撤销多次提交，可以将 `HEAD~1` 更改为 `HEAD~n`，其中 `n` 是你想撤销的提交数。

5. **已推送 (Pushed)**

更改已被 `git push` 推送到远程仓库。

撤销方法：

```bash
# 方式一：如果你想保留在远程仓库中的错误提交记录，你可以使用如下命令创建一个新的提交，这个提交会撤销先前的更改。
git revert

# 方式二：如果你想完全删除在远程仓库中的错误提交记录，你可以使用如下命令退回到正确的提交，然后使用 git push -f 将更改强制推送到远程仓库。但这是一个有风险的操作，因为它会重写远程仓库的历史，可能会影响其他协作者。
git reset
git push -f
```

> ⚠️ 注意：在使用任何撤销命令之前，最好确保你了解它们的后果，并考虑备份你的工作，以防万一。特别是当涉及到重写 Git 历史或与其他协作者合作时，要特别小心。

## 2.Git 常用命令

### 2.1 代码提交 & 同步代码

1. 确保你的工作区文件与远程仓库保持一致。

2. 对工作区的文件进行增删改操作，使其变为修改状态。

3. 通过 `git add` 命令将工作区的修改添加到暂存区，交给 Git 跟踪。

   ```bash
   # 查看工作区文件状态
   git status
   
   # 添加当前目录下的所有更改到暂存区
   git add --all
   
   # 添加当前目录下的所有更改到暂存区（等同于上面的命令）
   git add .
   
   # 添加指定文件到暂存区
   git add xx/xx.java xx/xx2.java
   ```

4. 通过 `git commit` 命令将暂存区的内容提交到本地仓库。

   ```bash
   git commit -m "<本次提交的描述（重要）>"
   ```

5. 通过 `git push` 将本地仓库的变更推送到远程仓库完成代码同步。

   ```bash
   # 首次推送需要关联远程分支（格式：git push -u 指向远程仓库的引用 远程仓库的分支）
   git push -u origin master
   
   # 后续再推送时就不必再指明应该推送的远程分支
   git push
   
   # 查看本地仓库的分支
   git branch
   
   # 查看 本地仓库 和 本地远程仓库（远程仓库的本地镜像） 的所有分支
   git branch -a
   ```

<hr/>

<center>某分支下的常用操作</center>

```bash
# 查看当前分支的状态，包括未提交的更改和已暂存的更改。
git status

# 将当前目录中所有的更改（包括新文件、修改和删除的文件）添加到暂存区。
git add -all  或 git add -a 或 git add .

# 再次查看状态以确保所有更改都已成功添加到暂存区。
git status

# 将暂存区中的更改提交到当前分支，并附带一条描述性的提交消息。
git commit -m 'xxxxxx'

# 从远程仓库拉取最新的更改，并将你的本地提交重新应用到拉取的更改之上。
# 有助于保持提交历史的整洁，并减少合并冲突的可能性。
git pull --rebase

# 将你的本地分支（通常是当前分支）的更改推送到远程仓库的同名分支。
# 这将更新远程仓库，使其包含你最新的更改，使其他协作者可以访问这些更改。
git push origin xxbranch
```

### 2.2 代码撤销 & 撤销同步

1. 已修改，但未通过 `git add` 命令进行暂存。

   ```bash
   # 列出所有的修改。
   git diff
   
   # 列出某(几)个文件的修改。
   git diff xx/xx.java xx/xx2.java
   
   # 撤销工作区下所有的修改。
   git checkout
   
   # 撤销当前文件夹下所有的修改。
   git checkout .
   
   # 撤销某几个文件的修改。
   git checkout xx/xx.java xx/xx2.java
   
   # Untracked 状态，撤销新增的文件
   git clean -f
   
   # Untracked 状态，撤销新增的文件和文件夹
   git clean -df
   ```

2. 已暂存，但未通过 `git commit` 命令进行提交。

   > 注意：此时已经通过 `git add` 命令将修改添加到暂存区了，但是该没有执行 `git commit` 命令进行提价。此时用 `git diff` 已经看不到任何修改，因为 `git diff` 检查的是工作区与暂存区之间的差异。

   ```bash
   # 显示暂存区和本地仓库的差异？？？到底是本地仓库还是工作区？？？
   git diff --cached
   
   # 将暂存区的修改恢复到工作区。
   git reset
   
   # 等价于 git reset，回滚到已修改的状态，修改的内容仍然在工作区中。
   git reset --soft
   
   # 回滚到未修改的状态，清空暂存区和工作区？？怎么理解?
   git reset --hard
   ```

   > TIP：上面的 `git reset --hard` 其实就等价于 `git reset` + `git checkout` 两个操作的组合效果。

3. 已提交，但未通过 git push 命令进行推送。

   > 注意：此时已经通过 git commit 命令进行提交到本地仓库了，这会在本地仓库中生成一个版本号（hash 值）标记本次提交。之后的任何时候，我们都可以借助这个哈希值回退到本次提交。

   ```bash
   # 比较两个分支之间的差异
   git diff <branch-name-1> <branch-name-2>
   
   # 查看本地仓库与本地远程仓库的差异（分支名以实际为准）
   git diff master origin/master
   
   # 回退与本地远程仓库一致
   git reset --hard origin/master
   
   # 回退到本地仓库的上一个版本
   git reset --hard HEAD^
   
   # 回退到本地仓库的任意版本？
   git reset --hard <hash code>
   
   # 回退且回到已修改的状态，修改仍然保留在工作区之中
   git reset --soft/git reset
   ```

4. 已推送到远程仓库。

   ```bash
   # 强制覆盖远程分支
   git push -f origin master
   
   # 如果之前已经使用 -u 关联过远程仓库，则可以省略分支名
   git push -f
   ```

   > 注意：请慎用上面的命令！一般而言，本地分支比远程分支新，所以可以直接推送到远程仓库。但是有时候推送到远程仓库后才发现有问题，于是进行了版本回退，旧版本或者分叉版本推送到远程仓库就需要添加 -f 参数来强制覆盖远程仓库。

### 2.3 关联远程仓库

如果你该没有初始化 git 仓库，需要在工作区目录下先执行一下命令：

```bash
git init
```

此时，如果你想要关联到某个远程仓库，可以使用如下命令：

```bash
# 下面的两个参数：远程仓库的名称、远程仓库地址
git remote add <name> <git-repo-url>

# 关联示例：
git remote add origin https://github.com/xxx
```

上面只是关联一个仓库，如果你想要关联多个远程仓库你可以使用如下命令：

```bash
git remote add <name> <another-git-repo-url>

# 关联示例：
git remote add coding https://coding.net/xxx
```

如果你忘记具体关联了哪些仓库，可以使用如下命令进行查看：

```bash
git remote -v
```

如果已经有了远程仓库，你可以使用如下命令进行 Clone 到本地：

```bash
# 默认情况下，被关联的远程仓库会被命名为 origin。
git clone <git-repo-url>
```

如果你想要将别人的仓库地址修改为自己的，可以执行如下命令：(不能理解！)

```bash
git remote set-url origin <git-repo-url>
```

### 2.4 切换分支

> TIP：一般而言，当我们新建一个仓库后，默认就生成了 master 分支。但是在后面的 GitHub 中，现在主要是 main 分支，需要特别注意！一般我们还是建议使用 master 分支，你可以在 GitHub 进行仓库创建的时候进行设置。

如果你想新建一个分支并切换可以执行如下命令：

```bash
# 如果仅仅是新建分支而不切换，则去掉 -b 即可
git checkout -b <new-branch-name>

# 示例：
git checkout -b dev
```

以下命令可以查看当前有哪些分支：

```bash
git branch

# 示例：（标 * 号的代表当前所在的分支）
# * dev
#   master
```

以下命令可以查看当前本地 & 远程仓库有哪些分支：

```bash
git branch -a

# 示例：
# * dev
#   master
#   remotes/origin/master
```

以下命令用于切换至现有分支：

```bash
git checkout <branch-name>
```

当你在自己的分支开发测试完成后，如果你想把 dev 分支合并到 master 主分支，可以执行如下命令：

```bash
git merge <branch-name>

# 示例：
git merge dev
```

在合并完成后，如果你想把本地的 master 分支推送到远程仓库，可以执行如下命令：

```bash
git push origin master
```

> TIP：你可以使用 git push -u origin master 命令将本地分支与远程分支进行关联，后续再推送时只需要使用 git push 即可。

如果远程分支被你的同事更新了，你可以使用如下命令进行更新：

```bash
git pull origin <branch-name>
```

> TIP：如果之前在 push 的时候使用过 -u 进行了关联，此时就可以只使用 git pull 即可。

如果本地有修改，能不能先 git pull？

```bash
# 工作区修改暂存
git stash

# 更新分支
git pull

# 暂存修改恢复到工作区
git stash pop
```

### 2.5 撤销操作

恢复暂存区文件到工作区：

```bash
git checkout <file-name>
```

恢复暂存区的所有文件到工作区：

```bash
git checkout .
```

重置暂存区的某个文件，使其与上一次 commit 保持一致，但工作区不变：

```bash
git reset <file-name>
```

重置暂存区与工作区，与上一次 commit 保持一致：

```bash
# 如果是回退版本 (commit)，那么 file-name，变成 commit 的 hash 码即可
git reset --hard <file-name>
```

去掉某个 commit：

```bash
# 实质是新建了一个与原来完全相反的 commit，抵消了原来 commit 的效果
git revert <commit-hash>
```

reset 回退错误恢复：

```bash
# 查看最近操作记录
git reflog

# 恢复到前五笔操作
git reset --hard HEAD{5}

# 再次拉取代码
git pull origin backend-log
```

### 2.6 版本回退与前进

查看历史版本：

```bash
git log
```

你可能觉得这样的 log 不好看，试试这个：

```bash
git log --graph --decorate --abbrev-commit --all
```

检出到任意版本：

```bash
# hash 码很长，通常 6-7 位就够了
git checkout <commit-hash>
```

远程仓库的版本很新，但是你还是想用老版本覆盖：

```bash
git push origin master --force

# 或者
git push -f origin master
```

觉得 commit 太多了? 多个 commit 合并为1个：

```bash
# 这个命令，将最近 4 个 commit 合并为1个，HEAD 代表当前版本。将进入 VIM 界面，你可以修改提交信息。推送到远程分支的 commit，不建议这样做，多人合作时，通常不建议修改历史。
git rebase -i HEAD~4
```

想回退到某一个版本：

```bash
# --hard 代表丢弃工作区的修改，让工作区与版本代码一模一样，与之对应，--soft 参数代表保留工作区的修改。
git reset --hard <hash>
```

想回退到上一个版本，有没有简便方法?

```bash
git reset --hard HEAD^
```

回退到上上个版本呢?

```bash
git reset --hard HEAD^^
```

回退错了，能不能前进呀：

```bash
# 这个命令保留了最近执行的操作及所处的版本，每条命令前的 hash 值，则是对应版本的 hash 值。使用上述的 git checkout  或者 git reset 命令 则可以检出或回退到对应版本。
git reflog
```

刚才 commit 信息写错了，可以修改吗：

```bash
git commit --amend
```

看看当前状态吧：

```bash
git status
```

### 2.7 配置 Git

查看当前 Git 配置：

```bash
git config --list
```

配置代码提交时的名字：

```bash
# --global 为可选参数，表示配置全局信息
git config --global user.name "<name>"
```

进一步你还可以配置自己的邮箱信息，方便别人联系你：

```bash
git config --global user.email "<email address>"
```

有些命令很长能不能简化一下？

```bash
git config --global alias.logg "log --graph --decorate --abbrev-commit --all"
```

## 3.gitignore

在使用 Git 的过程中，我们喜欢有的文件比如日志，临时文件，编译的中间文件等不要提交到代码仓库，这时就要设置相应的忽略规则，来忽略这些文件的提交。

| 规则          | 作用                       |
| ------------- | -------------------------- |
| /mtk          | 过滤整个文件夹             |
| *.zip         | 过滤所有.zip 文件          |
| /mtk/do.c     | 过滤某个具体文件           |
| !/mtk/one.txt | 追踪（不过滤）某个具体文件 |

> ⚠️ 注意：如果你创建 .gitignore 文件之前就 push 了某一文件，那么即使你在 .gitignore 文件中写入过滤该文件的规则，该规则也不会起作用，git 仍然会对该文件进行版本管理。

配置语法：

* 以斜杠 “/” 开头表示目录；
* 以星号 “*” 通配多个字符；
* 以问号 “?” 通配单个字符；
* 以方括号 “[]” 包含单个字符的匹配列表；
* 以叹号 “!” 表示不忽略 (跟踪) 匹配到的文件或目录；

> ⚠️ 注意： git 对于 .gitignore 配置文件是按行从上到下进行规则匹配的。

### 3.1 Git 忽略文件提交的方法

有三种方法可以实现忽略 Git 中不想提交的文件。

### 3.1.1 在 Git 项目中定义 .gitignore 文件

这种方式通过在项目的某个文件夹下定义 .gitignore 文件，在该文件中定义相应的忽略规则，来管理当前文件夹下的文件的Git提交行为。

.gitignore 文件是可以提交到共有仓库中，这就为该项目下的所有开发者都共享一套定义好的忽略规则。

在 .gitingore 文件中，遵循相应的语法，在每一行指定一个忽略规则。如：

```
*.log
*.temp
/vendor
```

### 3.1.2 在 Git 项目的设置中指定排除文件

这种方式只是临时指定该项目的行为，需要编辑当前项目下的 .git/info/exclude 文件，然后将需要忽略提交的文件写入其中。

需要注意的是，这种方式指定的忽略文件的根目录是项目根目录。

### 3.1.3 定义 Git 全局的 .gitignore 文件

除了可以在项目中定义 .gitignore 文件外，还可以设置全局的 git .gitignore 文件来管理所有Git项目的行为。这种方式在不同的项目开发者之间是不共享的，是属于项目之上Git应用级别的行为。

这种方式也需要创建相应的 .gitignore 文件，可以放在任意位置。然后在使用以下命令配置Git：

```
git config --global core.excludesfile ~/.gitignore
```

### 3.2 Git 忽略规则

详细的忽略规则可以参考[官方英文文档](https://git-scm.com/docs/gitignore)

### 3.3 Git 忽略优先级

在 .gitingore 文件中，每一行指定一个忽略规则，Git 检查忽略规则的时候有多个来源，它的优先级如下（由高到低）：

- 从命令行中读取可用的忽略规则
- 当前目录定义的规则
- 父级目录定义的规则，依次地推
- $GIT_DIR/info/exclude 文件中定义的规则
- core.excludesfile中定义的全局规则

### 3.4 Git 忽略规则匹配语法

在 .gitignore 文件中，每一行的忽略规则的语法如下：

- `空格`不匹配任意文件，可作为分隔符，可用反斜杠转义
- `# 开头`的模式标识注释，可以使用反斜杠进行转义
- `! 开头`的模式标识否定，该文件将会再次被包含，**如果排除了该文件的父级目录，则使用 ! 也不会再次被包含**。可以使用反斜杠进行转义
- `/ 结束`的模式只匹配文件夹以及在该文件夹路径下的内容，但是不匹配该文件
- `/ 开始`的模式匹配项目跟目录
- 如果一个模式不包含斜杠，则它匹配相对于当前 .gitignore 文件路径的内容，如果该模式不在 .gitignore 文件中，则相对于项目根目录
- `**`匹配多级目录，可在开始，中间，结束
- `?`通用匹配单个字符
- `[]`通用匹配单个字符列表

### 3.5 常用匹配示例

- bin/: 忽略当前路径下的bin文件夹，该文件夹下的所有内容都会被忽略，不忽略 bin 文件
- /bin: 忽略根目录下的bin文件
- /*.c: 忽略 cat.c，不忽略 build/cat.c
- debug/*.obj: 忽略 debug/io.obj，不忽略 debug/common/io.obj 和 tools/debug/io.obj
- **/foo: 忽略/foo, a/foo, a/b/foo等
- a/**/b: 忽略a/b, a/x/b, a/x/y/b等
- !/bin/run.sh: 不忽略 bin 目录下的 run.sh 文件
- *.log: 忽略所有 .log 文件
- config.php: 忽略当前路径的 config.php 文件

### 3.6 .gitignore 规则不生效问题

.gitignore只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。

解决方法就是先把本地缓存删除（改变成未track状态），然后再提交:

```
git rm -r --cached .
git add .
git commit -m 'update .gitignore'
```

<hr/>

参考资料：

* https://www.jianshu.com/p/74bd0ceb6182
* https://www.pdai.tech/md/devops/tool/tool-git.html
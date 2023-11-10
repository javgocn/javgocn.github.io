import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as e}from"./app-009ef08a.js";const t={},o=e(`<h2 id="_1-配置相关-configuration" tabindex="-1"><a class="header-anchor" href="#_1-配置相关-configuration" aria-hidden="true">#</a> 1.配置相关 (Configuration)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 初始化一个新的 Git 仓库</span>
<span class="token function">git</span> init
<span class="token comment"># 克隆并在本地创建一个远程仓库的副本</span>
<span class="token function">git</span> clone <span class="token operator">&lt;</span>url<span class="token operator">&gt;</span>
<span class="token comment"># 配置全局 Git 设置</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> <span class="token operator">&lt;</span>setting_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>value<span class="token operator">&gt;</span>
<span class="token comment"># 为特定仓库配置本地 Git 设置</span>
<span class="token function">git</span> config <span class="token parameter variable">--local</span> <span class="token operator">&lt;</span>setting_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>value<span class="token operator">&gt;</span>

<span class="token comment"># --------------- 高级配置 ------------------</span>

<span class="token comment"># 显示您的 Git 配置设置概览</span>
<span class="token function">git</span> config <span class="token parameter variable">--list</span>
<span class="token comment"># 为 Git 消息设置自定义文本编辑器</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> core.editor <span class="token string">&quot;&lt;editor_command&gt;&quot;</span>
<span class="token comment"># 创建一个 Git 命令别名</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> alias.<span class="token operator">&lt;</span>shortcut<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>command<span class="token operator">&gt;</span>
<span class="token comment"># 开启 Git 输出的自动颜色化</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> color.ui auto
<span class="token comment"># 为特定时间缓存 Git 凭据</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> credential.helper <span class="token string">&#39;cache --timeout=&lt;seconds&gt;&#39;</span>
<span class="token comment"># 配置 git 以检测特定类型的空白错误</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> core.whitespace <span class="token operator">&lt;</span>options<span class="token operator">&gt;</span>
<span class="token comment"># 在获取更新时自动修剪远程跟踪分支</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> fetch.prune <span class="token boolean">true</span>
<span class="token comment"># 为 Git 设置自定义差异工具</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> diff.tool <span class="token operator">&lt;</span>tool<span class="token operator">&gt;</span>
<span class="token comment"># 为 Git 设置自定义合并工具</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> merge.tool <span class="token operator">&lt;</span>tool<span class="token operator">&gt;</span>
<span class="token comment"># 使用自定义差异工具比较更改</span>
<span class="token function">git</span> difftool
<span class="token comment"># 使用自定义合并工具解决合并冲突</span>
<span class="token function">git</span> mergetool
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-文件操作-file-operations" tabindex="-1"><a class="header-anchor" href="#_2-文件操作-file-operations" aria-hidden="true">#</a> 2.文件操作 (File Operations)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 显示工作树状态</span>
<span class="token function">git</span> status
<span class="token comment"># 将文件添加到暂存区</span>
<span class="token function">git</span> <span class="token function">add</span> <span class="token operator">&lt;</span>file<span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token operator">&gt;</span>
<span class="token comment"># 从工作树和暂存区中移除文件</span>
<span class="token function">git</span> <span class="token function">rm</span> <span class="token operator">&lt;</span>file<span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token operator">&gt;</span>
<span class="token comment"># 移动或重命名文件</span>
<span class="token function">git</span> <span class="token function">mv</span> <span class="token operator">&lt;</span>old_file<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>new_file<span class="token operator">&gt;</span>
<span class="token comment"># 带有消息的提交更改</span>
<span class="token function">git</span> commit <span class="token parameter variable">-m</span> <span class="token string">&quot;commit message&quot;</span>
<span class="token comment"># 显示工作树与上次提交之间的差异</span>
<span class="token function">git</span> <span class="token function">diff</span>

<span class="token comment"># --------------- 高级操作 ------------------</span>

<span class="token comment"># 假设一个被跟踪的文件没有更改</span>
<span class="token function">git</span> update-index --assume-unchanged <span class="token operator">&lt;</span>file<span class="token operator">&gt;</span>
<span class="token comment"># 恢复正常跟踪更改的行为</span>
<span class="token function">git</span> update-index --no-assume-unchanged <span class="token operator">&lt;</span>file<span class="token operator">&gt;</span>
<span class="token comment"># 显示两次提交之间的差异</span>
<span class="token function">git</span> <span class="token function">diff</span> <span class="token operator">&lt;</span>commit_id<span class="token operator"><span class="token file-descriptor important">1</span>&gt;</span><span class="token punctuation">..</span><span class="token operator">&lt;</span>commit_id<span class="token operator"><span class="token file-descriptor important">2</span>&gt;</span>
<span class="token comment"># 取消暂存一个文件，但保留在工作目录中</span>
<span class="token function">git</span> <span class="token function">rm</span> <span class="token parameter variable">--cached</span> <span class="token operator">&lt;</span>file_name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-分支与合并-branches-and-merging" tabindex="-1"><a class="header-anchor" href="#_3-分支与合并-branches-and-merging" aria-hidden="true">#</a> 3.分支与合并 (Branches and Merging)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 列出所有分支</span>
<span class="token function">git</span> branch
<span class="token comment"># 创建一个新分支</span>
<span class="token function">git</span> branch <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token comment"># 切换到特定分支</span>
<span class="token function">git</span> checkout <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token comment"># 将一个分支合并到当前分支</span>
<span class="token function">git</span> merge <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token comment"># 删除特定分支</span>
<span class="token function">git</span> branch <span class="token parameter variable">-d</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token comment"># 列出所有远程分支</span>
<span class="token function">git</span> branch <span class="token parameter variable">-r</span>

<span class="token comment"># --------------- 高级操作 ------------------</span>

<span class="token comment"># 列出带有额外信息的分支</span>
<span class="token function">git</span> branch <span class="token parameter variable">-vv</span>
<span class="token comment"># 基于远程分支创建一个新分支</span>
<span class="token function">git</span> checkout <span class="token parameter variable">-b</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>/<span class="token operator">&lt;</span>remote_branch<span class="token operator">&gt;</span>
<span class="token comment"># 在冲突的情况下取消合并</span>
<span class="token function">git</span> merge <span class="token parameter variable">--abort</span>
<span class="token comment"># 将当前分支变基到另一个分支</span>
<span class="token function">git</span> rebase <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token comment"># 取消正在进行的变基操作</span>
<span class="token function">git</span> rebase <span class="token parameter variable">--abort</span>
<span class="token comment"># 交互式变基，用于编辑、压缩、重新排序或删除提交</span>
<span class="token function">git</span> rebase <span class="token parameter variable">-i</span>
<span class="token comment"># 交互式地将当前分支的提交变基到远程分支</span>
<span class="token function">git</span> rebase <span class="token parameter variable">-i</span> <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>/<span class="token operator">&lt;</span>remote_branch<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-远程存储库-remote-repositories" tabindex="-1"><a class="header-anchor" href="#_4-远程存储库-remote-repositories" aria-hidden="true">#</a> 4.远程存储库 (Remote Repositories)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 列出远程仓库</span>
<span class="token function">git</span> remote
<span class="token comment"># 添加一个远程仓库</span>
<span class="token function">git</span> remote <span class="token function">add</span> <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>url<span class="token operator">&gt;</span>
<span class="token comment"># 从远程仓库获取</span>
<span class="token function">git</span> fetch <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>
<span class="token comment"># 从远程分支拉取更改</span>
<span class="token function">git</span> pull <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>remote_branch<span class="token operator">&gt;</span>
<span class="token comment"># 将更改推送到远程仓库</span>
<span class="token function">git</span> push <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>local_branch<span class="token operator">&gt;</span>
<span class="token comment"># 删除远程仓库</span>
<span class="token function">git</span> remote <span class="token function">rm</span> <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>
<span class="token comment"># 显示特定远程仓库的信息</span>
<span class="token function">git</span> remote show <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>
<span class="token comment"># 显示远程仓库的跟踪分支</span>
<span class="token function">git</span> remote show <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span> <span class="token parameter variable">--verbose</span>

<span class="token comment"># --------------- 高级操作 -------------------</span>

<span class="token comment"># 从所有远程仓库获取更新</span>
<span class="token function">git</span> remote update
<span class="token comment"># 强制推送更改到远程仓库，覆盖远程历史</span>
<span class="token function">git</span> push <span class="token parameter variable">--force</span> <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>local_branch<span class="token operator">&gt;</span>
<span class="token comment"># 将所有标签推送到远程仓库</span>
<span class="token function">git</span> push <span class="token parameter variable">--tags</span> <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>
<span class="token comment"># 重命名远程仓库</span>
<span class="token function">git</span> remote <span class="token function">rename</span> <span class="token operator">&lt;</span>old_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>new_name<span class="token operator">&gt;</span>
<span class="token comment"># 更改远程仓库的 URL</span>
<span class="token function">git</span> remote set-url <span class="token operator">&lt;</span>name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>new_url<span class="token operator">&gt;</span>
<span class="token comment"># 删除过时的远程跟踪分支</span>
<span class="token function">git</span> remote prune <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>
<span class="token comment"># 列出所有已合并到当前分支的远程分支</span>
<span class="token function">git</span> branch <span class="token parameter variable">-r</span> <span class="token parameter variable">--merged</span>
<span class="token comment"># 列出所有尚未合并到当前分支的远程分支</span>
<span class="token function">git</span> branch <span class="token parameter variable">-r</span> --no-merged
<span class="token comment"># 从远程仓库获取更新并修剪过时的远程跟踪分支</span>
<span class="token function">git</span> fetch <span class="token parameter variable">-p</span>

<span class="token comment"># 跟踪一个远程分支，并设置本地分支自动与之同步</span>
<span class="token function">git</span> branch <span class="token parameter variable">--track</span> <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>/<span class="token operator">&lt;</span>remote_branch<span class="token operator">&gt;</span>
<span class="token comment"># 设置现有本地分支跟踪远程分支</span>
<span class="token function">git</span> branch <span class="token parameter variable">-u</span> <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span>/<span class="token operator">&lt;</span>remote_branch<span class="token operator">&gt;</span>
<span class="token comment"># 将分支推送到远程仓库并设置其跟踪远程分支</span>
<span class="token function">git</span> push <span class="token parameter variable">-u</span> <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>local_branch<span class="token operator">&gt;</span>
<span class="token comment"># 删除本地与远程分支之间的跟踪关联</span>
<span class="token function">git</span> branch --unset-upstream <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_5-提交历史记录-commit-history" tabindex="-1"><a class="header-anchor" href="#_5-提交历史记录-commit-history" aria-hidden="true">#</a> 5.提交历史记录 (Commit History)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 显示提交历史</span>
<span class="token function">git</span> log
<span class="token comment"># 显示简洁的提交历史</span>
<span class="token function">git</span> log <span class="token parameter variable">--oneline</span>
<span class="token comment"># 显示分支的提交历史</span>
<span class="token function">git</span> log <span class="token parameter variable">--graph</span>
<span class="token comment"># 根据作者筛选提交历史</span>
<span class="token function">git</span> log <span class="token parameter variable">--author</span><span class="token operator">=</span><span class="token operator">&lt;</span>author_name<span class="token operator">&gt;</span>
<span class="token comment"># 显示自特定日期起的提交历史</span>
<span class="token function">git</span> log <span class="token parameter variable">--since</span><span class="token operator">=</span><span class="token operator">&lt;</span>date<span class="token operator">&gt;</span>
<span class="token comment"># 显示直到特定日期的提交历史</span>
<span class="token function">git</span> log <span class="token parameter variable">--until</span><span class="token operator">=</span><span class="token operator">&lt;</span>date<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_6-标签-tags" tabindex="-1"><a class="header-anchor" href="#_6-标签-tags" aria-hidden="true">#</a> 6.标签 (Tags)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 列出所有标签</span>
<span class="token function">git</span> tag
<span class="token comment"># 在特定提交上创建一个新标签</span>
<span class="token function">git</span> tag <span class="token operator">&lt;</span>tag_name<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>commit_id<span class="token operator">&gt;</span>
<span class="token comment"># 创建带有消息的注释标签</span>
<span class="token function">git</span> tag <span class="token parameter variable">-a</span> <span class="token operator">&lt;</span>tag_name<span class="token operator">&gt;</span> <span class="token parameter variable">-m</span> <span class="token string">&quot;tag message&quot;</span>
<span class="token comment"># 删除特定标签</span>
<span class="token function">git</span> tag <span class="token parameter variable">-d</span> <span class="token operator">&lt;</span>tag_name<span class="token operator">&gt;</span>
<span class="token comment"># 删除特定的远程标签</span>
<span class="token function">git</span> push <span class="token operator">&lt;</span>remote_name<span class="token operator">&gt;</span> <span class="token parameter variable">--delete</span> <span class="token operator">&lt;</span>tag_name<span class="token operator">&gt;</span>
<span class="token comment"># 显示特定标签的信息</span>
<span class="token function">git</span> show <span class="token operator">&lt;</span>tag_name<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-暂存-stashes" tabindex="-1"><a class="header-anchor" href="#_7-暂存-stashes" aria-hidden="true">#</a> 7.暂存 (Stashes)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 临时保存工作树中的更改</span>
<span class="token function">git</span> stash save <span class="token string">&quot;stash message&quot;</span>
<span class="token comment"># 列出所有暂存</span>
<span class="token function">git</span> stash list
<span class="token comment"># 从特定暂存中应用更改</span>
<span class="token function">git</span> stash apply <span class="token operator">&lt;</span>stash<span class="token operator">&gt;</span>
<span class="token comment"># 删除特定的暂存</span>
<span class="token function">git</span> stash drop <span class="token operator">&lt;</span>stash<span class="token operator">&gt;</span>
<span class="token comment"># 删除所有暂存</span>
<span class="token function">git</span> stash <span class="token function">clear</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_8-拣选-cherry-picking" tabindex="-1"><a class="header-anchor" href="#_8-拣选-cherry-picking" aria-hidden="true">#</a> 8.拣选 (Cherry-Picking)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 将另一分支上的特定提交应用到当前分支</span>
<span class="token function">git</span> cherry-pick <span class="token operator">&lt;</span>commit_id<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_9-提交管理-commit-management" tabindex="-1"><a class="header-anchor" href="#_9-提交管理-commit-management" aria-hidden="true">#</a> 9.提交管理 (Commit Management)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 修改最新的提交</span>
<span class="token function">git</span> commit <span class="token parameter variable">--amend</span>
<span class="token comment"># 创建一个新的提交，以撤消先前提交的更改</span>
<span class="token function">git</span> revert <span class="token operator">&lt;</span>commit_id<span class="token operator">&gt;</span>
<span class="token comment"># 丢弃更改并将 HEAD 移动到特定的提交</span>
<span class="token function">git</span> reset <span class="token parameter variable">--hard</span> <span class="token operator">&lt;</span>commit_id<span class="token operator">&gt;</span>
<span class="token comment"># 将 HEAD 移动到特定的提交，但保留暂存的更改</span>
<span class="token function">git</span> reset <span class="token parameter variable">--soft</span> <span class="token operator">&lt;</span>commit_id<span class="token operator">&gt;</span>
<span class="token comment"># 显示对本地仓库头所做的所有更改的记录</span>
<span class="token function">git</span> reflog
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_10-子模块、子树和高级子模块-submodules-subtrees-and-advanced-submodules" tabindex="-1"><a class="header-anchor" href="#_10-子模块、子树和高级子模块-submodules-subtrees-and-advanced-submodules" aria-hidden="true">#</a> 10.子模块、子树和高级子模块 (Submodules, Subtrees, and Advanced Submodules)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 将子模块添加到当前仓库</span>
<span class="token function">git</span> submodule <span class="token function">add</span> <span class="token operator">&lt;</span>repository_url<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>path<span class="token operator">&gt;</span>
<span class="token comment"># 递归地初始化并更新所有子模块</span>
<span class="token function">git</span> submodule update <span class="token parameter variable">--init</span> <span class="token parameter variable">--recursive</span>
<span class="token comment"># 将子树添加到当前仓库</span>
<span class="token function">git</span> subtree <span class="token function">add</span> <span class="token parameter variable">--prefix</span><span class="token operator">=</span><span class="token operator">&lt;</span>path<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>repository_url<span class="token operator">&gt;</span>
<span class="token comment"># 初始化仓库中的子模块</span>
<span class="token function">git</span> submodule init
<span class="token comment"># 更新子模块到其最新的提交</span>
<span class="token function">git</span> submodule update
<span class="token comment"># 在每个子模块中执行特定的命令</span>
<span class="token function">git</span> submodule foreach <span class="token operator">&lt;</span>command<span class="token operator">&gt;</span>
<span class="token comment"># 注销一个子模块</span>
<span class="token function">git</span> submodule deinit <span class="token operator">&lt;</span>path<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_11-钩子和自动化-以及差异和合并工具-hooks-and-automation-and-diff-and-merge-tools" tabindex="-1"><a class="header-anchor" href="#_11-钩子和自动化-以及差异和合并工具-hooks-and-automation-and-diff-and-merge-tools" aria-hidden="true">#</a> 11.钩子和自动化，以及差异和合并工具 (Hooks and Automation, and Diff and Merge Tools)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 定位 Git 仓库中的钩子目录（通常在 .git/hooks/ 中）</span>
<span class="token function">git</span> hooks
<span class="token comment"># 可以添加到钩子目录的特定钩子脚本名称</span>
pre-commit, post-commit, pre-push, post-merge, 等等.
<span class="token comment"># 使钩子脚本可执行，以确保在必要时触发</span>
<span class="token function">chmod</span> +x <span class="token operator">&lt;</span>hook_script<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_12-与补丁文件交互-work-with-patches" tabindex="-1"><a class="header-anchor" href="#_12-与补丁文件交互-work-with-patches" aria-hidden="true">#</a> 12.与补丁文件交互 (Work with Patches)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 为特定的提交生成补丁文件</span>
<span class="token function">git</span> format-patch <span class="token operator">&lt;</span>commit_id<span class="token operator">&gt;</span>
<span class="token comment"># 将补丁应用到当前分支</span>
<span class="token function">git</span> apply <span class="token operator">&lt;</span>patch_file<span class="token operator">&gt;</span>
<span class="token comment"># 使用 &quot;git am&quot; (apply mailbox) 命令应用补丁</span>
<span class="token function">git</span> am <span class="token operator">&lt;</span>patch_file<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_13-协作-collaboration" tabindex="-1"><a class="header-anchor" href="#_13-协作-collaboration" aria-hidden="true">#</a> 13.协作 (Collaboration)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 生成两次提交之间更改的请求拉取摘要</span>
<span class="token function">git</span> request-pull <span class="token operator">&lt;</span>start_commit<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>end_commit<span class="token operator">&gt;</span> <span class="token operator">&lt;</span>url<span class="token operator">&gt;</span>
<span class="token comment"># 概括提交历史，列出作者及其贡献</span>
<span class="token function">git</span> shortlog
<span class="token comment"># 列出 Git 跟踪的所有文件</span>
<span class="token function">git</span> ls-files
<span class="token comment"># 在 Git 跟踪的文件中搜索指定的模式</span>
<span class="token function">git</span> <span class="token function">grep</span> <span class="token operator">&lt;</span>pattern<span class="token operator">&gt;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_14-二分查找、调试和性能问题-bisecting-debugging-and-performance-issues" tabindex="-1"><a class="header-anchor" href="#_14-二分查找、调试和性能问题-bisecting-debugging-and-performance-issues" aria-hidden="true">#</a> 14.二分查找、调试和性能问题 (Bisecting, Debugging, and Performance Issues)</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 开始一个二分查找会话以找到引入错误的提交</span>
<span class="token function">git</span> bisect start
<span class="token comment"># 将提交标记为“坏”，表示它包含错误</span>
<span class="token function">git</span> bisect bad <span class="token operator">&lt;</span>commit_id<span class="token operator">&gt;</span>
<span class="token comment"># 将提交标记为“好”，表示它不包含错误</span>
<span class="token function">git</span> bisect good <span class="token operator">&lt;</span>commit_id<span class="token operator">&gt;</span>
<span class="token comment"># 结束二分查找会话并返回到原始分支/提交</span>
<span class="token function">git</span> bisect reset
<span class="token comment"># 验证 Git 仓库的完整性</span>
<span class="token function">git</span> <span class="token function">fsck</span>
<span class="token comment"># 运行垃圾收集以优化仓库的性能</span>
<span class="token function">git</span> gc
<span class="token comment"># 删除未跟踪的文件和目录 (谨慎使用)</span>
<span class="token function">git</span> clean <span class="token parameter variable">-df</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_15-tips-and-tricks" tabindex="-1"><a class="header-anchor" href="#_15-tips-and-tricks" aria-hidden="true">#</a> 15.Tips and Tricks</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 交互式选择文件的部分（块）进行暂存</span>
<span class="token function">git</span> <span class="token function">add</span> <span class="token parameter variable">-p</span>

<span class="token comment"># 显示特定文件的提交历史和相关的补丁</span>
<span class="token function">git</span> log <span class="token parameter variable">-p</span> <span class="token operator">&lt;</span>file_name<span class="token operator">&gt;</span>
<span class="token comment"># 自定义 git log 输出的格式</span>
<span class="token function">git</span> log <span class="token parameter variable">--pretty</span><span class="token operator">=</span>format:<span class="token string">&quot;%h - %an, %ar : %s&quot;</span>
<span class="token comment"># 在提交消息中查找文本 (用于定位特定更改)</span>
<span class="token function">git</span> log <span class="token parameter variable">--grep</span><span class="token operator">=</span><span class="token string">&quot;&lt;text&gt;&quot;</span>
<span class="token comment"># 快速查看上次提交后工作目录中的更改</span>
<span class="token function">git</span> <span class="token function">diff</span> <span class="token parameter variable">--stat</span>
<span class="token comment"># 显示带装饰的分支历史，查看分支何时分裂或合并</span>
<span class="token function">git</span> log <span class="token parameter variable">--oneline</span> <span class="token parameter variable">--decorate</span> <span class="token parameter variable">--graph</span>

<span class="token comment"># 暂存工作树中的更改，包括未跟踪的文件</span>
<span class="token function">git</span> stash save <span class="token parameter variable">-u</span>
<span class="token comment"># 创建一个空提交，用于测试分支保护规则</span>
<span class="token function">git</span> commit --allow-empty <span class="token parameter variable">-m</span> <span class="token string">&quot;Empty commit message&quot;</span>

<span class="token comment"># 设置 git 输出分页器，当输出少于一个屏幕时退出，显示后不清屏</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> core.pager <span class="token string">&#39;less -RFX&#39;</span>
<span class="token comment"># 使用 Git 的自动纠正功能修复误键的命令</span>
<span class="token function">git</span> config <span class="token parameter variable">--global</span> help.autocorrect <span class="token number">1</span>
<span class="token comment"># 列出 Git 命令的别名</span>
<span class="token function">git</span> config --get-regexp <span class="token builtin class-name">alias</span>

<span class="token comment"># 执行合并的演习，不真正合并分支</span>
<span class="token function">git</span> merge --no-commit --no-ff <span class="token operator">&lt;</span>branch_name<span class="token operator">&gt;</span>
<span class="token comment"># 显示仓库结构的树形表示</span>
<span class="token function">git</span> ls-tree --name-only <span class="token parameter variable">-r</span> <span class="token parameter variable">-t</span> HEAD
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr><p>参考资料：</p><ul><li>翻译自《Git Cheatsheet》：https://cs.fyi/guide/git-cheatsheet</li></ul>`,33),i=[o];function l(p,c){return s(),a("div",null,i)}const m=n(t,[["render",l],["__file","02-Git命令清单.html.vue"]]);export{m as default};

import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as e}from"./app-009ef08a.js";const i={},c=e(`<figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-07-130641.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>地址：https://brew.sh/</p><p>安装：</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>/bin/bash <span class="token parameter variable">-c</span> <span class="token string">&quot;<span class="token variable"><span class="token variable">$(</span><span class="token function">curl</span> <span class="token parameter variable">-fsSL</span> https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh<span class="token variable">)</span></span>&quot;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="_1-基础操作" tabindex="-1"><a class="header-anchor" href="#_1-基础操作" aria-hidden="true">#</a> 1.基础操作</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 更新 Homebrew 本身和所有的公式（软件包的描述和安装脚本）</span>
brew update

<span class="token comment"># 修复潜在的安装问题</span>
<span class="token comment"># 这会检查并修复文件权限、清理无效的版本链接等</span>
brew doctor
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_2-软件包操作" tabindex="-1"><a class="header-anchor" href="#_2-软件包操作" aria-hidden="true">#</a> 2.软件包操作</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 搜索可用的软件包</span>
brew search <span class="token punctuation">[</span>package_name<span class="token punctuation">]</span>

<span class="token comment"># 安装指定的软件包</span>
<span class="token comment"># -v 或 --verbose: 在安装过程中提供更多的输出</span>
<span class="token comment"># --ignore-dependencies: 忽略所有依赖，只安装指定的软件包</span>
brew <span class="token function">install</span> <span class="token punctuation">[</span>package_name<span class="token punctuation">]</span> <span class="token punctuation">[</span>-v<span class="token punctuation">]</span> <span class="token punctuation">[</span>--ignore-dependencies<span class="token punctuation">]</span>

<span class="token comment"># 卸载指定的软件包</span>
<span class="token comment"># --force: 当指定的软件包有多个版本时，删除所有版本</span>
brew uninstall <span class="token punctuation">[</span>package_name<span class="token punctuation">]</span> <span class="token punctuation">[</span>--force<span class="token punctuation">]</span>

<span class="token comment"># 升级所有已安装的软件包</span>
brew upgrade

<span class="token comment"># 升级指定的软件包</span>
brew upgrade <span class="token punctuation">[</span>package_name<span class="token punctuation">]</span>

<span class="token comment"># 列出所有已安装的软件包</span>
brew list

<span class="token comment"># 显示指定软件包的信息，包括其版本、依赖等</span>
brew info <span class="token punctuation">[</span>package_name<span class="token punctuation">]</span>

<span class="token comment"># 显示已安装软件包中过时的软件包（有新版本可用的软件包）</span>
brew outdated

<span class="token comment"># 清理旧版本的软件包</span>
<span class="token comment"># 可以释放一些磁盘空间，因为 Homebrew 不会自动删除旧版本的软件包</span>
brew cleanup

<span class="token comment"># 用于从源代码创建新的软件包</span>
<span class="token comment"># 这需要一个公式文件，通常由软件包的维护者提供</span>
brew create <span class="token punctuation">[</span>url<span class="token punctuation">]</span>

<span class="token comment"># 检查某个公式是否有任何问题</span>
<span class="token comment"># 公式是一个 Ruby 脚本，用于指导 Homebrew 如何安装软件包</span>
brew audit --new-formula <span class="token punctuation">[</span>formula<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-管理服务" tabindex="-1"><a class="header-anchor" href="#_3-管理服务" aria-hidden="true">#</a> 3.管理服务</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 列出所有通过 brew 安装并支持使用 \`brew services\` 管理的服务</span>
brew services list

<span class="token comment"># 启动指定的服务</span>
<span class="token comment"># 当服务启动后，会在开机时自动启动</span>
brew services start <span class="token punctuation">[</span>service_name<span class="token punctuation">]</span>

<span class="token comment"># 运行服务，但不设置为开机启动</span>
<span class="token comment"># 这意味着当你重新启动计算机时，服务不会自动启动</span>
brew services run <span class="token punctuation">[</span>service_name<span class="token punctuation">]</span>

<span class="token comment"># 停止指定的服务</span>
<span class="token comment"># 也会取消该服务的开机自动启动设置</span>
brew services stop <span class="token punctuation">[</span>service_name<span class="token punctuation">]</span>

<span class="token comment"># 重新启动服务</span>
<span class="token comment"># 如果服务正在运行，它会先停止然后再启动。如果服务没有运行，它会直接启动。</span>
brew services restart <span class="token punctuation">[</span>service_name<span class="token punctuation">]</span>

<span class="token comment"># 显示指定服务的状态</span>
<span class="token comment"># 这实际上是 \`brew services list\` 的一部分，但可以通过 grep 来过滤指定的服务。</span>
brew services list <span class="token operator">|</span> <span class="token function">grep</span> <span class="token punctuation">[</span>service_name<span class="token punctuation">]</span>

<span class="token comment"># 清理已卸载的服务</span>
<span class="token comment"># 这将清除已经不再存在但仍有 plist 文件的服务。</span>
brew services cleanup
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-gui-程序操作-cask" tabindex="-1"><a class="header-anchor" href="#_4-gui-程序操作-cask" aria-hidden="true">#</a> 4.GUI 程序操作 (Cask)</h2><p>Homebrew 除了支持命令行软件包，也提供了一个叫做 Cask 的扩展，允许用户方便地安装 macOS 的 GUI 程序。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 搜索可用的 GUI 程序</span>
brew search <span class="token parameter variable">--casks</span> <span class="token punctuation">[</span>app_name<span class="token punctuation">]</span>

<span class="token comment"># 安装指定的 GUI 程序</span>
<span class="token comment"># --appdir=&lt;path&gt;: 指定安装应用的目录，默认为 /Applications</span>
brew <span class="token function">install</span> <span class="token parameter variable">--cask</span> <span class="token punctuation">[</span>app_name<span class="token punctuation">]</span> <span class="token punctuation">[</span>--appdir<span class="token operator">=</span><span class="token operator">&lt;</span>path<span class="token operator">&gt;</span><span class="token punctuation">]</span>

<span class="token comment"># 卸载指定的 GUI 程序</span>
<span class="token comment"># --zap: 这个选项除了删除应用，还尝试删除应用的相关数据（如配置、缓存等）</span>
brew uninstall <span class="token parameter variable">--cask</span> <span class="token punctuation">[</span>app_name<span class="token punctuation">]</span> <span class="token punctuation">[</span>--zap<span class="token punctuation">]</span>

<span class="token comment"># 列出所有已安装的 GUI 程序</span>
brew list <span class="token parameter variable">--casks</span>

<span class="token comment"># 显示指定 GUI 程序的信息</span>
brew info <span class="token parameter variable">--cask</span> <span class="token punctuation">[</span>app_name<span class="token punctuation">]</span>

<span class="token comment"># 更新所有的 GUI 程序到最新版本</span>
<span class="token comment"># 注意：&#39;brew upgrade&#39; 命令默认已经考虑了 casks</span>
brew upgrade <span class="token parameter variable">--cask</span>

<span class="token comment"># 更新指定的 GUI 程序</span>
brew upgrade <span class="token parameter variable">--cask</span> <span class="token punctuation">[</span>app_name<span class="token punctuation">]</span>

<span class="token comment"># 显示已安装 GUI 程序中过时的程序（有新版本可用的应用）</span>
brew outdated <span class="token parameter variable">--cask</span>

<span class="token comment"># 清理旧版本的 GUI 程序</span>
<span class="token comment"># 注意：&#39;brew cleanup&#39; 命令默认已经考虑了 casks</span>
brew cleanup <span class="token parameter variable">--cask</span>

<span class="token comment"># 安装指定版本的 GUI 程序</span>
<span class="token comment"># 首先，需要先查找可用的版本。然后指定版本号进行安装。</span>
brew search <span class="token parameter variable">--casks</span> <span class="token parameter variable">--versions</span> <span class="token punctuation">[</span>app_name<span class="token punctuation">]</span>
brew <span class="token function">install</span> <span class="token parameter variable">--cask</span> <span class="token punctuation">[</span>app_name<span class="token punctuation">]</span> <span class="token parameter variable">--version</span><span class="token operator">=</span><span class="token punctuation">[</span>version_number<span class="token punctuation">]</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),l=[c];function p(t,r){return s(),a("div",null,l)}const u=n(i,[["render",p],["__file","Homebrew.html.vue"]]);export{u as default};

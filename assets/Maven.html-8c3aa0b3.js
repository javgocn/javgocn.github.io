import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as e,f as a}from"./app-009ef08a.js";const i={},l=a(`<h2 id="_1-生命周期阶段" tabindex="-1"><a class="header-anchor" href="#_1-生命周期阶段" aria-hidden="true">#</a> 1.生命周期阶段</h2><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code><span class="token comment"># 清理阶段：清除 target 目录中之前构建的生成物。</span>
mvn clean

<span class="token comment"># 编译阶段：将 Java 源代码编译成 .class 字节码文件。</span>
mvn compile

<span class="token comment"># 测试阶段：使用测试框架（如 JUnit 或 TestNG）运行单元测试。不会生成包。</span>
mvn <span class="token builtin class-name">test</span>

<span class="token comment"># 打包阶段：将编译后的代码打包为指定类型的文件，如 JAR、WAR 等。</span>
<span class="token comment"># -DskipTests：跳过测试阶段</span>
mvn package <span class="token punctuation">[</span>-DskipTests<span class="token punctuation">]</span>

<span class="token comment"># 测试编译阶段 (不是主生命周期阶段，但也很常用)：编译测试代码。不会运行测试。</span>
mvn test-compile

<span class="token comment"># 安装阶段：将打包的构件安装到本地仓库，以便其他项目可以使用。</span>
mvn <span class="token function">install</span>

<span class="token comment"># 部署阶段：将项目构件部署到远程仓库。需要正确配置仓库信息。</span>
mvn deploy

<span class="token comment"># 验证阶段 (不是每个项目都会使用，但仍然很常用)：在集成测试之前执行，确保项目是正确的、完整的。</span>
mvn verify

<span class="token comment"># 集成测试 (不是主生命周期阶段，但也很常用)：运行集成测试。</span>
mvn integration-test
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,2),c=[l];function d(v,t){return s(),e("div",null,c)}const o=n(i,[["render",d],["__file","Maven.html.vue"]]);export{o as default};

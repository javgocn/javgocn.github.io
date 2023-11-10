import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as t}from"./app-009ef08a.js";const e={},p=t(`<h2 id="_1-最简单的读" tabindex="-1"><a class="header-anchor" href="#_1-最简单的读" aria-hidden="true">#</a> 1.最简单的读</h2><h3 id="_1-1-最简单的读的-excel-示例" tabindex="-1"><a class="header-anchor" href="#_1-1-最简单的读的-excel-示例" aria-hidden="true">#</a> 1.1 最简单的读的 excel 示例</h3><p>准备一张用于测试的 Excel 表如下：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_1-2-最简单的读的对象" tabindex="-1"><a class="header-anchor" href="#_1-2-最简单的读的对象" aria-hidden="true">#</a> 1.2 最简单的读的对象</h3><p>创建一个 Java 实体对数据表进行抽象，读取到的每一行数据我们都应该有一个对应的 Java 实体对象与之对应：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">EqualsAndHashCode</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Getter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Setter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Date</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token annotation punctuation">@Setter</span>
<span class="token annotation punctuation">@EqualsAndHashCode</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoData</span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 字符串标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">String</span> string<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 日期标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Date</span> date<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 数字标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Double</span> doubleData<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-3-最简单的读的监听器" tabindex="-1"><a class="header-anchor" href="#_1-3-最简单的读的监听器" aria-hidden="true">#</a> 1.3 最简单的读的监听器</h3><p>EasyExcel 是通过监听器回调来进行读操作，因此我们只需要实现 <code>com.alibaba.excel.read.listener.ReadListener</code> 并重写提供的方法即可：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>dao<span class="token punctuation">.</span></span><span class="token class-name">DemoDAO</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity<span class="token punctuation">.</span></span><span class="token class-name">DemoData</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>context<span class="token punctuation">.</span></span><span class="token class-name">AnalysisContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener<span class="token punctuation">.</span></span><span class="token class-name">ReadListener</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">ListUtils</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>fastjson<span class="token punctuation">.</span></span><span class="token class-name">JSON</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 注意：DemoDataListener 不能被 Spring 管理，每次读取 Excel 都需要 new 一个新的对象，如果有需要被 Spring 管理的对象，可以通过构造
 * 方法传进来
 *
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoDataListener</span> <span class="token keyword">implements</span> <span class="token class-name">ReadListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 批量处理的数据量大小：每隔 5 条存储数据库，实际使用中可以 100 条，然后清理 list ，方便内存回收
   */</span>
  <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">BATCH_COUNT</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 用于缓存数据的 list
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> cachedDataList <span class="token operator">=</span> <span class="token class-name">ListUtils</span><span class="token punctuation">.</span><span class="token function">newArrayListWithExpectedSize</span><span class="token punctuation">(</span><span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 如果需要进行数据库操作，可以在构造方法中初始化 DemoDAO，如果不用存储数据库，可以去掉这个属性（也可以是一个 Service）
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">DemoDAO</span> demoDAO<span class="token punctuation">;</span>

  <span class="token keyword">public</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// 这里只是 Demo，所以随便 new 一个 DAO 出来，实际使用中请使用下面的有参构造方法</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>demoDAO <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DemoDAO</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 如果使用了 Spring 管理 bean，可以通过构造方法传进来(即每次创建 Listener 都需要把 Spring 管理的 bean 传进来)
   * <span class="token keyword">@param</span> <span class="token parameter">demoDAO</span> 用于数据库操作的 DAO
   */</span>
  <span class="token keyword">public</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token class-name">DemoDAO</span> demoDAO<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>demoDAO <span class="token operator">=</span> demoDAO<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 每一条数据解析都会来调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">demoData</span> 每一条数据的对象，也就是 Excel 中的一行值。（类似 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">AnalysisContext</span><span class="token punctuation">#</span><span class="token function">readRowHolder</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span>
   * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
   */</span>
  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token class-name">DemoData</span> demoData<span class="token punctuation">,</span> <span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;解析到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 将解析的数据存储到 list，方便批量处理，或者后续自己业务逻辑的处理</span>
    cachedDataList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 如果 list 达到了 BATCH_COUNT，就进行一次数据库插入操作，防止数据几万条数据在内存，容易 OOM</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 存储完成清理 list</span>
      cachedDataList<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * Excel 的所有数据解析完成后会调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
   */</span>
  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doAfterAllAnalysed</span><span class="token punctuation">(</span><span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）</span>
    <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;所有数据解析完成！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 这里会一次性把缓存的数据全部拿出来，进行后续的数据库插入操作
   */</span>
  <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;{} 条数据，开始存储数据库！&quot;</span><span class="token punctuation">,</span> cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    demoDAO<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>cachedDataList<span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;存储数据库成功！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-4-持久层" tabindex="-1"><a class="header-anchor" href="#_1-4-持久层" aria-hidden="true">#</a> 1.4 持久层</h3><p>上面涉及到的持久层示例代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>dao</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity<span class="token punctuation">.</span></span><span class="token class-name">DemoData</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>stereotype<span class="token punctuation">.</span></span><span class="token class-name">Repository</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 假设这是一个 DAO，用于操作数据库，该类需要被 Spring 管理。为了简便这里直接使用 class 了，原则上应该使用接口，然后在实现类上加上
 * <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">Repository</span></span><span class="token punctuation">}</span> 注解。（如果不需要存储数据库，可以去掉这个类）
 *
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoDAO</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 保存数据到数据库
     *
     * <span class="token keyword">@param</span> <span class="token parameter">cachedDataList</span> 缓存的数据
     */</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">save</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> cachedDataList<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 如果是 MyBatis 请尽量不要直接调用多次 insert，而应该自己写一个 mapper 里面新增一个方法 batchInsert 负责批量插入</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_1-5-代码" tabindex="-1"><a class="header-anchor" href="#_1-5-代码" aria-hidden="true">#</a> 1.5 代码</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 最简单的读取 Excel 的示例
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 1. 创建 Excel 对应的实体对象 参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DemoData</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 2. 由于默认一行行的读取 Excel，所以每一行都需要创建回调监听器，参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DemoDataListener</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 3. 直接读即可
 */</span>
<span class="token annotation punctuation">@Test</span>
<span class="token keyword">void</span> <span class="token function">simpleRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">//==================  (写法1：不用额外写一个 DemoDataListener 类，JDK8+、easyexcel 3.0.0-beta1)  =======================</span>
    <span class="token comment">// 获取文件路径</span>
    <span class="token class-name">String</span> fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token comment">// 默认每次读取 100 条数据，然后反回给用户处理，直接调用 doRead 方法即可（具体执行 doRead 返回多少条数据，可以在 PageReadListener 的构造方法中指定）</span>
    <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">PageReadListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>dataList <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">DemoData</span> demoData <span class="token operator">:</span> dataList<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;读取到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//==============================  (写法2：匿名内部类 不用额外写一个DemoDataListener)  ==================================</span>
    fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">ReadListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

        <span class="token doc-comment comment">/**
         * 单次批量缓存的数据量大小
         */</span>
        <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">BATCH_COUNT</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 用于缓存数据的 list
         */</span>
        <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> cachedDataList <span class="token operator">=</span> <span class="token class-name">ListUtils</span><span class="token punctuation">.</span><span class="token function">newArrayListWithExpectedSize</span><span class="token punctuation">(</span><span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token doc-comment comment">/**
         * 每一条数据解析都会来调用该方法
         * <span class="token keyword">@param</span> <span class="token parameter">data</span> 每一条数据的对象，也就是 Excel 中的一行值。（类似 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">AnalysisContext</span><span class="token punctuation">#</span><span class="token function">readRowHolder</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span>
         * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
         */</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token class-name">DemoData</span> data<span class="token punctuation">,</span> <span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cachedDataList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">// 存储完成清理 list</span>
                cachedDataList<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/**
         * 所有数据解析完成了都会来调用该方法执行一些后续操作
         * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
         */</span>
        <span class="token annotation punctuation">@Override</span>
        <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doAfterAllAnalysed</span><span class="token punctuation">(</span><span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）</span>
            <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;所有数据解析完成！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token doc-comment comment">/**
         * 存储数据到数据库
         */</span>
        <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;{}条数据，开始存储数据库！&quot;</span><span class="token punctuation">,</span> cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;存储数据库成功！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//===================================  (写法3：使用 DemoDataListener)  ==============================================</span>
    fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token comment">// 这里需要执行读用哪个 class 去读，然后读取第一个 sheet，读取第一个 sheet 的 demoDataListener，读取完成之后自动关闭流</span>
    <span class="token comment">// 说明：这里的 sheet 是指 Excel 中的 sheet，即 Excel 中的 sheet1、sheet2、sheet3...（通俗来讲就是 Excel 中的表格）</span>
    <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">//===================================  (写法4：使用 DemoDataListener)  ==============================================</span>
    fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token comment">// 一个文件一个 reader</span>
    <span class="token keyword">try</span> <span class="token punctuation">(</span><span class="token class-name">ExcelReader</span> excelReader <span class="token operator">=</span> <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 构建一个 sheet，这里可以指定名字或者下标（下标从 0 开始）</span>
        <span class="token class-name">ReadSheet</span> readSheet <span class="token operator">=</span> <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">readSheet</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 读取指定 sheet</span>
        excelReader<span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>readSheet<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试结果如下：</p><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-090825.png" style="zoom:50%;"><h2 id="_2-指定列的下标或者列名" tabindex="-1"><a class="header-anchor" href="#_2-指定列的下标或者列名" aria-hidden="true">#</a> 2.指定列的下标或者列名</h2><h3 id="_2-1-excel-示例" tabindex="-1"><a class="header-anchor" href="#_2-1-excel-示例" aria-hidden="true">#</a> 2.1 Excel 示例</h3><p>准备一张用于测试的 Excel 表如下：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_2-2-对象" tabindex="-1"><a class="header-anchor" href="#_2-2-对象" aria-hidden="true">#</a> 2.2 对象</h3><p>同样需要使用一个实体来进行承载，但是这次可以结合 <code>@ExcelProperty</code> 注解来指定映射到哪个字段索引或者名称。该注解源码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span><span class="token constant">FIELD</span><span class="token punctuation">}</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span><span class="token constant">RUNTIME</span><span class="token punctuation">)</span>
<span class="token annotation punctuation">@Inherited</span>
<span class="token keyword">public</span> <span class="token annotation punctuation">@interface</span> <span class="token class-name">ExcelProperty</span> <span class="token punctuation">{</span>
    <span class="token comment">// 指定列的名称匹配</span>
    <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token punctuation">{</span><span class="token string">&quot;&quot;</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token comment">// 指定列的下标匹配</span>
    <span class="token keyword">int</span> <span class="token function">index</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>

    <span class="token keyword">int</span> <span class="token function">order</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">;</span>

    <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">Converter</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> <span class="token function">converter</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token class-name">AutoConverter</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/** <span class="token keyword">@deprecated</span> */</span>
    <span class="token annotation punctuation">@Deprecated</span>
    <span class="token class-name">String</span> <span class="token function">format</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token string">&quot;&quot;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>示例代码如下：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">ExcelProperty</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">EqualsAndHashCode</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Getter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Setter</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Date</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）（如果不需要存储数据库，可以去掉这个类）
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token annotation punctuation">@Setter</span>
<span class="token annotation punctuation">@EqualsAndHashCode</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">IndexOrNameData</span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 通过 Excel 的列名进行匹配。（注意：如果列名重复，会导致只有第一个列名生效读取到数据）
   */</span>
  <span class="token annotation punctuation">@ExcelProperty</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;字符串标题&quot;</span><span class="token punctuation">)</span>
  <span class="token keyword">private</span> <span class="token class-name">String</span> string<span class="token punctuation">;</span>

  <span class="token annotation punctuation">@ExcelProperty</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">&quot;日期标题&quot;</span><span class="token punctuation">)</span>
  <span class="token keyword">private</span> <span class="token class-name">Date</span> date<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 通过索引（下标从 0 开始）进行匹配，这里会强制读取第 3 列的数据。（注意：不建议 index 和 name 同时使用，统一使用一种即可）
   */</span>
  <span class="token annotation punctuation">@ExcelProperty</span><span class="token punctuation">(</span>index <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">)</span>
  <span class="token keyword">private</span> <span class="token class-name">Double</span> doubleData<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-监听器" tabindex="-1"><a class="header-anchor" href="#_2-3-监听器" aria-hidden="true">#</a> 2.3 监听器</h3><p>监听器保持不变，仅仅是泛型变了而已：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 注意：DemoDataListener 不能被 Spring 管理，每次读取 Excel 都需要 new 一个新的对象，里面有需要被 Spring 管理的对象，可以通过构造
 * 方法传进来
 *
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">IndexOrNameDataListener</span> <span class="token keyword">implements</span> <span class="token class-name">ReadListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">IndexOrNameData</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 批量处理的数据量大小：每隔 5 条存储数据库，实际使用中可以 100 条，然后清理 list ，方便内存回收
   */</span>
  <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">BATCH_COUNT</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 用于缓存数据的 list
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">IndexOrNameData</span><span class="token punctuation">&gt;</span></span> cachedDataList <span class="token operator">=</span> <span class="token class-name">ListUtils</span><span class="token punctuation">.</span><span class="token function">newArrayListWithExpectedSize</span><span class="token punctuation">(</span><span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 如果需要进行数据库操作，可以在构造方法中初始化 DemoDAO，如果不用存储数据库，可以去掉这个属性（也可以是一个 Service）
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">IndexOrNameDAO</span> indexOrNameDAO<span class="token punctuation">;</span>

  <span class="token keyword">public</span> <span class="token class-name">IndexOrNameDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// 这里只是 Demo，所以随便 new 一个 DAO 出来，实际使用中请使用下面的有参构造方法</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>indexOrNameDAO <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">IndexOrNameDAO</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 如果使用了 Spring 管理 bean，可以通过构造方法传进来(即每次创建 Listener 都需要把 Spring 管理的 bean 传进来)
   * <span class="token keyword">@param</span> <span class="token parameter">indexOrNameDAO</span> 用于数据库操作的 DAO
   */</span>
  <span class="token keyword">public</span> <span class="token class-name">IndexOrNameDataListener</span><span class="token punctuation">(</span><span class="token class-name">IndexOrNameDAO</span> indexOrNameDAO<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>indexOrNameDAO <span class="token operator">=</span> indexOrNameDAO<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 每一条数据解析都会来调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">indexOrNameData</span> 每一条数据的对象，也就是 Excel 中的一行值。（类似 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">AnalysisContext</span><span class="token punctuation">#</span><span class="token function">readRowHolder</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span>
   * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
   */</span>
  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token class-name">IndexOrNameData</span> indexOrNameData<span class="token punctuation">,</span> <span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;解析到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>indexOrNameData<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 将解析的数据存储到 list，方便批量处理，或者后续自己业务逻辑的处理</span>
    cachedDataList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>indexOrNameData<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 如果 list 达到了 BATCH_COUNT，就进行一次数据库插入操作，防止数据几万条数据在内存，容易 OOM</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 存储完成清理 list</span>
      cachedDataList<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 所有数据解析完成了，都会来调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
   */</span>
  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doAfterAllAnalysed</span><span class="token punctuation">(</span><span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）</span>
    <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;所有数据解析完成！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 这里会一次性把缓存的数据全部拿出来，进行后续的数据库插入操作
   */</span>
  <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;{} 条数据，开始存储数据库！&quot;</span><span class="token punctuation">,</span> cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    indexOrNameDAO<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>cachedDataList<span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;存储数据库成功！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-4-代码" tabindex="-1"><a class="header-anchor" href="#_2-4-代码" aria-hidden="true">#</a> 2.4 代码</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 测试指定下标或名称读取 Excel
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 1. 创建 Excel 对应的实体对象，并在对象属性上加上 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">ExcelProperty</span></span><span class="token punctuation">}</span> 注解，参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">IndexOrNameData</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 2. 由于默认一行行的读取 Excel，所以每一行都需要创建回调监听器，参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">IndexOrNameDataListener</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 3. 直接读即可
 */</span>
<span class="token annotation punctuation">@Test</span>
<span class="token keyword">void</span> <span class="token function">indexOrNameRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token comment">// 默认读取第一个 sheet（sheet 就是 Excel 中的表格，通俗来讲就是 Excel 中的 sheet1、sheet2、sheet3...）</span>
    <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">IndexOrNameData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">IndexOrNameDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试结果：</p><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-091636.png" style="zoom:50%;"><h2 id="_3-读多个-sheet" tabindex="-1"><a class="header-anchor" href="#_3-读多个-sheet" aria-hidden="true">#</a> 3.读多个 sheet</h2><h3 id="_3-1-excel-示例" tabindex="-1"><a class="header-anchor" href="#_3-1-excel-示例" aria-hidden="true">#</a> 3.1 Excel 示例</h3><p>准备一张用于测试的 Excel 表如下：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_3-2-对象" tabindex="-1"><a class="header-anchor" href="#_3-2-对象" aria-hidden="true">#</a> 3.2 对象</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">EqualsAndHashCode</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Getter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Setter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Date</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token annotation punctuation">@Setter</span>
<span class="token annotation punctuation">@EqualsAndHashCode</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoData</span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 字符串标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">String</span> string<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 日期标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Date</span> date<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 数字标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Double</span> doubleData<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-监听器" tabindex="-1"><a class="header-anchor" href="#_3-3-监听器" aria-hidden="true">#</a> 3.3 监听器</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>dao<span class="token punctuation">.</span></span><span class="token class-name">DemoDAO</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity<span class="token punctuation">.</span></span><span class="token class-name">DemoData</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>context<span class="token punctuation">.</span></span><span class="token class-name">AnalysisContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener<span class="token punctuation">.</span></span><span class="token class-name">ReadListener</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">ListUtils</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>fastjson<span class="token punctuation">.</span></span><span class="token class-name">JSON</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 注意：DemoDataListener 不能被 Spring 管理，每次读取 Excel 都需要 new 一个新的对象，如果有需要被 Spring 管理的对象，可以通过构造
 * 方法传进来
 *
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoDataListener</span> <span class="token keyword">implements</span> <span class="token class-name">ReadListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 批量处理的数据量大小：每隔 5 条存储数据库，实际使用中可以 100 条，然后清理 list ，方便内存回收
   */</span>
  <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">BATCH_COUNT</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 用于缓存数据的 list
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> cachedDataList <span class="token operator">=</span> <span class="token class-name">ListUtils</span><span class="token punctuation">.</span><span class="token function">newArrayListWithExpectedSize</span><span class="token punctuation">(</span><span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 如果需要进行数据库操作，可以在构造方法中初始化 DemoDAO，如果不用存储数据库，可以去掉这个属性（也可以是一个 Service）
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">DemoDAO</span> demoDAO<span class="token punctuation">;</span>

  <span class="token keyword">public</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// 这里只是 Demo，所以随便 new 一个 DAO 出来，实际使用中请使用下面的有参构造方法</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>demoDAO <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DemoDAO</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 如果使用了 Spring 管理 bean，可以通过构造方法传进来(即每次创建 Listener 都需要把 Spring 管理的 bean 传进来)
   * <span class="token keyword">@param</span> <span class="token parameter">demoDAO</span> 用于数据库操作的 DAO
   */</span>
  <span class="token keyword">public</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token class-name">DemoDAO</span> demoDAO<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>demoDAO <span class="token operator">=</span> demoDAO<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 每一条数据解析都会来调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">demoData</span> 每一条数据的对象，也就是 Excel 中的一行值。（类似 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">AnalysisContext</span><span class="token punctuation">#</span><span class="token function">readRowHolder</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span>
   * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
   */</span>
  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token class-name">DemoData</span> demoData<span class="token punctuation">,</span> <span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;解析到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 将解析的数据存储到 list，方便批量处理，或者后续自己业务逻辑的处理</span>
    cachedDataList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 如果 list 达到了 BATCH_COUNT，就进行一次数据库插入操作，防止数据几万条数据在内存，容易 OOM</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 存储完成清理 list</span>
      cachedDataList<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * Excel 的所有数据解析完成后会调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
   */</span>
  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doAfterAllAnalysed</span><span class="token punctuation">(</span><span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）</span>
    <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;所有数据解析完成！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 这里会一次性把缓存的数据全部拿出来，进行后续的数据库插入操作
   */</span>
  <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;{} 条数据，开始存储数据库！&quot;</span><span class="token punctuation">,</span> cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    demoDAO<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>cachedDataList<span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;存储数据库成功！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-4-代码" tabindex="-1"><a class="header-anchor" href="#_3-4-代码" aria-hidden="true">#</a> 3.4 代码</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 测试读取多个 sheet。（注意：一个 sheet 不能读取多次，如果需要读取多次，需要重新读取 Excel）
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 1. 创建 Excel 对应的实体对象，参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DemoData</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 2. 由于默认一行行的读取 Excel，所以每一行都需要创建回调监听器，参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DemoDataListener</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 3. 直接读即可
 */</span>
<span class="token annotation punctuation">@Test</span>
<span class="token keyword">void</span> <span class="token function">repeatedRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 读取全部 sheet（注意：DemoDataListener#doAfterAllAnalysed 会在每个 sheet 读取完成之后都会调用一次</span>
    <span class="token comment">// 然后所有 sheet 读都会往同一个 DemoDataListener#invoke 方法中回调数据）</span>
    <span class="token class-name">String</span> fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span><span class="token keyword">new</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doReadAll</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 读取部分 sheet</span>
    fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span><span class="token punctuation">(</span><span class="token class-name">ExcelReader</span> excelReader <span class="token operator">=</span> <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
        <span class="token comment">// 这里为了简单，所以注册了同样的 read 和 Listener，自己使用功能的时候必须用不同的 read 和 Listener</span>
        <span class="token class-name">ReadSheet</span> readSheet1 <span class="token operator">=</span> <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">readSheet</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">head</span><span class="token punctuation">(</span><span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">registerReadListener</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ReadSheet</span> readSheet2 <span class="token operator">=</span> <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">readSheet</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">head</span><span class="token punctuation">(</span><span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">registerReadListener</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 注意：一定要把 sheet1、sheet2 一起传进去，否则 03 版本的 Excel 就会读取多次，从而浪费性能</span>
        excelReader<span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>readSheet1<span class="token punctuation">,</span> readSheet2<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_4-日期、数字或自定义格式转换" tabindex="-1"><a class="header-anchor" href="#_4-日期、数字或自定义格式转换" aria-hidden="true">#</a> 4.日期、数字或自定义格式转换</h2><h3 id="_4-1-excel-示例" tabindex="-1"><a class="header-anchor" href="#_4-1-excel-示例" aria-hidden="true">#</a> 4.1 Excel 示例</h3><p>准备一张用于测试的 Excel 表如下：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_4-2-对象" tabindex="-1"><a class="header-anchor" href="#_4-2-对象" aria-hidden="true">#</a> 4.2 对象</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>converter<span class="token punctuation">.</span></span><span class="token class-name">CustomStringStringConverter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span></span><span class="token class-name">ExcelProperty</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span>format<span class="token punctuation">.</span></span><span class="token class-name">DateTimeFormat</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>annotation<span class="token punctuation">.</span>format<span class="token punctuation">.</span></span><span class="token class-name">NumberFormat</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">EqualsAndHashCode</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Getter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Setter</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx），如果需要转换数据，可以在这里进行转换
 *
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token annotation punctuation">@Setter</span>
<span class="token annotation punctuation">@EqualsAndHashCode</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConverterData</span> <span class="token punctuation">{</span>

    <span class="token doc-comment comment">/**
     * 自定义的转换器：不管数据传入什么，都会给它加上 “自定义：”
     */</span>
    <span class="token annotation punctuation">@ExcelProperty</span><span class="token punctuation">(</span>converter <span class="token operator">=</span> <span class="token class-name">CustomStringStringConverter</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> string<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 日期格式化：将 Excel 中的日期字符串格式化成指定的格式（这里需要用 String 接收日期才能格式化）
     */</span>
    <span class="token annotation punctuation">@DateTimeFormat</span><span class="token punctuation">(</span><span class="token string">&quot;yyyy年MM月dd日HH时mm分ss秒&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> data<span class="token punctuation">;</span>

    <span class="token doc-comment comment">/**
     * 数字格式化：将 Excel 中的数字格式化成百分比（这里需要用 String 接收数字才能格式化）
     */</span>
    <span class="token annotation punctuation">@NumberFormat</span><span class="token punctuation">(</span><span class="token string">&quot;#.##%&quot;</span><span class="token punctuation">)</span>
    <span class="token keyword">private</span> <span class="token class-name">String</span> doubleData<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-监听器" tabindex="-1"><a class="header-anchor" href="#_4-3-监听器" aria-hidden="true">#</a> 4.3 监听器</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>dao<span class="token punctuation">.</span></span><span class="token class-name">ConverterDataDAO</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity<span class="token punctuation">.</span></span><span class="token class-name">ConverterData</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>context<span class="token punctuation">.</span></span><span class="token class-name">AnalysisContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener<span class="token punctuation">.</span></span><span class="token class-name">ReadListener</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">ListUtils</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>fastjson<span class="token punctuation">.</span></span><span class="token class-name">JSON</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 *
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/29
 */</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConverterDataListener</span> <span class="token keyword">implements</span> <span class="token class-name">ReadListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ConverterData</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">BATCH_COUNT</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ConverterData</span><span class="token punctuation">&gt;</span></span> cachedDataList <span class="token operator">=</span> <span class="token class-name">ListUtils</span><span class="token punctuation">.</span><span class="token function">newArrayListWithExpectedSize</span><span class="token punctuation">(</span><span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">ConverterDataDAO</span> converterDataDAO<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">ConverterDataListener</span><span class="token punctuation">(</span><span class="token class-name">ConverterDataDAO</span> converterDataDAO<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>converterDataDAO <span class="token operator">=</span> converterDataDAO<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token class-name">ConverterData</span> converterData<span class="token punctuation">,</span> <span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;解析到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>converterData<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        cachedDataList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>converterData<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            cachedDataList<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doAfterAllAnalysed</span><span class="token punctuation">(</span><span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        cachedDataList<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;所有数据解析完成！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;{}条数据，开始存储数据库！&quot;</span><span class="token punctuation">,</span> cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        converterDataDAO<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>cachedDataList<span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;存储数据库成功！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-自定义转换器" tabindex="-1"><a class="header-anchor" href="#_4-4-自定义转换器" aria-hidden="true">#</a> 4.4 自定义转换器</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>converter</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>converters<span class="token punctuation">.</span></span><span class="token class-name">Converter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>converters<span class="token punctuation">.</span></span><span class="token class-name">ReadConverterContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>converters<span class="token punctuation">.</span></span><span class="token class-name">WriteConverterContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>enums<span class="token punctuation">.</span></span><span class="token class-name">CellDataTypeEnum</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>metadata<span class="token punctuation">.</span>data<span class="token punctuation">.</span></span><span class="token class-name">WriteCellData</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于转换数据的类，需要实现 com.alibaba.excel.convert.Converter 接口
 *
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">CustomStringStringConverter</span> <span class="token keyword">implements</span> <span class="token class-name">Converter</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 支持的 java 类型
   * <span class="token keyword">@return</span> java 类型
   */</span>
  <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> <span class="token function">supportJavaTypeKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 支持的 excel 类型
   * <span class="token keyword">@return</span> excel 类型
   */</span>
  <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">CellDataTypeEnum</span> <span class="token function">supportExcelTypeKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">CellDataTypeEnum</span><span class="token punctuation">.</span><span class="token constant">STRING</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 读取 excel 时会调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">context</span> 读取 excel 上下文
   * <span class="token keyword">@return</span> java 数据
   * <span class="token keyword">@throws</span> <span class="token reference"><span class="token class-name">Exception</span></span> 异常
   */</span>
  <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">convertToJavaData</span><span class="token punctuation">(</span><span class="token class-name">ReadConverterContext</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> context<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token string">&quot;自定义：&quot;</span> <span class="token operator">+</span> context<span class="token punctuation">.</span><span class="token function">getReadCellData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getStringValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 写入 excel 时会调用该方法（不用管）
     * <span class="token keyword">@param</span> <span class="token parameter">context</span> 写入 excel 上下文
     * <span class="token keyword">@return</span> excel 数据
     * <span class="token keyword">@throws</span> <span class="token reference"><span class="token class-name">Exception</span></span> 异常
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token class-name">WriteCellData</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span></span> <span class="token function">convertToExcelData</span><span class="token punctuation">(</span><span class="token class-name">WriteConverterContext</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> context<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">WriteCellData</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span>context<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-5-代码" tabindex="-1"><a class="header-anchor" href="#_4-5-代码" aria-hidden="true">#</a> 4.5 代码</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 日期、数字或者自定义格式转换
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 默认读的转换器 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DefaultConverterLoader</span><span class="token punctuation">#</span><span class="token function">loadDefaultReadConverter</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>1. 创建 Excel 对应的实体对象 参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">ConverterData</span></span><span class="token punctuation">}</span> ,里面可以使用注解 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DateTimeFormat</span></span><span class="token punctuation">}</span>、<span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">NumberFormat</span></span><span class="token punctuation">}</span> 或者自定义注解
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>2. 由于默认一行行的读取 Excel，所以需要创建 Excel 一行一行的回调监听器，参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">ConverterDataListener</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>3. 直接读即可
 */</span>
<span class="token annotation punctuation">@Test</span>
<span class="token keyword">void</span> <span class="token function">converterRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token class-name">String</span> fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">ConverterData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span><span class="token keyword">new</span> <span class="token class-name">ConverterDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token comment">// 注意：也可以通过 registerConverter 来指定自定义的转换器，但是这将作用于全局，所以不建议这么做（所有 java 为 string,</span>
            <span class="token comment">// excel 为 string 的都会用这个转换器）如果就想单个字段使用请使用 @ExcelProperty 指定 converter。</span>
            <span class="token comment">// .registerConverter(new CustomStringStringConverter())</span>
            <span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试结果：</p><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-094620.png" style="zoom:50%;"><h2 id="_5-多行头" tabindex="-1"><a class="header-anchor" href="#_5-多行头" aria-hidden="true">#</a> 5.多行头</h2><h3 id="_5-1-excel-示例" tabindex="-1"><a class="header-anchor" href="#_5-1-excel-示例" aria-hidden="true">#</a> 5.1 Excel 示例</h3><p>准备一张用于测试的 Excel 表如下：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_5-2-对象" tabindex="-1"><a class="header-anchor" href="#_5-2-对象" aria-hidden="true">#</a> 5.2 对象</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">EqualsAndHashCode</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Getter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Setter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Date</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token annotation punctuation">@Setter</span>
<span class="token annotation punctuation">@EqualsAndHashCode</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoData</span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 字符串标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">String</span> string<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 日期标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Date</span> date<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 数字标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Double</span> doubleData<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-3-监听器" tabindex="-1"><a class="header-anchor" href="#_5-3-监听器" aria-hidden="true">#</a> 5.3 监听器</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>dao<span class="token punctuation">.</span></span><span class="token class-name">DemoDAO</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity<span class="token punctuation">.</span></span><span class="token class-name">DemoData</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>context<span class="token punctuation">.</span></span><span class="token class-name">AnalysisContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener<span class="token punctuation">.</span></span><span class="token class-name">ReadListener</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">ListUtils</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>fastjson<span class="token punctuation">.</span></span><span class="token class-name">JSON</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>
 * 注意：DemoDataListener 不能被 Spring 管理，每次读取 Excel 都需要 new 一个新的对象，如果有需要被 Spring 管理的对象，可以通过构造
 * 方法传进来
 *
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoDataListener</span> <span class="token keyword">implements</span> <span class="token class-name">ReadListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 批量处理的数据量大小：每隔 5 条存储数据库，实际使用中可以 100 条，然后清理 list ，方便内存回收
   */</span>
  <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">BATCH_COUNT</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 用于缓存数据的 list
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> cachedDataList <span class="token operator">=</span> <span class="token class-name">ListUtils</span><span class="token punctuation">.</span><span class="token function">newArrayListWithExpectedSize</span><span class="token punctuation">(</span><span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 如果需要进行数据库操作，可以在构造方法中初始化 DemoDAO，如果不用存储数据库，可以去掉这个属性（也可以是一个 Service）
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">DemoDAO</span> demoDAO<span class="token punctuation">;</span>

  <span class="token keyword">public</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token comment">// 这里只是 Demo，所以随便 new 一个 DAO 出来，实际使用中请使用下面的有参构造方法</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>demoDAO <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DemoDAO</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 如果使用了 Spring 管理 bean，可以通过构造方法传进来(即每次创建 Listener 都需要把 Spring 管理的 bean 传进来)
   * <span class="token keyword">@param</span> <span class="token parameter">demoDAO</span> 用于数据库操作的 DAO
   */</span>
  <span class="token keyword">public</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token class-name">DemoDAO</span> demoDAO<span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>demoDAO <span class="token operator">=</span> demoDAO<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 每一条数据解析都会来调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">demoData</span> 每一条数据的对象，也就是 Excel 中的一行值。（类似 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">AnalysisContext</span><span class="token punctuation">#</span><span class="token function">readRowHolder</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span>
   * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
   */</span>
  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token class-name">DemoData</span> demoData<span class="token punctuation">,</span> <span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;解析到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 将解析的数据存储到 list，方便批量处理，或者后续自己业务逻辑的处理</span>
    cachedDataList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">// 如果 list 达到了 BATCH_COUNT，就进行一次数据库插入操作，防止数据几万条数据在内存，容易 OOM</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
      <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token comment">// 存储完成清理 list</span>
      cachedDataList<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * Excel 的所有数据解析完成后会调用该方法
   * <span class="token keyword">@param</span> <span class="token parameter">analysisContext</span> 解析上下文
   */</span>
  <span class="token annotation punctuation">@Override</span>
  <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doAfterAllAnalysed</span><span class="token punctuation">(</span><span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）</span>
    <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;所有数据解析完成！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token doc-comment comment">/**
   * 这里会一次性把缓存的数据全部拿出来，进行后续的数据库插入操作
   */</span>
  <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;{} 条数据，开始存储数据库！&quot;</span><span class="token punctuation">,</span> cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    demoDAO<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>cachedDataList<span class="token punctuation">)</span><span class="token punctuation">;</span>
    log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;存储数据库成功！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_5-4-代码" tabindex="-1"><a class="header-anchor" href="#_5-4-代码" aria-hidden="true">#</a> 5.4 代码</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 多行头
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>1. 创建 excel 对应的实体对象 参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DemoData</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>2. 由于默认一行行的读取 excel，所以需要创建 excel 一行一行的回调监听器，参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DemoDataListener</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>3. 设置 headRowNumber 参数，然后读。 这里要注意 headRowNumber 如果不指定， 会根据你传入的 class 的 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">ExcelProperty</span><span class="token punctuation">#</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span><span class="token punctuation">}</span>
 * 里面的表头的数量来决定行数，如果不传入 class 则默认为 1.当然你指定了 headRowNumber 不管是否传入 class 都是以你传入的为准。
 */</span>
<span class="token annotation punctuation">@Test</span>
<span class="token keyword">void</span> <span class="token function">complexHeaderRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token class-name">String</span> fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span><span class="token keyword">new</span> <span class="token class-name">DemoDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
            <span class="token comment">// 这里需要指定读取的 sheet，否则默认读取第一个 sheet</span>
            <span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
            <span class="token comment">// 这里需要指定读取的行数，否则默认读取第二行开始读取</span>
            <span class="token comment">// 不传入也可以，因为默认会根据 DemoData 来解析，他没有指定头，也就是默认 1 行，所以这里会从第二行开始读取</span>
           <span class="token comment">// 这里为了方便效果演示我们设置为 2，也就是从第三行开始读取</span>
            <span class="token punctuation">.</span><span class="token function">headRowNumber</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span>
            <span class="token punctuation">.</span><span class="token function">doRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试结果：</p><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-095417.png" style="zoom:50%;"><h2 id="_6-同步返回" tabindex="-1"><a class="header-anchor" href="#_6-同步返回" aria-hidden="true">#</a> 6.同步返回</h2><h3 id="_6-1-excel-示例" tabindex="-1"><a class="header-anchor" href="#_6-1-excel-示例" aria-hidden="true">#</a> 6.1 Excel 示例</h3><p>准备一张用于测试的 Excel 表如下：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_6-2-对象" tabindex="-1"><a class="header-anchor" href="#_6-2-对象" aria-hidden="true">#</a> 6.2 对象</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">EqualsAndHashCode</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Getter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Setter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Date</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token annotation punctuation">@Setter</span>
<span class="token annotation punctuation">@EqualsAndHashCode</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoData</span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 字符串标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">String</span> string<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 日期标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Date</span> date<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 数字标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Double</span> doubleData<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_6-3-代码" tabindex="-1"><a class="header-anchor" href="#_6-3-代码" aria-hidden="true">#</a> 6.3 代码</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 解释：所谓同步读取，就是一行一行的读取，读取完一行就返回给用户，用户可以自己处理这一行数据，然后再读取下一行，以此类推。
 * 同步读取 Excel，不推荐使用，如果数据量大会导致 OOM，并且读取速度慢。
 */</span>
<span class="token annotation punctuation">@Test</span>
<span class="token keyword">void</span> <span class="token function">synchronousRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span>
    <span class="token class-name">String</span> fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token comment">// 这里需要指定用哪一个 class 去读，然后读取第一个 sheet，同步读取会自动 finish</span>
    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> list <span class="token operator">=</span> <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">head</span><span class="token punctuation">(</span><span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doReadSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">DemoData</span> data <span class="token operator">:</span> list<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;读取到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 这里也可以不指定 class 返回一个 list，然后读取第一个 sheet，同步读取会自动 finish</span>
    <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Map</span><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> listMap <span class="token operator">=</span> <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doReadSync</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> data <span class="token operator">:</span> listMap<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 返回每条数据的键值对: key 是第几列，value 是所在列的值</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;读取到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_7-读取表头数据" tabindex="-1"><a class="header-anchor" href="#_7-读取表头数据" aria-hidden="true">#</a> 7.读取表头数据</h2><h3 id="_7-1-excel-示例" tabindex="-1"><a class="header-anchor" href="#_7-1-excel-示例" aria-hidden="true">#</a> 7.1 Excel 示例</h3><p>准备一张用于测试的 Excel 表如下：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h3 id="_7-2-对象" tabindex="-1"><a class="header-anchor" href="#_7-2-对象" aria-hidden="true">#</a> 7.2 对象</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">EqualsAndHashCode</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Getter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span></span><span class="token class-name">Setter</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Date</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/26
 */</span>
<span class="token annotation punctuation">@Getter</span>
<span class="token annotation punctuation">@Setter</span>
<span class="token annotation punctuation">@EqualsAndHashCode</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoData</span> <span class="token punctuation">{</span>

  <span class="token doc-comment comment">/**
   * 字符串标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">String</span> string<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 日期标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Date</span> date<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/**
   * 数字标题
   */</span>
  <span class="token keyword">private</span> <span class="token class-name">Double</span> doubleData<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-3-监听器" tabindex="-1"><a class="header-anchor" href="#_7-3-监听器" aria-hidden="true">#</a> 7.3 监听器</h3><p>最简单的读的监听器里面多了一个方法，只要重写 <code>invokeHead(Map&lt;Integer, ReadCellData&lt;?&gt;&gt; headMap, AnalysisContext context)</code> 方法即可：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">package</span> <span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener</span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>dao<span class="token punctuation">.</span></span><span class="token class-name">DemoDAO</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">cn<span class="token punctuation">.</span>javgo<span class="token punctuation">.</span>springboot<span class="token punctuation">.</span>easyexcel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>repository<span class="token punctuation">.</span>entity<span class="token punctuation">.</span></span><span class="token class-name">DemoData</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>context<span class="token punctuation">.</span></span><span class="token class-name">AnalysisContext</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>metadata<span class="token punctuation">.</span>data<span class="token punctuation">.</span></span><span class="token class-name">ReadCellData</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>read<span class="token punctuation">.</span>listener<span class="token punctuation">.</span></span><span class="token class-name">ReadListener</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>excel<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">ListUtils</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">com<span class="token punctuation">.</span>alibaba<span class="token punctuation">.</span>fastjson<span class="token punctuation">.</span></span><span class="token class-name">JSON</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">lombok<span class="token punctuation">.</span>extern<span class="token punctuation">.</span>slf4j<span class="token punctuation">.</span></span><span class="token class-name">Slf4j</span></span><span class="token punctuation">;</span>

<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">List</span></span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token import"><span class="token namespace">java<span class="token punctuation">.</span>util<span class="token punctuation">.</span></span><span class="token class-name">Map</span></span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@author</span> javgo.cn
 * <span class="token keyword">@date</span> 2023/10/29
 */</span>
<span class="token annotation punctuation">@Slf4j</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DemoHeadDataListener</span> <span class="token keyword">implements</span> <span class="token class-name">ReadListener</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>

    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">BATCH_COUNT</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">DemoData</span><span class="token punctuation">&gt;</span></span> cachedDataList <span class="token operator">=</span> <span class="token class-name">ListUtils</span><span class="token punctuation">.</span><span class="token function">newArrayListWithExpectedSize</span><span class="token punctuation">(</span><span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">private</span> <span class="token class-name">DemoDAO</span> demoDAO<span class="token punctuation">;</span>

    <span class="token keyword">public</span> <span class="token class-name">DemoHeadDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>demoDAO <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DemoDAO</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">DemoHeadDataListener</span><span class="token punctuation">(</span><span class="token class-name">DemoDAO</span> demoDAO<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>demoDAO <span class="token operator">=</span> demoDAO<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">invoke</span><span class="token punctuation">(</span><span class="token class-name">DemoData</span> demoData<span class="token punctuation">,</span> <span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;解析到一条数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        cachedDataList<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>demoData<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;=</span> <span class="token constant">BATCH_COUNT</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            cachedDataList<span class="token punctuation">.</span><span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">doAfterAllAnalysed</span><span class="token punctuation">(</span><span class="token class-name">AnalysisContext</span> analysisContext<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;所有数据解析完成！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">saveData</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;{} 条数据，开始存储数据库！&quot;</span><span class="token punctuation">,</span> cachedDataList<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        demoDAO<span class="token punctuation">.</span><span class="token function">save</span><span class="token punctuation">(</span>cachedDataList<span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;存储数据库成功！&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
     * 这里会一行行的返回头，如果需要获取头的值可以重写该方法
     *
     * <span class="token keyword">@param</span> <span class="token parameter">headMap</span> 头的数据 key 是头的行号，value 是具体的值
     * <span class="token keyword">@param</span> <span class="token parameter">context</span> 解析上下文
     */</span>
    <span class="token annotation punctuation">@Override</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">invokeHead</span><span class="token punctuation">(</span><span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">ReadCellData</span><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> headMap<span class="token punctuation">,</span> <span class="token class-name">AnalysisContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;解析到一条头数据:{}&quot;</span><span class="token punctuation">,</span> <span class="token constant">JSON</span><span class="token punctuation">.</span><span class="token function">toJSONString</span><span class="token punctuation">(</span>headMap<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 如果想转成成 Map&lt;Integer,String&gt;：</span>
        <span class="token comment">// 方案一：不要 implements ReadListener 而是 extends AnalysisEventListener</span>
        <span class="token comment">// 方案二：调用 ConverterUtils.convertToStringMap(headMap, context) 自动会转换</span>
        <span class="token comment">// Map&lt;Integer, String&gt; map = ConverterUtils.convertToStringMap(headMap, context);</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_7-4-代码" tabindex="-1"><a class="header-anchor" href="#_7-4-代码" aria-hidden="true">#</a> 7.4 代码</h3><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * 读取表头数据
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>1. 创建 excel 对应的实体对象 参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DemoData</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>2. 由于默认一行行的读取 excel，所以需要创建 excel 一行一行的回调监听器，参照 <span class="token punctuation">{</span><span class="token keyword">@link</span> <span class="token reference"><span class="token class-name">DemoHeadDataListener</span></span><span class="token punctuation">}</span>
 * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>p</span><span class="token punctuation">&gt;</span></span>3. 直接读即可
 */</span>
<span class="token annotation punctuation">@Test</span>
<span class="token keyword">void</span> <span class="token function">headerRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> fileName <span class="token operator">=</span> <span class="token class-name">TestFileUtil</span><span class="token punctuation">.</span><span class="token function">getPath</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;test-file&quot;</span> <span class="token operator">+</span> <span class="token class-name">File</span><span class="token punctuation">.</span>separator <span class="token operator">+</span> <span class="token string">&quot;demo.xlsx&quot;</span><span class="token punctuation">;</span>
    <span class="token class-name">EasyExcel</span><span class="token punctuation">.</span><span class="token function">read</span><span class="token punctuation">(</span>fileName<span class="token punctuation">,</span> <span class="token class-name">DemoData</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">DemoHeadDataListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">sheet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">doRead</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>测试结果：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-101719.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="_8-额外信息-批注、超链接、合并单元格信息读取" tabindex="-1"><a class="header-anchor" href="#_8-额外信息-批注、超链接、合并单元格信息读取" aria-hidden="true">#</a> 8.额外信息（批注、超链接、合并单元格信息读取）</h2><blockquote><p>since：2.0.0-beta1</p></blockquote><h3 id="_8-1-excel-示例" tabindex="-1"><a class="header-anchor" href="#_8-1-excel-示例" aria-hidden="true">#</a> 8.1 Excel 示例</h3><h3 id="_8-2-对象" tabindex="-1"><a class="header-anchor" href="#_8-2-对象" aria-hidden="true">#</a> 8.2 对象</h3><h3 id="_8-3-监听器" tabindex="-1"><a class="header-anchor" href="#_8-3-监听器" aria-hidden="true">#</a> 8.3 监听器</h3><h3 id="_8-4-代码" tabindex="-1"><a class="header-anchor" href="#_8-4-代码" aria-hidden="true">#</a> 8.4 代码</h3>`,96),c=[p];function o(l,i){return s(),a("div",null,c)}const d=n(e,[["render",o],["__file","02-读Excel.html.vue"]]);export{d as default};

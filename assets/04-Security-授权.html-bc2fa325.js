import{_ as c}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as t,c as i,a,d as n,b as p,f as s}from"./app-009ef08a.js";const l={},r=s(`<h2 id="_1-整体架构" tabindex="-1"><a class="header-anchor" href="#_1-整体架构" aria-hidden="true">#</a> 1.整体架构</h2><p>Spring Security 的高级授权功能无疑是其受欢迎的关键因素。无论你采用哪种身份验证方式，不论是采用 Spring Security 自带的机制，还是与其他认证机构或容器集成（如 JWT），你都可以在应用程序中简洁且统一地使用授权服务。简单来说，Spring Security 的认证与授权是相互独立的！</p><p>本节，我首先会介绍不同的 <code>AbstractSecurityInterceptor</code> 实现，然后深入讨论如何通过域访问控制列表来细化授权策略。</p><h3 id="_1-1-授权-authorities" tabindex="-1"><a class="header-anchor" href="#_1-1-授权-authorities" aria-hidden="true">#</a> 1.1 授权（Authorities）</h3><p>当我们谈及 <code>Authentication</code>，实际上是在探讨 <code>Authentication </code>实现如何存储一系列 <code>GrantedAuthority</code> 对象。这些对象表示授予用户的权限（可能是角色，也可能是资源）。当认证成功后 <code>AuthenticationManager</code> （认证管理器）负责将 <code>GrantedAuthority</code> 对象插入到 <code>Authentication</code> 中并返回，之后 <code>AuthorizationManager</code> （授权管理器）在做出授权决策时会使用这些数据。</p><p><code>GrantedAuthority </code>是一个简单的接口，只有一个方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">GrantedAuthority</span> <span class="token keyword">extends</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span>
	<span class="token class-name">String</span> <span class="token function">getAuthority</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这个方法使得 <code>AuthorizationManager</code> （授权管理器）能够获取 <code>GrantedAuthority</code> 的确切字符串表示。为什么说是字符串表示？从返回值 String 也不难看出，Spring Security 是用字符串的形式来代表一项权限的。</p><p>由于大多数 <code>AuthorizationManager</code> 和 <code>AccessDecisionManager</code> （访问决策管理器）可以轻松解析这个字符串，如果 <code>GrantedAuthority</code> 对象不能直接转换为字符串，则该对象被认为是 “复杂” 的，这时 <code>getAuthority()</code> 应该返回 <code>null</code>。</p><p>例如，一个存储不同客户账号的操作和权限阈值列表的 <code>GrantedAuthority</code> 就很难转换为简单的字符串，因此这类 <code>GrantedAuthority</code> 是 “复杂” 的，它的 <code>getAuthority()</code> 方法会返回 <code>null</code>。这样，<code>AuthorizationManager</code> 就知道需要特定的支持来理解这个 <code>GrantedAuthority</code> 对象。</p><p>Spring Security 提供了一个具体的 <code>GrantedAuthority</code> 实现，即 <code>SimpleGrantedAuthority</code>，它可以将任何字符串转换为 <code>GrantedAuthority</code>。</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-095158.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>Spring Security 中的所有 <code>AuthenticationProvider</code> 都使用 <code>SimpleGrantedAuthority</code> 来填充 <code>Authentication</code> 对象的。</p><h3 id="_1-2-预调用处理" tabindex="-1"><a class="header-anchor" href="#_1-2-预调用处理" aria-hidden="true">#</a> 1.2 预调用处理</h3><p>Spring Security 提供了一系列拦截器，用于控制对安全敏感对象的访问，这些对象可能是方法调用或 Web 请求。在实际调用发生前，是否允许该调用继续由 <code>AccessDecisionManager</code> 决定。</p><h4 id="_1-2-1-authorizationmanager-的引入" tabindex="-1"><a class="header-anchor" href="#_1-2-1-authorizationmanager-的引入" aria-hidden="true">#</a> 1.2.1 AuthorizationManager 的引入</h4><p><code>AuthorizationManager</code> 是为替代 Spring Security 旧版本 <code>AccessDecisionManager</code> 和 <code>AccessDecisionVoter</code> 设计的新接口。为了实现更高的可定制性和效率，现在鼓励那些曾自定义 <code>AccessDecisionManager</code> 或 <code>AccessDecisionVoter</code> 的开发者转向使用 <code>AuthorizationManager</code>。</p><p>由 <code>AuthorizationFilter</code> 调用的 <code>AuthorizationManager</code> 负责做出终极的访问决策。此接口定义了两个核心方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@FunctionalInterface</span>
<span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">AuthorizationManager</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">&gt;</span></span> <span class="token punctuation">{</span>
  
	<span class="token keyword">default</span> <span class="token keyword">void</span> <span class="token function">verify</span><span class="token punctuation">(</span><span class="token class-name">Supplier</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Authentication</span><span class="token punctuation">&gt;</span></span> authentication<span class="token punctuation">,</span> <span class="token class-name">T</span> object<span class="token punctuation">)</span> <span class="token punctuation">{</span>
		<span class="token class-name">AuthorizationDecision</span> decision <span class="token operator">=</span> <span class="token function">check</span><span class="token punctuation">(</span>authentication<span class="token punctuation">,</span> object<span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token keyword">if</span> <span class="token punctuation">(</span>decision <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span>decision<span class="token punctuation">.</span><span class="token function">isGranted</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
			<span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">AccessDeniedException</span><span class="token punctuation">(</span><span class="token string">&quot;Access Denied&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
		<span class="token punctuation">}</span>
	<span class="token punctuation">}</span>
  
     <span class="token annotation punctuation">@Nullable</span>
	<span class="token class-name">AuthorizationDecision</span> <span class="token function">check</span><span class="token punctuation">(</span><span class="token class-name">Supplier</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Authentication</span><span class="token punctuation">&gt;</span></span> authentication<span class="token punctuation">,</span> <span class="token class-name">T</span> object<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>check</code> 方法会接收到所有必要的信息以做出授权决策。特别是，它会接收一个 “安全对象”，这使得我们能检查真正的安全对象调用中的参数。比如，如果这个安全对象是 <code>MethodInvocation</code>，我们可以轻松获取其中的 <code>Customer</code> 参数，并在 <code>AuthorizationManager</code> 中实现相应的安全逻辑，以验证某个主体是否被允许对该客户执行某个操作。</p><p>该方法的返回值是 <code>AuthorizationDecision</code>。如果授权成功，将返回正的 <code>AuthorizationDecision</code>；如果被拒绝，则返回负的 <code>AuthorizationDecision</code>；而如果决策被放弃或无法决定，则返回 <code>null</code>。</p><p>这里提到的 “正”、“负” <code>AuthorizationDecision</code> 是什么意思？点开源码你就知晓了：</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-112241.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>可见，<code>AuthorizationDecision</code> 中使用一个 boolean 类型的 <code>granted</code> 属性代表是否允许本次对 “安全对象” 的访问或操作。</p><p>另外，<code>verify</code> 方法基本上是在调用 <code>check</code> 方法后，根据其返回值决定是否抛出 <code>AccessDeniedException</code>。</p><h4 id="_1-2-2-基于委托的-authorizationmanager-授权管理器实现" tabindex="-1"><a class="header-anchor" href="#_1-2-2-基于委托的-authorizationmanager-授权管理器实现" aria-hidden="true">#</a> 1.2.2 基于委托的 AuthorizationManager 授权管理器实现</h4><p>虽然开发者可以自行实现 <code>AuthorizationManager</code>，Spring Security 也提供了 <code>RequestMatcherDelegatingAuthorizationManager</code>，这是一个与多个 <code>AuthorizationManager</code> 一同工作的委托管理器。它的主要功能是将请求匹配到最合适的 <code>AuthorizationManager</code>。为了增强方法的安全性，可以进一步使用 <code>AuthorizationManagerBeforeMethodInterceptor</code> 和 <code>AuthorizationManagerAfterMethodInterceptor</code>。</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-114935.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>通过这种方式，可以组合多个 <code>AuthorizationManager</code> 实现，并依次轮询它们以做出授权决策。</p><h4 id="_1-2-3-authorityauthorizationmanager" tabindex="-1"><a class="header-anchor" href="#_1-2-3-authorityauthorizationmanager" aria-hidden="true">#</a> 1.2.3 AuthorityAuthorizationManager</h4><p>Spring Security 中最常用的 <code>AuthorizationManager</code> 是 <code>AuthorityAuthorizationManager</code>。它通过比对当前的 <code>Authentication</code> 来查找配置的权限。如果 <code>Authentication</code> 中包含任何给定的权限，则它会返回一个正的 <code>AuthorizationDecision</code>；否则，它返回一个负的 <code>AuthorizationDecision</code>。</p><h4 id="_1-2-4-authenticatedauthorizationmanager" tabindex="-1"><a class="header-anchor" href="#_1-2-4-authenticatedauthorizationmanager" aria-hidden="true">#</a> 1.2.4 AuthenticatedAuthorizationManager</h4><p><code>AuthenticatedAuthorizationManager</code> 的主要用途是区分不同的用户身份状态，例如匿名用户、已认证用户以及 “记住我” 状态的用户。很多网站在用户处于 “记住我” 的状态时，会提供有限的访问权限，但要获取更多权限则需要用户登录。</p><h4 id="_1-2-5-自定义授权管理器" tabindex="-1"><a class="header-anchor" href="#_1-2-5-自定义授权管理器" aria-hidden="true">#</a> 1.2.5 自定义授权管理器</h4><p>当然，你也可以自定义 <code>AuthorizationManager</code>，在其中加入你自己的访问控制逻辑。这可能与你的业务逻辑密切相关，或可能涉及特定的安全管理策略。例如，你可以创建一个查询开放策略代理或自定义授权数据库的授权管理器。</p>`,35),d={href:"https://spring.io/blog/2009/01/03/spring-security-customization-part-2-adjusting-secured-session-in-real-time",target:"_blank",rel:"noopener noreferrer"},u=a("code",null,"AccessDecisionVoter",-1),k=a("code",null,"AuthorizationManager",-1),h=s(`<h3 id="_1-3-调整-accessdecisionmanager-和-accessdecisionvoters" tabindex="-1"><a class="header-anchor" href="#_1-3-调整-accessdecisionmanager-和-accessdecisionvoters" aria-hidden="true">#</a> 1.3 调整 AccessDecisionManager 和 AccessDecisionVoters</h3><p>在 Spring Security 中，<code>AuthorizationManager</code> 是一个新的接口，提供了更为简化和通用的方法来实现权限检查。但对于那些已经使用了 <code>AccessDecisionManager</code> 和 <code>AccessDecisionVoter</code> 的旧版本应用程序，迁移可能会遇到一些挑战。因此，我们可以使用适配器模式将这两种方法与新的 <code>AuthorizationManager</code> 连接起来。</p><p>如果你之前已经有一个自定义的 <code>AccessDecisionManager</code>，并且希望在新的 <code>AuthorizationManager</code> 结构中继续使用它，你可以创建一个适配器。这个适配器将实现 <code>AuthorizationManager</code> 接口，并在内部调用您原有的 <code>AccessDecisionManager</code>。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token comment">// 创建一个名为 AccessDecisionManagerAuthorizationManagerAdapter 的组件，它实现了 AuthorizationManager 接口。</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AccessDecisionManagerAuthorizationManagerAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">AuthorizationManager</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">AccessDecisionManager</span> accessDecisionManager<span class="token punctuation">;</span>  <span class="token comment">// 一个 AccessDecisionManager 实例。</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">SecurityMetadataSource</span> securityMetadataSource<span class="token punctuation">;</span>  <span class="token comment">// 一个 SecurityMetadataSource 实例，它提供安全对象的属性。</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token comment">// 实现 check 方法。</span>
    <span class="token keyword">public</span> <span class="token class-name">AuthorizationDecision</span> <span class="token function">check</span><span class="token punctuation">(</span><span class="token class-name">Supplier</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Authentication</span><span class="token punctuation">&gt;</span></span> authentication<span class="token punctuation">,</span> <span class="token class-name">Object</span> object<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">try</span> <span class="token punctuation">{</span>
            <span class="token comment">// 获取安全对象的属性。</span>
            <span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ConfigAttribute</span><span class="token punctuation">&gt;</span></span> attributes <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>securityMetadataSource<span class="token punctuation">.</span><span class="token function">getAttributes</span><span class="token punctuation">(</span>object<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 使用 AccessDecisionManager 的 decide 方法做出授权决策。</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span>accessDecisionManager<span class="token punctuation">.</span><span class="token function">decide</span><span class="token punctuation">(</span>authentication<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> object<span class="token punctuation">,</span> attributes<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 如果授权成功，返回正 AuthorizationDecision。</span>
            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">AuthorizationDecision</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">AccessDeniedException</span> ex<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 如果授权失败，返回负 AuthorizationDecision。</span>
            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">AuthorizationDecision</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token comment">// 实现 verify 方法。</span>
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">verify</span><span class="token punctuation">(</span><span class="token class-name">Supplier</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Authentication</span><span class="token punctuation">&gt;</span></span> authentication<span class="token punctuation">,</span> <span class="token class-name">Object</span> object<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ConfigAttribute</span><span class="token punctuation">&gt;</span></span> attributes <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>securityMetadataSource<span class="token punctuation">.</span><span class="token function">getAttributes</span><span class="token punctuation">(</span>object<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>accessDecisionManager<span class="token punctuation">.</span><span class="token function">decide</span><span class="token punctuation">(</span>authentication<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> object<span class="token punctuation">,</span> attributes<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>完成上述适配器后，只需将它添加到你的 <code>SecurityFilterChain</code> 中，就可以在新的 <code>AuthorizationManager</code> 结构中继续使用原有的 <code>AccessDecisionManager</code> 了。</p><p>对于那些只使用 <code>AccessDecisionVoter</code> 的应用程序，您可以创建一个类似的适配器，但这次是针对 <code>AccessDecisionVoter</code>。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token annotation punctuation">@Component</span>
<span class="token comment">// 创建一个名为 AccessDecisionVoterAuthorizationManagerAdapter 的组件，它实现了 AuthorizationManager 接口。</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AccessDecisionVoterAuthorizationManagerAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">AuthorizationManager</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">AccessDecisionVoter</span> accessDecisionVoter<span class="token punctuation">;</span>  <span class="token comment">// 一个 AccessDecisionVoter 实例。</span>
    <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">SecurityMetadataSource</span> securityMetadataSource<span class="token punctuation">;</span>  <span class="token comment">// 一个 SecurityMetadataSource 实例，它提供安全对象的属性。</span>

    <span class="token annotation punctuation">@Override</span>
    <span class="token comment">// 实现 check 方法。</span>
    <span class="token keyword">public</span> <span class="token class-name">AuthorizationDecision</span> <span class="token function">check</span><span class="token punctuation">(</span><span class="token class-name">Supplier</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Authentication</span><span class="token punctuation">&gt;</span></span> authentication<span class="token punctuation">,</span> <span class="token class-name">Object</span> object<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 获取安全对象的属性。</span>
        <span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ConfigAttribute</span><span class="token punctuation">&gt;</span></span> attributes <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>securityMetadataSource<span class="token punctuation">.</span><span class="token function">getAttributes</span><span class="token punctuation">(</span>object<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 使用 AccessDecisionVoter 的 vote 方法做出授权决策。</span>
        <span class="token keyword">int</span> decision <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>accessDecisionVoter<span class="token punctuation">.</span><span class="token function">vote</span><span class="token punctuation">(</span>authentication<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> object<span class="token punctuation">,</span> attributes<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">switch</span> <span class="token punctuation">(</span>decision<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">case</span> <span class="token constant">ACCESS_GRANTED</span><span class="token operator">:</span>
            <span class="token comment">// 如果授权成功，返回正 AuthorizationDecision。</span>
            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">AuthorizationDecision</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">case</span> <span class="token constant">ACCESS_DENIED</span><span class="token operator">:</span>
            <span class="token comment">// 如果授权失败，返回负 AuthorizationDecision。</span>
            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">AuthorizationDecision</span><span class="token punctuation">(</span><span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 如果既不允许也不拒绝，返回 null。</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>同样，完成这个适配器后，将它添加到您的 <code>SecurityFilterChain</code> 中，您就可以在新的 <code>AuthorizationManager</code> 结构中继续使用原有的 <code>AccessDecisionVoter</code> 了。</p><p>通过使用适配器模式，您可以确保在迁移到新的 <code>AuthorizationManager</code> 结构时，旧版本应用程序中的权限检查逻辑仍然有效。这样可以确保向后兼容性，同时享受 <code>Spring Security</code> 新版本带来的优点和功能。</p><h3 id="_1-4-角色层次结构的重要性" tabindex="-1"><a class="header-anchor" href="#_1-4-角色层次结构的重要性" aria-hidden="true">#</a> 1.4 角色层次结构的重要性</h3><p>很多时候，我们需要给定的角色自动包括其他角色的权限。比如在大多数系统中，“管理员” 通常拥有比 “普通用户” 更多的权限。而不是为每个管理员单独配置所有的权限，角色层次结构允许我们简单地声明管理员继承了普通用户的所有权限。</p><p>Spring Security 提供了 <code>RoleHierarchy</code> 接口和其实现 <code>RoleHierarchyImpl</code> 以支持角色层次结构的定义。这个定义说明了哪些角色继承了其他角色的权限。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">RoleHierarchy</span> hierarchy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RoleHierarchyImpl</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
hierarchy<span class="token punctuation">.</span><span class="token function">setHierarchy</span><span class="token punctuation">(</span><span class="token string">&quot;ROLE_ADMIN &gt; ROLE_STAFF\\n&quot;</span> <span class="token operator">+</span>
        <span class="token string">&quot;ROLE_STAFF &gt; ROLE_USER\\n&quot;</span> <span class="token operator">+</span>
        <span class="token string">&quot;ROLE_USER &gt; ROLE_GUEST&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上述代码中：</p><ul><li><code>ROLE_ADMIN</code> 继承了 <code>ROLE_STAFF</code>、<code>ROLE_USER</code> 和 <code>ROLE_GUEST</code> 的所有权限。</li><li><code>ROLE_STAFF</code> 继承了 <code>ROLE_USER</code> 和 <code>ROLE_GUEST</code> 的所有权限。</li><li><code>ROLE_USER</code> 继承了 <code>ROLE_GUEST</code> 的所有权限。</li><li><code>RoleHierarchyVoter</code> 是 <code>Spring Security</code> 中的一个投票器，它能够理解这种角色层次结构。当用户的权限被检查时，这个投票器会考虑用户的所有继承权限。</li></ul><p>这样做的优势如下：</p><ol><li><strong>简化配置</strong>: 通过角色层次结构，你不再需要为每个角色单独配置所有权限。只需配置继承关系即可。</li><li><strong>易于管理</strong>: 随着应用程序的发展，新的角色和权限可能会添加进来。使用层次结构可以更容易地管理这些变化，而不是更新每个角色的单独配置。</li><li><strong>更清晰的语义</strong>: 通过查看角色的层次结构，你可以快速了解各个角色之间的关系和它们所拥有的权限。</li></ol><p>可见，角色层次结构是权限管理中的一个强大工具，特别是在那些有多个角色和权限的复杂应用程序中。正确使用可以大大简化配置和管理工作。</p><h3 id="_1-5-遗留的授权组件" tabindex="-1"><a class="header-anchor" href="#_1-5-遗留的授权组件" aria-hidden="true">#</a> 1.5 遗留的授权组件</h3><p>Spring Security 为了向后兼容和逐渐迁移到新的授权模型，保留了一些遗留组件。虽然它们仍然存在，但是新的应用程序和功能建议使用前面提到的新的授权组件。下面是有关 <code>AccessDecisionManager</code> 遗留组件的简要说明。</p><h4 id="_1-5-1-accessdecisionmanager" tabindex="-1"><a class="header-anchor" href="#_1-5-1-accessdecisionmanager" aria-hidden="true">#</a> 1.5.1 AccessDecisionManager</h4><p><code>AccessDecisionManager</code> 在 Spring Security 的早期版本中用于做出授权决策。它由 <code>AbstractSecurityInterceptor</code> 调用，主要职责是确定给定的认证是否应该被允许访问一个特定的对象（如方法、URL等）。</p><p>它的主要方法和职责如下：</p><ol><li><strong>decide</strong>: <ul><li>参数: <ul><li><code>Authentication authentication</code>: 当前用户的认证信息。</li><li><code>Object secureObject</code>: 当前试图访问的对象。</li><li><code>Collection&lt;ConfigAttribute&gt; attrs</code>: 与 <code>secureObject</code> 关联的配置属性（通常表示为角色）。</li></ul></li><li>职责: <ul><li>决定给定的 <code>authentication</code> 是否应该被允许访问 <code>secureObject</code>。如果不允许，则会抛出 <code>AccessDeniedException</code> 异常。</li></ul></li></ul></li><li><strong>supports(ConfigAttribute attribute)</strong>: <ul><li>参数: <ul><li><code>ConfigAttribute attribute</code>: 一个配置属性。</li></ul></li><li>职责: <ul><li>确定 <code>AccessDecisionManager</code> 是否支持给定的 <code>ConfigAttribute</code>。这是为了确保 <code>AccessDecisionManager</code> 可以处理与 <code>secureObject</code> 关联的所有配置属性。</li></ul></li></ul></li><li><strong>supports(Class clazz)</strong>: <ul><li>参数: <ul><li><code>Class clazz</code>: 一个类。</li></ul></li><li>职责: <ul><li>确定 <code>AccessDecisionManager</code> 是否支持给定的安全对象类型。这通常用于确定 <code>AccessDecisionManager</code> 是否可以处理由特定的安全拦截器（如方法、URL等）呈现的 <code>secureObject</code>。</li></ul></li></ul></li></ol><p>在更早期的 Spring Security 实现中，这些组件为授权决策提供了核心功能。但随着时间的推移，为了更好地满足现代应用程序的需要，Spring Security 引入了新的授权组件，如 <code>AuthorizationManager</code>。</p><p>总之，虽然 <code>AccessDecisionManager</code> 可能在某些早期的实现中仍然是必要的，但对于新的实现和功能，建议使用新的授权组件。</p><h4 id="_1-5-2-基于投票的-accessdecisionmanager-实现" tabindex="-1"><a class="header-anchor" href="#_1-5-2-基于投票的-accessdecisionmanager-实现" aria-hidden="true">#</a> 1.5.2 基于投票的 AccessDecisionManager 实现</h4><p>在 Spring Security 中，一种常见的做法是使用基于投票的机制来做出授权决策。这种方法依赖于多个 <code>AccessDecisionVoter</code> 来评估授权请求，然后 <code>AccessDecisionManager</code> 根据这些投票来做出最终的决策。</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-114917.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>以下是这种方法的详细说明：</p><ol><li><strong>AccessDecisionVoter 接口</strong>: <ul><li><code>vote(Authentication authentication, Object object, Collection&lt;ConfigAttribute&gt; attrs)</code>: 返回 int 类型的投票结果。它可以是 <code>ACCESS_ABSTAIN</code>（表示投票者对此决策没有意见），<code>ACCESS_DENIED</code>（表示投票者拒绝访问）或 <code>ACCESS_GRANTED</code>（表示投票者允许访问）。</li><li><code>supports(ConfigAttribute attribute)</code>: 返回一个布尔值，表示此投票者是否支持给定的配置属性。</li><li><code>supports(Class clazz)</code>: 返回一个布尔值，表示此投票者是否支持给定的安全对象类型。</li></ul></li><li><strong>具体的 AccessDecisionManager 实现</strong>: <ul><li><strong>ConsensusBased</strong>: 基于非弃权投票的多数来决定授予权限。有属性可以配置在所有票数相等或所有投票者都弃权时的行为。</li><li><strong>AffirmativeBased</strong>: 只要至少有一个投票者投了 <code>ACCESS_GRANTED</code>，就授予访问权限。其他所有的 <code>ACCESS_DENIED</code> 投票都将被忽略。也有属性可以配置在所有投票者都弃权时的行为。</li><li><strong>UnanimousBased</strong>: 只有当所有投票都是 <code>ACCESS_GRANTED</code> 时，才授予权限。如果任何投票者投 <code>ACCESS_DENIED</code>，访问将被拒绝。忽略所有的 <code>ACCESS_ABSTAIN</code> 投票。也有属性可以配置在所有投票者都弃权时的行为。</li></ul></li><li><strong>定制的 AccessDecisionManager</strong>: 尽管 Spring Security 提供了几个基于投票的 <code>AccessDecisionManager</code> 实现，但在某些情况下，您可能需要更复杂的投票策略。例如，某个特定的 <code>AccessDecisionVoter</code> 的投票可能需要被赋予更高的权重，或者某个特定的拒绝投票可能需要具有一票否决权。在这些情况下，您可以实现自己的 <code>AccessDecisionManager</code> 来满足这些特定需求。</li></ol><p>总之，基于投票的授权决策提供了一种灵活的方法来处理复杂的授权逻辑，允许多个 <code>AccessDecisionVoter</code> 贡献其决策，然后由 <code>AccessDecisionManager</code> 根据这些投票做出最终的授权决策。</p><h4 id="_1-5-3-rolevoter" tabindex="-1"><a class="header-anchor" href="#_1-5-3-rolevoter" aria-hidden="true">#</a> 1.5.3 RoleVoter</h4><p><code>RoleVoter</code> 是 Spring Security 中最常用的 <code>AccessDecisionVoter</code>。它主要用于简单的基于角色的访问控制，检查用户是否被授予特定的角色以获得对资源的访问权限。</p><p><strong>工作原理</strong>：</p><ul><li><code>RoleVoter</code> 主要关注那些以 <code>ROLE_</code> 为前缀的 <code>ConfigAttribute</code>。</li><li>它会检查用户的 <code>GrantedAuthority</code>（通常是从用户的 <code>Authentication</code> 对象中获得的）是否包含与 <code>ConfigAttribute</code> 完全匹配的角色。</li><li>如果用户有一个或多个匹配的角色，<code>RoleVoter</code> 就会投票 <code>ACCESS_GRANTED</code>。</li><li>如果没有匹配的角色，它会投票 <code>ACCESS_DENIED</code>。</li><li>对于不以 <code>ROLE_</code> 为前缀的 <code>ConfigAttribute</code>，<code>RoleVoter</code> 会弃权，即返回 <code>ACCESS_ABSTAIN</code>。</li></ul><h4 id="_1-5-4-authenticatedvoter" tabindex="-1"><a class="header-anchor" href="#_1-5-4-authenticatedvoter" aria-hidden="true">#</a> 1.5.4 AuthenticatedVoter</h4><p><code>AuthenticatedVoter</code> 是另一个常用的 <code>AccessDecisionVoter</code>，用于区分不同身份验证级别的用户。</p><ul><li>工作原理： <ul><li><code>AuthenticatedVoter</code> 考虑的 <code>ConfigAttribute</code> 主要有三个：<code>IS_AUTHENTICATED_ANONYMOUSLY</code>、<code>IS_AUTHENTICATED_REMEMBERED</code> 和 <code>IS_AUTHENTICATED_FULLY</code>。</li><li>当一个用户是匿名用户时，<code>IS_AUTHENTICATED_ANONYMOUSLY</code> 会被授予。</li><li>当一个用户通过“记住我”功能被认证时，<code>IS_AUTHENTICATED_REMEMBERED</code> 会被授予。</li><li>当一个用户完全被身份验证（例如，通过一个登录表单）时，<code>IS_AUTHENTICATED_FULLY</code> 会被授予。</li><li>这三个属性允许您区分不同级别的用户身份验证，并基于这些身份验证级别为资源提供访问控制。</li></ul></li></ul><p>通过组合这些 <code>Voters</code> 和其他自定义 <code>Voters</code>，你可以在 Spring Security 中创建非常精细的访问控制策略。</p><h4 id="_1-5-5-自定义投票者" tabindex="-1"><a class="header-anchor" href="#_1-5-5-自定义投票者" aria-hidden="true">#</a> 1.5.5 自定义投票者</h4><p>在Spring Security中，使用<code>AccessDecisionVoter</code>接口创建自定义投票者是为了提供更加细粒度和特定于应用程序的访问控制策略。自定义投票者可以根据特定的业务逻辑或其他条件为特定的操作或资源提供访问控制。</p><figure><img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-115018.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>例如，您可以创建一个投票者来检查用户账户是否被暂停，如果账户被暂停，那么访问请求将被拒绝。</p><p><strong>实现自定义投票者的步骤</strong>：</p><ol><li>实现<code>AccessDecisionVoter</code>接口。</li><li>根据您的需要实现<code>vote</code>方法。这是做出授权决策的核心方法。</li><li>还需要实现<code>supports</code>方法，以确定投票者是否支持特定的<code>ConfigAttribute</code>或安全对象类型。</li><li>将您的自定义投票者添加到基于投票的<code>AccessDecisionManager</code>实现中。</li></ol><p><strong>AfterInvocationManager和AfterInvocationProvider</strong></p><p>在Spring Security中，<code>AfterInvocationManager</code>用于在方法调用之后处理安全考虑因素。这可能包括修改返回的对象或在某些条件下抛出<code>AccessDeniedException</code>。</p><p>例如，即使用户有权访问某个方法，<code>AfterInvocationProvider</code>也可以基于返回数据的内容或状态来决定是否抛出<code>AccessDeniedException</code>。</p><p><strong>关键点</strong>：</p><ul><li>如果您使用了<code>AfterInvocationManager</code>，仍然需要一个<code>AccessDecisionManager</code>来决定是否允许对方法进行调用。</li><li>默认情况下，如果所有的<code>AccessDecisionVoter</code>都弃权，且<code>AccessDecisionManager</code>的<code>allowIfAllAbstainDecisions</code>属性设置为<code>false</code>，将会抛出<code>AccessDeniedException</code>。</li><li>可以通过两种方法避免上述问题：(i) 将<code>allowIfAllAbstainDecisions</code>设置为<code>true</code>（但通常不建议这样做）；或(ii)确保至少有一个<code>ConfigAttribute</code>存在，供某个<code>AccessDecisionVoter</code>根据该属性授予访问权限。</li></ul><p>最后，无论是自定义投票者还是其他安全组件，Spring Security都提供了非常强大和灵活的机制来满足您的特定需求。</p><h2 id="_2-授权-http-请求" tabindex="-1"><a class="header-anchor" href="#_2-授权-http-请求" aria-hidden="true">#</a> 2.授权 HTTP 请求</h2><h2 id="_3-使用-filtersecurityinterceptor-授权-http-请求" tabindex="-1"><a class="header-anchor" href="#_3-使用-filtersecurityinterceptor-授权-http-请求" aria-hidden="true">#</a> 3.使用 FilterSecurityInterceptor 授权 HTTP 请求</h2><h2 id="_4-基于表达式的访问控制" tabindex="-1"><a class="header-anchor" href="#_4-基于表达式的访问控制" aria-hidden="true">#</a> 4.基于表达式的访问控制</h2><h2 id="_5-安全对象实现" tabindex="-1"><a class="header-anchor" href="#_5-安全对象实现" aria-hidden="true">#</a> 5.安全对象实现</h2><h2 id="_6-方法安全性" tabindex="-1"><a class="header-anchor" href="#_6-方法安全性" aria-hidden="true">#</a> 6.方法安全性</h2><h2 id="_7-对象安全-acl" tabindex="-1"><a class="header-anchor" href="#_7-对象安全-acl" aria-hidden="true">#</a> 7.对象安全 ACL</h2><h2 id="_8-授权事件" tabindex="-1"><a class="header-anchor" href="#_8-授权事件" aria-hidden="true">#</a> 8.授权事件</h2>`,59);function g(A,m){const e=o("ExternalLinkIcon");return t(),i("div",null,[r,a("blockquote",null,[a("p",null,[n("在 Spring 官方网站上有一篇"),a("a",d,[n("博客文章"),p(e)]),n("，描述了如何使用旧版 "),u,n(" 来拒绝已被暂停账户的用户访问。现在，你可以通过实现新的 "),k,n(" 来达到相同的效果。")])]),h])}const y=c(l,[["render",g],["__file","04-Security-授权.html.vue"]]);export{y as default};

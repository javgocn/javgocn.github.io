---
title: 02-Security-整体架构
---


在本篇文章中，我们将探索 Spring Security 在基于 Servlet 的应用中的高级架构。这为我们后续的认证（Authentication）和授权（Authorization）内容打下坚实的基础。

## 1.Servlet Filter：守门人的角色

Spring Security 在 Servlet 中的支持是围绕 Servlet 过滤器构建的。为了更好地理解 Spring Security，我们首先需要了解 Servlet 过滤器的核心概念和作用。想象一下，当一个 HTTP 请求到来时，它会经过一系列的检查点，这些检查点就像一个个守门人，确保请求是合法的。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-130142.png)

当一个客户端请求到达我们的服务时，容器会为这个请求创建一个所谓的 FilterChain（过滤器链）。这个链包含了一系列的过滤器和一个 Servlet，它们都是基于请求的 URI 来决定的。在 Spring MVC 的世界里，这个 Servlet 通常是我们熟知的 **DispatcherServlet**。值得注意的是，**一个请求只能由一个 Servlet 来处理，但可以被多个过滤器审查**。

这些过滤器可以做以下事情：

* **阻止后续的过滤器或 Servlet 的执行**。例如，当一个请求没有通过某些安全检查时，相应的过滤器可以直接返回一个错误响应。
* **在请求到达 Servlet 之前或之后，修改请求或响应的内容**。

过滤器的真正威力来自于它可以**与其他过滤器一起协同工作**，这得益于传递给它的 FilterChain。

为了更直观地理解，让我们看一个简单的示例：

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
	// 做一些预处理
    chain.doFilter(request, response); // 继续执行其他过滤器或 Servlet（如果已经是最后一个过滤器）
    // 做一些后处理
}
```

这里的关键是，**过滤器的执行顺序**至关重要，因为每个过滤器都可能依赖于前一个过滤器的结果。

## 2.DelegatingFilterProxy：桥接 Servlet 和 Spring 的神器

在 Web 应用开发中，我们经常需要**在 Servlet 容器和 Spring 的 ApplicationContext 之间建立联系**。Spring 提供了一个巧妙的解决方案，名为 `DelegatingFilterProxy`。（我们简单拆开翻译就是：授权 Filter 代理）

🤔 什么是 DelegatingFilterProxy？

`DelegatingFilterProxy` 是 Spring 提供的一个 Filter 实现，我们可以在 spring-web-xxx.jar 包中发现它：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-133013.png)

它的核心功能是允许 Servlet 容器（如 Tomcat）使用其标准机制注册 Filter，但实际的 Filter 逻辑是由 Spring 定义的 Bean 执行的。简而言之，它**充当了一个代理，将请求从 Servlet 容器转发到 Spring 定义的 Filter Bean。使得 Spring 的 Filter Bean 可以像 Servlet Filter 那样参与到处理本次请求的过程之中，从而实现一些自定义的处理逻辑。**

> ⚠️ 注意：上面加粗这句话很重要，请大声朗读三遍。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-143113.png)

🤔 它是如何工作的？

当一个请求到达 `DelegatingFilterProxy` 时（它的父类 `GenericFilterBean` 实现了 `Filter` 接口，因此它也是一个 `Filter`），它不会立即处理该请求。相反，它会从 Spring 的 ApplicationContext 中查找一个实现了 Filter 接口的 Bean，并将请求委托给这个 Bean 进行处理。

以下是 `DelegatingFilterProxy` 的简化伪代码：

```java
public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) {
    // 延迟从 Spring ApplicationContext 中获取 Filter Bean
    Filter delegate = getFilterBean(someBeanName);
    // 将工作委托给这个 Spring Bean
    delegate.doFilter(request, response);
}
```

虽然 Spring Security 官方文档仅仅给了为代码，但是为了加深理解我们不妨直接看看源代码。既然 `DelegatingFilterProxy` 本身也是一个 Filter，那么我们直接关注 Filter 的核心方法 `doFilter()` 或许就能看出一些端倪。

```java
/**
 * DelegatingFilterProxy 一个代理过滤器，它将实际的过滤逻辑委托给一个 Spring 管理的 bean。
 */
public class DelegatingFilterProxy extends GenericFilterBean {

    // 运行此过滤器的 WebApplicationContext
    @Nullable
    private WebApplicationContext webApplicationContext;

    // 要委托的目标 bean 的名称
    @Nullable
    private String targetBeanName;

    // 实际的委托过滤器 bean，延迟初始化
    @Nullable
    private volatile Filter delegate;

    // 用于同步委托的延迟初始化的监视器对象
    private final Object delegateMonitor = new Object();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 如果需要，延迟初始化委托。
        Filter delegateToUse = this.delegate;
      
        // 检查委托过滤器 Bean 是否存在（双重检查锁，同步块外检查一次）
        if (delegateToUse == null) {
            // 上锁，保证同步
            synchronized (this.delegateMonitor) {
                delegateToUse = this.delegate;
                 
                 // 同步块内二次检查
                if (delegateToUse == null) {
                    // 查找运行此过滤器的 WebApplicationContext（我们需要从容器中根据 targetBeanName 获取对应的 Filter Bean）
                    WebApplicationContext wac = findWebApplicationContext();
                    if (wac == null) {
                        // 如果找不到 WebApplicationContext，抛出异常
                        throw new IllegalStateException("未找到 WebApplicationContext: " +
                                "没有注册 ContextLoaderListener 或 DispatcherServlet?");
                    }
                    // 使用找到的 WebApplicationContext 初始化委托过滤器 Bean
                    delegateToUse = initDelegate(wac);
                }
                this.delegate = delegateToUse;
            }
        }

        // 让委托过滤器 Bean 执行实际的 doFilter 操作
        invokeDelegate(delegateToUse, request, response, filterChain);
    }
  
  
     /**
     * 在 WebApplicationContext 中国呢查找委托过滤器 Bean
     */
   protected Filter initDelegate(WebApplicationContext wac) throws ServletException {
          // 获取 targetBeanName
		String targetBeanName = getTargetBeanName();
		Assert.state(targetBeanName != null, "No target bean name set");
     
          // 在容器中找到对应的委托过滤器 Bean
		Filter delegate = wac.getBean(targetBeanName, Filter.class);
		if (isTargetFilterLifecycle()) {
			delegate.init(getFilterConfig());
		}
		return delegate;
	}

    /**
     * 调用委托过滤器的 doFilter 方法。
     */
    protected void invokeDelegate(
            Filter delegate, ServletRequest request, ServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        // 按照委托过滤器的内部实现进行处理本次请求
        delegate.doFilter(request, response, filterChain);
    }
}
```

认证看完上述源码，不难发现 `DelegatingFilterProxy` 确实只作为一个代理，它会参与到一次请求的过滤器链中。当请求到达  `DelegatingFilterProxy` 后，在它的 doFilter() 实现中会从 WebApplicationContext 中查找到对应的需要委托的 Spring 实现的 Filter Bean，然后将本次处理请求的具体逻辑授权（Delegating）给找到的这个 Filter Bean 进行处理。

🤔 为什么它如此重要？

`DelegatingFilterProxy` 的一个关键优势是其**延迟查找机制**。也就是说，尽管 **Servlet 容器需要在启动时注册所有的 Filter**，但实际的 Spring 实现的 Filter Bean 可以稍后由 Spring 自己加载，并没有与 Servlet 原生的 Filter 一起注册。因为 `DelegatingFilterProxy` 已经加载了，但是由于真实处理请求的委托过滤器是在其内部方法中调用的，因此不必参与 Servlet 的 Filter 在 Servlet 容器启动时立即初始化。

这是非常有用的，因为 Spring 通常使用 `ContextLoaderListener` 来加载其 Bean，这可能会在 Servlet 容器完成其 Filter 注册之后才发生。

这时候，你可能又要犯难了。`ContextLoaderListener` 是个啥玩意儿？看后缀 “-Listener” 盲猜是一个监听器，我们知道在 Spring 中监听器一般是用来监听某个事件从而触发一些动作的。

> ⏰ 复习时间：
>
> 在 Spring 中事件的基类是 ApplicationEvent，而发布事件的能力（publishEvent()）则是由 ApplicationEventPublisher 接口提供的，它最常见的实现 AbstractApplicationContext 负责提供具体的发布逻辑。ApplicationEventPublisher 有一个我们熟悉的子接口 ApplicationContext，事件通常就是由它发出的。最后，这些一个个的 ApplicationListener 监听器由谁维护呢？在 Spring 中是由一个称为 ApplicationEventMulticaster（上下文事件多播接口）的实现类 AbstractApplicationEventMulticaster 中的 CachedListenerRetriever 内部内使用一个 Set 集合维护的。当 ApplicationContext 发出事件时就会获取并通过多播的形式通知到每一个监听器。（感兴趣的自己去翻翻源码，这里主要涉及到了设计模式中的观察者模式，值得细品 🍵）

在一个典型的 Spring Web 应用程序中，`ContextLoaderListener` 是一个 Servlet 监听器，它负责启动 Web 应用程序的根 `ApplicationContext`。这个根 `ApplicationContext` 是整个 Web 应用程序共享的，它通常包含那些不特定于任何一个 Servlet 的 Bean，例如服务层、数据访问层等。

当 Servlet 容器（如 Tomcat）启动时，它会按照在 `web.xml` 文件中定义的顺序初始化各种组件。首先，它会初始化并注册所有的 `Filter`，然后再初始化 `Servlet`。监听器（如 `ContextLoaderListener`）的初始化通常在这两者之间发生。

这意味着，如果你在 `web.xml` 中定义了一个 `Filter`（比如 `DelegatingFilterProxy`），并希望它使用一个 Spring Bean（也就是上面所说的委托过滤器），那么在 Servlet 容器尝试初始化这个 `Filter` 时，Spring 的 `ApplicationContext` 可能还没有完全启动和加载所有的 Bean。

这就是 `DelegatingFilterProxy` 的价值所在。它允许你在 `web.xml` 中定义一个 `Filter`，但实际的过滤逻辑是由一个 Spring Bean 实现的。当请求到达这个 `Filter` 时，`DelegatingFilterProxy` 会从已经初始化的 `ApplicationContext` 中查找并委托给相应的 Spring Bean。这样，我们就可以确保在 `Filter` 需要的时候，所依赖的 Spring Bean 已经被正确地初始化和加载。

🥱 说得简单粗暴点：`DelegatingFilterProxy` 提供了一种机制，使我们能够在 Servlet 容器的生命周期中更灵活地使用 Spring Bean，而不必担心初始化的顺序或时机问题。

## 3.FilterChainProxy：Spring Security 过滤器链的管家

在 Spring Security 的世界中，`FilterChainProxy` 扮演着一个核心角色，它是**桥接 Servlet 过滤器与 Spring Security 过滤器**之间的关键组件。从名字上我们可以简单将其翻译为 “过滤器链代理”。

`FilterChainProxy` 是 Spring Security 提供的一个特定的过滤器，但它与传统的 Servlet 过滤器有所不同。它的主要职责是**管理一系列的 `SecurityFilterChain`，每一个 `SecurityFilterChain` 又包含了多个 Spring Security 过滤器实例**。这种设计模式允许我们灵活地配置和组合不同的安全策略。

🤔 那么，它与 DelegatingFilterProxy 有什么关系呢？

虽然 `FilterChainProxy` 本身是一个强大的组件，但在实际的应用部署中，我们通常不直接使用它。为什么呢？因为 `FilterChainProxy` 是一个 Spring 管理的 Bean，而 Servlet 容器在启动时并不知道 Spring 的上下文。这就是 `DelegatingFilterProxy` 出场的时候。

`DelegatingFilterProxy` 是一个标准的 Servlet 过滤器（这很重要），它的主要任务是**将请求委托给 Spring 容器中的特定 Bean，即我们的 `FilterChainProxy`。**这样，当一个请求到达我们的应用程序时，`DelegatingFilterProxy` 会确保这个请求被正确地转发给 `FilterChainProxy`，进而流经我们配置的 Spring Security 过滤器链。

> ⚠️ 注意：这其实和我们上一节中介绍的 Spring 实现的委托过滤器 Bean 是相关联的，你可以理解为这里的 Spring Security 提供的 FilterChainProxy Bean 就是 DelegatingFilterProxy 中从 WebApplicationContext 中获取的 delegate。（是不是稍微串起来了呢？ 😎）

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-144041.png)

## 3.SecurityFilterChain：Security 过滤器的串绳

在 Spring Security 的架构中，`FilterChainProxy` 起到了核心的作用，而它的工作方式是通过使用 `SecurityFilterChain` 来确定哪些 Spring Security 过滤器应该被调用来处理特定的请求。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-144654.png)

简单地说，`SecurityFilterChain` 是一个包含多个 Spring Security 过滤器的链条，这些过滤器按照特定的顺序执行。这些安全过滤器虽然也是一个个的 Spring Bean，但它们是直接注册到 `FilterChainProxy` 而不是 `DelegatingFilterProxy`。

使用 `FilterChainProxy` 有多个明显的优势：

1. **统一的入口点**：它为 Spring Security 的所有 Servlet 支持提供了一个统一的起点。这意味着，如果你想对 Spring Security 进行故障排除，`FilterChainProxy` 是一个理想的 Debug 调试点。
2. **核心任务**：作为 Spring Security 的核心组件，`FilterChainProxy` 能够执行一些关键任务，如清除 `SecurityContext` 以避免内存泄漏，以及应用 `HttpFirewall` 以增强应用的安全性。
3. **高度灵活性**：与传统的 Servlet 过滤器只能基于 URL 进行调用不同，`FilterChainProxy` 可以利用 `RequestMatcher` 接口，根据 `HttpServletRequest` 中的任何内容来决定哪个 `SecurityFilterChain` 应该被调用。

🤔 那么，如何选择合适的 SecurityFilterChain?

`FilterChainProxy` 能够决定哪一个 `SecurityFilterChain` 应该被用于处理特定的请求。这种设计允许我们为应用的不同部分提供独立的安全配置。

我们通过一幅图进行进一步理解：

![](https://docs.spring.io/spring-security/reference/5.8/_images/servlet/architecture/multi-securityfilterchain.png)

例如，考虑一个应用程序有两个 `SecurityFilterChain`：SecurityFilterChain<sub>0</sub> 和 SecurityFilterChain<sub>n</sub>

SecurityFilterChain<sub>0</sub> 针对 `/api/**` 的模式进行配置，而 SecurityFilterChain<sub>n</sub> 针对其他请求进行配置。当一个请求到达 `/api/messages/` URL 时，它会首先匹配到 SecurityFilterChain<sub>0</sub>，因此只有这个过滤器链条会被调用。但如果请求是针对 `/messages/` 的 URL，那么 `FilterChainProxy` 会尝试其他的 `SecurityFilterChain`，直到找到一个匹配的。

## 4.Spring Security 中的过滤器机制

在 Web 安全领域，过滤器是一个核心组件，它允许我们在请求到达目标处理程序之前或之后执行特定的操作。Spring Security 利用了 Jakarta Servlet 规范中的过滤器机制，为我们的应用程序提供了一系列的安全功能。

Spring Security 自己实现了一系列的 Servlet 过滤器来确保应用程序的安全性。这些过滤器负责各种安全相关的任务，如**身份验证、授权和漏洞防护**。为了确保这些任务按照正确的顺序和时机执行，这些过滤器被有序地组织在 `SecurityFilterChain` 中，并通过 `FilterChainProxy` 进行管理。

例如，身份验证过滤器应该在授权过滤器之前执行，因为只有在用户被正确地验证后（你是谁？），我们才能决定他们是否有权访问特定的资源（你能干啥？）。

尽管大多数时候我们不需要关心这些过滤器的执行顺序，但有时了解它们的顺序可以帮助我们更好地理解和故障排除。为了查看这些过滤器的顺序，我们可以参考 `FilterOrderRegistration` 的源码。

源码如下，感兴趣的看一看，这些都是 Spring Security 实现的过滤器，不用刻意记忆：

```java
/**
 * FilterOrderRegistration 类用于为 Spring Security 中的过滤器定义执行顺序。
 */
final class FilterOrderRegistration {
    // 初始的过滤器顺序值
    private static final int INITIAL_ORDER = 100;
    // 每个过滤器之间的顺序间隔
    private static final int ORDER_STEP = 100;
    // 存储过滤器类名与其执行顺序的映射
    private final Map<String, Integer> filterToOrder = new HashMap<>();

    /**
     * 构造函数中定义了各个过滤器的执行顺序。
     */
    FilterOrderRegistration() {
        // 创建一个步进器，用于生成过滤器的执行顺序
        Step order = new Step(INITIAL_ORDER, ORDER_STEP);

         // 禁用 URL 编码的过滤器
          put(DisableEncodeUrlFilter.class, order.next());
         // 强制提前创建会话的过滤器
		put(ForceEagerSessionCreationFilter.class, order.next());
         // 用于处理安全通道，如 HTTPS 的过滤器
		put(ChannelProcessingFilter.class, order.next());
         // 跳过一个顺序，可能是为了后续添加或其他原因（人家就这么实现的，咱也不懂）
		order.next(); // gh-8105
         // 用于集成 Web 异步支持的过滤器
		put(WebAsyncManagerIntegrationFilter.class, order.next());
         // 设置 SecurityContext 的过滤器
		put(SecurityContextHolderFilter.class, order.next());
         // 用于持久化 SecurityContext 的过滤器
		put(SecurityContextPersistenceFilter.class, order.next());
         // 用于写入安全相关的响应头的过滤器
		put(HeaderWriterFilter.class, order.next());
         // 处理跨域请求的过滤器
		put(CorsFilter.class, order.next());
         // 防止 CSRF 攻击的过滤器
		put(CsrfFilter.class, order.next());
         // 处理注销逻辑的过滤器
		put(LogoutFilter.class, order.next());
         // OAuth2 授权请求重定向过滤器
		this.filterToOrder.put("org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter",order.next());
         // SAML2 Web SSO 认证请求过滤器
		this.filterToOrder.put("org.springframework.security.saml2.provider.service.servlet.filter.Saml2WebSsoAuthenticationRequestFilter",order.next());
         // X.509 证书认证的过滤器
		put(X509AuthenticationFilter.class, order.next());
         // 预认证处理的基础过滤器
		put(AbstractPreAuthenticatedProcessingFilter.class, order.next());
         // CAS 认证的过滤器
		this.filterToOrder.put("org.springframework.security.cas.web.CasAuthenticationFilter", order.next());
         // OAuth2 登录认证的过滤器
		this.filterToOrder.put("org.springframework.security.oauth2.client.web.OAuth2LoginAuthenticationFilter",order.next());
         // SAML2 Web SSO 认证的过滤器
		this.filterToOrder.put("org.springframework.security.saml2.provider.service.servlet.filter.Saml2WebSsoAuthenticationFilter",order.next());
         // 用户名密码认证的过滤器
		put(UsernamePasswordAuthenticationFilter.class, order.next());
         // 跳过一个顺序，可能是为了后续添加或其他原因
		order.next(); // gh-8105
         // OpenID 认证的过滤器
		this.filterToOrder.put("org.springframework.security.openid.OpenIDAuthenticationFilter", order.next());
         // 自动生成默认登录页面的过滤器
		put(DefaultLoginPageGeneratingFilter.class, order.next());
         // 自动生成默认注销页面的过滤器
		put(DefaultLogoutPageGeneratingFilter.class, order.next());
         // 并发会话控制的过滤器
		put(ConcurrentSessionFilter.class, order.next());
         // HTTP 摘要认证的过滤器
		put(DigestAuthenticationFilter.class, order.next());
         // Bearer 令牌认证的过滤器
		this.filterToOrder.put("org.springframework.security.oauth2.server.resource.web.BearerTokenAuthenticationFilter",order.next());
          // HTTP 基础认证的过滤器
		put(BasicAuthenticationFilter.class, order.next());
         // 请求缓存处理的过滤器
		put(RequestCacheAwareFilter.class, order.next());
         // 使请求感知 SecurityContext 的过滤器
		put(SecurityContextHolderAwareRequestFilter.class, order.next());
         // JAAS API 集成的过滤器
		put(JaasApiIntegrationFilter.class, order.next());
         // "记住我"功能的认证过滤器
		put(RememberMeAuthenticationFilter.class, order.next());
         // 匿名用户认证的过滤器
		put(AnonymousAuthenticationFilter.class, order.next());
         // OAuth2 授权码模式的过滤器
		this.filterToOrder.put("org.springframework.security.oauth2.client.web.OAuth2AuthorizationCodeGrantFilter",order.next());
         // 会话管理的过滤器
		put(SessionManagementFilter.class, order.next());
         // 异常转换过滤器，用于将安全相关的异常转换为 Spring Security 的异常
		put(ExceptionTranslationFilter.class, order.next());
         // 安全拦截器，用于在请求处理之前进行安全检查
		put(FilterSecurityInterceptor.class, order.next());
         // 授权过滤器，用于检查用户是否有权访问特定资源
		put(AuthorizationFilter.class, order.next());
         // 切换用户过滤器，允许管理员模拟其他用户进行操作
		put(SwitchUserFilter.class, order.next());
    }

    /**
     * 将过滤器类与其执行顺序添加到映射中。
     * 
     * @param filter 过滤器类
     * @param position 执行顺序
     */
    void put(Class<? extends Filter> filter, int position) {
        // 获取过滤器的类名作为 Key
        String className = filter.getName();
        // 如果当前 Map 中已经包含该过滤器则不做任何处理
        if (this.filterToOrder.containsKey(className)) {
            return;
        }
        // 否则将过滤器和其执行顺序插入 Map 集合
        this.filterToOrder.put(className, position);
    }

    /**
     * 获取指定过滤器类的执行顺序。
     * 
     * @param clazz 过滤器类
     * @return 执行顺序，如果未找到则返回 null
     */
    Integer getOrder(Class<?> clazz) {
        while (clazz != null) {
            // 获取过滤器对应的执行顺序
            Integer result = this.filterToOrder.get(clazz.getName());
            // 如果存在，则返回对应的执行顺序
            if (result != null) {
                return result;
            }
            // 否则向上传递给父类
            clazz = clazz.getSuperclass();
        }
        return null;
    }

    /**
     * Step 类用于生成过滤器的执行顺序。
     */
    private static class Step {
        // 过滤器顺序值
        private int value;
        // 每个过滤器之间的顺序间隔
        private final int stepSize;

        Step(int initialValue, int stepSize) {
            this.value = initialValue;
            this.stepSize = stepSize;
        }

        /**
         * 获取下一个执行顺序值。
         * 
         * @return 执行顺序值
         */
        int next() {
            int value = this.value;
            this.value += this.stepSize;
            return value;
        }
    }
}
```

简单数一下发现 Spring Security 5.x 提供了36 个过滤器，下面列出一些比较常见的（我听过的）过滤器，后面遇到的时候回来看一下即可：（可以重点看看加粗部分。。。🤔 似乎也全是加粗，初学者先大概知道每个过滤器的作用吧）

| 过滤器名称                                   | 描述                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| **SecurityContextHolderFilter**              | 用于在请求开始时清除 `SecurityContextHolder`。               |
| SecurityContextPersistenceFilter             | 在 `HttpSession` 中持久化 `SecurityContext`，以便跨请求共享。 |
| **HeaderWriterFilter**                       | 为响应添加安全相关的头部，如 `X-Content-Type-Options` 和 `X-XSS-Protection`。 |
| **CorsFilter**                               | 处理跨域资源共享 (CORS) 请求。（全局跨域处理常用方式）       |
| **CsrfFilter**                               | 提供 CSRF (跨站请求伪造) 保护。                              |
| **LogoutFilter**                             | 处理用户注销逻辑。                                           |
| **AbstractPreAuthenticatedProcessingFilter** | 为预认证的场景提供基础，如与外部系统集成时已经进行了身份验证。（JWT 定制点） |
| **UsernamePasswordAuthenticationFilter**     | 处理基于用户名和密码的身份验证。（默认的认证方式）           |
| **DefaultLoginPageGeneratingFilter**         | 如果未指定自定义登录页面，则生成默认的登录页面。（单体项目定制登陆页） |
| **DefaultLogoutPageGeneratingFilter**        | 如果未指定自定义注销页面，则生成默认的注销页面。（单体项目定制注销页） |
| ConcurrentSessionFilter                      | 确保用户不会超过其允许的并发会话数。                         |
| **BearerTokenAuthenticationFilter**          | 用于 OAuth2，处理带有 Bearer 令牌的身份验证请求。            |
| **BasicAuthenticationFilter**                | 处理基于 HTTP Basic 的身份验证。                             |
| **RequestCacheAwareFilter**                  | 在身份验证成功后，将请求重定向到原始请求的 URL。（其实就是缓存原始请求） |
| SecurityContextHolderAwareRequestFilter      | 将当前请求包装为 `SecurityContextHolderAwareRequestWrapper`，提供额外的安全方法。 |
| **RememberMeAuthenticationFilter**           | 处理 “记住我” 的身份验证，允许用户在关闭浏览器后仍然保持登录状态。 |
| **AnonymousAuthenticationFilter**            | 如果当前用户未认证，为其提供匿名 `Authentication` 对象。     |
| **SessionManagementFilter**                  | 提供会话管理功能，如会话固定保护和会话超时。                 |
| **ExceptionTranslationFilter**               | 捕获 Spring Security 异常并将其转换为适当的响应，例如重定向到登录页面。（需要理解） |
| **FilterSecurityInterceptor**                | 在请求访问资源之前，检查请求是否具有足够的权限。（重要）     |
| **AuthorizationFilter**                      | 用于检查用户是否有权访问特定资源。（重要）                   |

读到这里，我们其实不难发现，如果我们想要配置 Security，最简单的办法就是配置 SecurityFilterChain，因为它管理了一系列按顺序处理的 Security 过滤器。通过在程序中显示的配置它，我们可以进行个性化的控制，例如修改该 SecurityFilterChain 可以处理那些 URI（可以基于 Ant 风格匹配），在什么位置添加某个自定义的过滤器等等。

> ⚠️ 注意：
>
> 1. 这里需要明确一个点，那就是我们在 SecurityFilterChain 时，更准确的说我们其实是在配置 SecurityFilterChain 过滤器链中的一个或者多个具体过滤器的行为。
> 2. 我们配置 SecurityFilterChain 过滤器链中的顺序并不意味着这是链中过滤器的执行顺序，其顺序如果我们不进行覆盖或者修改的情况下，还是以 FilterOrderRegistration 中注册的为准。

考虑以下的 Spring Security 配置：（暂时不必深究具体配置的内容）

```java
@Configuration
@EnableWebSecurity // 开启 Spring Security
public class SecurityConfig {

    // 配置 SecurityFilterChain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(Customizer.withDefaults()) // CsrfFilter
            .authorizeHttpRequests(authorize -> authorize // AuthorizationFilter
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults()) // BasicAuthenticationFilter
            .formLogin(Customizer.withDefaults()); // UsernamePasswordAuthenticationFilter
        return http.build();
    }

}
```

基于上述配置，以下是产生的过滤器顺序：

| Filter                               | Added by                           |
| ------------------------------------ | ---------------------------------- |
| CsrfFilter                           | HttpSecurity#csrf                  |
| UsernamePasswordAuthenticationFilter | HttpSecurity#formLogin             |
| BasicAuthenticationFilter            | HttpSecurity#httpBasic             |
| AuthorizationFilter                  | HttpSecurity#authorizeHttpRequests |

其实也就干了三件事儿，后面你都会很熟悉：

1. 首先，调用 CsrfFilter 来防止 CSRF 攻击。
2. 其次，调用身份验证过滤器（AuthorizationFilter）来验证请求。
3. 最后，调用 AuthorizationFilter 来授权请求。

> **注意**：上述列表可能并不完整，还有其他的过滤器实例可能未被列出。如果你想查看针对特定请求的完整过滤器列表，可以使用 IDEA 尝试 Debug 一下。

## 5.打印安全过滤器：让 Security Filter 浮出水面

在开发和调试过程中，能够**查看为特定请求调用的安全过滤器列表**是非常有价值的。这不仅可以帮助你确保已经添加的过滤器（下一节就会讲）正确地被纳入了安全过滤器链中，还可以帮助你更好地**理解过滤器是如何按顺序工作**的。

当应用程序启动时，安全过滤器列表会在 **INFO 日志级别**下被打印出来。因此，在你的控制台或日志文件中，应该能够看到类似以下的输出：

```markdown
2023-06-14T08:55:22.321-03:00  INFO 76975 --- [           main] o.s.s.web.DefaultSecurityFilterChain     : Will secure any request with [
org.springframework.security.web.session.DisableEncodeUrlFilter@404db674,
org.springframework.security.web.context.request.async.WebAsyncManagerIntegrationFilter@50f097b5,
org.springframework.security.web.context.SecurityContextHolderFilter@6fc6deb7,
org.springframework.security.web.header.HeaderWriterFilter@6f76c2cc,
org.springframework.security.web.csrf.CsrfFilter@c29fe36,
org.springframework.security.web.authentication.logout.LogoutFilter@ef60710,
org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter@7c2dfa2,
org.springframework.security.web.authentication.ui.DefaultLoginPageGeneratingFilter@4397a639,
org.springframework.security.web.authentication.ui.DefaultLogoutPageGeneratingFilter@7add838c,
org.springframework.security.web.authentication.www.BasicAuthenticationFilter@5cc9d3d0,
org.springframework.security.web.savedrequest.RequestCacheAwareFilter@7da39774,
org.springframework.security.web.servletapi.SecurityContextHolderAwareRequestFilter@32b0876c,
org.springframework.security.web.authentication.AnonymousAuthenticationFilter@3662bdff,
org.springframework.security.web.access.ExceptionTranslationFilter@77681ce4,
org.springframework.security.web.access.intercept.AuthorizationFilter@169268a7]
```

这为你提供了一个清晰的视图，展示了每个过滤器链中配置的安全过滤器。

但这还不够。在某些情况下，你可能希望**查看每个请求的每个过滤器的详细调用情况**。这样可以更深入地了解特定请求中的过滤器调用顺序，或者确定异常的来源。为了实现这一点，可以配置应用程序来记录安全相关的事件。这通常涉及到调整日志配置，以在更详细的级别（如 DEBUG 或 TRACE）捕获和记录与安全相关的活动。（留在最后的日志记录部分分享）

总之，通过正确地配置和使用日志工具，我们可以更好地理解和控制 Spring Security 在应用程序中的行为。

## 6.向过滤器链中添加自定义过滤器

### 6.1 定制一个安全过滤器：实现 Filter

在许多情况下，Spring Security 提供的默认安全过滤器（上面提到的 36 个）已经能够满足应用程序的安全需求。但有时，我们可能需要向安全过滤器链中添加自定义的过滤器，以满足特定的业务或安全需求。

例如，考虑一个场景，你希望添加一个过滤器来从请求头中提取租户 ID，并验证当前用户是否有权访问该租户的数据。从这个需求中，我们可以推断出**需要在身份验证（你是谁）过滤器之后授权处理过滤器（你能干什么）之前添加此过滤器，因为我们需要知道当前的用户身份**。

> 定制过滤器不用说了吧？就是实现 Filter 接口并重写其核心方法  doFilter()。

首先，我们来定义这个过滤器：（⚠️ 注意，这里我们并没有将 `TenantFilter` 声明为 Spring Bean）

```java
public class TenantFilter implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // 1. 从请求头中获取租户 ID
        String tenantId = request.getHeader("X-Tenant-Id");

        // 2. 验证当前用户是否有权访问该租户 ID
        boolean hasAccess = isUserAllowed(tenantId);

        // 3. 如果用户有访问权限，则继续执行过滤器链中的其他过滤器
        if (hasAccess) {
            filterChain.doFilter(request, response);
            return;
        }

        // 4. 如果用户没有访问权限，则抛出一个访问拒绝异常
        throw new AccessDeniedException("Access denied");
    }

    private boolean isUserAllowed(String tenantId) {
        // 这里可以添加具体的逻辑来验证用户是否有权访问指定的租户 ID
        return true;  // 示例代码，实际应用中需要替换为实际的验证逻辑
    }
}
```

在上述代码中，我们进行了以下操作：

1. 从请求头中获取租户ID。
2. 验证当前用户是否有权访问该租户ID。
3. 如果用户有访问权限，则继续执行过滤器链中的其他过滤器。
4. 如果用户没有访问权限，则抛出一个访问拒绝异常。（这里就涉及到我们前面表格中的 `ExceptionTranslationFilter` 了，它负责捕获 Spring Security 异常并将其转换为适当的响应）

> ‼️ 重要‼️ 重要‼️ 重要：
>
> （重要的事情我一般只说三遍，务必要记住该过滤器，在 Spring Security 整合 JWT 定制 JWTFilter 时它将发挥其作用 ）
>
> 
>
> 📒 拿出小本本记下来：
> 如果你的过滤器需要**确保每次请求只调用一次**，在定制自己的 Security 过滤器时你可以考虑从 `OncePerRequestFilter` 抽象类继承，而不是直接实现 `Filter` 接口。这个类提供了一个 `doFilterInternal` 抽象方法，它接受 `HttpServletRequest` 和 `HttpServletResponse` 作为参数，**确保每个请求只调用一次过滤器**。

### 6.2 配置安全过滤器链：SecurityFilterChain

OK，现在我们已经定制好了自己的过滤器。下一步就是讨论如何将其加入 `SecurityFilterChain` 安全过滤器链中了。

使用`HttpSecurity`对象，我们可以配置安全过滤器链并确定过滤器的执行顺序：

```java
@Bean
SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        // ... 其他配置
        .addFilterBefore(new TenantFilter(), AuthorizationFilter.class); 
    return http.build();
}
```

在上述代码中，我们使用了 `HttpSecurity#addFilterBefore` 方法在 `AuthorizationFilter` 过滤器（用于检查用户是否有权访问特定资源）之前添加了自定义的 `TenantFilter`。这确保了在身份验证过滤器之调用 `TenantFilter`。

除此之外，还可以使用 `HttpSecurity#addFilterAfter` 在特定过滤器之后添加过滤器，或使用 `HttpSecurity#addFilterAt` 在过滤器链中的特定位置添加过滤器。

其实 `HttpSecurity` 提供了不少 `addFilterXxx()` 方法，我们可以在其源码中看到：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-022757.png)

具体参见下表，根据你的实际需求在合适的位置添加自定义的过滤器即可：

| 方法声明                                                     | 返回值       | 描述                                                         | 参数描述                                                     |
| ------------------------------------------------------------ | ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| addFilterBefore(Filter filter, Class<? extends Filter> beforeFilter) | HttpSecurity | 在指定的过滤器之前添加一个过滤器。                           | 1、`filter`: 要添加的过滤器<br>2、`beforeFilter`: 在此过滤器之前将添加新的过滤器。 |
| addFilterAfter(Filter filter, Class<? extends Filter> afterFilter) | HttpSecurity | 在指定的过滤器之后添加一个过滤器。                           | 1、`filter`: 要添加的过滤器<br>2、`afterFilter`: 在此过滤器之后将添加新的过滤器。 |
| addFilterAt(Filter filter, Class<? extends Filter> atFilter) | HttpSecurity | 在过滤器链中的指定位置添加一个过滤器，替换该位置上的现有过滤器（如果存在）。 | 1、`filter`: 要添加的过滤器<br>2、`atFilter`: 新的过滤器将被放置在此过滤器的位置，并替换它（如果存在）。 |
| addFilter(Filter filter)                                     | HttpSecurity | 将过滤器添加到过滤器链中，但不会替换或重新排序任何现有的过滤器。这主要用于添加自定义过滤器。 | 1、`filter`: 要添加到过滤器链中的过滤器。                    |

### 6.3 避免过滤器的重复调用：逻辑混乱的根源

当你在 Spring Boot 应用程序中定义一个过滤器并将其声明为 Spring bean（例如，通过使用 `@Component` 注解或在配置类中使用 `@Bean` 注解），Spring Boot 的自动配置机制会自动将其注册到嵌入式的 Servlet 容器（如 Tomcat）中。也就是说，每当有一个 HTTP 请求到达应用程序时，这个过滤器都会被调用。

但是，当你使用 Spring Security 并希望将这个过滤器添加到 Spring Security 的过滤器链中时，这个过滤器会再次被调用，因为 Spring Security 有自己的过滤器链，它独立于 Servlet 容器的过滤器链。（前面我们已经讨论过，忘记的回过去看）

因此，如果不采取任何措施，我们的过滤器将被调用两次：**一次是由 Servlet 容器调用的，另一次是由 Spring Security 调用的**。这可能不是我们想要的，特别是如果我们的过滤器执行了一些重要的逻辑或有副作用。

为了解决这个问题，Spring Boot 提供了 `FilterRegistrationBean` 类。这个类允许您定义一个过滤器，但告诉 Spring Boot 不要自动将其注册到 Servlet 容器中。这是通过将 `FilterRegistrationBean` 的 `enabled` 属性设置为 `false` 来实现的。这样，您的过滤器只会在 Spring Security 的上下文中被调用，而不是在 Servlet 容器的上下文中。

示例代码如下：

```java
@Bean
public FilterRegistrationBean<TenantFilter> tenantFilterRegistration(TenantFilter filter) {
    FilterRegistrationBean<TenantFilter> registration = new FilterRegistrationBean<>(filter);
    registration.setEnabled(false);
    return registration;
}
```

总之，`FilterRegistrationBean` 允许您控制哪些过滤器应该被自动注册到 Servlet 容器，哪些不应该。这样，您可以确保您的过滤器只在所需的上下文中被调用。

## 7.ExceptionTranslationFilter：安全异常处理站

在 Spring Security 中，`ExceptionTranslationFilter` 负责处理与安全相关的异常。它确保了当用户访问受保护的资源但未经身份验证或没有足够的权限时，能够给出适当的响应。

`ExceptionTranslationFilter` 是 `FilterChainProxy` 管理的 `SecurityFilterChain` 中的一个关键过滤器，它确保了安全异常的统一处理：

![](https://docs.spring.io/spring-security/reference/5.8/_images/servlet/architecture/exceptiontranslationfilter.png)

1. `ExceptionTranslationFilter` 首先尝试执行应用程序的其余部分，通过调用 `FilterChain.doFilter(request, response)`。
2. 如果用户未经身份验证或抛出了 `AuthenticationException`，则启动身份验证流程：
   * 清除 `SecurityContextHolder` 中的内容。
   * 保存当前的 `HttpServletRequest`，以便在身份验证成功后可以重新执行原始请求。
   * 使用 `AuthenticationEntryPoint` 向客户端请求凭据。例如，它可能会重定向到登录页面或发送 `WWW-Authenticate` 头。
3. 如果是 `AccessDeniedException`，则表示用户没有足够的权限访问资源。此时，会调用 `AccessDeniedHandler` 来处理这种拒绝访问的情况。

> ‼️‼️‼️（看到这三个感叹号，你就知道下面又是重点了）
>
> 这里是 Spring Securit 在前后端分离场景下处理身份认证的一个扩展点，我们可以：
>
> 1、通过自定义 `AuthenticationEntryPoint` 重写其 `commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)` 方法对响应形式进行个性化的定制，从而定制当用户未认证抛出 `AuthenticationException` 异常时的行为。
>
> 2、通过自定义 `AccessDeniedHandler` 重写其 `handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException)` 方法对对响应形式进行个性化的定制，从而定制当认证的用户访问受保护资源但是由于权限不够而抛出 `AccessDeniedHandler` 异常时的行为。
>
> 例如，我们大致可以如下处理：
>
> 1. 设置响应头的 Access-Control-Allow-Origin 字段告诉客户端允许那些请求类型，例如可以允许所有请求源，从而支持跨域访问；
> 2. 设置响应头的 Cache-Control 字段为 no-cache 指示本次响应不应被客户端缓存，从而确保每次拿到的都是最新状态信息；
> 3. 设置响应的字符编码，通常为 UFT-8；
> 4. 设置响应内容类型，通常在前后端分离项目中我们使用 JSON 进行数据传输，因此使用 application/json 即可；
> 5. 将认证失败的消息写入响应体携带给前端，一般需要使用我们自定义封装的通用返回对象将异常信息封装为 JSON 作为本次响应数据；
> 6. 刷新响应流确保数据被发送，这是常识，不过多解释，
>
> 对应的示例代码可能如下：
>
> ```java
> public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {
>     @Override
>     public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
>         // 设置响应头，允许任何域进行跨域请求
>         response.setHeader("Access-Control-Allow-Origin", "*");
>         // 设置响应头，指示响应不应被缓存
>         response.setHeader("Cache-Control","no-cache");
>         // 设置响应的字符编码为 UTF-8
>         response.setCharacterEncoding("UTF-8");
>         // 设置响应内容类型为 JSON
>         response.setContentType("application/json");
>         // 将认证失败的消息写入响应体
>         response.getWriter().println(JSONUtil.parse(CommonResult.unauthorized(authException.getMessage())));
>         // 刷新响应流，确保数据被发送
>         response.getWriter().flush();
>     }
> }
> 
> public class RestfulAccessDeniedHandler implements AccessDeniedHandler {
>     @Override
>     public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
>         response.setHeader("Access-Control-Allow-Origin", "*");
>         response.setHeader("Cache-Control","no-cache");
>         response.setCharacterEncoding("UTF-8");
>         response.setContentType("application/json");
>         response.getWriter().println(JSONUtil.parse(CommonResult.forbidden(accessDeniedException.getMessage())));
>         response.getWriter().flush();
>     }
> }
> ```
>
> 然后在配置 `SecurityFilterChain` 时通过如下方式将其进行注册以覆盖默认行为即可：
>
> ```java
> @Bean
>     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
>         
>        http.
>                 // 其他配置
>                 // 配置异常处理器  ExceptionHandlingConfigurer
>                 .exceptionHandling()
>                 // 当访问被拒绝时使用自定义的处理器返回响应
>                 .accessDeniedHandler(restfulAccessDeniedHandler)
>                 // 当未认证或 token 过期时使用自定义的处理器返回响应
>                 .authenticationEntryPoint(restAuthenticationEntryPoint)
>                 // ...
>     }
> ```
>
> ⚠️ 重要的是要注意，只有当应用程序抛出 `AccessDeniedException` 或 `AuthenticationException` 时，`ExceptionTranslationFilter` 才会介入处理。如果应用程序没有抛出这些异常，该过滤器将不执行任何操作。

以下是 `ExceptionTranslationFilter` 的简化逻辑：

```java
try {
     // 继续执行以捕获对应异常
	filterChain.doFilter(request, response);  // （1）
} catch (AccessDeniedException | AuthenticationException ex) { // 只会捕获 AuthenticationException 和 AccessDeniedException
	if (!authenticated || ex instanceof AuthenticationException) {
          // 开始身份验证流程
		startAuthentication();   // （2）
	} else {
          // 访问被拒绝
		accessDenied();   // （3）
	}
}
```

1. 我们知道调用 `FilterChain.doFilter(request, response)` 相当于执行应用程序的其余部分。这意味着，如果应用程序的其他部分（例如 `FilterSecurityInterceptor` 或方法安全）抛出 `AuthenticationException` 或 `AccessDeniedException`，它将在此处被捕获并处理。
2. 如果用户未经身份验证或是 `AuthenticationException`，则开始身份验证流程。
3. 否则，表示访问被拒绝。

通过这种方式，Spring Security 确保了对于所有的安全异常，都有统一和恰当的处理机制。

## 8.保存认证之间的请求

在处理安全异常时（如 `AuthenticationException` 或 `AccessDeniedException`），我们了解到，当一个未认证的请求试图访问需要认证的资源时，我们需要保存这个请求。这样，在认证成功后，我们可以重新请求这个已认证的资源。在 Spring Security 中，这是通过使用 `RequestCache` （请求缓存）来保存 `HttpServletRequest` 来实现的。

### 8.1 RequestCache

`HttpServletRequest` 被保存在 `RequestCache` 接口中。当用户成功认证后，`RequestCache` 用于重新执行原始请求。其中定义了几个方法来操作请求：如保存、获取、匹配、删除等

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-033135.png)

但是，这只是一个接口而已，它又是由谁来维护呢？

在 Spring Secutity 中有一个过滤器 `RequestCacheAwareFilter` 负责在身份验证成功后，将请求重定向到原始请求的 URL。（忘记的回过去看之前列出的过滤器表加粗部分）这个 Filter 中就负责维护 `RequestCache` ，即通过它来保存 `HttpServletRequest`。

```java
public class RequestCacheAwareFilter extends GenericFilterBean {
	private RequestCache requestCache;
  
    // ... 
}
```

> 还是简单小结一下：`RequestCacheAwareFilter` 负责使用 `RequestCache` 来保存 `HttpServletRequest`。这个过滤器确保了在用户认证之前的请求都被适当地保存，以便在认证成功后可以重新执行这些请求。

默认情况下，Spring Security 使用 `HttpSessionRequestCache` 来缓存 `HttpServletRequest`。它是 `RequestCache` 接口的一个实现，在其 `saveRequest` 方法处理逻辑中我们可以了解到，它其实就是将请求信息存入了 Session 域中：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-034246.png)

如何验证 `HttpSessionRequestCache` 真的是默认实现呢？我们可以回到 `RequestCacheAwareFilter` 的源码中可以看到，Spring Security 在创建 `RequestCacheAwareFilter` 时其无参构造就创建了 `HttpSessionRequestCache`：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-034520.png)

最后再看看 `RequestCacheAwareFilter` 的核心处理逻辑：

```java
/**
 * Spring Security 默认过滤器，与 {@link RequestCache} 集成，确保在认证之前，
 * 当前请求被存储，从而在成功认证后，系统可以重定向回原始请求。
 */
public class RequestCacheAwareFilter extends GenericFilterBean {

     // 用于存储请求的缓存
	private RequestCache requestCache;

     /**
     * 默认构造函数，使用默认的 {@link HttpSessionRequestCache} 初始化过滤器。（通过 Session 域进行缓存）
     */
	public RequestCacheAwareFilter() {
		this(new HttpSessionRequestCache());
	}

  
     /**
     * 允许提供自定义 {@link RequestCache} 的构造函数。（一般不怎么用，根据实际情况来）
     * @param requestCache 要使用的自定义请求缓存。
     */
	public RequestCacheAwareFilter(RequestCache requestCache) {
          // 确保提供的 requestCache 不为 null
		Assert.notNull(requestCache, "requestCache cannot be null");
		this.requestCache = requestCache;
	}

     /**
     * 拦截请求并确保在必要时进行缓存的核心方法。
     * @param request 当前请求。
     * @param response 当前响应。
     * @param chain 进行下一个过滤器的过滤器链。
     */
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
          // // 如果可用，检索与当前请求匹配的已保存请求（即先查缓存）
		HttpServletRequest wrappedSavedRequest = this.requestCache.getMatchingRequest((HttpServletRequest) request,
				(HttpServletResponse) response);
    
          // 如果找到已保存的请求，则在链中使用它作为下一个过滤器的请求参数。否则，使用当前请求。
		chain.doFilter((wrappedSavedRequest != null) ? wrappedSavedRequest : request, response);
	}

}
```

在 `RequestCache` 的实现中除了 Session 以外，其实也支持 Cookie，感兴趣的可以自己看看源码：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-035532.png)

如果不想使用默认的 `HttpSessionRequestCache` 实现咋整？

好在 Spring Security 也为我们提供了自定义方案，下面的代码展示了如何自定义 `RequestCache` 实现，这个实现会检查 `HttpSession` 中已保存请求是否存在名为 "continue" 的参数。

通常，当用户尝试访问受保护的资源而未经认证时，Spring Security 会将该请求保存起来，然后重定向用户到登录页面。一旦用户成功登录，Spring Security 会使用 `RequestCache` 来获取并重定向回那个被保存的请求，从而允许用户继续他们原先尝试的操作。

但在某些情况下，可能不希望总是这样做。例如，你可能只想在请求中明确包含某个参数（如 "continue"）时才执行此重定向原请求行为。

看如下配置，只有当存在 "continue" 参数时，`RequestCache` 才会检查已保存的请求：

```java
@Bean
DefaultSecurityFilterChain springSecurity(HttpSecurity http) throws Exception {
    // 创建一个 HttpSessionRequestCache 实例，它是 Spring Security 提供的默认实现，用于在 HttpSession 中保存和检索请求
    HttpSessionRequestCache requestCache = new HttpSessionRequestCache();

    // 设置 requestCache 以便只在请求中存在名为 "continue" 的参数时检查已保存的请求
    // 如果请求中没有这个参数，那么 requestCache 将不会检索已保存的请求
    requestCache.setMatchingRequestParameterName("continue");
    http
        // ... 其他的 http 配置
        .requestCache((cache) -> cache
            .requestCache(requestCache)  // 将自定义的 requestCache 设置到 http 安全配置中
        );
    // 构建并返回安全过滤器链
    return http.build();
}
```

### 8.2 防止请求被保存

有多种原因可能导致你不希望在会话（Session）中存储未经身份验证的用户请求。例如，你可能希望将此存储任务卸载到用户的浏览器上，或者将其存储在数据库中从而减轻服务器压力。又或者，你可能只是想关闭这个功能，因为你可能总是希望在用户登录后重定向他们到主页，而不是他们登录前试图访问的页面。

为了实现这个目的，Spring Security 也提供了 `RequestCache`  的对应实现，那就是 `NullRequestCache`。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-035751.png)

其实现逻辑简单粗暴，那就是将所有方法进行空实现：

```java
public class NullRequestCache implements RequestCache {

	@Override
	public SavedRequest getRequest(HttpServletRequest request, HttpServletResponse response) {
		return null;
	}

	@Override
	public void removeRequest(HttpServletRequest request, HttpServletResponse response) {

	}

	@Override
	public void saveRequest(HttpServletRequest request, HttpServletResponse response) {
	}

	@Override
	public HttpServletRequest getMatchingRequest(HttpServletRequest request, HttpServletResponse response) {
		return null;
	}

}
```

同样，我们可以在配置类中进行如下配置以防止请求被保存：

```java
@Bean
SecurityFilterChain springSecurity(HttpSecurity http) throws Exception {
    RequestCache nullRequestCache = new NullRequestCache();
    http
        // ...
        .requestCache((cache) -> cache
            .requestCache(nullRequestCache)
        );
    return http.build();
}
```

## 9.Spring Security 日志记录

Spring Security 提供了强大的日志记录功能，特别是在调试和跟踪级别。这对于开发者来说是一个宝贵的工具，因为当出现安全问题时，Spring Security 默认不会在 HTTP 响应中提供详细的错误原因，以避免泄露潜在的安全信息。但是，通过日志，开发者可以获得关于发生了什么的深入了解。

例如，考虑一个场景：用户尝试在没有 CSRF 令牌的情况下向启用了 CSRF 保护的资源发出 POST 请求。在这种情况下，用户只会看到一个 403 Forbidden 错误，而没有任何进一步的解释。但是，如果启用了 Spring Security 的日志记录，就能够看到详细的日志消息，明确指出了 CSRF 令牌丢失，这是请求被拒绝的原因。

```markdown
2023-06-14T09:44:25.797-03:00 DEBUG 76975 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Securing POST /hello
2023-06-14T09:44:25.797-03:00 TRACE 76975 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking DisableEncodeUrlFilter (1/15)
2023-06-14T09:44:25.798-03:00 TRACE 76975 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking WebAsyncManagerIntegrationFilter (2/15)
2023-06-14T09:44:25.800-03:00 TRACE 76975 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking SecurityContextHolderFilter (3/15)
2023-06-14T09:44:25.801-03:00 TRACE 76975 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking HeaderWriterFilter (4/15)
2023-06-14T09:44:25.802-03:00 TRACE 76975 --- [nio-8080-exec-1] o.s.security.web.FilterChainProxy        : Invoking CsrfFilter (5/15)
2023-06-14T09:44:25.814-03:00 DEBUG 76975 --- [nio-8080-exec-1] o.s.security.web.csrf.CsrfFilter         : Invalid CSRF token found for http://localhost:8080/hello
2023-06-14T09:44:25.814-03:00 DEBUG 76975 --- [nio-8080-exec-1] o.s.s.w.access.AccessDeniedHandlerImpl   : Responding with 403 status code
2023-06-14T09:44:25.814-03:00 TRACE 76975 --- [nio-8080-exec-1] o.s.s.w.header.writers.HstsHeaderWriter  : Not injecting HSTS header since it did not match request to [Is Secure]
```

为了充分利用 Spring Security 的日志功能，需要在应用程序中进行适当的配置。以下是如何在 Spring Boot 应用程序中配置它的方法：

在 `application.properties` 或 `application.yml`  文件中，设置 Spring Security 的日志级别为 TRACE（跟踪）：

```properties
logging.level.org.springframework.security=TRACE
```

如果你想使用 `logback.xml` 进行日志配置，可以添加以下内容来捕获 Spring Security 的日志：

```xml
<configuration>
    <appender name="STDOUT" class="ch.qos.logback.core.ConsoleAppender">
        <!-- ... 其他配置 ... -->
    </appender>
    
    <!-- 设置 Spring Security 的日志级别为 TRACE -->
    <logger name="org.springframework.security" level="trace" additivity="false">
        <appender-ref ref="STDOUT" />
    </logger>
</configuration>
```

通过这些配置，你不仅可以更好地理解 Spring Security 如何处理请求，还可以更容易地诊断和解决潜在的安全问题。

<hr/>

参考地址：

* Spring Security 官方文档[《Architecture》](https://docs.spring.io/spring-security/reference/5.8/servlet/architecture.html)
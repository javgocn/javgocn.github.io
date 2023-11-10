---
title: 04-Security-授权
---
## 1.整体架构

Spring Security 的高级授权功能无疑是其受欢迎的关键因素。无论你采用哪种身份验证方式，不论是采用 Spring Security 自带的机制，还是与其他认证机构或容器集成（如 JWT），你都可以在应用程序中简洁且统一地使用授权服务。简单来说，Spring Security 的认证与授权是相互独立的！

本节，我首先会介绍不同的 `AbstractSecurityInterceptor` 实现，然后深入讨论如何通过域访问控制列表来细化授权策略。

### 1.1 授权（Authorities）

当我们谈及 `Authentication`，实际上是在探讨 `Authentication `实现如何存储一系列 `GrantedAuthority` 对象。这些对象表示授予用户的权限（可能是角色，也可能是资源）。当认证成功后 `AuthenticationManager` （认证管理器）负责将 `GrantedAuthority` 对象插入到 `Authentication` 中并返回，之后 `AuthorizationManager` （授权管理器）在做出授权决策时会使用这些数据。

`GrantedAuthority `是一个简单的接口，只有一个方法：

```java
public interface GrantedAuthority extends Serializable {
	String getAuthority();
}
```

这个方法使得 `AuthorizationManager` （授权管理器）能够获取 `GrantedAuthority` 的确切字符串表示。为什么说是字符串表示？从返回值 String 也不难看出，Spring Security 是用字符串的形式来代表一项权限的。

由于大多数 `AuthorizationManager` 和 `AccessDecisionManager` （访问决策管理器）可以轻松解析这个字符串，如果 `GrantedAuthority` 对象不能直接转换为字符串，则该对象被认为是 “复杂” 的，这时 `getAuthority()` 应该返回 `null`。

例如，一个存储不同客户账号的操作和权限阈值列表的 `GrantedAuthority` 就很难转换为简单的字符串，因此这类 `GrantedAuthority` 是 “复杂” 的，它的 `getAuthority()` 方法会返回 `null`。这样，`AuthorizationManager` 就知道需要特定的支持来理解这个 `GrantedAuthority` 对象。

Spring Security 提供了一个具体的 `GrantedAuthority` 实现，即 `SimpleGrantedAuthority`，它可以将任何字符串转换为 `GrantedAuthority`。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-095158.png)

Spring Security 中的所有 `AuthenticationProvider` 都使用 `SimpleGrantedAuthority` 来填充 `Authentication` 对象的。

### 1.2 预调用处理

Spring Security 提供了一系列拦截器，用于控制对安全敏感对象的访问，这些对象可能是方法调用或 Web 请求。在实际调用发生前，是否允许该调用继续由 `AccessDecisionManager` 决定。

#### 1.2.1 AuthorizationManager 的引入

`AuthorizationManager` 是为替代 Spring Security 旧版本 `AccessDecisionManager` 和 `AccessDecisionVoter` 设计的新接口。为了实现更高的可定制性和效率，现在鼓励那些曾自定义 `AccessDecisionManager` 或 `AccessDecisionVoter` 的开发者转向使用 `AuthorizationManager`。

由 `AuthorizationFilter` 调用的 `AuthorizationManager` 负责做出终极的访问决策。此接口定义了两个核心方法：

```java
@FunctionalInterface
public interface AuthorizationManager<T> {
  
	default void verify(Supplier<Authentication> authentication, T object) {
		AuthorizationDecision decision = check(authentication, object);
		if (decision != null && !decision.isGranted()) {
			throw new AccessDeniedException("Access Denied");
		}
	}
  
     @Nullable
	AuthorizationDecision check(Supplier<Authentication> authentication, T object);
}
```

`check` 方法会接收到所有必要的信息以做出授权决策。特别是，它会接收一个 “安全对象”，这使得我们能检查真正的安全对象调用中的参数。比如，如果这个安全对象是 `MethodInvocation`，我们可以轻松获取其中的 `Customer` 参数，并在 `AuthorizationManager` 中实现相应的安全逻辑，以验证某个主体是否被允许对该客户执行某个操作。

该方法的返回值是 `AuthorizationDecision`。如果授权成功，将返回正的 `AuthorizationDecision`；如果被拒绝，则返回负的 `AuthorizationDecision`；而如果决策被放弃或无法决定，则返回 `null`。

这里提到的 “正”、“负” `AuthorizationDecision` 是什么意思？点开源码你就知晓了：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-112241.png)

可见，`AuthorizationDecision` 中使用一个 boolean 类型的 `granted` 属性代表是否允许本次对 “安全对象” 的访问或操作。

另外，`verify` 方法基本上是在调用 `check` 方法后，根据其返回值决定是否抛出 `AccessDeniedException`。

#### 1.2.2 基于委托的 AuthorizationManager 授权管理器实现

虽然开发者可以自行实现 `AuthorizationManager`，Spring Security 也提供了 `RequestMatcherDelegatingAuthorizationManager`，这是一个与多个 `AuthorizationManager` 一同工作的委托管理器。它的主要功能是将请求匹配到最合适的 `AuthorizationManager`。为了增强方法的安全性，可以进一步使用 `AuthorizationManagerBeforeMethodInterceptor` 和 `AuthorizationManagerAfterMethodInterceptor`。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-114935.png)

通过这种方式，可以组合多个 `AuthorizationManager` 实现，并依次轮询它们以做出授权决策。

#### 1.2.3 AuthorityAuthorizationManager

Spring Security 中最常用的 `AuthorizationManager` 是 `AuthorityAuthorizationManager`。它通过比对当前的 `Authentication` 来查找配置的权限。如果 `Authentication` 中包含任何给定的权限，则它会返回一个正的 `AuthorizationDecision`；否则，它返回一个负的 `AuthorizationDecision`。

#### 1.2.4 AuthenticatedAuthorizationManager

`AuthenticatedAuthorizationManager` 的主要用途是区分不同的用户身份状态，例如匿名用户、已认证用户以及 “记住我” 状态的用户。很多网站在用户处于 “记住我” 的状态时，会提供有限的访问权限，但要获取更多权限则需要用户登录。

#### 1.2.5 自定义授权管理器

当然，你也可以自定义 `AuthorizationManager`，在其中加入你自己的访问控制逻辑。这可能与你的业务逻辑密切相关，或可能涉及特定的安全管理策略。例如，你可以创建一个查询开放策略代理或自定义授权数据库的授权管理器。

> 在 Spring 官方网站上有一篇[博客文章](https://spring.io/blog/2009/01/03/spring-security-customization-part-2-adjusting-secured-session-in-real-time)，描述了如何使用旧版 `AccessDecisionVoter` 来拒绝已被暂停账户的用户访问。现在，你可以通过实现新的 `AuthorizationManager` 来达到相同的效果。

### 1.3 调整 AccessDecisionManager 和 AccessDecisionVoters

在 Spring Security 中，`AuthorizationManager` 是一个新的接口，提供了更为简化和通用的方法来实现权限检查。但对于那些已经使用了 `AccessDecisionManager` 和 `AccessDecisionVoter` 的旧版本应用程序，迁移可能会遇到一些挑战。因此，我们可以使用适配器模式将这两种方法与新的 `AuthorizationManager` 连接起来。

如果你之前已经有一个自定义的 `AccessDecisionManager`，并且希望在新的 `AuthorizationManager` 结构中继续使用它，你可以创建一个适配器。这个适配器将实现 `AuthorizationManager` 接口，并在内部调用您原有的 `AccessDecisionManager`。

```java
@Component
// 创建一个名为 AccessDecisionManagerAuthorizationManagerAdapter 的组件，它实现了 AuthorizationManager 接口。
public class AccessDecisionManagerAuthorizationManagerAdapter implements AuthorizationManager {
    private final AccessDecisionManager accessDecisionManager;  // 一个 AccessDecisionManager 实例。
    private final SecurityMetadataSource securityMetadataSource;  // 一个 SecurityMetadataSource 实例，它提供安全对象的属性。

    @Override
    // 实现 check 方法。
    public AuthorizationDecision check(Supplier<Authentication> authentication, Object object) {
        try {
            // 获取安全对象的属性。
            Collection<ConfigAttribute> attributes = this.securityMetadataSource.getAttributes(object);
            // 使用 AccessDecisionManager 的 decide 方法做出授权决策。
            this.accessDecisionManager.decide(authentication.get(), object, attributes);
            // 如果授权成功，返回正 AuthorizationDecision。
            return new AuthorizationDecision(true);
        } catch (AccessDeniedException ex) {
            // 如果授权失败，返回负 AuthorizationDecision。
            return new AuthorizationDecision(false);
        }
    }

    @Override
    // 实现 verify 方法。
    public void verify(Supplier<Authentication> authentication, Object object) {
        Collection<ConfigAttribute> attributes = this.securityMetadataSource.getAttributes(object);
        this.accessDecisionManager.decide(authentication.get(), object, attributes);
    }
}
```

完成上述适配器后，只需将它添加到你的 `SecurityFilterChain` 中，就可以在新的 `AuthorizationManager` 结构中继续使用原有的 `AccessDecisionManager` 了。

对于那些只使用 `AccessDecisionVoter` 的应用程序，您可以创建一个类似的适配器，但这次是针对 `AccessDecisionVoter`。

```java
@Component
// 创建一个名为 AccessDecisionVoterAuthorizationManagerAdapter 的组件，它实现了 AuthorizationManager 接口。
public class AccessDecisionVoterAuthorizationManagerAdapter implements AuthorizationManager {
    private final AccessDecisionVoter accessDecisionVoter;  // 一个 AccessDecisionVoter 实例。
    private final SecurityMetadataSource securityMetadataSource;  // 一个 SecurityMetadataSource 实例，它提供安全对象的属性。

    @Override
    // 实现 check 方法。
    public AuthorizationDecision check(Supplier<Authentication> authentication, Object object) {
        // 获取安全对象的属性。
        Collection<ConfigAttribute> attributes = this.securityMetadataSource.getAttributes(object);
        // 使用 AccessDecisionVoter 的 vote 方法做出授权决策。
        int decision = this.accessDecisionVoter.vote(authentication.get(), object, attributes);
        switch (decision) {
        case ACCESS_GRANTED:
            // 如果授权成功，返回正 AuthorizationDecision。
            return new AuthorizationDecision(true);
        case ACCESS_DENIED:
            // 如果授权失败，返回负 AuthorizationDecision。
            return new AuthorizationDecision(false);
        }
        // 如果既不允许也不拒绝，返回 null。
        return null;
    }
}
```

同样，完成这个适配器后，将它添加到您的 `SecurityFilterChain` 中，您就可以在新的 `AuthorizationManager` 结构中继续使用原有的 `AccessDecisionVoter` 了。

通过使用适配器模式，您可以确保在迁移到新的 `AuthorizationManager` 结构时，旧版本应用程序中的权限检查逻辑仍然有效。这样可以确保向后兼容性，同时享受 `Spring Security` 新版本带来的优点和功能。

### 1.4 角色层次结构的重要性

很多时候，我们需要给定的角色自动包括其他角色的权限。比如在大多数系统中，“管理员” 通常拥有比 “普通用户” 更多的权限。而不是为每个管理员单独配置所有的权限，角色层次结构允许我们简单地声明管理员继承了普通用户的所有权限。

Spring Security 提供了 `RoleHierarchy` 接口和其实现 `RoleHierarchyImpl` 以支持角色层次结构的定义。这个定义说明了哪些角色继承了其他角色的权限。

```java
RoleHierarchy hierarchy = new RoleHierarchyImpl();
hierarchy.setHierarchy("ROLE_ADMIN > ROLE_STAFF\n" +
        "ROLE_STAFF > ROLE_USER\n" +
        "ROLE_USER > ROLE_GUEST");
```

在上述代码中：

* `ROLE_ADMIN` 继承了 `ROLE_STAFF`、`ROLE_USER` 和 `ROLE_GUEST` 的所有权限。
* `ROLE_STAFF` 继承了 `ROLE_USER` 和 `ROLE_GUEST` 的所有权限。
* `ROLE_USER` 继承了 `ROLE_GUEST` 的所有权限。
* `RoleHierarchyVoter` 是 `Spring Security` 中的一个投票器，它能够理解这种角色层次结构。当用户的权限被检查时，这个投票器会考虑用户的所有继承权限。

这样做的优势如下：

1. **简化配置**: 通过角色层次结构，你不再需要为每个角色单独配置所有权限。只需配置继承关系即可。
2. **易于管理**: 随着应用程序的发展，新的角色和权限可能会添加进来。使用层次结构可以更容易地管理这些变化，而不是更新每个角色的单独配置。
3. **更清晰的语义**: 通过查看角色的层次结构，你可以快速了解各个角色之间的关系和它们所拥有的权限。

可见，角色层次结构是权限管理中的一个强大工具，特别是在那些有多个角色和权限的复杂应用程序中。正确使用可以大大简化配置和管理工作。

### 1.5 遗留的授权组件

Spring Security 为了向后兼容和逐渐迁移到新的授权模型，保留了一些遗留组件。虽然它们仍然存在，但是新的应用程序和功能建议使用前面提到的新的授权组件。下面是有关 `AccessDecisionManager` 遗留组件的简要说明。

#### 1.5.1 AccessDecisionManager

`AccessDecisionManager` 在 Spring Security 的早期版本中用于做出授权决策。它由 `AbstractSecurityInterceptor` 调用，主要职责是确定给定的认证是否应该被允许访问一个特定的对象（如方法、URL等）。

它的主要方法和职责如下：

1. **decide**:
   - 参数:
     - `Authentication authentication`: 当前用户的认证信息。
     - `Object secureObject`: 当前试图访问的对象。
     - `Collection<ConfigAttribute> attrs`: 与 `secureObject` 关联的配置属性（通常表示为角色）。
   - 职责:
     - 决定给定的 `authentication` 是否应该被允许访问 `secureObject`。如果不允许，则会抛出 `AccessDeniedException` 异常。
2. **supports(ConfigAttribute attribute)**:
   - 参数:
     - `ConfigAttribute attribute`: 一个配置属性。
   - 职责:
     - 确定 `AccessDecisionManager` 是否支持给定的 `ConfigAttribute`。这是为了确保 `AccessDecisionManager` 可以处理与 `secureObject` 关联的所有配置属性。
3. **supports(Class clazz)**:
   - 参数:
     - `Class clazz`: 一个类。
   - 职责:
     - 确定 `AccessDecisionManager` 是否支持给定的安全对象类型。这通常用于确定 `AccessDecisionManager` 是否可以处理由特定的安全拦截器（如方法、URL等）呈现的 `secureObject`。

在更早期的 Spring Security 实现中，这些组件为授权决策提供了核心功能。但随着时间的推移，为了更好地满足现代应用程序的需要，Spring Security 引入了新的授权组件，如 `AuthorizationManager`。

总之，虽然 `AccessDecisionManager` 可能在某些早期的实现中仍然是必要的，但对于新的实现和功能，建议使用新的授权组件。

#### 1.5.2 基于投票的 AccessDecisionManager 实现

在 Spring Security 中，一种常见的做法是使用基于投票的机制来做出授权决策。这种方法依赖于多个 `AccessDecisionVoter` 来评估授权请求，然后 `AccessDecisionManager` 根据这些投票来做出最终的决策。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-114917.png)

以下是这种方法的详细说明：

1. **AccessDecisionVoter 接口**:
   - `vote(Authentication authentication, Object object, Collection<ConfigAttribute> attrs)`: 返回 int 类型的投票结果。它可以是 `ACCESS_ABSTAIN`（表示投票者对此决策没有意见），`ACCESS_DENIED`（表示投票者拒绝访问）或 `ACCESS_GRANTED`（表示投票者允许访问）。
   - `supports(ConfigAttribute attribute)`: 返回一个布尔值，表示此投票者是否支持给定的配置属性。
   - `supports(Class clazz)`: 返回一个布尔值，表示此投票者是否支持给定的安全对象类型。
2. **具体的 AccessDecisionManager 实现**:
   - **ConsensusBased**: 基于非弃权投票的多数来决定授予权限。有属性可以配置在所有票数相等或所有投票者都弃权时的行为。
   - **AffirmativeBased**: 只要至少有一个投票者投了 `ACCESS_GRANTED`，就授予访问权限。其他所有的 `ACCESS_DENIED` 投票都将被忽略。也有属性可以配置在所有投票者都弃权时的行为。
   - **UnanimousBased**: 只有当所有投票都是 `ACCESS_GRANTED` 时，才授予权限。如果任何投票者投 `ACCESS_DENIED`，访问将被拒绝。忽略所有的 `ACCESS_ABSTAIN` 投票。也有属性可以配置在所有投票者都弃权时的行为。
3. **定制的 AccessDecisionManager**: 尽管 Spring Security 提供了几个基于投票的 `AccessDecisionManager` 实现，但在某些情况下，您可能需要更复杂的投票策略。例如，某个特定的 `AccessDecisionVoter` 的投票可能需要被赋予更高的权重，或者某个特定的拒绝投票可能需要具有一票否决权。在这些情况下，您可以实现自己的 `AccessDecisionManager` 来满足这些特定需求。

总之，基于投票的授权决策提供了一种灵活的方法来处理复杂的授权逻辑，允许多个 `AccessDecisionVoter` 贡献其决策，然后由 `AccessDecisionManager` 根据这些投票做出最终的授权决策。

#### 1.5.3 RoleVoter

`RoleVoter` 是 Spring Security 中最常用的 `AccessDecisionVoter`。它主要用于简单的基于角色的访问控制，检查用户是否被授予特定的角色以获得对资源的访问权限。

**工作原理**：

- `RoleVoter` 主要关注那些以 `ROLE_` 为前缀的 `ConfigAttribute`。
- 它会检查用户的 `GrantedAuthority`（通常是从用户的 `Authentication` 对象中获得的）是否包含与 `ConfigAttribute` 完全匹配的角色。
- 如果用户有一个或多个匹配的角色，`RoleVoter` 就会投票 `ACCESS_GRANTED`。
- 如果没有匹配的角色，它会投票 `ACCESS_DENIED`。
- 对于不以 `ROLE_` 为前缀的 `ConfigAttribute`，`RoleVoter` 会弃权，即返回 `ACCESS_ABSTAIN`。

#### 1.5.4 AuthenticatedVoter

`AuthenticatedVoter` 是另一个常用的 `AccessDecisionVoter`，用于区分不同身份验证级别的用户。

- 工作原理：
  - `AuthenticatedVoter` 考虑的 `ConfigAttribute` 主要有三个：`IS_AUTHENTICATED_ANONYMOUSLY`、`IS_AUTHENTICATED_REMEMBERED` 和 `IS_AUTHENTICATED_FULLY`。
  - 当一个用户是匿名用户时，`IS_AUTHENTICATED_ANONYMOUSLY` 会被授予。
  - 当一个用户通过“记住我”功能被认证时，`IS_AUTHENTICATED_REMEMBERED` 会被授予。
  - 当一个用户完全被身份验证（例如，通过一个登录表单）时，`IS_AUTHENTICATED_FULLY` 会被授予。
  - 这三个属性允许您区分不同级别的用户身份验证，并基于这些身份验证级别为资源提供访问控制。

通过组合这些 `Voters` 和其他自定义 `Voters`，你可以在 Spring Security 中创建非常精细的访问控制策略。

#### 1.5.5 自定义投票者

在Spring Security中，使用`AccessDecisionVoter`接口创建自定义投票者是为了提供更加细粒度和特定于应用程序的访问控制策略。自定义投票者可以根据特定的业务逻辑或其他条件为特定的操作或资源提供访问控制。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-25-115018.png)

例如，您可以创建一个投票者来检查用户账户是否被暂停，如果账户被暂停，那么访问请求将被拒绝。

**实现自定义投票者的步骤**：

1. 实现`AccessDecisionVoter`接口。
2. 根据您的需要实现`vote`方法。这是做出授权决策的核心方法。
3. 还需要实现`supports`方法，以确定投票者是否支持特定的`ConfigAttribute`或安全对象类型。
4. 将您的自定义投票者添加到基于投票的`AccessDecisionManager`实现中。

**AfterInvocationManager和AfterInvocationProvider**

在Spring Security中，`AfterInvocationManager`用于在方法调用之后处理安全考虑因素。这可能包括修改返回的对象或在某些条件下抛出`AccessDeniedException`。

例如，即使用户有权访问某个方法，`AfterInvocationProvider`也可以基于返回数据的内容或状态来决定是否抛出`AccessDeniedException`。

**关键点**：

- 如果您使用了`AfterInvocationManager`，仍然需要一个`AccessDecisionManager`来决定是否允许对方法进行调用。
- 默认情况下，如果所有的`AccessDecisionVoter`都弃权，且`AccessDecisionManager`的`allowIfAllAbstainDecisions`属性设置为`false`，将会抛出`AccessDeniedException`。
- 可以通过两种方法避免上述问题：(i) 将`allowIfAllAbstainDecisions`设置为`true`（但通常不建议这样做）；或(ii)确保至少有一个`ConfigAttribute`存在，供某个`AccessDecisionVoter`根据该属性授予访问权限。

最后，无论是自定义投票者还是其他安全组件，Spring Security都提供了非常强大和灵活的机制来满足您的特定需求。

## 2.授权 HTTP 请求



## 3.使用 FilterSecurityInterceptor 授权 HTTP 请求



## 4.基于表达式的访问控制



## 5.安全对象实现



## 6.方法安全性



## 7.对象安全 ACL



## 8.授权事件
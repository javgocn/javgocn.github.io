---
title: 03-Security-认证
---
## 1.整体架构

Spring Security 是 Java 开发者的首选框架，为 Web 应用程序提供了全面的身份验证和授权支持。在本文中，我们将从深入探讨其背后的 Servlet 身份验证架构原理开始。

在开始之前，我们需要明确一点：本节的目的是为您提供一个高层次的、抽象的视角，让您了解身份验证的整体架构，而不是深入到具体的实现细节。

以下是 Spring Security 在 Servlet 身份验证中使用的主要架构组件：

| 组件                                   | 描述                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| SecurityContextHolder                  | Spring Security 存储已认证用户详细信息的地方                 |
| SecurityContext                        | 从 SecurityContextHolder 获取，并包含当前已认证用户的 `Authentication` 信息 |
| Authentication                         | 可以作为 `AuthenticationManager` 的输入，提供用户提供的凭据（一般是密码）进行身份验证，或者从 `SecurityContext` 获取当前用户信息 |
| GrantedAuthority                       | 授予 `Authentication` 主体的权限，例如角色、范围等           |
| AuthenticationManager                  | 定义了 Spring Security 的过滤器如何执行身份验证的 API        |
| ProviderManager                        | `AuthenticationManager` 的最常见实现                         |
| AuthenticationProvider                 | 由 `ProviderManager` 使用，执行特定类型的身份验证            |
| AuthenticationEntryPoint               | 用于从客户端请求凭据，例如重定向到登录页面或发送 `WWW-Authenticate` 响应等 |
| AbstractAuthenticationProcessingFilter | 用于身份验证的基础过滤器。它也很好地展示了身份验证的高级流程以及各个组件如何协同工作 |

Spring Security 提供了一个强大而灵活的身份验证架构，通过了解其背后的核心组件和它们如何互相协作，您将更好地理解如何利用这个框架来满足您的安全需求。

### 1.1 SecurityContextHolder

🤔 什么是 SecurityContextHolder？

`SecurityContextHolder` 是一个特殊的对象，用于**存储与当前执行线程相关的安全上下文**信息，即 `SecurityContext`。这个上下文包含了关于**当前用户的所有信息**，包括他们的**凭证**和授予的**角色**。

🤔 如何使用 SecurityContextHolder？

Spring Security 本身并不关心 `SecurityContextHolder` 是如何被填充的。但如果它包含一个值，Spring Security 会将其视为当前已认证的用户。下面是一个简单的示例，展示了如何手动设置 `SecurityContextHolder`：

```java
// 从 SecurityContextHolder 中获取与当前执行线程相关的安全上下文（SecurityContext）
SecurityContext context = SecurityContextHolder.createEmptyContext(); 

// 创建一个认证对象，传入：用户名、凭证、角色
Authentication authentication = new TestingAuthenticationToken("username", "password", "ROLE_USER"); 
// 将 Authentication 设置到 SecurityContext
context.setAuthentication(authentication);

// 将 SecurityContext 设置到 SecurityContextHolder
SecurityContextHolder.setContext(context); 
```

在上述代码中：

1. 我们首先创建了一个空的 `SecurityContext`。为了避免在多线程环境中出现竞态条件，创建新的 `SecurityContext` 实例是很重要的，而不是直接使用 `SecurityContextHolder.getContext().setAuthentication(authentication)`。
2. 接下来，我们创建了一个新的 `Authentication` 对象。Spring Security 并不关心 `SecurityContext` 上设置的 `Authentication` 实现的具体类型。在这里，我们使用了 `TestingAuthenticationToken`，因为它非常简单。在生产环境中，更常见的是使用 `UsernamePasswordAuthenticationToken(userDetails, password, authorities)`。
3. 最后，我们将 `SecurityContext` 设置到 `SecurityContextHolder` 上。此后，Spring Security 将使用这些信息进行授权。

`SecurityContextHolder` 是 Spring Security 中非常重要的一个组件，它为开发者提供了一个方便的方式来存储和检索关于当前用户的安全上下文。理解它的工作原理和如何使用它，对于构建安全的 Spring 应用程序至关重要。

🤔 如何获取当前已验证的用户信息？

要获取当前已验证的用户的信息，您可以使用以下代码：

```java
// 获取当前的 SecurityContext
SecurityContext context = SecurityContextHolder.getContext();

// 从 SecurityContext 中获取 Authentication 对象
Authentication authentication = context.getAuthentication();

// 获取用户名
String username = authentication.getName();

// 获取主体对象，通常是一个 UserDetails 对象
Object principal = authentication.getPrincipal();

// 获取用户的权限集合
Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
```

🤔 SecurityContextHolder 的存储策略是怎样的？

默认情况下，`SecurityContextHolder` 使用 `ThreadLocal` 来存储安全上下文，这意味着在同一线程中，无论何时，您都可以访问 `SecurityContext`，即使您没有将其明确传递为方法参数。只要在处理请求后清除线程，使用 `ThreadLocal` 就是安全的。Spring Security 的 `FilterChainProxy` 确保 `SecurityContext` 在请求结束后被清除。

但是，某些应用程序可能不适合使用 `ThreadLocal`，因为它们可能以特定的方式使用线程。例如，Swing 客户端可能希望 JVM 中的所有线程共享相同的安全上下文。为了满足这些需求，`SecurityContextHolder` 提供了不同的存储策略：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-050310.png)

* **MODE_GLOBAL**：所有线程共享一个全局的 `SecurityContext`。
* **MODE_INHERITABLETHREADLOCAL**：安全线程创建的子线程将继承其 `SecurityContext`。
* **MODE_THREADLOCAL**（默认）：每个线程都有其自己的 `SecurityContext`。

要更改默认的存储策略，您可以**设置系统属性**或调用 `SecurityContextHolder` 上的静态方法 `setStrategyName(String strategyName)`。

> 大多数应用程序不需要更改默认策略，但如果您需要进行更改，请查阅 `SecurityContextHolder` 的 Javadoc 以获取更多详细信息。

### 1.2 SecurityContext

`SecurityContext` 是 Spring Security 中的一个接口，它用于存储与当前线程相关的安全凭据（`Authentication`）。它的主要职责是持有一个 `Authentication` 对象，该对象代表了当前用户的身份验证信息。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-050744.png)

您可以使用 `SecurityContextHolder` 来获取当前线程的 `SecurityContext`。例如：

```java
SecurityContext context = SecurityContextHolder.getContext();
```

一旦您从 `SecurityContextHolder` 获取了 `SecurityContext`，您可以轻松访问 `Authentication` 对象以及与之关联的其他信息。例如，要获取当前用户的用户名：

```java
Authentication authentication = context.getAuthentication();
String username = authentication.getName();
```

> ⚠️ 注意：虽然 `SecurityContext` 提供了对当前用户的详细信息的访问，但您应该避免直接修改它，除非您确切知道自己在做什么。任何更改都可能影响应用程序的安全性。

### 1.3 Authentication

在 Spring Security 中，身份验证（`Authentication`）扮演着至关重要的角色，它主要有以下两个用途：

1. 作为 `AuthenticationManager` 的输入，提供用户提供的凭据以进行身份验证。在这种情境下，`isAuthenticated()` 方法返回 `false`。
2. 代表当前已经经过身份验证的用户。当前的 `Authentication` 可以从 `SecurityContext` 中获取。

身份验证（`Authentication`）包含以下内容：

* **主体（Principal）**：标识用户。当使用用户名/密码进行身份验证时，这通常是 `UserDetails` 的一个实例。
* **凭据（Credentials）**：通常是密码。在许多情况下，一旦用户被验证，为确保不会泄露，这些凭据会被清除。
* **权限（Authorities）**：这些是授予用户的高级权限。一些常见的例子包括角色（roles）或范围（scopes）。

对应源码如下：

```java
/**
 * Authentication 接口定义了 Spring Security 中身份验证对象的核心结构。
 * 它继承了 Principal 和 Serializable 接口，确保身份验证对象可以被序列化。
 */
public interface Authentication extends Principal, Serializable {

    /**
     * 获取与此身份验证相关的权限集合。
     * 这些权限通常代表了用户的角色或其他相关权限。
     *
     * @return 代表用户权限的集合
     */
    Collection<? extends GrantedAuthority> getAuthorities();

    /**
     * 获取与此身份验证相关的凭据，通常是密码或其他秘密信息。
     * 出于安全原因，身份验证成功后，这些凭据通常会被清除。
     *
     * @return 用户的凭据
     */
    Object getCredentials();

    /**
     * 获取与此身份验证相关的详细信息。
     * 这些详细信息可以是任何与身份验证请求相关的额外信息，例如 IP 地址、会话 ID 等。
     *
     * @return 身份验证的详细信息
     */
    Object getDetails();

    /**
     * 获取代表用户的主体对象。
     * 当使用用户名/密码进行身份验证时，这通常是 UserDetails 的一个实例。
     *
     * @return 代表用户的主体对象
     */
    Object getPrincipal();

    /**
     * 检查此身份验证是否已经完成。
     *
     * @return 如果用户已经通过身份验证，则为 true，否则为 false
     */
    boolean isAuthenticated();

    /**
     * 设置此身份验证的状态。
     * 注意：此方法的调用者负责确保此身份验证仅在安全上下文中正确地设置。
     *
     * @param isAuthenticated 身份验证的状态
     * @throws IllegalArgumentException 如果尝试将身份验证设置为未完成
     */
    void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException;
}
```

上面涉及到的 `UserDetails` 是 Spring Security 中的一个核心接口，用于**获取用户的认证和授权信息**。这个接口提供了一种方法来暴露有关用户的核心信息，如**用户名、密码、权限等**。通常，当我们从数据库或其他数据源加载用户信息时，我们会实现这个接口。

以下是 `UserDetails` 接口中的方法及其描述：

| 方法                      | 返回值                                   | 描述                                                   |
| ------------------------- | ---------------------------------------- | ------------------------------------------------------ |
| getAuthorities()          | Collection\<? extends GrantedAuthority\> | 获取与用户关联的所有权限。这些权限是用于授权决策的。   |
| getPassword()             | String                                   | 获取用户的密码。这用于认证过程中与提供的凭据进行比较。 |
| getUsername()             | String                                   | 获取用户的用户名。这是用户的主要标识符。               |
| isAccountNonExpired()     | boolean                                  | 指示用户的帐户是否已过期。一个过期的帐户不能被认证。   |
| isAccountNonLocked()      | boolean                                  | 指示用户的帐户是否被锁定。一个锁定的帐户不能被认证。   |
| isCredentialsNonExpired() | boolean                                  | 指示用户的凭据（密码）是否已过期。过期的凭据阻止认证。 |
| isEnabled()               | boolean                                  | 指示用户是否启用或禁用。禁用的用户不能被认证。         |

当你实现 `UserDetails` 接口时，你可以根据你的应用程序的需求为这些方法提供具体的实现。例如，你可能会从数据库中检索相关的用户信息，并基于这些信息返回适当的值。

`User` 是 `UserDetails` 接口的一个具体实现，它是 Spring Security 提供的。这个类包含了一些基本的属性，如用户名、密码和权限，以及一些用于描述用户状态的属性，如是否启用、帐户是否过期等。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-053117.png)

`User` 类的主要构造函数：

```java
public User(String username, String password, Collection<? extends GrantedAuthority> authorities) {
  this(username, password, true, true, true, true, authorities);
}

public User(String username, String password, boolean enabled, boolean accountNonExpired,
    boolean credentialsNonExpired, boolean accountNonLocked,
    Collection<? extends GrantedAuthority> authorities) {
  Assert.isTrue(username != null && !"".equals(username) && password != null,
      "Cannot pass null or empty values to constructor");
  this.username = username;
  this.password = password;
  this.enabled = enabled;
  this.accountNonExpired = accountNonExpired;
  this.credentialsNonExpired = credentialsNonExpired;
  this.accountNonLocked = accountNonLocked;
  this.authorities = Collections.unmodifiableSet(sortAuthorities(authorities));
}
```

假设我们要为一个用户创建一个 `UserDetails` 对象，该用户有两个角色：`ROLE_USER` 和 `ROLE_ADMIN`，并且该用户是启用的、帐户未过期的、凭据未过期的、帐户未锁定的。

```java
public class UserDetailsExample {

    public static void main(String[] args) {
        // 创建权限列表，SimpleGrantedAuthority 是 GrantedAuthority 的基本实现，存储授予 Authentication 对象的权限的字符串表示形式
        List<GrantedAuthority> authorities = Arrays.asList(
            new SimpleGrantedAuthority("ROLE_USER"),
            new SimpleGrantedAuthority("ROLE_ADMIN")
        );

        // 使用 User 类创建 UserDetails 对象
        User user = new User("username", "password", true, true, true, true, authorities);

        // 输出 UserDetails 信息
        System.out.println("Username: " + user.getUsername());
        System.out.println("Password: " + user.getPassword());
        System.out.println("Authorities: " + user.getAuthorities());
        System.out.println("Account Non Expired: " + user.isAccountNonExpired());
        System.out.println("Account Non Locked: " + user.isAccountNonLocked());
        System.out.println("Credentials Non Expired: " + user.isCredentialsNonExpired());
        System.out.println("Enabled: " + user.isEnabled());
    }
}
```

当然，这只是一个简单的示例，实际应用中，你可能会从数据库或其他数据源加载用户信息，并使用这些信息创建 `UserDetails` 对象。

除了上面的创建方式，Spring Security 还提供了 `User` 类的一个内部静态类 `User.UserBuilder`，它提供了一种流畅的方式来构建 `UserDetails` 对象。以下是主要的方法：

1. `User.withUsername(String username)`：设置用户名。
2. `User.withPassword(String password)`：设置密码。
3. `User.withAuthorities(Collection<? extends GrantedAuthority> authorities)`：设置权限。
4. `User.withDefaultPasswordEncoder()`：设置默认的密码编码器。

示例如下：

```java
public class UserBuilderExample {

    public static void main(String[] args) {
        // 创建权限列表
        List<SimpleGrantedAuthority> authorities = Arrays.asList(
            new SimpleGrantedAuthority("ROLE_USER"),
            new SimpleGrantedAuthority("ROLE_ADMIN")
        );

        // 使用 UserBuilder 创建 UserDetails 对象
        UserDetails user = User.withDefaultPasswordEncoder()
            .username("username")
            .password("password")
            .authorities(authorities)
            .accountExpired(false)
            .accountLocked(false)
            .credentialsExpired(false)
            .disabled(false)
            .build();

        // 输出 UserDetails 信息
        System.out.println("Username: " + user.getUsername());
        System.out.println("Password: " + user.getPassword());
        System.out.println("Authorities: " + user.getAuthorities());
        System.out.println("Account Non Expired: " + user.isAccountNonExpired());
        System.out.println("Account Non Locked: " + user.isAccountNonLocked());
        System.out.println("Credentials Non Expired: " + user.isCredentialsNonExpired());
        System.out.println("Enabled: " + user.isEnabled());
    }
}
```

> ⚠️ 注意：在实际生产环境中，不建议使用 `withDefaultPasswordEncoder()`，因为它使用的是不安全的密码编码器。在实际应用中，应该使用更安全的密码编码器，如 `BCryptPasswordEncoder`。

### 1.4 GrantedAuthority

在 Spring Security 中，`GrantedAuthority` 是一个核心概念，它代表了**授予用户的权限**。这些权限可以是**角色**、**权限**或其他自定义的标识符，用于**决定用户可以访问哪些资源或执行哪些操作**。

1. **获取 GrantedAuthority：**

   通过 `Authentication.getAuthorities()` 方法，我们可以获取到与当前用户关联的所有 `GrantedAuthority`。这个方法返回一个 `GrantedAuthority` 对象的集合，每个对象都代表了用户被授予的一个特定权限。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-051759.png)

2. **角色与权限：**

   在许多情况下，`GrantedAuthority` 通常表示为 “角色”，例如 `ROLE_ADMINISTRATOR` 或 `ROLE_HR_SUPERVISOR`。这些角色可以进一步用于配置 Web 授权、方法授权和域对象授权。当 Spring Security 进行授权决策时，它会检查用户的 `GrantedAuthority`，确保用户具有访问特定资源的适当权限。

3. **如何加载 GrantedAuthority：**

   当使用基于用户名/密码的身份验证时，`GrantedAuthority` 通常由 `UserDetailsService` 加载，它根据用户的身份提供相关的权限。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-052432.png)

4. **应用程序范围的权限：**

   在 Spring Security 的上下文中，通常有两种权限的概念：

   * **应用程序范围的权限**：这些是通常的权限，例如 “读取”、“写入” 或特定的角色，如 “管理员” 或 “用户”。这些权限是全局的，适用于应用程序的所有用户和所有资源。
   * **域对象的权限**：这些权限是特定于某个对象或资源的。例如，考虑一个员工管理系统，其中每个员工都是一个 “域对象”。在这种情况下，特定于域对象的权限可能是 “读取员工编号为 54 的信息” 或 “编辑员工编号为 101 的薪水”。

   现在，`GrantedAuthority` 通常用于表示前者（应用程序范围的权限）。如果我们尝试使用 `GrantedAuthority` 来表示后者（域对象的权限），并为每个单独的域对象（例如每个员工）创建一个 `GrantedAuthority`，那么在有大量员工的系统中，这将导致大量的 `GrantedAuthority` 对象。这不仅会消耗大量的内存，还可能导致性能问题，因为每次进行权限检查时，系统都必须遍历这些对象。

   为了解决这个问题，Spring Security 提供了一个特定的功能，称为 “域对象安全” 或 “ACL（访问控制列表）”。这允许我们为特定的域对象定义细粒度的权限，而不是为每个对象创建一个新的 `GrantedAuthority`。这种方法更加高效，可以避免上述问题。

### 1.5 AuthenticationManager

在 Spring Security 中，身份验证的核心是 `AuthenticationManager` 接口。它定义了如何验证用户的身份，即如何确保用户是他们声称的那个人。

`AuthenticationManager` 的主要职责是验证用户的身份。当用户尝试登录时，他们提供一些证据来证明他们是谁，通常是用户名和密码。`AuthenticationManager` 负责验证这些证据。

当验证成功时，`AuthenticationManager` 返回一个完全填充的 `Authentication` 对象，这表示用户已经成功登录。这个对象可以被其他部分的应用程序使用，例如为特定用户提供特定的内容或执行特定的业务逻辑。

这都是由 `AuthenticationManager` 的核心方法 `authenticate` 完成的，源码如下：

```java
public interface AuthenticationManager {
	Authentication authenticate(Authentication authentication) throws AuthenticationException;
}
```

🤔 那么，它如何与 Spring Security 的 Filters 集成呢？

Spring Security 的过滤器链中，一旦用户的身份得到验证，`Authentication` 对象就会被设置在 `SecurityContextHolder` 上。这意味着，应用程序的其他部分可以轻松地访问当前登录用户的详细信息。

但是，如果您的应用程序没有使用 Spring Security 的默认过滤器，您仍然可以手动设置 `SecurityContextHolder`。这在某些高级用例中可能会很有用，例如当您有自定义的身份验证流程或与第三方身份验证服务集成时。

🤔 AuthenticationManager#authenticate 方法由谁实现？

虽然 `AuthenticationManager` 可以有多种实现，但 `ProviderManager` 是最常见的一种：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-054349.png)

它**不直接处理身份验证**，而是**委托给一系列的 `AuthenticationProvider` 实例，每个实例都知道如何处理特定类型的身份验证**。例如，一个 `AuthenticationProvider` 可能知道如何验证用户名和密码，而另一个可能知道如何验证 API 令牌。

这种模块化的方法使得 `ProviderManager` 能够很容易地支持多种身份验证方法，而不需要修改核心代码。

### 1.6 ProviderManager：身份验证的多样性

在 Spring Security 的身份验证体系中，`ProviderManager` 扮演着核心的角色。它是 `AuthenticationManager` 的一个常见实现，但它的工作方式与其他实现有所不同。`ProviderManager` 不直接处理身份验证，而是将这个任务委托给一系列的 `AuthenticationProvider` 实例。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-054751.png)

对应的示意图如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-060122.png)

当一个身份验证请求到达 `ProviderManager` 时，它会遍历其配置的 `AuthenticationProvider` 列表，询问每个提供者是否可以处理这个请求。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-054918.png)

这是一个链式的处理过程：

* 如果一个 `AuthenticationProvider` 确定它可以验证请求，并且验证成功，那么身份验证过程就此结束。

  ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-055141.png)

* 如果 `AuthenticationProvider` 无法验证请求，它会简单地跳过，允许下一个提供者尝试。

  ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-055016.png)

* 如果所有的 `AuthenticationProvider` 都不能处理请求，`ProviderManager` 会抛出一个 `ProviderNotFoundException`。

  ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-055311.png)

这种设计的优势在于其模块化和灵活性。每个 `AuthenticationProvider` 都是专门为处理特定类型的身份验证设计的。例如：

* 一个 `AuthenticationProvider` 可能专门处理基于用户名和密码的身份验证。
* 另一个 `AuthenticationProvider` 可能处理基于 SAML 或 OAuth2 的身份验证。

这意味着，当应用程序的身份验证需求发生变化时，只需添加、删除或修改 `AuthenticationProvider`，而不必更改 `ProviderManager` 或其他部分的代码。

> 📒 Note：
>
> `ProviderManager` 提供了一种高度模块化和可扩展的方式来处理身份验证。通过将身份验证任务委托给一系列的 `AuthenticationProvider`，它能够支持多种身份验证方法，同时为开发者提供了一个统一、简洁的 API。这种设计确保了 Spring Security 的灵活性和强大性，使其能够满足各种复杂的身份验证需求。

😎 如果你足够细心，想必已经在源码中看到并抛出了一个疑问：**为什么 ProviderManager 中维护了一个 AuthenticationManager？**

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-055733.png)

Spring Security 的 `ProviderManager` 不仅提供了一种模块化的方式来处理身份验证，还提供了额外的功能，如**父级身份验证和凭据管理**，以增强其灵活性和安全性。

也就是说，除了其内部的 `AuthenticationProvider` 列表，`ProviderManager` 还允许配置一个**可选**的父级 `AuthenticationManager`，它通常是 `ProviderManager` 的一个实例。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-060114.png)

这意味着，如果所有内部的 `AuthenticationProvider` 都不能处理身份验证请求，`ProviderManager` 会转而询问其父级 `AuthenticationManager` 而不是直接抛出一个 `ProviderNotFoundException`。

在 `authenticate` 源码中的关键部分如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-060607.png)

这种设计提供了额外的灵活性，特别是在以下情况：

**共享身份验证逻辑**：多个 `ProviderManager` 实例可以共享同一个父级 `AuthenticationManager`。这在多个 `SecurityFilterChain` 实例具有一些共同的身份验证逻辑，但也有各自的特定身份验证机制时，非常有用。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-060107.png)

为了增强安全性，`ProviderManager` 默认会尝试从成功的身份验证请求返回的 `Authentication` 对象中清除任何敏感的凭据信息，如密码。这确保了敏感信息不会在 `HttpSession` 中保留超过所需的时间。

但在某些情况下，这可能会导致问题：

**用户对象缓存**：如果您缓存了用户对象（例如，为了提高无状态应用程序的性能），并且 `Authentication` 对象引用了缓存中的对象，那么当该对象的凭据被清除后，再次对缓存中的对象进行身份验证可能会失败。

为了解决这个问题，您可以：

* 在缓存实现中或在创建返回的 `Authentication` 对象的 `AuthenticationProvider` 中首先创建对象的副本。
* 禁用 `ProviderManager` 上的 `eraseCredentialsAfterAuthentication` 属性。

可见，`ProviderManager` 提供了一种灵活且安全的方式来处理身份验证。通过支持父级身份验证和凭据管理，它确保了身份验证过程既灵活又安全。当设计和实施身份验证策略时，了解这些功能可以帮助您更好地利用 Spring Security 提供的功能。

### 1.7 AuthenticationProvider：多样化的身份验证策略

在 Spring Security 中，身份验证不仅仅是一个简单的用户名和密码的校验过程。随着现代应用程序的复杂性增加，身份验证策略也变得多样化，从简单的用户名/密码校验到复杂的令牌验证和第三方身份验证等。为了满足这些多样化的需求，Spring Security 提供了 `AuthenticationProvider` 接口，允许开发者为每种身份验证策略提供自定义的实现。

上面我们了解了，`ProviderManager` 可以配置多个 `AuthenticationProvider` 实例，每个实例都负责处理特定类型的身份验证。当一个身份验证请求到来时，`ProviderManager` 会遍历其内部的 `AuthenticationProvider` 列表，直到找到一个能够处理该请求的提供者。

`AuthenticationProvider` 的源码也很简单，只有两个方法，一个是负责处理 ProviderManager 传递过来的认证逻辑的 `authenticate` 方法，另一个是检测此 `AuthenticationProvider` 是否支持处理执行的 `Authentication` 认证类型。

```java
/**
 * AuthenticationProvider 接口定义了身份验证提供者应实现的核心方法。
 * 它是 Spring Security 身份验证过程中的关键组件，允许多种身份验证策略的插入和扩展。
 */
public interface AuthenticationProvider {

    /**
     * 对给定的身份验证请求进行身份验证。
     *
     * @param authentication 表示身份验证请求的对象，通常包含主体（如用户名）和凭据（如密码）。
     * @return 一个完全填充的身份验证对象，表示成功的身份验证。如果身份验证失败，此方法将抛出一个 AuthenticationException。
     * @throws AuthenticationException 如果身份验证失败，例如由于无效的凭据或其他原因。
     */
    Authentication authenticate(Authentication authentication) throws AuthenticationException;

    /**
     * 指示此 AuthenticationProvider 是否支持给定的身份验证类型。
     *
     * @param authentication 要检查的身份验证类。
     * @return 如果此 AuthenticationProvider 支持指定的身份验证类，则返回 true，否则返回 false。
     */
    boolean supports(Class<?> authentication);
}
```

`AuthenticationProvider` 有十几个实现：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-061137.png)

下面列举两个最常见的：

* **DaoAuthenticationProvider**：这是最常见的身份验证提供者，支持**基于用户名和密码的身份验证**。它通常与 `UserDetailsService` 配合使用，从数据库或其他数据源中加载用户的详细信息。
* **JwtAuthenticationProvider**：随着无状态应用程序和微服务架构的流行，JWT（JSON Web Token）身份验证也变得越来越普遍。`JwtAuthenticationProvider` 负责验证 JWT 令牌的有效性，并从中提取身份验证信息。

除了 Spring Security 提供的标准 `AuthenticationProvider` 实现外，开发者还可以创建自定义的实现，以支持特定的身份验证策略。这为应用程序提供了极大的灵活性，确保身份验证过程可以完美地适应业务需求。

### 1.8 请求凭据与 AuthenticationEntryPoint

在 Spring Security 中，`AuthenticationEntryPoint` 是一个关键接口，用于处理未经身份验证的客户端请求资源时的情况。它定义了如何向客户端发送一个响应，要求其提供身份验证凭据。

1. **主动提供凭据的情况**

   有时，客户端在请求资源时会主动提供身份验证凭据，例如用户名和密码。这种情况下，由于凭据已经提供，Spring Security 不需要再次请求。系统会尝试使用这些凭据进行身份验证，并根据结果授予或拒绝访问权限。

2. **未提供凭据的情况**

   如果客户端尝试访问他们没有权限的资源，并且没有提供任何身份验证凭据，那么 `AuthenticationEntryPoint` 就会介入。它的任务是决定如何响应这种未经身份验证的请求。

例如，对于基于表单的登录，`AuthenticationEntryPoint` 可能会重定向用户到登录页面。对于基于 HTTP Basic 或 Digest 的身份验证，它可能会发送一个带有 `WWW-Authenticate` 标头的响应，提示客户端提供凭据。

可见，`AuthenticationEntryPoint`为 Spring Security 提供了一个灵活的机制，用于处理各种未经身份验证的请求情况。开发者可以根据自己的需求实现此接口，以定义特定的身份验证入口策略。

该接口中只有一个默认方法用于处理如何向客户端发送一个响应的逻辑：

```java
public interface AuthenticationEntryPoint {
  	void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
			throws IOException, ServletException;
}
```

它有几个常见的实现：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-082130.png)

我们以常见的表单认证和 HTTP Basic 两个实现分别看看大致的处理逻辑：

1. **LoginUrlAuthenticationEntryPoint**：重定向到登陆页面；

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-082414.png)

2. **BasicAuthenticationEntryPoint**：发送一个带有 `WWW-Authenticate` 标头的响应，提示客户端提供凭据；

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-082522.png)

下面给一个在前后端分离中常见的自定义 `AuthenticationEntryPoint` 方式。我们大致可以如下处理：

1. 设置响应头的 Access-Control-Allow-Origin 字段告诉客户端允许那些请求类型，例如可以允许所有请求源，从而支持跨域访问；
2. 设置响应头的 Cache-Control 字段为 no-cache 指示本次响应不应被客户端缓存，从而确保每次拿到的都是最新状态信息；
3. 设置响应的字符编码，通常为 UFT-8；
4. 设置响应内容类型，通常在前后端分离项目中我们使用 JSON 进行数据传输，因此使用 application/json 即可；
5. 将认证失败的消息写入响应体携带给前端，一般需要使用我们自定义封装的通用返回对象将异常信息封装为 JSON 作为本次响应数据；
6. 刷新响应流确保数据被发送，这是常识，不过多解释，

示例代码如下：

```java
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        // 设置响应头，允许任何域进行跨域请求
        response.setHeader("Access-Control-Allow-Origin", "*");
        // 设置响应头，指示响应不应被缓存
        response.setHeader("Cache-Control","no-cache");
        // 设置响应的字符编码为 UTF-8
        response.setCharacterEncoding("UTF-8");
        // 设置响应内容类型为 JSON
        response.setContentType("application/json");
        // 将认证失败的消息写入响应体
        response.getWriter().println(JSONUtil.parse(CommonResult.unauthorized(authException.getMessage())));
        // 刷新响应流，确保数据被发送
        response.getWriter().flush();
    }
}
```

然后在配置 `SecurityFilterChain` 时通过如下方式将其进行注册以覆盖默认行为即可：

```java
@Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

       http.
                // 其他配置
                // 配置异常处理器  ExceptionHandlingConfigurer
                .exceptionHandling()
                // 当未认证或 token 过期时使用自定义的处理器返回响应
                .authenticationEntryPoint(restAuthenticationEntryPoint)
                // ...
    }
```

### 1.9 AbstractAuthenticationProcessingFilter

在 Spring Security 中，`AbstractAuthenticationProcessingFilter` 抽象类是**处理身份验证请求的核心组件**。它定义了身份验证过程的基本流程，从接收用户提交的凭据到身份验证成功或失败的结果。

1. **用户凭据的提交**：

   当用户提交其身份验证凭据（例如，通过登录表单）时，`AbstractAuthenticationProcessingFilter` 负责从 `HttpServletRequest` 中提取这些凭据并创建一个 `Authentication` 对象。具体的 `Authentication` 类型取决于该过滤器的具体子类实现。例如，`UsernamePasswordAuthenticationFilter` 会根据提交的用户名和密码创建一个 `UsernamePasswordAuthenticationToken`。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-083304.png)

2. **身份验证过程**：

   创建了 `Authentication` 对象后，它会被传递给 `AuthenticationManager` 进行实际的身份验证。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-22-083801.png)

3. **身份验证失败**：

   如果身份验证失败，以下步骤将被执行：

   * 清除 `SecurityContextHolder`，确保不会有任何残留的身份验证信息。
   * 如果配置了 "remember me" 功能，`RememberMeServices.loginFail` 方法会被调用。如果没有配置，这个步骤不会执行任何操作。
   * `AuthenticationFailureHandler` 会被调用，处理身份验证失败的情况，例如重定向到错误页面或显示错误消息。

4. **身份验证成功**：

   如果身份验证成功，以下步骤将被执行：

   * 通知 `SessionAuthenticationStrategy` 有一个新的登录事件。
   * 在 `SecurityContextHolder` 上设置 `Authentication` 对象。稍后，`SecurityContextPersistenceFilter` 会将 `SecurityContext` 保存到 `HttpSession`。
   * 如果配置了 "remember me" 功能，`RememberMeServices.loginSuccess` 方法会被调用。如果没有配置，这个步骤不会执行任何操作。
   * 发布一个 `InteractiveAuthenticationSuccessEvent` 事件，通知其他应用程序组件身份验证成功。
   * 调用 `AuthenticationSuccessHandler`，处理身份验证成功的情况，例如重定向到主页或显示欢迎消息。

可见，`AbstractAuthenticationProcessingFilter` 提供了一个结构化的框架，用于处理身份验证请求的各个阶段。它确保了身份验证过程的一致性和安全性，同时也为开发者提供了足够的灵活性，以根据特定需求定制身份验证流程。

## 2.基于用户名和密码的身份认证



## 3.OAuth 2.0 登录



## 4.SAML 2.0 登录



## 5.中央身份验证服务器 (CAS)



## 6.Remember Me



## 7.基于 JAAS 的身份认证



## 8.基于 OpenID 的身份认证



## 9.预身份验证场景



## 10.基于 X509 的身份认证


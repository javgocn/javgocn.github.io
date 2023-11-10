---
title: 01-核心-IOC
---
## 1.介绍 Spring IoC 容器和 Beans
控制反转（IoC）是一种设计原则，用于将对象之间的依赖关系从程序代码中解耦。在 Spring 框架中，IoC 的实现被称为依赖注入（DI）。

DI 的核心思想是，对象的依赖关系不再由对象自己创建和管理，而是由外部容器（如 Spring IoC 容器）来负责。具体来说，对象通过以下方式定义其依赖关系：

- **构造函数参数**：对象可以通过构造函数参数将自己的依赖关系传递给被创建的对象。
- **工厂方法的参数**：如果一个对象需要依赖其他对象，它可以提供一个工厂方法，该方法接受所需的依赖对象作为参数，并返回一个新的对象实例。
- **在对象实例构造或从工厂方法返回后设置在对象实例上的属性**：有时，对象可以在实例化后或从工厂方法返回时，通过设置属性来暴露其依赖关系（例如 Setter 方式的依赖注入）。

一旦对象的依赖关系被定义好，容器会在创建该对象时自动注入所需的依赖对象，而无需我们进行管理和维护。容器会根据预先配置的规则和映射关系，将依赖关系注入到相应的位置。

这种控制反转的过程与 bean 本身控制其依赖项的实例化或位置的方式截然相反。在没有使用 IoC 的情况下，bean 可能会直接使用类直接构造或服务定位器模式等方式来管理其依赖关系。然而，通过使用 IoC，Spring 框架将这些管理工作交由容器来完成，从而简化了开发人员的工作。

`org.springframework.beans` 和 `org.springframework.context` 包是 Spring Framework 的 IoC 容器的基础。其中 `BeanFactory` 接口提供了一种高级的配置机制，能够管理任何类型的对象。而 `ApplicationContext` 是 `BeanFactory` 的子接口，它对 `BeanFactory` 的功能进行了扩展。

具体来说，它添加了：

- 更容易与 Spring 的 AOP 功能集成
- 消息资源处理（用于国际化）
- 事件发布
- 应用程序层特定的上下文，如 `WebApplicationContext`，用于 web 应用程序。

简而言之，`BeanFactory` 提供了配置框架和基本功能，而 `ApplicationContext` 添加了更多企业级特定功能。`ApplicationContext` 是 `BeanFactory` 的完整超集，在本章节的描述中用于使用 Spring 的 IoC 容器来代指 `ApplicationContext`。
> TIP：如果你想了解更多关于使用 `BeanFactory` 而不是 `ApplicationContext` 的信息，请参阅涵盖 BeanFactory API 的部分。

在 Spring 中，由 Spring IoC 容器管理并构成应用程序骨干的对象被称为 beans。一个 bean 是通过 Spring IoC 容器实例化、组装和管理的对象。否则，bean 只是应用程序中众多对象之一。beans 及其之间的依赖关系通过容器使用的元数据配置进行反映。
## 2.容器概述
`org.springframework.context.ApplicationContext` 接口代表了 Spring 的 IoC 容器，负责实例化、配置和组装 Bean。容器通过读取配置元数据来获取要实例化、配置和组装的对象指令。配置元数据可以以 XML、Java 注解或 Java 代码的形式来表示。它允许您表达组成应用程序的对象以及这些对象之间的依赖关系。

Spring 提供了多个 `ApplicationContext` 接口的实现。在独立应用程序中，通常创建 `ClassPathXmlApplicationContext` 或 `FileSystemXmlApplicationContext` 的实例。

> TIP：ClassPathXmlApplicationContext vs FileSystemXmlApplicationContext
> 1. `ClassPathXmlApplicationContext`：这个类用于加载类路径（classpath）下的 XML 配置文件来初始化 `ApplicationContext`。它的应用场景通常是在开发阶段，当应用程序需要使用外部的配置文件进行初始化时，可以使用这个类。它的主要优点是简单易用，不需要额外的文件系统权限，但是缺点是只能加载类路径下的配置文件，对于其他路径或者远程的配置文件无法处理。
> 2. `FileSystemXmlApplicationContext`：这个类用于加载文件系统中的 XML 配置文件来初始化 `ApplicationContext`。它的应用场景通常是在生产环境中，当应用程序需要使用外部的配置文件进行初始化时，可以使用这个类。它的主要优点是可以加载任意位置的配置文件，但是缺点是需要文件系统的权限，而且相对复杂一些。
> 
简言之，`ClassPathXmlApplicationContext` 和 `FileSystemXmlApplicationContext` 的主要区别在于加载配置文件的位置和是否需要文件系统权限。在实际使用中，可以根据具体的应用场景和需求选择合适的实现类。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-12-144520.png)

虽然 XML 一直是定义配置元数据的传统格式，但您也可以通过提供少量的 XML 配置来指示容器使用 Java 注解或 Java 代码作为元数据格式，从而声明式地支持这些额外的元数据格式。

下图显示了 Spring 工作的高级视图。您的应用程序类与配置元数据结合，因此，在创建和初始化 `ApplicationContext` 之后，您将拥有一个完全配置且可执行的系统或应用程序。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-12-144531.png)

从上面的工作图中，我们也能看出 Spring IoC 实现原理：

1. 从配置元数据（XML、Java 注解或 Java 配置类）中获取需要依赖注入（DI）的业务 POJO；
2. 将业务 POJOs 封装成 `BeanDefinition` 注入到 Spring Container 之中进行管理；
3. 需要使用时通过 `ApplicationContext` 从 Spring Container 中直接获取即可。
### 2.1 配置元数据
如上一节的工作图可知，Spring IoC 容器会选择至少一种形式的配置元数据（XML、Java 注解或 Java 配置类）。这种配置元数据表示您作为应用程序开发者，如何告诉 Spring 容器应该如何实例化、配置和组装应用程序中的对象。

配置元数据通常以简单直观的 XML 格式提供，传统的项目开发大都使用这种格式来传达 Spring IoC 容器的关键概念和特性。然而，Spring 发展至今，许多开发人员选择基于 Java 的配置来管理他们的 Spring 应用程序。因此，在对 Spring 官方文档进行解读时，我将摈弃传统的使用 XML 配置元数据的方式，而是使用 Java 注解或者 JavaConfig 的方式进行配置，有关 XML 方式的使用请自行参考官方文档。

> TIP：
> - 注解式配置：Spring 2.5 引入了对基于注解的配置元数据的支持。
> - Java 配置：从 Spring 3.0 开始，Spring JavaConfig 项目提供的功能已成为 Spring 框架的核心部分。因此，您可以使用 Java 而不是 XML 文件来定义应用程序类之外的 bean。

下面我们分别简单介绍基于 Java 注解和 JavaConfig 方式的配置，更详细的说明将在后面的对应小节进行详细转开。
#### 2.1.1 Java 注解配置
首先，需要在类上添加相应的注解（`@Component`、`@Service`、`@Repository`、`@Controller` 等）来标识这个类是 Spring 容器管理的 Bean。例如，假设我们有一个名为 `MyService` 的类，我们可以使用 `@Service` 注解来标识这个类：
```java
import org.springframework.stereotype.Service;

@Service	// 注册为业务 Bean
public class MyService {
    // ...
}
```
然后，在需要使用这个 Bean 的地方，可以通过 `@Autowired` 注解进行注入：
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component	// 注册为普通 Bean
public class MyComponent {

    // MyComponent Bean 需要依赖的 MyService Bean
    private final MyService myService;

    // 构造注入
    @Autowired
    public MyComponent(MyService myService) {
        this.myService = myService;
    }

    // ...
}
```
#### 2.1.2 JavaConfig 配置
首先，需要创建一个配置类，并使用 `@Configuration` 注解标记这个类。在这个类中，可以使用 `@Bean` 注解定义 Bean，并使用 `@ComponentScan` 注解指定需要扫描的包路径：
```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration	// 标记为 JavaConfig，本身也会被注册为 Bean
@ComponentScan(basePackages = "com.example")	// 要扫描并注册到容器的包路径（通常是扫描注解方式配置的 Bean）
public class AppConfig {
    
    @Bean	// 定义一个 Bean
    public MyService myService() {	// 通常是一个方法，返回值就是 Bean 类型，方法名则为 Bean 在容器中的名称
        return new MyService();
    }
}
```
在上面的例子中，我们定义了一个名为 `myService` 的 Bean。接下来，在需要使用这个 Bean 的地方，同样可以通过 `@Autowired` 注解进行注入：
```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component	// 注册为普通 Bean
public class MyComponent {

    // MyComponent Bean 需要依赖的 MyService Bean
    private final MyService myService;

    // 构造注入
    @Autowired
    public MyComponent(MyService myService) {
        this.myService = myService;
    }

    // ...
}
```
> 小结：
> Java 注解配置和 JavaConfig 配置的主要区别在于注解的使用方式。Java 注解配置主要依赖于自定义的注解，而 JavaConfig 配置则依赖于 Spring 提供的 `@Configuration`、`@Bean` 等注解。在实际项目中，可以根据具体需求选择合适的配置方式。

### 2.2 实例化容器
在定义了上面的 Bean 后，我们如何实例化 `ApplicationContext` 容器呢？传统基于 XML 的方式是通过 `ApplicationContext`的两个常用实现 `ClassPathXmlApplicationContext` 或 `FileSystemXmlApplicationContext` 读取类路径或者文件系统中的 Spring 配置文件（如 applicationContext.xml）。

下面简单提及示例代码：

```java
// 从 CLASSPATH 加载配置文件
ApplicationContext context = new ClassPathXmlApplicationContext("applicationContext.xml");

// 从文件系统加载配置文件
ApplicationContext context = new FileSystemXmlApplicationContext("D:/applicationContext.xml");
```
由于我们更多时候是使用 Java 注解 + JavaConfig 的方式进行 Bean 的注册的，所以这里想要获取到 `ApplicationContext`，我们可以使用它的另一个实现 `AnnotationConfigApplicationContext`来加载配置文件并实例化容器：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-12-144608.png)

示例代码如下：

```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class Main {
    public static void main(String[] args) {
        // 实例化容器
        ApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);

        // ...
    }
}
```
### 2.3 使用容器
拿到 `ApplicationContext` 容器后，我们应该如何访问容器中的 Bean 呢？我们知道 `ApplicationContext` 是超级工厂 `BeanFactory` 的扩展，`BeanFactory` 负责创建和管理 Bean，该接口提供了一系列的 `getBean()` 方法用来获取容器中管理的 Bean：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-12-144619.png)

对应源码解释如下：

```java
public interface BeanFactory {
    /**
     * 根据指定名称获取 Bean 对象。
     * @param name Bean 的名称
     * @return 返回指定名称的 Bean 对象
     * @throws BeansException 如果获取 Bean 对象时发生异常
     */
    Object getBean(String name) throws BeansException;

    /**
     * 根据指定名称和类型获取 Bean 对象。
     * @param name Bean 的名称
     * @param requiredType Bean 的类型
     * @return 返回指定名称和类型的 Bean 对象
     * @throws BeansException 如果获取 Bean 对象时发生异常
     */
    <T> T getBean(String name, Class<T> requiredType) throws BeansException;

    /**
     * 根据指定名称和参数列表获取 Bean 对象。
     * @param name Bean 的名称
     * @param args 参数列表
     * @return 返回指定名称和参数列表的 Bean 对象
     * @throws BeansException 如果获取 Bean 对象时发生异常
     */
    Object getBean(String name, Object... args) throws BeansException;

    /**
     * 根据指定类型获取 Bean 对象。
     * @param requiredType Bean 的类型
     * @return 返回指定类型的 Bean 对象
     * @throws BeansException 如果获取 Bean 对象时发生异常
     */
    <T> T getBean(Class<T> requiredType) throws BeansException;

    /**
     * 根据指定类型和参数列表获取 Bean 对象。
     * @param requiredType Bean 的类型
     * @param args 参数列表
     * @return 返回指定类型和参数列表的 Bean 对象
     * @throws BeansException 如果获取 Bean 对象时发生异常
     */
    <T> T getBean(Class<T> requiredType, Object... args) throws BeansException;

    // ... ...
}
```
如何理解上面的 `Object... args`？`Object... args` 表示一个可变参数列表。具体来说，它是一个对象数组，可以传入任意数量的参数。假设我们有一个名为 `MyService` 的类，它有一个带有两个参数的构造函数：
```java
@Service
public class MyService {
    private String name;
    private int age;

    public MyService(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```
然后我们可以使用 `Object... args` 来创建一个 `MyService` 实例：
```java
MyService myService = (MyService) context.getBean("myService", new Object[]{"John", 30});
```
在这个例子中，我们将两个参数 "John" 和 30 打包成一个数组传递给 `getBean` 方法。这个方法会将数组中的参数依次传递给 `MyService` 的构造函数，从而创建一个 `MyService` 实例。
> 注意：在使用可变参数列表时，我们需要确保传递给方法的参数类型与目标方法的参数类型匹配。否则，会抛出 `IncompatibleClassChangeError` 异常。

下面我们分别介绍每个 API 的使用示例。

1. 根据指定名称获取 Bean 对象（需要强制类型转换）
```java
MyComponent myComponent = (MyComponent) context.getBean("myComponent");
```

2. 根据指定名称和类型获取 Bean 对象（不需要强制类型转换）
```java
MyService myService = context.getBean("myService", MyService.class);
```

3. 根据指定类型获取 Bean 对象（不需要强制类型转换）
```java
MyService myService = context.getBean(MyService.class);
```
在实际应用中，推荐使用第 2 种方式（根据指定名称和类型获取 Bean 对象），因为这种方式代码简洁，易于理解。同时，通过类型参数可以确保返回的 Bean 对象是我们期望的类型，避免了强制类型转换可能导致的问题。同时我们也指定了 Bean 名称，从而确保获取到我们想要的 Bean。

## 3.Bean 概述

### 3.1 BeanDefinition

Spring 的 IoC（控制反转）容器是用来管理多个 Bean 的。想象这些 Bean 就像应用程序的组件，它们可以由你提供的配置信息来创建，比如使用 XML、Java 注解或 JavaConfig 的配置方式。
那这些 Bean 的配置信息是如何在容器内部表示的呢？它们是通过所谓的 `BeanDefinition` 对象来表示的。`BeanDefinition` 是一个接口，描述了一个 Bean 的配置信息。这意味着它包含关于 Bean 的所有必要详情，如它的类名、它的属性和它与其他 Bean 的关系等。

其中包含以下元数据：

- 包限定类名：通常，是正在定义的 Bean 的实际实现类而非接口。
- Bean 行为配置元素，它们声明了 Bean 在容器中的行为（例如作用域、生命周期回调等）。
- 对 Bean 完成其工作所需的其他 Bean 的引用，这些引用也称为协作者或依赖项。
- 在新创建的对象中设置的其他配置设置——例如，池的大小限制或管理连接池的 bean 中使用的连接数。

这些元数据转化为一组属性，构成了每个 Bean 定义。下表描述了这些属性：

| **属性** | **解释** |
| --- | --- |
| Class | 实例化 Bean |
| Name | 命名 Bean |
| Scope | Bean 作用域 |
| Constructor arguments | 依赖注入 |
| Properties | 依赖注入 |
| Autowiring mode | 自动装配协作者 |
| Lazy initialization mode | 延迟初始化 Bean |
| Initialization method | 初始化回调 |
| Destruction method | 销毁回调 |

### 3.2 DefaultListableBeanFactory
除了通过常规配置来定义 Bean，Spring 的 `ApplicationContext` 还允许你直接注册一个已经创建的对象（比如你手动创建的对象）。这可以通过 `ApplicationContext` 的内部组件 `BeanFactory` 来实现，具体地说，是通过它的一个默认实现：`DefaultListableBeanFactory`。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-12-144636.png)

你可以使用 `getBeanFactory()` 方法获取这个实现。在 `DefaultListableBeanFactory` 里，你可以使用 `registerSingleton(..)` 来注册一个已经创建的单例对象，或使用 `registerBeanDefinition(..)` 来注册一个新的 Bean 定义。但在实际应用中，大部分开发者还是选择使用常规的配置方式来定义 Bean。

假设你已经创建了一个 `User` 对象，并希望将其注册到 Spring 容器中：

```java
import org.springframework.beans.factory.support.DefaultListableBeanFactory;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public class RegisterBeanExample {

    public static void main(String[] args) {
        // 创建 ApplicationContext
        ApplicationContext context = new AnnotationConfigApplicationContext();

        // 获取 DefaultListableBeanFactory 实例
        DefaultListableBeanFactory beanFactory = (DefaultListableBeanFactory) context.getBeanFactory();

        // 手动创建一个 User 对象
        User user = new User("Tom", 25);

        // 将已经创建的 user 单例对象注册到容器中
        beanFactory.registerSingleton("myUser", user);

        // 获取并打印对象
        User retrievedUser = context.getBean("myUser", User.class);
        System.out.println(retrievedUser.getName());  // 输出: Tom

        // 关闭 ApplicationContext
        context.close();
    }

    public static class User {
        private String name;
        private int age;

        // 构造器、getter、setter 省略...
    }
}
```
> 注意：大多数应用程序只需要使用普通的 `BeanDefinition` 来定义 Bean。同时，为了确保容器能够正确处理这些 Bean 和依赖关系，你应该尽早地注册它们。虽然 Spring 提供了一定程度的支持来覆盖现有的元数据和实例，但在运行时尝试添加新的 Bean 并不被官方推荐，因为这可能导致各种问题。

最后我们再详细补充一下 `DefaultListableBeanFactory`：
`DefaultListableBeanFactory` 也是 Spring 中最常用的 `BeanFactory` 实现，它继承自 `AbstractAutowireCapableBeanFactory` 并实现了 `ConfigurableListableBeanFactory`、`BeanDefinitionRegistry` 等接口。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-12-144651.png)

它的主要特点和功能如下：

1. **BeanDefinition 的注册和管理**：`DefaultListableBeanFactory` 作为一个 `BeanDefinitionRegistry` 可以注册新的 `BeanDefinition`，并且可以管理查询已注册的 `BeanDefinition`。
2. **Bean 的生命周期管理**：它负责 Bean 的完整生命周期，从创建、初始化到销毁。
3. **支持多种资源描述符**：如 XML、Java 注解等。
4. **依赖查找**：它可以列出所有已注册的 Beans 和 Beans 的名称，这对于某些场景非常有用，如自动装配。
5. **提供 Singleton 和 Prototype 管理**：除了标准的单例和原型作用域外，还可以通过自定义 Scope 扩展更多的 Bean 作用域。
6. **允许注册外部创建的对象**：通过 `registerSingleton(..)` 和 `registerBeanDefinition(..)` 方法，开发者可以将对象或 Bean 的定义注册到容器中。

可见，`DefaultListableBeanFactory` 是 Spring IoC 容器的心脏。当你使用 Spring 来配置和管理 Bean 时，实际上是与这个 `BeanFactory` 的实例交互。它维护了 Bean 的定义、依赖解析、生命周期管理等所有关键操作。
如上一次提供的代码示例所示，`DefaultListableBeanFactory` 允许我们注册已经创建的对象。此外，如果你想定义一个新的 Bean（而不是直接注册一个已经创建的对象），你可以这样做：
```java
// 创建一个 DefaultListableBeanFactory 对象，这是 Spring 框架中用于管理 bean 的核心类
DefaultListableBeanFactory factory = new DefaultListableBeanFactory();

// 创建一个 RootBeanDefinition 对象，表示一个 bean 的定义。这里定义的 bean 的类型是 User
RootBeanDefinition beanDefinition = new RootBeanDefinition(User.class);

// 为 bean 的属性设置值，这里设置了"name"和"age"两个属性的值
beanDefinition.getPropertyValues().add("name", "Tom");
beanDefinition.getPropertyValues().add("age", 25);

// 将 bean 的定义注册到工厂中，这样 Spring 框架就可以在需要的时候创建这个 bean 了
factory.registerBeanDefinition("myUser", beanDefinition);

// 从工厂中获取刚刚注册的 bean，类型是 User
User user = factory.getBean("myUser", User.class);

// 打印出 bean 的 "name" 属性的值
System.out.println(user.getName());
```
在上述代码中，我们首先创建了一个 `DefaultListableBeanFactory` 实例。接着，我们定义了一个新的 `RootBeanDefinition` 来描述我们想要的 User Bean，并设置了其属性。然后，我们将这个 `BeanDefinition` 注册到 `BeanFactory`。最后，我们从 `BeanFactory` 获取并使用了这个 Bean。
### 3.3 命名 Beans
每个 Bean 都有一个或多个唯一标识符。在同一个容器中，这些标识符必须是唯一的。通常情况下，一个 Bean 只有一个标识符。但如果需要多个，额外的标识符可以被视为别名。

在基于 Java 的配置中，Bean 的名字通常来自于类名的首字母小写形式或通过 `@Component`、`@Service`、`@Repository` 和 `@Controller` 注解的 `value` 属性来定义。例如：

```java
@Service("myService")	// Bean 的名字为 "myService"
public class MyServiceImpl implements MyService {
    //...
}
```
如果你没有为 Bean 明确提供一个名字或标识符，Spring 容器会为这个 Bean 自动生成一个唯一的名字。但如果你希望通过名字引用该 Bean，你必须提供一个名字。通常情况下，没有提供名字的情境与内部 Beans 和自动装配相关。
:::info
**Spring 官方建议的 Bean 命名规范：**

按照约定，Bean 的命名遵循 Java 的实例字段命名规范。即，Bean 名称以小写字母开头，接下来是驼峰式命名。例如：accountManager、accountService、userDao、loginController 等。
一致的命名使得配置更易于阅读和理解。此外，如果你使用 Spring AOP，命名的一致性会在为一组名字相关的 Beans 应用建议时更加有帮助。
:::

> 注意：
> 在类路径中进行组件扫描时，Spring 为未命名的组件生成 Bean 名称，遵循之前描述的规则：基本上，取类的简单名称并将其首字母转为小写。但在特殊情况下，如果有多个字符并且第一个和第二个字符都是大写，则原始大小写保持不变。这些规则与 `java.beans.Introspector.decapitalize` 定义的规则相同（Spring 在这里使用这个方法）。


---

**为 Bean 设置别名：**

在 Spring 中，我们可以为一个 Bean 设置多个名称，这些名字等同于该 Bean 的别名。这种功能在一些场景中很有用，例如，当应用程序的每个组件都需要使用特定于自己的 Bean 名称来引用一个公共的依赖时。
尽管在 Bean 的定义中可以为其指定多个名称，但有时我们可能希望为在其他地方定义的 Bean 引入一个别名。这在大型系统中是常见的，其中配置被分割到每个子系统中，每个子系统都有自己的对象定义集。
使用 Java 配置时，可以使用 `@Bean` 注解的 `name` 属性为 Bean 提供多个别名：

```java
@Configuration
public class AppConfig {

    @Bean(name = {"myAppDataSource", "subsystemADataSource", "subsystemBDataSource"})
    public DataSource dataSource() {
        // 实例化、配置并返回数据源
        return new DataSource();
    }
}
```
在这个示例中，`dataSource` Bean 有三个名称或别名：`myAppDataSource`、`subsystemADataSource` 和 `subsystemBDataSource`。无论是哪个名称，都可以用来引用相同的 `dataSource` Bean。
这样，每个组件以及主应用程序都可以通过对它们唯一且不会与任何其他定义冲突的名称（有效地创建一个命名空间）来引用 `dataSource`，但它们引用的都是相同的 Bean。
### 3.4 实例化 Beans
在 Spring 中，Bean 定义本质上是创建一个或多个对象的 “食谱” 或 “指南”。当请求一个命名的 Bean 时，容器会查看该 Bean 的 “食谱”，并使用该 Bean 定义封装的配置元数据来创建（或获取）实际的对象。

使用 JavaConfig，您可以使用 `@Bean` 注解来定义一个 Bean。此注解通常与 `@Configuration` 注解一起使用，后者标记一个类作为 Bean 定义的源。

1. **直接构造 Bean：**通常会返回一个新实例，这类似于使用 Java 中的 new 运算符。
```java
@Configuration
public class AppConfig {

    @Bean
    public SomeClass someClass() {
        return new SomeClass();
    }
}
```

2. **使用静态工厂方法：**在某些情况下，您可能想使用类的静态工厂方法来创建 Bean，而不是直接构造它。
```java
// 工厂类
public class SomeClassFactory {
    // 定义一个静态工厂方法，用于创建 SomeClass 对象并返回
    public static SomeClass createInstance() {
        return new SomeClass();
    }
}

@Configuration	// 标记该类作为 Bean 定义的源
public class AppConfig {
    
    // 使用 @Bean 注解标记 someClass 方法，表示该方法将返回一个 SomeClass 类型的 Bean 对象
    @Bean
    public SomeClass someClass() {
        // 调用 SomeClassFactory 类的 createInstance 静态工厂方法创建 SomeClass 对象并返回
        return SomeClassFactory.createInstance();
    }
}
```
:::info
**嵌套类的命名：**

对于 Java，一个外部类可以有嵌套类（或内部类）。当您想为嵌套类配置 Bean 定义时，类的命名方式略有不同。假设您有一个名为 `SomeThing` 的类在 `com.example` 包中，这个 `SomeThing` 类有一个静态嵌套类叫做 `OtherThing`。当您在 Java 中引用这个嵌套类时，您应该使用 `$` 或 `.` 符号分隔。
:::

对应示例代码如下：

```java
public class SomeThing {

    // 静态嵌套类
    public static class OtherThing {
        // class details
    }
}

@Configuration
public class AppConfig {

    @Bean
    public SomeThing.OtherThing otherThing() {
        return new SomeThing.OtherThing();
    }
}
```
#### 3.4.1 使用构造函数实例化
在 Spring 中，当你想要创建一个 Bean，你可以使用它的构造函数来做。这意味着你不需要让你的类满足任何特定的接口或编码风格；几乎所有的普通 Java 类都可以与 Spring 兼容。

实际上，为了让 Spring 能够成功地创建和管理 Bean，你可能需要确保该类具有一个默认（即无参数）的构造函数。虽然许多 JavaBeans 标准推荐这样做，但 Spring 完全可以管理非标准的 JavaBeans。这意味着，即使你的类不完全遵循 JavaBeans 规范（例如，它可能没有无参构造函数或 getter/setter 方法），Spring 仍然可以处理。例如，如果你在遗留系统中有一个连接池，它并不完全遵循 JavaBeans 规范，Spring 依然可以管理它。

在基于 Java 注解和 JavaConfig 的配置方式中，你可以这样定义你的 Bean：

```java
@Configuration
public class AppConfig {

    @Bean
    public ExampleBean exampleBean() {
        return new ExampleBean();
    }

    @Bean
    public ExampleBeanTwo anotherExample() {
        return new ExampleBeanTwo();
    }
}
```
对于这段代码中的 `ExampleBean` 和 `ExampleBeanTwo` Bean，Spring 默认采用构造方法进行创建。因为使用了 `@Bean` 注解标记了 `exampleBean()` 和 `anotherExample()` 方法，Spring 会调用这些方法来创建对应的 Bean 实例，并添加到 Spring 容器中。

在调用 `exampleBean()` 方法时，Spring 会通过反射机制创建一个 `ExampleBean` 类的实例，并将该实例作为 Bean 注册到容器中。同样地，在调用 `anotherExample(`) 方法时，Spring 也会通过反射机制创建一个 `ExampleBeanTwo` 类的实例，并将该实例作为 Bean 注册到容器中。

:::info
**请为 Bean 提供无参构造：**

需要注意的是，如果 `ExampleBean` 和 `ExampleBeanTwo` 类没有无参构造方法，或者构造方法不可访问（例如被声明为 `private`），那么 Spring 将无法通过反射机制创建这些类的实例，从而导致无法注册到容器中。在这种情况下，我们需要使用其他方式来创建这些类的实例，比如通过工厂方法、静态工厂方法或者属性注入等方式。

:::

> TIP：关于如何向构造函数提供参数（如果需要）以及如何在对象被构造后设置对象实例属性，在 “依赖注入” 部分会进行详细说明和示例。

#### 3.4.2 使用静态工厂方法实例化
在 Spring 中，除了使用构造函数实例化 Bean，还可以使用所谓的 “静态工厂方法” 来实例化。这种方法允许你在 Spring 配置中引用一个返回实例对象的静态方法，而这个方法会作为工厂来生成 Bean 的实例。

为了在基于 Java 的配置中实现这种方式，你可以直接在 `@Bean` 注解的方法中调用这个静态工厂方法：

```java
@Configuration
public class AppConfig {

    @Bean
    public ClientService clientService() {
        return ClientService.createInstance();
    }
}
```
上述代码中，`ClientService` 类的实例是通过调用静态工厂方法 `createInstance` 获得的。
对应的 `ClientService` 类如下：
```java
public class ClientService {
    private static ClientService clientService = new ClientService();
    
    // 构造函数是私有的，意味着外部不能直接通过 new 来创建实例
    private ClientService() {}

    // 静态工厂方法，用于返回 ClientService 的实例
    public static ClientService createInstance() {
        return clientService;
    }
}
```
在这个例子中，`ClientService` 的构造方法是私有的，这就意味着你不能在类的外部直接实例化它。而 `createInstance` 是一个静态方法，它返回一个 `ClientService` 的实例，这样 Spring 可以使用它作为工厂来获得 Bean 的实例。（单例模式下的解决方案）
#### 3.4.3 使用实例工厂方法实例化
实例工厂方法实例化与静态工厂方法类似，但不同之处在于它调用的是一个已存在的 Bean 的非静态方法来创建新的 Bean。这意味着，有一个单独的 Bean（我们称之为 “工厂 Bean”）在容器中，它的任务是产生其他 Bean。

要使用这种机制，在基于 Java 的配置中，你将定义一个方法返回 Bean，并在这个方法中调用工厂 Bean 的工厂方法：

```java
// 配置类
@Configuration
public class AppConfig {

    // 创建实例工厂 Bean
    @Bean
    public DefaultServiceLocator serviceLocator() {
        return new DefaultServiceLocator();
    }

    // 创建并返回一个客户端服务实例
    @Bean
    public ClientService clientService() {
        // 调用 DefaultServiceLocator Bean 的实例方法
        return serviceLocator().createClientServiceInstance();
    }

    // 创建并返回一个账户服务实例
    @Bean
    public AccountService accountService() {
        // 调用 DefaultServiceLocator Bean 的实例方法
        return serviceLocator().createAccountServiceInstance();
    }
}

// 实例工厂类，用于创建和管理各种服务实例
public class DefaultServiceLocator {
    
    // 创建并初始化客户端服务实例
    private static ClientService clientService = new ClientServiceImpl();
    
    // 创建并初始化账户服务实例
    private static AccountService accountService = new AccountServiceImpl();

    // 实例工厂方法：创建并返回客户端服务实例的方法
    public ClientService createClientServiceInstance() {
        return clientService;
    }

    // 实例工厂方法：创建并返回账户服务实例的方法
    public AccountService createAccountServiceInstance() {
        return accountService;
    }
}
```
在上面的例子中，`DefaultServiceLocator` 是工厂 Bean。它有两个工厂方法：`createClientServiceInstance` 和 `createAccountServiceInstance`，分别用来产生 `ClientService` 和 `AccountService` 的实例。
在 `AppConfig` 配置类中，我们定义了 `clientService` 和 `accountService` 的 `@Bean` 方法，这两个方法分别调用了 `serviceLocator` 的两个工厂方法来产生新的 Bean 实例。
> 注意：
> 1. 工厂 Bean 可以通过依赖注入 (DI) 进行管理和配置。这意味着工厂 Bean 本身也可以从其他 Bean 中接收依赖。
> 2. 在 Spring 文档中，“factory bean”是指配置在 Spring 容器中并通过实例或静态工厂方法创建对象的 Bean。而 `FactoryBean`（注意大小写）是指一个特定的 Spring FactoryBean 实现类。

#### 3.4.4 确定 Bean 的运行时类型
在 Spring 框架中，某个特定 Bean 的运行时类型并不总是一目了然的。即使我们在配置中定义了某个 Bean 的类，实际运行时的类型可能与此不同。原因有很多：

1. 如果使用了工厂方法创建 Bean，那么该方法返回的实际类型可能与原始定义的类型不同。
2. 如果使用了 `FactoryBean`，则实际创建的 Bean 类型可能是 `FactoryBean` 的 `getObject` 方法的返回类型。
3. 当我们在 Bean 上使用了 AOP（面向切面编程）功能，Spring 可能会为 Bean 创建一个代理，这个代理在运行时的类型可能与原始 Bean 的类型不同，尤其是当代理基于接口而不是基于类时。

因此，为了准确得知某个 Bean 的实际运行时类型，我们不能仅仅依赖于配置中声明的类信息。

:::info
**获取 Bean 类型推荐的方法：**

使用 `BeanFactory` 的 `getType` 方法查询 Bean 的名字。这个方法会考虑上面提到的所有情况，并返回与 `BeanFactory.getBean` 方法为同一 Bean 名称返回的对象的实际类型。
:::

下面是一个示例：

```java
import org.springframework.beans.factory.BeanFactory;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public MyBean myBean() {
        return new MyBean();
    }

    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext(AppConfig.class);
        BeanFactory beanFactory = context.getBeanFactory();

        // 获取 Bean 的运行时类型
        Class<?> beanType = beanFactory.getType("myBean");
        System.out.println("Runtime type of 'myBean': " + beanType.getName());

        context.close();
    }

    static class MyBean {}
}
```
在这个示例中，我们定义了一个简单的 `MyBean` 类型的 Bean。我们使用 `BeanFactory.getType` 方法确定其运行时的类型，并将其打印出来。
## 4.依赖关系
在企业应用中，一个应用往往不仅仅是由单一对象（或在 Spring 中称为 “bean”）构成的。即使是最简单的应用，也包含多个对象，它们协同工作，为终端用户呈现一个完整的应用。该部分我们将解释如何将独立的 bean 定义组合到一起，使它们共同协作，完成特定目标。
### 4.1 依赖注入
依赖注入（DI）是一种过程，其中对象仅通过构造函数参数、工厂方法参数或在对象实例被构造或从工厂方法返回后设置的属性（Setter）来定义其依赖关系（即，它们与哪些其他对象合作）。当容器创建 bean 时，它会注入这些依赖关系。这个过程基本上是反向的，因为这里是容器来控制，而不是 bean 自身通过直接构建类或使用 Service Locator 模式来控制其依赖的实例化或定位。（这也是 “控制反转” 一词的由来）
采用 DI 原则，代码变得更简洁，当对象与其依赖关系分离时，解耦效果更明显。对象不再自己查找其依赖，也不再知道依赖的位置或类。因此，特别是当依赖关系基于接口或抽象基类时，您的类变得更容易测试，这允许在单元测试中使用桩或模拟实现。

DI 主要存在两种形式：基于构造函数的依赖注入和基于 setter 的依赖注入。

#### 4.1.1 基于构造函数的依赖注入
当我们谈论基于构造函数的依赖注入时，我们指的是容器通过调用构造函数并传递一些参数（代表不同的依赖项）来实现这一点。

以下是一个简单示例，该类只能通过构造函数注入来注入依赖：

```java
@Component
public class SimpleMovieLister {

    // SimpleMovieLister 对 MovieFinder 有一个依赖
    private final MovieFinder movieFinder;

    // 一个构造函数，以便 Spring 容器可以注入一个 MovieFinder
    @Autowired
    public SimpleMovieLister(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // 实际使用注入的 MovieFinder 的业务逻辑被省略...
}
```
> 注意，这个类没有任何特别之处。它是一个 POJO，并且没有对容器特定的接口、基类或注解的依赖。

:::info
**构造函数参数解析**

当 Spring 容器尝试为 bean 的构造函数注入依赖时，它会根据参数的类型来匹配合适的 bean。如果 bean 的构造函数参数没有任何潜在的歧义，那么定义参数的顺序就是在实例化 bean 时提供给构造函数的参数的顺序。
:::

考虑以下类：

```java
package x.y;

@Component
public class ThingOne {

    @Autowired
    public ThingOne(ThingTwo thingTwo, ThingThree thingThree) {
        //...
    }
}
```
如果 `ThingTwo` 和 `ThingThree` 类在继承关系上没有任何联系，那么就不会存在潜在的歧义，Spring 容器就可以很容易地匹配并注入这两个依赖。

对于简单类型，如整数或字符串，Spring 需要额外的帮助来确定类型，因为它无法自己推断出值的类型。例如：

```java
package examples;

@Component
public class ExampleBean {

    private final int years;
    private final String ultimateAnswer;

    @Autowired
    public ExampleBean(@Value("7500000") int years, @Value("42") String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}
```
在上述情况下，我们使用 `@Value` 注解来为构造函数的参数提供值。

:::info
**构造函数参数类型匹配**

在 Spring 中，当容器尝试注入一个 bean 的构造函数参数时，它会尝试根据参数的类型进行匹配。在基于注解和 JavaConfig 的配置中，你不需要显式地指定参数的类型，因为这是由 Java 代码自身决定的。但在某些情况下，你可能需要提供额外的信息或值。
:::

考虑以下类：

```java
package examples;

import org.springframework.stereotype.Component;

@Component
public class ExampleBean {

    private final int years;
    private final String ultimateAnswer;

    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}
```
为了使用基于 Java 的配置来配置这个 bean，你可以如下操作：
```java
package examples;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    @Bean
    public ExampleBean exampleBean() {
        return new ExampleBean(7500000, "42");
    }
}
```
在上面的 `AppConfig` 类中，我们定义了一个方法 `exampleBean()`，该方法返回 `ExampleBean` 的实例，并使用两个参数：一个整数和一个字符串。这就是如何在基于 Java 的配置中显式地提供构造函数参数的值。
> 注意：如果在容器中存在多个相同类型的 bean，那么 Spring 可能无法确定应该注入哪一个 bean。在这种情况下，你需要使用 `@Qualifier` 注解指定具体的 Bean 名称来消除这种歧义。

在 Spring 中，当你有一个多参数构造函数，并且希望确保参数的注入顺序时，你可以使用参数的索引或名称来明确指定。在基于 JavaConfig 和注解的配置中，这种情况是由 Java 自身的类型系统和参数名称决定的。但是，有时你可能需要提供额外的信息，以确保参数的注入顺序或消除歧义。

在 Java 中，参数的顺序是由其在构造函数或方法中的位置决定的。因此，当你创建一个对象实例并传递参数时，你必须确保参数的顺序与构造函数的参数顺序匹配。

```java
package examples;

public class ExampleBean {
    private final int years;
    private final String ultimateAnswer;

    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}

// JavaConfig 配置
@Configuration
public class AppConfig {
    @Bean
    public ExampleBean exampleBean() {
        return new ExampleBean(7500000, "42");
    }
}
```
在大多数情况下，你不需要指定参数名称，因为 Java 编译器默认会保存参数名称（如果在编译时使用了`-parameters` 选项）。Spring 可以使用这些参数名称来正确地注入值。

但是，为了确保没有歧义，或者如果你的代码没有使用 `-parameters` 选项进行编译，你可以使用 `@ConstructorProperties` 注解来显式地提供参数名称。

```java
package examples;

import java.beans.ConstructorProperties;

public class ExampleBean {
    private final int years;
    private final String ultimateAnswer;

    @ConstructorProperties({"years", "ultimateAnswer"})
    public ExampleBean(int years, String ultimateAnswer) {
        this.years = years;
        this.ultimateAnswer = ultimateAnswer;
    }
}
```
在上面的代码中，`@ConstructorProperties` 注解确保了 Spring 容器知道每个参数的名称，从而可以正确地注入相应的值。这是非常有用的，特别是当你有多个同类型的参数并希望避免任何注入歧义时。
#### 4.1.2 基于 Setter 的依赖注入
这种注入方式是通过在实例化 bean 后，调用 bean 上的 setter 方法来完成依赖注入的。下面是一个简单的示例，它只能通过纯 setter 注入来进行依赖注入：
```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    // 通过 setter 方法来允许 Spring 容器注入一个 MovieFinder
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // 实际使用注入的 MovieFinder 的业务逻辑被省略...
}
```
使用 `@Autowired` 注解，你可以通知 Spring 自动注入相关的依赖项：
```java
@Autowired
public void setMovieFinder(MovieFinder movieFinder) {
    this.movieFinder = movieFinder;
}
```
:::info
**构造函数注入还是基于 Setter 的注入？**

你可以在 Spring 中混合使用构造函数注入和基于 Setter 的注入。一个经验法则是：对于必须的依赖项，使用构造函数；对于可选的依赖项，使用 setter 方法或配置方法。

- **构造函数注入**：Spring 团队通常建议使用构造函数注入，因为这样你可以将应用组件实现为不可变（final）对象，并确保必需的依赖项不为 null。此外，通过构造函数注入的组件始终在完全初始化的状态下返回给客户端代码。但是，需要注意的是，大量的构造函数参数可能意味着代码的设计可能存在问题，可能需要重新考虑职责的划分，因为很可以已经违背了单一职责原则。
- **基于 Setter 的注入**：这种注入应主要用于可以在类内部分配合理默认值的可选依赖项。另一个优点是，setter 方法使该类的对象可以在之后重新配置或重新注入。因此，通过 JMX MBeans 进行管理是 setter 注入的一个有力的应用场景。

总的来说，你应该根据特定类的需求选择最合适的 DI 风格。有时，当你处理没有源代码的第三方类时，选择可能已经为你做好了。例如，如果第三方类没有公开任何 setter 方法，那么构造函数注入可能是唯一可用的 DI 形式。
:::
#### 4.1.3 依赖解析过程
在 Spring 容器中，当我们创建和初始化 `ApplicationContext`，容器会按以下步骤执行 bean 的依赖解析：

1. **初始化**：首先，我们创建并初始化 `ApplicationContext`，它会加载描述所有 bean 的配置元数据。这些配置元数据可以通过 Java 代码、注解或早期的 XML 形式来指定。
2. **依赖表达**：对于每一个 bean，它的依赖项会以属性、构造函数参数或静态工厂方法的参数形式来表示。当实际创建 bean 时，这些依赖项会被提供给 bean。
3. **定义与引用**：每个属性或构造函数参数可以是设定的值，也可以是容器中另一个 bean 的引用（即依赖）。
4. **类型转换**：所有指定为值的属性或构造函数参数从其给定格式转换为该属性或参数的实际类型。例如，Spring 默认可以将字符串格式的值转换为所有内置类型，如 int、long、String 等。
5. **验证与创建**：当容器被创建时，Spring 容器会验证每个 bean 的配置。但实际的属性值会在 bean 实际创建时才被设定。默认情况下，单例作用域的 bean 在容器创建时就会被实例化。否则，bean 仅在请求时被创建。
#### 4.1.4 循环依赖问题
在 Spring 中，当你大量使用构造器注入，有可能会遭遇到循环依赖的问题，这意味着两个或多个 bean 互相依赖，形成一个闭环。

考虑两个类，A 和 B。如果 A 通过构造器注入需要 B 的实例，并且 B 同样通过构造器注入需要 A 的实例，那么当这两个类被注入到彼此时，Spring IoC 容器会在运行时检测到这种循环引用，并抛出一个 `BeanCurrentlyInCreationException`。

```java
@Component
public class ClassA {
    private final ClassB classB;

    @Autowired
    public ClassA(ClassB classB) {
        this.classB = classB;
    }
}

@Component
public class ClassB {
    private final ClassA classA;

    @Autowired
    public ClassB(ClassA classA) {
        this.classA = classA;
    }
}
```
:::info
解决办法：为了解决这种问题，你可以更改某些类，使其通过 setter 方法而不是构造器来进行配置。这意味着，尽管不太推荐这种方式，但你可以使用 setter 注入来配置循环依赖。
:::

下面是使用 Setter 注入来避免循环依赖的示例：

```java
@Component
public class ClassA {
    private ClassB classB;

    @Autowired
    public void setClassB(ClassB classB) {
        this.classB = classB;
    }
}

@Component
public class ClassB {
    private ClassA classA;

    @Autowired
    public void setClassA(ClassA classA) {
        this.classA = classA;
    }
}
```
:::info
**Spring 的处理机制**

你通常可以信任 Spring 会做正确的事情。它在容器加载时检测配置问题，比如不存在的 bean 引用和循环依赖。Spring 会在 bean 实际被创建时尽可能晚地设置属性和解析依赖。这意味着，一个正确加载的 Spring 容器在你后续请求一个对象时可能会产生异常，例如，由于缺失或无效的属性，bean 抛出一个异常。
为了提前发现这些配置问题，`ApplicationContext` 默认会预先实例化单例 bean。但是，你仍然可以覆盖这个默认行为，使得单例 bean 按需进行懒加载，而不是预先实例化。
如果不存在循环依赖，当一个或多个合作的 bean 被注入到一个依赖的 bean 中时，每个合作的 bean 在被注入到依赖的 bean 之前都会被完全配置。这意味着，如果 bean A 依赖于 bean B，那么在调用 bean A 的 setter 方法之前，Spring IoC 容器会完全配置 bean B。
:::

#### 4.1.5 依赖注入示例
依赖注入 (Dependency Injection) 是 Spring 框架的核心功能，它允许我们将一个对象的依赖（即其他对象）注入到该对象中，无需手动创建或查找这些依赖。我们可以通过构造器注入或者 setter 方法注入来实现这一点。
下面提供一些 Spring 官方的依赖注入示例。

1. **Setter 注入**

通过 setter 方法注入，我们可以在 bean 被创建后设置其属性。首先，让我们看看 Java 类的定义：
```java
@Component
public class ExampleBean {

    private AnotherBean beanOne;
    private YetAnotherBean beanTwo;
    private int i;

    @Autowired
    public void setBeanOne(AnotherBean beanOne) {
        this.beanOne = beanOne;
    }

    @Autowired
    public void setBeanTwo(YetAnotherBean beanTwo) {
        this.beanTwo = beanTwo;
    }

    public void setIntegerProperty(int i) {
        this.i = i;
    }
}
```
在这里，我们使用 `@Autowired` 注解来标记需要 Spring 容器自动注入的 setter 方法。在 bean 实例化后，Spring 会自动查找与方法参数类型匹配的 bean 并注入它们。

2. **构造器注入**

另一种注入方式是通过构造器注入，这样我们可以在 bean 创建时注入依赖项：
```java
@Component
public class ExampleBean {

    private AnotherBean beanOne;
    private YetAnotherBean beanTwo;
    private int i;

    @Autowired
    public ExampleBean(AnotherBean beanOne, YetAnotherBean beanTwo, @Value("1") int i) {
        this.beanOne = beanOne;
        this.beanTwo = beanTwo;
        this.i = i;
    }
}
```
在这种情况下，当 Spring 创建 `ExampleBean` 的实例时，它会查找合适的 bean 来满足构造器的参数，并自动注入它们。

3. **静态工厂方法**

我们还可以告诉 Spring 使用一个静态工厂方法来创建 bean 的实例，而不是直接调用构造器。在这种情况下，工厂方法的参数会被视为需要注入的依赖。
```java
@Component
public class ExampleBean {

    private AnotherBean beanOne;
    private YetAnotherBean beanTwo;
    private int i;

    private ExampleBean(AnotherBean beanOne, YetAnotherBean beanTwo, int i) {
        this.beanOne = beanOne;
        this.beanTwo = beanTwo;
        this.i = i;
    }

    @Bean
    public static ExampleBean createInstance(
        AnotherBean anotherBean, YetAnotherBean yetAnotherBean, @Value("1") int i) {

        return new ExampleBean(anotherBean, yetAnotherBean, i);
    }
}
```
在上述例子中，`@Bean` 注解告诉 Spring 使用 `createInstance` 静态方法来创建 `ExampleBean` 的实例，并注入需要的依赖。
### 4.2 依赖关系与配置细节
### 4.3 使用 @DependsOn
在 Spring 中，通常当一个 bean 依赖于另一个 bean 时，意味着一个 bean 作为属性被设置在另一个 bean 中。这通常通过注入来实现。但是，有时候 beans 之间的依赖关系并不那么直接。例如，当需要触发类中的静态初始化器时，如数据库驱动注册。为了解决这样的问题，Spring 提供了 `@DependsOn` 注解，它可以明确地强制在初始化当前 bean 之前初始化一个或多个其他 beans。

下面是一个示例，表达了一个 bean 对另一个 bean 的依赖关系：

```java
@Configuration
public class AppConfig {

    @Bean
    public ManagerBean manager() {
        return new ManagerBean();
    }

    @Bean
    @DependsOn("manager")	// 该 Bean 初始化前先初始化 ManagerBean
    public ExampleBean beanOne() {
        // 依赖于 ManagerBean
        return new ExampleBean(manager());
    }
}
```
在这里，`@DependsOn("manager")` 说明在初始化 `beanOne` 之前必须先初始化 `manager`。
要表达对多个 beans 的依赖，您可以在 `@DependsOn` 注解中提供一个 bean 名称列表：
```java
@Configuration
public class AppConfig {

    @Bean
    public ManagerBean manager() {
        return new ManagerBean();
    }

    @Bean
    public JdbcAccountDao accountDao() {
        return new JdbcAccountDao();
    }

    @Bean
    @DependsOn({"manager", "accountDao"})
    public ExampleBean beanOne() {
        return new ExampleBean(manager());
    }
}
```
`@DependsOn` 注解不仅可以指定初始化时的依赖，而且在单例 beans 的情况下，还可以指定相应的销毁时依赖。定义了 `depends-on` 关系的依赖 beans 会在给定的 bean 销毁之前先被销毁。因此，`@DependsOn` 也可以控制关闭顺序。
### 4.4 延迟初始化 Bean
默认情况下，`ApplicationContext` 的实现会在初始化过程中急切地创建和配置所有单例 bean。通常，这种预实例化是可取的，因为配置或周围环境中的错误会立即被发现，而不是几小时或甚至几天后。但是，当这种行为不受欢迎时，您可以通过将 bean 定义标记为延迟初始化来防止单例 bean 的预实例化。延迟初始化的 bean 告诉 IoC 容器在首次请求时创建 bean 实例，而不是在启动时。

在 JavaConfig 中，你可以使用 `@Lazy` 注解来控制此行为。例如：

```java
@Configuration
public class AppConfig {

    @Lazy
    @Bean
    public ExpensiveToCreateBean lazy() {
        return new ExpensiveToCreateBean();
    }

    @Bean
    public AnotherBean notLazy() {
        return new AnotherBean();
    }
}
```
当上述配置被一个 `ApplicationContext` 消费时，`lazy` bean 不会在 `ApplicationContext` 启动时急切地预实例化，而 `notLazy` bean 则会急切地预实例化。

然而，当一个延迟初始化的 bean 是一个非延迟初始化的单例 bean 的依赖项时，`ApplicationContext` 会在启动时创建延迟初始化的 bean，因为它必须满足单例的依赖关系。这个延迟初始化的 bean 会被注入到其他地方的一个非延迟初始化的单例 bean 中。

你还可以在容器级别控制延迟初始化，只需在主配置类上使用 `@Lazy` 注解：

```java
@Lazy
@Configuration
public class AppConfig {
    // 在此配置类中定义的bean都不会被预实例化
}
```
通过这种方式，容器中的所有 beans 都不会被预实例化。
### 4.5 自动注入
在 Spring 中，可以自动注入 bean 之间的协作关系。这意味着，Spring 可以自动地为你的 bean 找到并注入它所需要的其他 bean，只需根据 `ApplicationContext` 的内容进行检查。
自动注入有以下优势：

- 它可以大大减少指定属性或构造函数参数的需要。
- 当你的对象发展时，自动注入可以更新配置。例如，如果你需要为一个类添加一个依赖，该依赖可以自动满足，而无需你修改配置。

Spring 的自动注入主要是通过 `@Autowired` 注解来实现的。这个注解可以放在不同的位置，从而影响注入的方式。
#### 4.5.1 自动注入方式
##### No Autowiring：(默认) 明确指定引用
这是默认模式，不进行任何自动注入。你必须明确指定 bean 之间的引用。
```java
@Bean
public SomeBean someBean(AnotherBean anotherBean) {
    return new SomeBean(anotherBean);
}
```
##### byName：@Autowired 作用于 Setter 方法
当你在某个 setter 方法上使用 `@Autowired`，Spring 会调用那个 setter 方法来注入依赖。Spring 会尝试查找与需要注入的属性同名的 bean，并将其注入。如果你有一个属性名为 `master`，那么 Spring 会查找一个名为 `master` 的 bean 并注入它。
```java
public class SomeClass {
    private MasterBean master;

    @Autowired
    public void setMaster(MasterBean master) {
        this.master = master;
    }
}
```
不仅仅是 setter 方法，你实际上可以在任何方法上使用 `@Autowired`。当你这样做时，Spring 会在创建类的实例时调用该方法，方法的参数会被自动注入。
```java
private SomeService someService;
private AnotherService anotherService;

@Autowired
public void configure(SomeService someService, AnotherService anotherService) {
    this.someService = someService;
    this.anotherService = anotherService;
}
```
##### byType：@Autowired 作用于字段
当你在类的字段（成员变量）上使用 `@Autowired`，Spring 会在创建那个类的实例时自动为那个字段注入对应类型的 bean。如果容器中存在唯一一个与属性类型匹配的 bean，Spring 就会自动注入。
```java
public class SomeClass {
    
    @Autowired
    private MasterBean master;
}
```
如果 Spring 容器中存在多个相同类型的 Bean，会产生冲突。为了解决这个问题，可以使用 `@Qualifier` 注解来指明需要注入哪一个具体的 Bean。
假设你有两个相同类型的 Bean：
```java
@Configuration
public class AppConfig {

    @Bean
    public Engine petrolEngine() {
        return new PetrolEngine();
    }

    @Bean
    public Engine dieselEngine() {
        return new DieselEngine();
    }
}
```
在上面的例子中，有两个类型为 `Engine` 的 Beans：`petrolEngine` 和 `dieselEngine`。如果我们想为一个属性自动注入一个具体的 `Engine` Bean，可以使用 `@Qualifier`：
```java
@Component
public class Car {

    private Engine engine;

    @Autowired
    public Car(@Qualifier("petrolEngine") Engine engine) {
        this.engine = engine;
    }
}
```
在这个例子中，`@Qualifier("petrolEngine")` 告诉 Spring 容器，我们想为 Car 类的 engine 属性注入 `petrolEngine` Bean，而不是 `dieselEngine`。
##### constructor：@Autowired 作用于构造方法
当你在构造函数上使用 `@Autowired`，Spring 会在创建类的实例时通过该构造函数注入依赖。类似于 byType，但适用于构造函数参数而已。如果容器中不只有一个与构造函数参数类型匹配的 bean，就会抛出错误。
> TIP：如果只有一个构造函数，从 Spring 4.3 开始，可以省略 `@Autowired`，Spring 默认会尝试使用那个构造函数进行注入。

```java
public class SomeClass {
    private MasterBean master;

    @Autowired
    public SomeClass(MasterBean master) {
        this.master = master;
    }
}
```
> TIP：
> 1. 当使用 byType 或 constructor 自动注入模式时，你可以为数组和类型化集合进行自动注入。在这种情况下，容器中所有与预期类型匹配的自动注入候选者都会被用来满足依赖关系。
> 2. 你还可以自动注入强类型的 Map 实例，如果预期的键类型为 String。一个自动注入的 Map 实例的值包括所有与预期类型匹配的 bean 实例，而 Map 实例的键包含相应的 bean 名称。

自动注入方式总结如下：

| Mode        | Explanation                                                  |
| ----------- | ------------------------------------------------------------ |
| no（默认）  | ●不进行自动注入。 ●Bean 间的引用必须明确指定。               |
| byName      | ●根据属性名称自动注入。 ●Spring 会查找与属性名相同的 bean 并注入。 |
| byType      | ●根据属性的类型自动注入。 ●如果容器中存在一个与属性类型相匹配的 bean，Spring 会自动注入。 ●如果有多个相同类型的 bean，则会产生冲突。 |
| constructor | ●类似于 byType，但适用于构造函数参数。 ●依赖于构造函数的参数类型来注入 bean。 |

除了上述方式，你还可以结合其他注解如  `@Resource` 进行注入。它同样可以作用于字段、方法和构造器（从 Java EE 7 开始，`@Resource` 支持构造函数注入，但这在 Spring 中可能并不是特别常见）。
`@Resource` 默认是按名称查找，这意味着如果你有以下的配置：

```java
@Resource(name = "specificService")
private SomeService someService;
```
Spring 将会寻找名为 "specificService" 的 bean 并注入到 `someService` 字段上。如果没有指定名称，它会默认使用字段名或 setter 方法名作为 bean 的名称进行查找。如果按名称查找失败，`@Resource` 会尝试按类型来查找。

:::info
**@Resource vs @Autowired**

- 来源：`@Resource` 是来自 Java 的 `javax.annotation` 包，而 `@Autowired` 是 Spring 特有的。
- 查找策略：如上所述，`@Resource` 默认是按名称查找，然后是按类型。而 `@Autowired` 默认是按类型查找。
- 配合其他注解：`@Autowired` 可以与 `@Qualifier` 注解一起使用，以指定注入哪个具体的 bean。而 `@Resource` 通过其 name 属性来实现类似的功能。

总的来说，选择使用哪个注解取决于你的具体需求和你想如何进行注入。如果需要按名称注入，`@Resource` 可能是更直接的选择；如果按类型注入更方便，那么 `@Autowired` 可能更合适。

注意：尽管字段注入在简单场景下很方便，但它可能不是最佳的实践，因为这样的字段不能被标记为 final，并且可能使单元测试变得困难。构造函数注入是推荐的方式，因为它可以确保所有的依赖都被正确注入，而且类的字段可以被标记为 final，这样可以提供不变性。
:::

#### 4.5.2 自动注入的局限性与缺点
自动注入最适合在整个项目中一致地使用。如果通常不使用自动注入，只为一两个 bean 定义使用自动注入可能会使开发人员感到困惑。
请考虑自动注入的以下限制和缺点：

1. **属性和构造函数参数的明确依赖性总是优先于自动注入。**你不能自动注入简单的属性，如基本类型、字符串、类（及其数组）。这是故意设计的限制。
2. **自动注入不如明确的注入精确。**虽然如前所述，Spring 在面临可能产生意外结果的模糊性时会非常小心，但你的 Spring 管理的对象之间的关系不再明确地记录。
3. **工具可能无法从 Spring 容器生成文档，因为它们可能无法获取注入信息。**
4. **容器内的多个 bean 定义可能与要自动注入的 setter 方法或构造函数参数的类型匹配。**对于数组、集合或 Map 实例来说，这不一定是个问题。然而，对于期望单一值的依赖项，这种模糊性不会被随意解决。如果没有唯一的 bean 定义可用，则会抛出异常。

面对上述情况，你有几种选择：

- 放弃自动注入，选择明确的注入。
- 通过设置 bean 的 `autowire-candidate` 属性为 false 来避免为某个 bean 定义使用自动注入。
- 使用注解基于配置提供的更细粒度的控制。

对于避免某个 bean 被自动注入的情况，可以使用 `@Primary` 注解来指示哪个 bean 应该被优先考虑进行自动注入：
```java
@Configuration
public class AppConfig {

    @Bean
    @Primary
    public Engine primaryEngine() {
        return new PetrolEngine();
    }

    @Bean
    public Engine secondaryEngine() {
        return new DieselEngine();
    }
}
```
在上述示例中，如果你有一个组件需要一个 `Engine` 类型的 bean 进行自动注入，那么 `primaryEngine` bean（也就是 `PetrolEngine` 实例）将被优先考虑，因为它被标记为 `@Primary`。
#### 4.5.3 从自动注入中排除 Bean
你可以为每个 Bean 设定是否要从自动注入中排除。在 Spring 的 XML 格式中，有一个 `autowire-candidate` 属性来控制这个功能。当这个属性设为 `false` 时，Spring 容器会将该特定 Bean 排除出自动注入的考虑范围（包括像 `@Autowired` 这样的注解配置方式）。

要在基于 Java 的配置中达到这个效果，你可以使用 `@Qualifier` 注解配合 `@Autowired` 注解来明确指定 Bean 的名称，从而避免使用被排除的 Bean。
定义两个不同的 Bean：

```java
@Component("mainEngine")
public class MainEngine {}

@Component("backupEngine")
public class BackupEngine {}
```
当你想注入其中一个 Bean，而不希望 Spring 因为类型匹配而混淆它们，可以这样做：
```java
@Service
public class CarService {

    private final MainEngine engine;

    @Autowired
    public CarService(@Qualifier("mainEngine") MainEngine engine) {
        this.engine = engine;
    }
}
```
在上面的示例中，尽管 `BackupEngine` 也是一个有效的 `MainEngine` 类型的 Bean，但由于我们明确地使用了 `@Qualifier("mainEngine")`，因此 `MainEngine` Bean 将被注入，而不是 `BackupEngine`。
这种方式不仅可以帮助你排除某些 Bean 从自动注入的候选中，还可以使你的代码更加明确，清晰地表示你的意图，而不仅仅依赖于自动注入的机制。

总之，要排除一个 Bean 从自动注入中，最简单的方法是在注入时使用 `@Qualifier` 注解来明确指定所需的 Bean，从而避免使用不想要的 Bean。

### 4.6 方法注入
在大多数应用场景中，容器中的大多数 beans 都是单例模式。当一个单例 bean 需要与另一个单例 bean 合作，或一个非单例 bean 需要与另一个非单例 bean 合作时，通常通过定义一个 bean 作为另一个 bean 的属性来处理依赖关系。

但当 bean 的生命周期不同时，就会出现问题。假设单例 bean A 需要使用非单例（原型）bean B，可能在 A 上的每次方法调用都需要。容器只创建一次单例 bean A，因此只有一次机会设置属性。容器不能每次 bean A 需要它时都为它提供一个新的 bean B 实例。

一个解决方案是放弃一些控制反转。您可以通过实现 `ApplicationContextAware` 接口，使 bean A 意识到容器，并通过向容器发出 `getBean("B")` 调用，每次 bean A 需要它时都请求一个 bean B 实例。
但这种方法不是很理想，因为业务代码意识到并与 Spring 框架耦合。Spring IoC 容器的方法注入功能，让你可以干净地处理这个用例。

下面的示例使用基于 Java 的配置，展示如何使用 `@Lookup` 注解实现方法注入：

```java
@Component	// 默认单例 Bean
public abstract class CommandManager {

    public Object process(Map commandState) {
        Command command = createCommand();
        command.setState(commandState);
        return command.execute();
    }

    @Lookup("command")	// 方法注入一个原型 Bean（作用域不同）
    protected abstract Command createCommand();
}

@Component("command")
@Scope("prototype")	// 原型 Bean
public class Command {
    private Map state;
    
    public void setState(Map state) {
        this.state = state;
    }
    
    public Object execute() {
        // 业务逻辑
        return null;
    }
}
```
在上述代码中，`CommandManager` 是一个单例，但每次调用 `createCommand` 时，都会获取一个新的 `Command` 实例，因为它标记为原型范围，并使用 `@Lookup` 注解进行方法注入。这样，我们就不需要使业务代码与 Spring 框架紧密耦合也能使一个单例 Bean 在每次使用时都为它提供一个新的原型 Bean。

感兴趣可以详细阅读下面的文章：[Method Injection](https://spring.io/blog/2004/08/06/method-injection/)

#### 4.6.1 查找方法注入
当您的 Spring 应用中有一个单例（singleton）bean，每次使用时都需要一个新的原型（prototype）bean 实例时，查找方法注入就显得非常有用。

传统的方法是，您可以让单例 bean 通过实现 `ApplicationContextAware` 接口感知到 Spring 容器，并每次需要原型 bean 时都调用 `getBean()` 方法。但这样做会让您的业务代码与 Spring 框架耦合，这并不是一个好的实践。
而查找方法注入提供了一个解决方案：通过 Spring 动态覆盖 bean 中的方法，每次该方法被调用时，都会返回一个新的 bean 实例。这样做的优势是您的业务代码不需要依赖 Spring，而且写起来也更简洁。

原型 Bean（每次请求都返回一个新的实例）：

```java
@Component("myCommand")
@Scope("prototype")
public class AsyncCommand implements Command {
    // ... 你的实现细节
}
```
使用查找方法注入的单例 Bean：
```java
@Component
public abstract class CommandManager {

    public Object process(Object commandState) {
        Command command = createCommand();
        command.setState(commandState);
        return command.execute();
    }

    @Lookup
    protected abstract Command createCommand();
}
```
在上述 `CommandManager` 示例中，每次调用 `createCommand` 方法时，都会从 Spring 容器中获取一个新的 `AsyncCommand` 实例，而 `CommandManager` 本身是一个单例。

这里的关键点是 `@Lookup` 注解和 `createCommand` 方法是抽象的。Spring 在运行时动态生成 `CommandManager` 的子类，覆盖 `createCommand` 方法，使其返回一个新的 `AsyncCommand` 实例。

> 查找方法注入主要用于以下场景：
> 1. 单例 bean 需要多次与原型 bean 交互。例如，一个缓存管理器（singleton）需要为每个请求创建一个新的缓存项（prototype）。
> 2. 您想避免业务代码与 Spring 框架的耦合。

#### 4.6.2 任意方法替换
在 Spring 框架中，除了查找方法注入外，还有一个功能叫做 “任意方法替换”（Arbitrary Method Replacement）。这项功能允许我们替换 bean 中现有的方法实现。尽管这个功能不如查找方法注入那么常用，但在某些特殊的场景下可能会很有用。

1. **原始的类：**
```java
public class MyValueCalculator {
    
    public String computeValue(String input) {
        // some real code...
        return input;
    }
    
    // some other methods...
}
```

2. **替换方法的实现：**

我们需要一个类来实现 `MethodReplacer` 接口，该接口只有一个方法：`reimplement()`。此方法将被用来替换原始方法的实现。
```java
public class ReplacementComputeValue implements MethodReplacer {
    @Override
    public Object reimplement(Object o, Method m, Object[] args) throws Throwable {
        // get the input value, work with it, and return a computed result
        String input = (String) args[0];
        // ... your new implementation
        return ...;
    }
}
```

3. **JavaConfig 配置：**

在 JavaConfig 中，我们不直接使用 “方法替换” 的概念。相反，我们通常会利用 Java 的多态性和组合来达到类似的目的。但严格说来，Spring 的 JavaConfig 并没有一个直接等价于 XML 的 `<replaced-method>` 的注解方式。

例如在 XML 配置文件中，我们可以这样进行配置：

```java
<bean id="myValueCalculator" class="x.y.z.MyValueCalculator">
    <!-- arbitrary method replacement -->
    <replaced-method name="computeValue" replacer="replacementComputeValue">
        <arg-type>String</arg-type>
    </replaced-method>
</bean>

<bean id="replacementComputeValue" class="a.b.c.ReplacementComputeValue"/>
```
而在 JavaConfig 中并没有提供有用的注解：
```java
@Configuration
public class AppConfig {

    @Bean
    public MyValueCalculator myValueCalculator() {
        return new MyValueCalculator();
    }

    @Bean
    public ReplacementComputeValue replacementComputeValue() {
        return new ReplacementComputeValue();
    }
}
```
在上述配置中，我们定义了两个bean：`MyValueCalculator` 和 `ReplacementComputeValue`。但这并不真正地 “替换” 了原始方法的实现。如果您真的需要替换方法的功能，您可能需要考虑其他方法，例如使用代理或者 AOP（面向切面编程）。
> 总结：尽管任意方法替换在 XML 配置中是可行的，但在基于 Java 的配置中，我们通常会使用其他技术和模式来达到相同的目的。

## 5.Bean 作用域
当您创建一个 bean 定义时，您创建了一个配方，用于创建由该 bean 定义的类的实际实例。bean 定义是一个配方的想法很重要，因为这意味着，与使用类一样，您可以从一个配方创建许多对象实例。

您不仅可以控制要插入到从特定 bean 定义创建的对象中的各种依赖项和配置值，还可以控制从特定 bean 定义创建的对象的范围。这种方法功能强大且灵活，因为您可以通过配置选择创建的对象的作用域，而不必在 Java 类级别上设置对象的作用域。可以将 bean 定义为部署在多个作用域中的一个。Spring 框架支持 6 个作用域，其中 4 个只有在使用 web 感知的 `ApplicationContext` 时才可用。您还可以创建自定义作用域。

Spring 支持的作用域如下表：

| **Scope** | **Description** |
| --- | --- |
| [singleton](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#beans-factory-scopes-singleton) | (默认) 将单个 bean 定义作用于每个 Spring IoC 容器的单个对象实例。 |
| [prototype](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#beans-factory-scopes-prototype) | 将单个 bean 定义限定为任意数量的对象实例。 |
| [request](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#beans-factory-scopes-request) | 将单个 bean 定义限定在单个 HTTP 请求的生命周期内。也就是说，每个 HTTP 请求都有自己的 bean 实例，该实例是在单个 bean 定义的后面创建的。只在具有 web 感知的 Spring ApplicationContext 上下文中有效。 |
| [session](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#beans-factory-scopes-session) | 将单个 bean 定义限定在 HTTP 会话的生命周期内。只在具有 web 感知的 Spring ApplicationContext 上下文中有效。 |
| [application](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#beans-factory-scopes-application) | 将单个 bean 定义限定在 ServletContext 的生命周期内。只在具有 web 感知的 Spring ApplicationContext 上下文中有效。 |
| [websocket](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/web.html#websocket-stomp-websocket-scope) | 将单个 bean 定义限定在 WebSocket 的生命周期内。只在具有 web 感知的 Spring ApplicationContext 上下文中有效。 |

### 5.1 单例作用域 (The Singleton Scope)
在 Spring 中，当一个 bean 的作用域被定义为 “单例” 时，意味着该 bean 的定义对应的类只有一个实例会被 Spring IoC 容器创建并管理。无论你多少次请求这个 bean，容器都会返回这个唯一的实例。

为了更明白地理解，当你在 Spring 的 Java 配置中定义了一个 bean，并将其标记为单例，Spring IoC 容器会为这个 bean 的定义创建一个且仅一个的实例。这个唯一的实例会被储存到一个缓存中，以后所有对这个名为 “单例” 的 bean 的请求和引用都会返回这个已经缓存的对象实例。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-12-145121.png)

需要注意的是，Spring 的单例 bean 的概念与 “四人帮”（Gang of Four, GoF)设计模式书中定义的单例模式是不同的。GoF 的单例模式是硬编码的，确保每个 ClassLoader 只创建该类的一个实例。而 Spring 的单例作用域更好地描述为 “每个容器每个 bean”。这意味着，如果你在一个 Spring 容器中为特定的类定义了一个 bean，那么 Spring 容器只会为该 bean 的定义创建该类的一个实例。而且，单例作用域是 Spring 的默认作用域。
现在，我们用 Java 注解和 JavaConfig 的形式看看如何定义一个单例 bean：

```java
@Configuration
public class AppConfig {

    // 这就是一个默认的单例bean，因为singleton是Spring的默认作用域
    @Bean
    public DefaultAccountService accountService() {
        return new DefaultAccountService();
    }

    // 显式地标记为singleton，但实际上这是多余的，因为singleton已经是默认值
    @Bean
    @Scope("singleton")
    public DefaultAccountService anotherAccountService() {
        return new DefaultAccountService();
    }
}
```
在上面的示例中，我们定义了两个 bean，一个是默认的单例 bean，另一个显式地标记为单例。但实际上，无论你是否添加了 `@Scope("singleton")`，它们都是单例的。
### 5.2 原型作用域 (The Prototype Scope)
当一个 bean 的作用域被定义为 “原型” 时，这意味着每次请求该特定 bean 时，都会创建该 bean 的一个新实例。这种情况适用于当 bean 被注入到另一个 bean 中或通过容器的 `getBean()` 方法请求时。通常，对于所有有状态的 bean，你应该使用原型作用域，而对于无状态的 bean，使用单例作用域。

要注意，与其他作用域不同，Spring 不管理原型 bean 的完整生命周期。容器实例化、配置和组装一个原型对象后，会将其交给客户端，但之后不会再记录该原型实例。因此，尽管所有对象的初始化生命周期回调方法都会被调用，无论其作用域如何，但在原型的情况下，配置的销毁生命周期回调不会被调用。客户端代码必须清理原型作用域的对象并释放原型 bean 持有的昂贵资源。要让 Spring 容器释放原型作用域 bean 持有的资源，你可以尝试使用一个自定义的 bean 后置处理器，它保持对需要清理的 bean 的引用。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-12-145131.png)

从某些方面看，Spring 容器对原型作用域 bean 的角色可以看作是 Java 的 new 操作符的替代品。从那一点之后的所有生命周期管理都必须由客户端处理。
现在，我们用 Java 注解和 JavaConfig 的形式看看如何定义一个原型 bean：

```java
@Configuration
public class AppConfig {

    // 定义一个原型作用域的bean
    @Bean
    @Scope("prototype")
    public DefaultAccountService accountService() {
        return new DefaultAccountService();
    }
}
```
在上面的示例中，我们定义了一个原型作用域的 bean。每次请求 `accountService` 时，都会得到一个新的 `DefaultAccountService` 实例。
> TIP：其他的四个作用域实际应用并不多，感兴趣的请自行参见 Spring 官方文档：[https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#beans-factory-scopes](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#beans-factory-scopes)

## 6.自定义 Bean 的性质
> Spring 框架提供了许多可用于自定义 bean 性质的接口。

### 6.1 生命周期回调
在 Spring 框架中，bean 的生命周期是由容器来管理的。为了能够与 bean 的生命周期互动，你可以采用多种方式来定义在 bean 初始化和销毁时需要执行的操作。

1. **Spring 特定的接口**：你可以让你的 bean 实现 Spring 的 `InitializingBean` 和 `DisposableBean` 接口。当 bean 初始化完成后，容器会调用 `afterPropertiesSet()` 方法；当 bean 被销毁之前，容器会调用 `destroy()` 方法。
2. **JSR-250 注解**：在现代的 Spring 应用中，使用 `@PostConstruct` 和 `@PreDestroy` 注解是通常被认为的最佳实践来接收生命周期回调。使用这些注解的好处是，你的 bean 不会与 Spring 的特定接口耦合。
   1. `@PostConstruct`：该注解表示该方法应该在 bean 所有属性都设置完毕后被调用。
   2. `@PreDestroy`：该注解表示在 bean 被销毁之前需要执行的方法。
3. **Bean 后置处理器**：Spring 内部使用 `BeanPostProcessor` 实现来处理找到的任何回调接口，并调用相应的方法。如果你需要 Spring 默认未提供的自定义特性或其他生命周期行为，你可以自己实现 `BeanPostProcessor`。

除了初始化和销毁回调外，由 Spring 管理的对象还可以实现 `Lifecycle` 接口，这样这些对象就可以参与容器的启动和关闭过程。
#### 6.1.1 初始化回调
在 Spring 中，有时候你可能想要在 bean 的所有必要属性都被容器设置完之后，执行一些初始化工作。为了实现这个目的，Spring 提供了几种方式来为 bean 定义初始化回调。

1. **通过 InitializingBean 接口：**

`InitializingBean` 接口允许 bean 在容器设置了所有必要的属性后执行初始化工作。这个接口只有一个方法：`void afterPropertiesSet() throws Exception;` 。但是，我们通常不建议使用 `InitializingBean` 接口，因为它不必要地将代码与 Spring 耦合在一起。
```java
public class AnotherExampleBean implements InitializingBean {

    @Override
    public void afterPropertiesSet() {
        // 执行一些初始化工作
    }
}
```

2. **使用 @PostConstruct 注解或指定一个 POJO 初始化方法：**

使用 Java 配置时，你可以使用 `@Bean` 的 `initMethod` 属性来指定一个初始化方法。这个方法应该没有参数并返回 `void`。这种方式的好处是你的代码不会与 Spring 特定的接口耦合。
```java
@Configuration
public class AppConfig {
    
    @Bean(initMethod = "init")
    public ExampleBean exampleInitBean() {
        return new ExampleBean();
    }
}

public class ExampleBean {

    public void init() {
        // 执行一些初始化工作
    }
}
```
`@PostConstruct` 是 JSR-250 提供的注解，它在 Spring 中被用作初始化回调。当容器对所有属性进行依赖注入后，它会调用带有 `@PostConstruct` 注解的方法。这提供了一种机会来执行任何必要的后处理设置或启动。
```java
import javax.annotation.PostConstruct;

@Component
public class ExampleBean {

    // 可以是其他属性和依赖注入

    @PostConstruct
    public void init() {
        // 执行一些初始化工作
        System.out.println("Bean is going through init.");
    }

    // 其他业务方法
}
```
在上述示例中，`init` 方法被标记为 `@PostConstruct`，这意味着每当 `ExampleBean` 的实例被 Spring 容器创建和初始化时，`init` 方法都会被自动调用。
> 综上所述，第二种方法（使用 `@PostConstruct` 或指定 POJO 初始化方法）更为推荐，因为它避免了代码与 Spring 的耦合。

#### 6.1.2 销毁回调
Spring 提供了方法，以便在 Spring 容器销毁 bean 之前执行某些操作。一种方法是通过实现  `DisposableBean`  接口，但建议不要这样做，因为它不必要地将代码与 Spring 耦合起来。
```java
public class ExampleBean implements DisposableBean {

    @Override
    public void destroy() {
        // 执行一些销毁工作（例如释放连接池中的连接）
    }
}
```
推荐的方式是使用 `@PreDestroy` 注解或指定一个普通的销毁方法。对于基于 Java 的配置，您可以在 `@Bean` 注解中使用 `destroyMethod` 属性来指定销毁方法。
```java
import javax.annotation.PreDestroy;

@Component
public class ExampleBean {

    @PreDestroy
    public void cleanup() {
        // 执行一些销毁工作（例如释放连接池中的连接）
        System.out.println("Bean is being destroyed.");
    }
}
```
在上述示例中，当 `ExampleBean` 实例在 Spring 容器销毁时，`cleanup` 方法会被自动调用，因为它被 `@PreDestroy` 注解标记。

如果您正在使用 Java 配置类，可以使用 `@Bean` 的 `destroyMethod` 属性来指定一个普通的销毁方法：

```java
@Configuration
public class AppConfig {

    @Bean(destroyMethod = "cleanup")
    public ExampleBean exampleBean() {
        return new ExampleBean();
    }
}

public class ExampleBean {

    public void cleanup() {
        // 执行一些销毁工作
        System.out.println("Bean is being destroyed.");
    }
}
```
在这个示例中，当 Spring 容器销毁 `ExampleBean` 的实例时，它将自动调用 `cleanup` 方法，因为在 `@Bean` 注解中指定了 `destroyMethod` 属性。
> 总结：`@PreDestroy` 注解和 `@Bean` 的 `destroyMethod` 属性都为 Spring 提供了销毁 bean 之前需要执行的方法的信息，但建议使用 `@PreDestroy` 注解，因为它使代码与 Spring 的具体实现解耦。

#### 6.1.3 默认初始化和销毁方法
在 Spring 中，您可以定义默认的初始化和销毁方法，这样您就不必为每个 Bean 单独指定这些方法。这有助于确保项目中的命名一致性。

如果是传统的 XML 方式，你可以像如下这么进行配置：

```java
public class DefaultBlogService implements BlogService {

    private BlogDao blogDao;

    public void setBlogDao(BlogDao blogDao) {
        this.blogDao = blogDao;
    }

    // this is (unsurprisingly) the initialization callback method
    public void init() {
        if (this.blogDao == null) {
            throw new IllegalStateException("The [blogDao] property must be set.");
        }
    }
}
```
```xml
<!-- 统一定义所有 Bean 的初始化方法 -->
<beans default-init-method="init">

  <bean id="blogService" class="com.something.DefaultBlogService">
    <property name="blogDao" ref="blogDao" />
  </bean>

</beans>
```
在 Java 配置中，虽然没有直接的等价功能，但我们可以通过定义一个基类或接口来实现相似的效果，并让所有其他的 Bean 都继承或实现它。

假设您的初始化回调方法名为 `init()`，销毁回调方法名为 `destroy()`：

```java
public abstract class DefaultLifecycleBean {

    public void init() {
        // 默认的初始化逻辑
        System.out.println("Default initialization logic");
    }

    public void destroy() {
        // 默认的销毁逻辑
        System.out.println("Default destroy logic");
    }
}
```
您的实际 Bean 可以继承这个基类：
```java
@Component
public class DefaultBlogService extends DefaultLifecycleBean {

    @Autowired
    private BlogDao blogDao;

    @Override
    public void init() {
        super.init();
        if (this.blogDao == null) {
            throw new IllegalStateException("The [blogDao] property must be set.");
        }
    }

    // ... 其他方法 ...
}
```
在 Java 配置中，您可以这样定义 Bean 并指定初始化和销毁方法：
```java
@Configuration
public class AppConfig {

    @Bean(initMethod = "init", destroyMethod = "destroy")
    public DefaultBlogService blogService() {
        return new DefaultBlogService();
    }

    // ... 其他Bean定义 ...
}
```
这样，当 Spring 容器创建并组装 `DefaultBlogService` Bean 时，它会在适当的时候调用 `init()` 方法。销毁时同样会调用 `destroy()` 方法。
> 注意：Spring 容器保证配置的初始化回调在 Bean 提供所有依赖项后立即被调用。这意味着在初始化回调被调用的这个阶段，Bean 还是它原始的版本，还没有被任何 AOP 拦截器所 “装饰” 或 “修改”。这意味着，如果您在初始化方法中调用 Bean 的其他方法，那么这些方法调用不会被 AOP 拦截器捕获。由于 AOP 拦截器在初始化阶段尚未应用到 Bean 上，这确保了初始化方法的调用不受任何外部影响，它仅仅是 Bean 原始代码的一部分。这意味着初始化方法不会因为某个拦截器而产生意外的行为。因为初始化是在原始 Bean 上完成的，所以无论何时与这个 Bean 交互，都可以保证得到预期的结果，而不会受到 AOP 拦截器的影响。

#### 6.1.4 组合生命周期机制
当我们谈论 Spring 中 Bean 的生命周期时，我们实际上是指 Bean 从创建到销毁的过程。在这个过程中，Spring 提供了多种机制来允许我们插入自定义的逻辑，例如在 Bean 创建后初始化一些资源或在 Bean 销毁之前释放一些资源。

从 Spring 2.5 开始，我们有以下三种控制 Bean 生命周期行为的选项：

1. 使用 `InitializingBean` 和 `DisposableBean` 回调接口；
2. 自定义的 `init()` 和 `destroy()` 方法；
3. 使用 `@PostConstruct` 和 `@PreDestroy` 注解。

---

**使用 InitializingBean 和 DisposableBean 回调接口：**

当你的 Bean 实现 `InitializingBean` 接口时，必须重写 `afterPropertiesSet()` 方法。此方法在 Spring 容器为 Bean 设置了所有属性之后会被调用。同样地，当 Bean 实现 `DisposableBean` 接口时，必须重写 `destroy()` 方法。此方法在 Bean 销毁时会被调用。

```java
@Component
public class MyBean implements InitializingBean, DisposableBean {

    @Override
    public void afterPropertiesSet() {
        // Initialization logic
    }

    @Override
    public void destroy() {
        // Cleanup logic
    }
}
```

---

**自定义的 init() 和 destroy() 方法：**

你可以为你的 Bean 定义自己的初始化和销毁方法。这些方法可以随意命名，并在 Bean 配置中进行指定。

```java
@Configuration
public class MyConfig {

    @Bean(initMethod = "myInit", destroyMethod = "myDestroy")
    public MyCustomBean myCustomBean() {
        return new MyCustomBean();
    }
}

public class MyCustomBean {
    public void myInit() {
        // Initialization logic
    }

    public void myDestroy() {
        // Cleanup logic
    }
}
```

---

**使用 @PostConstruct 和 @PreDestroy 注解：**

这两个注解用于标记一个方法，表示该方法应在 Bean 的某个生命周期阶段被执行。

```java
@Component
public class MyAnnotatedBean {

    @PostConstruct
    public void onStart() {
        // Initialization logic
    }

    @PreDestroy
    public void onEnd() {
        // Cleanup logic
    }
}
```
:::info
**组合使用**

当 Bean 配置了多种生命周期机制时，它们将按照以下顺序执行：
初始化方法执行顺序：

1. `@PostConstruct` 注解的方法；
2. `afterPropertiesSet()` 方法（`InitializingBean` 接口定义）
3. 自定义的 `init()` 方法（`initMethod` 属性指定）

销毁方法执行顺序：

1. `@PreDestroy` 注解的方法；
2. `destroy()` 方法（`DisposableBean` 接口定义）
3. 自定义的 `destroy()` 方法（`destroyMethod` 属性指定）

如果同一生命周期阶段配置了多个相同名称的方法（例如，多个 `init()` 方法），则该方法只会执行一次。
:::
#### 6.1.5 Bean 的启动和关闭回调
在 Spring 中，你可以为 Bean 定义启动和关闭的生命周期。这主要通过 `Lifecycle` 接口实现，这个接口定义了三个核心方法：

- `start()`: 启动 Bean
- `stop()`: 关闭 Bean
- `isRunning()`: 判断 Bean 是否正在运行

示例使用代码如下：
```java
public class MyLifecycleBean implements Lifecycle {

    @Override
    public void start() {
        // 启动逻辑
    }

    @Override
    public void stop() {
        // 关闭逻辑
    }

    @Override
    public boolean isRunning() {
        return true; // 根据实际情况返回
    }
}
```
`LifecycleProcessor`（生命周期处理器）是 `Lifecycle` 的扩展，它还添加了其他两个方法来响应上下文的刷新和关闭：
![image.png](https://cdn.nlark.com/yuque/0/2023/png/28699456/1692269024707-c33b0c55-61ff-4ee0-8d3e-4a03603a7c68.png#averageHue=%231a1c27&clientId=u76ef3b47-9c00-4&from=paste&height=164&id=u54429eb7&originHeight=164&originWidth=709&originalType=binary&ratio=1&rotation=0&showTitle=false&size=33076&status=done&style=shadow&taskId=ud4b1c7d5-16b3-44b4-9201-92dc9a1c741&title=&width=709)

- `onRefresh()`: 当 `ApplicationContext` 刷新时调用。
- `onClose()`: 当 `ApplicationContext` 关闭时调用。

普通的 `Lifecycle` 接口仅为显式的启动和停止提供合同，并不暗示在上下文刷新时自动启动。`SmartLifecycle`（智能生命周期）为生命周期添加了更多的智能功能。这包括自动启动、异步关闭和定义启动/关闭的顺序。
核心方法：

- `isAutoStartup()`: 是否在上下文刷新时自动启动。
- `stop(Runnable callback)`: 带有回调的停止方法。
- `getPhase()`: 获取阶段值，决定 Bean 的启动和关闭顺序。

下面是使用示例代码：
```java
@Component
public class MySmartLifecycleBean implements SmartLifecycle {

    // 在上下文刷新时自动启动 Bean
    @Override
    public boolean isAutoStartup() {
        return true;
    }

    // 带有回调的停止方法
    @Override
    public void stop(Runnable callback) {
        // 关闭逻辑
        callback.run();
    }

    // 获取阶段值，决定 Bean 的启动和关闭顺序
    @Override
    public int getPhase() {
        return 0;
    }

    @Override
    public void start() {
        // 启动逻辑
    }

    @Override
    public void stop() {
        // 关闭逻辑
    }

    @Override
    public boolean isRunning() {
        return true; // 根据实际情况返回
    }
}
```
当你有多个 `SmartLifecycle` Beans 时，它们的启动和关闭顺序可能很重要。`SmartLifecycle` 提供了 `getPhase()` 方法来定义这个顺序。对象的启动顺序由其阶段值从低到高决定，而关闭顺序则相反，从高到低。默认情况下，任何不实现 SmartLifecycle 的 Lifecycle 对象的阶段值为 0。

例如，`getPhase()` 返回 `Integer.MIN_VALUE` 的对象将首先启动且最后关闭。而返回 `Integer.MAX_VALUE` 的对象将最后启动并首先关闭。

`SmartLifecycle` 的 `stop(Runnable callback)` 方法允许异步关闭。你必须在 Bean 的关闭过程完成后调用 `callback.run()` 方法。默认情况下，`DefaultLifecycleProcessor`（`LifecycleProcessor` 的默认实现）会等待其超时值以等待每个阶段中的对象组调用该回调。默认的每个阶段超时是 30 秒。你可以在上下文中定义一个名为 `lifecycleProcessor` 的 bean 来覆盖默认的生命周期处理器实例。

#### 6.1.6 在非 Web 应用程序中优雅地关闭 Spring IoC 容器
在 Web 应用中，Spring 的基于 Web 的 `ApplicationContext` 实现已经包含了代码来优雅地关闭 IoC 容器。但在非 Web 应用程序中，我们需要额外进行设置。

为了确保在非 Web 应用程序中 Spring 的 IoC 容器能够优雅地关闭，释放所有资源，并正确地调用所有单例 bean 的 `destroy()` 方法，你需要在 JVM 中注册一个 `shutdown` 钩子（shutdown hook）。
如何注册 `shutdown` 钩子？

你可以通过调用 `ConfigurableApplicationContext` 接口上的 `registerShutdownHook()` 方法来注册 `shutdown` 钩子。

下面是一个简单的示例：

```java
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

public final class Boot {

    public static void main(final String[] args) throws Exception {
        // 使用 JavaConfig 加载 Spring 上下文
        ConfigurableApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);

        // 为上面的上下文添加一个 shutdown 钩子
        ctx.registerShutdownHook();

        // 应用程序的主要逻辑在这里运行...

        // main方法退出时，会在应用程序关闭之前调用钩子
    }
}

// 这是一个简单的 JavaConfig 配置类
@Configuration
public class AppConfig {
    // 定义你的 beans 和其他配置...
}
```
此示例使用 `AnnotationConfigApplicationContext` 来加载基于 Java 的配置。当你注册 `shutdown` 钩子后，无论应用程序何时结束，都会确保 IoC 容器优雅地关闭，并调用所有相关的 `destroy()` 方法。
### 6.2 ApplicationContextAware 和 BaenNameAware
Spring 提供了一些特殊的接口，允许 Bean 在被 Spring IoC 容器创建时获取特定的环境信息。
#### 6.2.1 ApplicationContextAware
如果你的 Bean 实现了 `ApplicationContextAware` 接口，那么当 Spring 容器创建这个 Bean 的实例时，这个 Bean 可以获得对创建它的 `ApplicationContext` 的引用。
```java
public interface ApplicationContextAware {
    void setApplicationContext(ApplicationContext applicationContext) throws BeansException;
}

```
下面是一个使用示例：
```java
@Component
public class MyBean implements ApplicationContextAware {
    private ApplicationContext context;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        this.context = applicationContext;
    }

    public void displayOtherBeans() {
        // 使用 context 获取其他 beans
        String[] beanNames = context.getBeanDefinitionNames();
        // ...
    }
}
```
> 注意：虽然你可以这样做，但通常最好避免直接在代码中使用 `ApplicationContext`，因为这会与 Spring 耦合，并违背控制反转（IoC）原则。Spring 提供了其他方式来注入依赖。

#### 6.2.2 BaenNameAware
如果你的 Bean 实现了 `BeanNameAware` 接口，当 Spring 容器创建这个 Bean 的实例时，这个 Bean 会被提供其在 Spring 容器中定义的名称。
```java
public interface BeanNameAware {
    void setBeanName(String name) throws BeansException;
}
```
下面是一个使用示例：
```java
@Component
public class NamedBean implements BeanNameAware {
    private String beanName;

    @Override
    public void setBeanName(String name) {
        this.beanName = name;
    }

    public void printBeanName() {
        System.out.println("Bean's name is: " + beanName);
    }
}
```
此回调发生在正常 bean 属性被填充之后，但在初始化回调（如 `InitializingBean.afterPropertiesSet()` 或自定义的初始化方法）之前。

最后，记住，使用 `@Autowired` 注解是获取 `ApplicationContext` 引用的另一种方法。你可以简单地在需要自动注入的属性、构造函数或方法上添加 `@Autowired` 注解。

### 6.3 其他 Aware 接口
其他 Aware 感知接口并不常用，感兴趣的请自行阅读官方文档：
[Core Technologies](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#aware-list)
## 7.Bean 定义继承
Spring 允许一个 Bean 的定义继承另一个 Bean 的定义，这意味着你可以基于一个已经配置的 Bean 来创建一个新的 Bean，从而避免重复配置相同的属性。使用 Bean 定义继承可以节省大量的输入工作。这实际上是一种模板化的形式。

在 JavaConfig 中，我们可以通过使用 `@Bean` 注解定义的方法来模拟继承。方法的返回值作为 Bean，并且可以使用另一个 `@Bean` 方法的返回值来模拟从父 Bean 继承。

```java
@Configuration
public class AppConfig {

    @Bean
    public ParentBean parentBean() {
        ParentBean parentBean = new ParentBean();
        parentBean.setName("parent");
        parentBean.setAge(1);
        return parentBean;
    }

    @Bean
    public ChildBean childBean() {
        ChildBean child = new ChildBean(parentBean()); // 继承父 Bean
        child.setName("override"); // 覆盖父 Bean 的属性
        return child;
    }
}

public class ParentBean {
    private String name;
    private int age;

    // getters and setters
}

public class ChildBean extends ParentBean {
    // 这个类可以选择覆盖 ParentBean 的属性或方法，或者添加新的属性和方法
}
```
要点如下：

1. 子 Bean 可以覆盖父 Bean 的属性和方法。
2. 如果子 Bean 没有指定某个属性的值，它将使用父 Bean 的值。
3. 子 Bean 继承了父 Bean 的作用域、构造函数参数值、属性值和方法覆盖，但也可以选择添加新的值。
4. 任何在子 Bean 上指定的作用域、初始化方法、销毁方法或静态工厂方法设置都会覆盖父 Bean 的相应设置。
5. 如果你只打算将一个 Bean 定义作为模板使用（即，你永远不会实例化它），那么在 JavaConfig 中，你只需要不为它创建一个 `@Bean` 方法即可。
## 8.容器的扩展点
通常，应用程序开发者无需子类化 `ApplicationContext` 实现类。相反，通过插入特定的集成接口的实现，可以扩展 Spring IoC 容器。以下部分描述了这些集成接口。
### 8.1 使用 BeanPostProcessor 自定义 Beans
`BeanPostProcessor` 接口定义了回调方法，您可以实现这些方法来提供自己的实例化逻辑、依赖解析逻辑等，或者覆盖容器的默认逻辑。如果您想在 Spring 容器完成 Bean 的实例化、配置和初始化后执行某些自定义逻辑，您可以插入一个或多个自定义 `BeanPostProcessor` 实现。
```java
@Component
public class CustomBeanPostProcessor implements BeanPostProcessor, Ordered {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {
        // 在初始化之前执行的逻辑
        return bean;
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {
        // 在初始化之后执行的逻辑
        return bean;
    }

    @Override
    public int getOrder() {
        return 0;  // 控制执行顺序
    }
}
```
要点如下：

- 可以配置多个 `BeanPostProcessor` 实例，并通过设置 `order` 属性来控制这些 `BeanPostProcessor` 实例的执行顺序。

- `BeanPostProcessor` 实例对 bean 或对象实例进行操作。

- `BeanPostProcessor` 实例在每个容器中都是有作用域的。如果在一个容器中定义了一个 `BeanPostProcessor`，它只会对该容器中的 beans 进行后处理。

- 若要更改实际的 bean 定义，您需要使用 `BeanFactoryPostProcessor`。
  :::info
  **BeanPostProcessor 说明**

  `BeanPostProcessor` 接口只有两个回调方法 `postProcessBeforeInitialization` 和 `postProcessAfterInitialization` 作用在 Bean 初始化的前后。容器为每个由创建的 bean 实例从容器获得回调，都在容器初始化方法之前和之后。后处理器可以采取任何与 bean 实例相关的操作。一个 bean 后处理器通常会检查回调接口，或者可能会使用代理包装一个 bean。

  `ApplicationContext` 会自动检测在配置元数据中定义的实现 `BeanPostProcessor` 接口的任何 beans。`ApplicationContext` 会将这些检测到的 beans 注册为后处理器，以便稍后在创建其他 bean 时调用它们的回调方法。与其他 beans 一样，Bean 后处理器可以在容器中部署。

  在使用 `@Bean` 工厂方法在配置类上声明 `BeanPostProcessor` 时，工厂方法的返回类型应该至少是 `org.springframework.beans.factory.config.BeanPostProcessor` 接口，明确地表示该 bean 的后处理器特性。

  实现 `BeanPostProcessor` 接口的类是特殊的，并由容器以不同的方式处理。所有 `BeanPostProcessor` 实例和它们直接引用的 beans 在启动时都会被实例化。
  :::

---

Spring 的 `BeanPostProcessor` 是一个非常强大的工具，允许开发者在 Spring 创建并准备好 bean 实例后，但在 bean 真正被应用程序使用之前（初始化），插入自己的逻辑。通常情况下，我们会在 Spring 配置中直接声明它，然后 Spring 容器会自动检测并应用它。但有时，您可能希望在注册 `BeanPostProcessor` 之前进行某些评估或判断。

举一个例子：您可能有一个特定的 `BeanPostProcessor`，但只希望在某些条件满足时（例如，配置文件设置为某个特定值时）才将其注册到 Spring 容器中。在这种情况下，您不能仅仅在 Spring 配置中声明它，因为这样做会导致它始终被注册。相反，您需要编程地根据您的条件判断来注册它。

这就是 `ConfigurableBeanFactory` 的 `addBeanPostProcessor` 方法发挥作用的地方。您可以使用它来动态、编程地将您的 `BeanPostProcessor` 添加到 Spring 容器中。

此外，有时候，您可能有多个 Spring 容器（上下文）的层次结构。例如，有一个父容器和多个子容器。在这种情况下，您可能希望将父容器中定义的 `BeanPostProcessor` 复制到其中一个或多个子容器中。再次，`addBeanPostProcessor` 方法在这里就非常有用。

以下是一个简单的示例，说明如何使用 `addBeanPostProcessor`：

```java
public class MyCustomBeanPostProcessor implements BeanPostProcessor {
    // ... 实现 BeanPostProcessor 的方法
}

ConfigurableApplicationContext context = //... 获取您的 Spring 上下文
ConfigurableBeanFactory beanFactory = context.getBeanFactory();

// 基于某种条件逻辑判断是否要注册 BeanPostProcessor
if (someConditionIsMet()) {
    MyCustomBeanPostProcessor processor = new MyCustomBeanPostProcessor();
    beanFactory.addBeanPostProcessor(processor);
}
```
在上述代码中，我们首先获取 `ConfigurableBeanFactory`，然后基于某些条件逻辑来决定是否注册 `BeanPostProcessor`。

---

**Example: Hello World, BeanPostProcessor-style（官方示例）**

首先，让我们从 `BeanPostProcessor` 实现开始：

```java
package scripting;

import org.springframework.beans.factory.config.BeanPostProcessor;

public class InstantiationTracingBeanPostProcessor implements BeanPostProcessor {

    @Override
    public Object postProcessBeforeInitialization(Object bean, String beanName) {
        return bean; // 在bean初始化之前不做任何操作，只是返回bean本身
    }

    @Override
    public Object postProcessAfterInitialization(Object bean, String beanName) {
        System.out.println("Bean '" + beanName + "' created : " + bean.toString());
        return bean; // 在bean初始化之后打印bean的信息，然后返回bean本身
    }
}
```
接下来，我们使用 Java 配置来代替 XML：
```java
package config;

import scripting.InstantiationTracingBeanPostProcessor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AppConfig {

    // 将InstantiationTracingBeanPostProcessor注册为一个bean，这样Spring就会自动检测到它
    @Bean
    public InstantiationTracingBeanPostProcessor tracingBeanPostProcessor() {
        return new InstantiationTracingBeanPostProcessor();
    }
}
```
然后，我们有一个 Java 应用程序来运行以上代码：
```java
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import org.springframework.scripting.Messenger;

public final class Boot {

    public static void main(final String[] args) throws Exception {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
        // 此时，由于我们未在Java配置中定义Messenger bean，所以下面的代码只是为了示例
        // Messenger messenger = ctx.getBean("messenger", Messenger.class);
        // System.out.println(messenger);
    }
}
```
:::info
**AutowiredAnnotationBeanPostProcessor**

`AutowiredAnnotationBeanPostProcessor` 是 Spring 框架中的一个内建 `BeanPostProcessor` 实现，它允许自动注入功能。具体地说，它检查所有的 bean，看看它们是否有 `@Autowired` 注解，如果有，它会尝试自动注入相应的依赖。

当您在 Spring 配置中启用 `@Autowired` 功能（例如，通过使用 `@ComponentScan` 注解），这个 `BeanPostProcessor` 就会自动被注册到 Spring 容器中。这意味着您不需要手动配置或理解其内部工作机制，只需知道 `@Autowired` 注解如何在您的 bean 中工作即可。
:::

### 8.2 使用 BeanFactoryPostProcessor 自定义配置元数据
`BeanFactoryPostProcessor` 是 Spring 提供的一个扩展点，使您可以在容器实例化任何其他 bean 之前，读取和修改 bean 的配置元数据。简单来说，您可以在 Spring 实际创建 bean 之前，对其配置进行某些更改。

与 `BeanPostProcessor` 相似，您可以配置多个 `BeanFactoryPostProcessor` 实例。如果您希望控制它们的执行顺序，可以让您的 `BeanFactoryPostProcessor` 实现 `Ordered` 接口并设置 `order` 属性。

假设我们有一个自定义的 `BeanFactoryPostProcessor`，它会更改某个 bean 的属性值：

```java
package com.example;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.config.BeanFactoryPostProcessor;
import org.springframework.beans.factory.config.ConfigurableListableBeanFactory;

public class CustomBeanFactoryPostProcessor implements BeanFactoryPostProcessor {

    @Override
    public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {
        // 示例：修改某个 bean 的某个属性值
        // BeanDefinition bd = beanFactory.getBeanDefinition("someBeanName");
        // bd.getPropertyValues().addPropertyValue("someProperty", "newValue");
    }
}
```
为了将其注册到 Spring 容器中，我们可以在 Java 配置类中声明：
```java
@Configuration
public class AppConfig {

    @Bean
    public CustomBeanFactoryPostProcessor customBeanFactoryPostProcessor() {
        return new CustomBeanFactoryPostProcessor();
    }
}
```
注意点如下：

- 如果您想更改实际的 bean 实例，您应该使用 `BeanPostProcessor` 而不是 `BeanFactoryPostProcessor`。

- 尽管在 `BeanFactoryPostProcessor` 中可以获取并工作于 bean 实例，但这会导致提前 bean 实例化，违反了标准容器生命周期，可能带来负面影响。

- `BeanFactoryPostProcessor` 是按容器范围定义的。这意味着，如果您在一个容器中定义了 `BeanFactoryPostProcessor`，它只会应用于该容器中的 bean 定义。
  :::info
  当您在应用上下文中声明一个 `BeanFactoryPostProcessor` 时，它会自动运行，以便对容器的配置元数据进行更改。与 `BeanPostProcessors` 一样，您通常不希望为 `BeanFactoryPostProcessors` 配置懒加载。如果没有其他 bean 引用它，那么该后处理器可能根本不会被实例化。因此，即使您尝试将其标记为懒加载，它仍然会被提前实例化。
  :::

  Spring 也提供了一些预定义的 `BeanFactoryPostProcessors`，例如 `PropertyOverrideConfigurer` 和 `PropertySourcesPlaceholderConfigurer`，帮助您在 bean 创建之前做一些额外的处理。
  ![image.png](https://cdn.nlark.com/yuque/0/2023/png/28699456/1692273785985-eec59d5a-6137-4652-a9e3-ed4ab1bbce92.png#averageHue=%23181a24&clientId=u76ef3b47-9c00-4&from=paste&height=257&id=ueb288421&originHeight=257&originWidth=975&originalType=binary&ratio=1&rotation=0&showTitle=false&size=59495&status=done&style=shadow&taskId=u018cfdcf-4334-4caf-83a0-90979fd8c99&title=&width=975)

---

**Example：使用 PropertySourcesPlaceholderConfigurer 进行类名替换（官方示例）**

使用 `PropertySourcesPlaceholderConfigurer`，您可以将 bean 定义中的属性值外部化到单独的文件中，这些文件使用标准的 Java 属性格式。这样做的好处是可以让部署应用程序的人在不修改主要的容器配置文件的情况下，定制特定环境的属性，如数据库 URL 和密码。

假设我们有一个使用占位符值的 `DataSource` 配置：

```java
@Configuration
public class AppConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        // 设置配置文件的位置
        configurer.setLocation(new ClassPathResource("com/something/jdbc.properties"));
        return configurer;
    }

    @Bean(destroyMethod = "close")
    public BasicDataSource dataSource(
            @Value("${jdbc.driverClassName}") String driverClassName,
            @Value("${jdbc.url}") String url,
            @Value("${jdbc.username}") String username,
            @Value("${jdbc.password}") String password) {
        BasicDataSource dataSource = new BasicDataSource();
        dataSource.setDriverClassName(driverClassName);
        dataSource.setUrl(url);
        dataSource.setUsername(username);
        dataSource.setPassword(password);
        return dataSource;
    }
}
```
外部属性文件 `jdbc.properties` 的内容如下：
```properties
jdbc.driverClassName=org.hsqldb.jdbcDriver
jdbc.url=jdbc:hsqldb:hsql://production:9002
jdbc.username=sa
jdbc.password=root
```
在运行时，`PropertySourcesPlaceholderConfigurer` 会读取 jdbc.properties 文件，并将 bean 定义中的 `${...}` 格式的占位符替换为相应的值。
> 注意：
> 1. `PropertySourcesPlaceholderConfigurer` 不仅仅在您指定的属性文件中查找属性。默认情况下，如果在指定的属性文件中找不到某个属性，它会检查 Spring 的环境属性和普通的 Java 系统属性。
> 2. 您还可以使用 `PropertySourcesPlaceholderConfigurer` 替换类名，这在运行时需要选择特定的实现类时非常有用。

例如，您可以如下配置：
```java
@Configuration
public class StrategyConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer strategyConfigurer() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        // 设置配置文件的位置
        configurer.setLocation(new ClassPathResource("com/something/strategy.properties"));
        // 添加属性
        Properties props = new Properties();
        props.setProperty("custom.strategy.class", "com.something.DefaultStrategy");
        configurer.setProperties(props);
        return configurer;
    }

    @Bean
    public Object serviceStrategy(@Value("${custom.strategy.class}") String strategyClassName) throws ClassNotFoundException, IllegalAccessException, InstantiationException {
        // 反射创建实例
        Class<?> clazz = Class.forName(strategyClassName);
        return clazz.newInstance();
    }
}
```
外部属性文件 strategy.properties 的内容可能如下：
```properties
custom.strategy.class=com.something.AnotherStrategy
```
如果在运行时，该类名不存在或不可用（可能是因为它没有被正确地编译或部署），Spring 容器在尝试实例化这个 bean 时就会遇到问题，因为它找不到该类。进一步说，当 Spring ApplicationContext（应用上下文）启动时，它默认会尝试创建所有的 singleton bean（单例 bean），除非我们明确告诉它延迟这个过程（这就是所谓的懒加载或 lazy initialization）。这个默认的 bean 创建阶段称为 `preInstantiateSingletons()` 阶段。在这个阶段，如果有任何 bean 不能被正确实例化，Spring 会抛出一个异常，并且应用上下文的启动会失败。

---

**Example：PropertyOverrideConfigurer（官方示例）**
`PropertyOverrideConfigurer` 是一个 bean 工厂后处理器（bean factory post-processor）。与 `PropertySourcesPlaceholderConfigurer` 相似，但有一个关键的区别：原始的 bean 定义可以为 bean 的属性设置默认值，或者不设置任何值。如果覆盖属性的文件中没有某个 bean 属性的条目，那么会使用默认的上下文定义。

需要注意的是，bean 定义并不知道它被覆盖了，所以当使用 `PropertyOverrideConfigurer` 时，从 bean 的配置中并不容易看出。如果有多个 `PropertyOverrideConfigurer` 实例为同一个 bean 属性定义了不同的值，那么最后一个会胜出，这是因为覆盖机制。
假设我们有以下 JavaBeans：

```java
public class Tom {
    private Fred fred;
    // getter and setter
}

public class Fred {
    private Bob bob;
    // getter and setter
}

public class Bob {
    private int sammy;
    // getter and setter
}
```
假设 override.properties 属性文件的配置行格式为：
```java
tom.fred.bob.sammy=123
```
指定的覆盖值始终是文字值。它们不会转化为 bean 引用。这种约定也适用于 XML bean 定义中指定的原始值是 bean 引用的情况。

上面这种复合属性名称的设置，实际上，它意味着我们有一个名为 `tom` 的 bean，在这个 bean 中有一个属性名为 `fred`，`fred` 属性是一个对象，这个对象又有一个名为 `bob` 的属性，`bob` 也是一个对象，它有一个名为 `sammy` 的属性。我们想要设置或覆盖这个 `sammy` 属性的值为 123。

配置示例如下：

```java
@Configuration
public class AppConfig {

    @Bean
    public Tom tom() {
        Tom tom = new Tom();
        tom.setFred(fred());
        return tom;
    }

    @Bean
    public Fred fred() {
        Fred fred = new Fred();
        fred.setBob(bob());
        return fred;
    }

    @Bean
    public Bob bob() {
        Bob bob = new Bob();
        bob.setSammy(100);  // 默认值为 100
        return bob;
    }

    @Bean
    public PropertyOverrideConfigurer propertyOverrideConfigurer() {
        PropertyOverrideConfigurer configurer = new PropertyOverrideConfigurer();
        configurer.setLocation(new ClassPathResource("override.properties"));
        return configurer;
    }
}
```
在这个 JavaConfig 示例中，我们创建了一个 `PropertyOverrideConfigurer` bean，并为其设置了一个 `ClassPathResource`，指向我们的 override.properties 文件。在容器中的 Bean 初始化前会使用 `123` 覆盖 `sammy` 的属性值。

总之，`PropertyOverrideConfigurer` 提供了一种灵活的方式来覆盖 bean 属性的默认值，而无需更改 bean 的原始定义。这在多环境部署中特别有用，因为您可以为每个环境提供一个不同的属性文件，而不必更改基本的 bean 配置。

### 8.3 使用 FactoryBean 自定义实例化逻辑
Spring 提供了一个接口叫做 `FactoryBean`，允许您创建对象，这些对象本身就是工厂。这意味着，当您有一些复杂的初始化逻辑，并认为用 Java 描述比用 XML 更合适时，您可以考虑使用 `FactoryBean`。
`FactoryBean` 是一个插入到 Spring IoC 容器实例化逻辑中的接口。如果你的初始化代码很复杂，用 XML 来描述可能会很冗长，那么你可以创建自己的 `FactoryBean`，在该类中写入复杂的初始化代码，然后将你的自定义 `FactoryBean` 插入到容器中。

`FactoryBean<T>` 接口提供了三个方法：

- `T getObject()`: 返回此工厂创建的对象的一个实例。根据此工厂返回的是单例还是原型，该实例可能是共享的。
- `boolean isSingleton()`: 如果这个 `FactoryBean` 返回单例，则返回 true，否则返回 false。这个方法的默认实现返回 true。
- `Class<?> getObjectType()`: 返回 `getObject()` 方法返回的对象类型，或者如果事先不知道类型则返回 null。

Spring 框架本身内部使用了 `FactoryBean` 接口的概念和实现。Spring 本身也附带了超过 80 种 `FactoryBean` 的实现。
![image.png](https://cdn.nlark.com/yuque/0/2023/png/28699456/1692285347088-54b2ac68-204c-4f69-b83b-c3ba19e6ee71.png#averageHue=%23161821&clientId=u51090e27-296b-4&from=paste&height=184&id=ucd0056a2&originHeight=184&originWidth=735&originalType=binary&ratio=1&rotation=0&showTitle=false&size=37514&status=done&style=shadow&taskId=u240dfb9c-629e-481c-b110-feb1f97432a&title=&width=735)
假设您有一个复杂的 `ComplexObject`，您想通过 `FactoryBean` 来创建：
```java
public class ComplexObject {
    // ...其他方法和属性...
}

@Component
public class ComplexObjectFactoryBean implements FactoryBean<ComplexObject> {

    @Override
    public ComplexObject getObject() throws Exception {
        // 这里是创建 ComplexObject 的复杂逻辑...
        ComplexObject complexObject = new ComplexObject();
        // ...初始化操作...
        return complexObject;
    }

    @Override
    public Class<?> getObjectType() {
        return ComplexObject.class;
    }

    @Override
    public boolean isSingleton() {
        return true;
    }
}
```
在 Spring 容器中，您可以这样使用：
```java
@Configuration
public class AppConfig {

    @Bean
    public ComplexObjectFactoryBean complexObject() {
        return new ComplexObjectFactoryBean();
    }
}
```
然后，您可以从容器中获取 `ComplexObject` 的实例，或者直接获取 `ComplexObjectFactoryBean` 实例。
:::info
当您需要从容器中获取实际的 `FactoryBean` 实例本身，而不是它产生的 bean 时，调用 `ApplicationContext` 的 `getBean()` 方法时，bean 的 id 前要加上和号 (`&`)。因此，对于一个 id 为 `myBean` 的 `FactoryBean`，在容器上调用 `getBean("myBean")` 会返回 `FactoryBean` 的产物，而调用 `getBean("&myBean")` 则返回 `FactoryBean` 实例本身。
:::
## 9.基于注解的容器配置
:::info
**注解和 XML 配置在 Spring 中哪个更好?**

随着基于注解的配置的引入，人们开始质疑这种方法是否比 XML “更好”。简单的回答是 “看情况”。每种方法都有其优缺点，通常由开发者决定哪种策略更适合他们。由于注解的定义方式，它们在声明时提供了大量的上下文，导致配置更短、更简洁。但是，XML 擅长于不触及组件源代码或重新编译它们的情况下连接组件。一些开发者更喜欢将配置靠近源代码，而另一些人认为注解类不再是 POJOs，配置变得分散且难以控制。
无论选择哪种方式，Spring 都可以同时适应两种风格，甚至可以混合它们。值得指出的是，通过 JavaConfig 选项，Spring 允许在不触及目标组件源代码的情况下以非侵入性的方式使用注解。
:::

与基于 XML 的配置相比，基于注解的配置通过字节码元数据来连接组件，而不是通过尖括号声明。开发者可以使用注解在相关的类、方法或字段声明上将配置移到组件类本身，而不是使用 XML 来描述 bean 的连接。

例如，Spring 2.0 引入了使用 `@Required` 注解来强制执行所需属性的可能性。Spring 2.5 允许遵循相同的通用方法来驱动 Spring 的依赖注入。实际上，`@Autowired` 注解提供了与自动装配协作者中描述的相同功能，但控制更为精细，适用范围更广。Spring 2.5 还增加了对 JSR-250 注解的支持，如 `@PostConstruct` 和 `@PreDestroy`。Spring 3.0 增加了对 JSR-330 (Java 的依赖注入) 注解的支持，如 `@Inject` 和 `@Named`。

> 注意：注解注入在 XML 注入之前执行，因此，通过两种方法连接的属性，XML 配置会覆盖注解。

考虑一个简单的服务类：
```java
@Service	// 注册为业务 Bean
public class MyService {
    private MyRepository repository;

    // 构造注入（根据类型查找）
    @Autowired
    public MyService(MyRepository repository) {
        this.repository = repository;
    }

    // 初始化前回调
    @PostConstruct
    public void init() {
        // 初始化代码...
    }

    // 初始后回调
    @PreDestroy
    public void cleanup() {
        // 清理资源...
    }
}
```
在 JavaConfig 中，您可以这样配置：
```java
@Configuration
@ComponentScan(basePackages = "com.example") // 会扫描指定包下的所有注解配置
public class AppConfig {
    // 这里可以添加其他@Bean定义，如果需要的话
}
```
### 9.1 使用 @Required
`@Required` 注解主要用于 bean 的属性 setter 方法。这意味着，当 Spring 容器创建这个 bean 时，标有 `@Required` 的属性必须被设置，否则容器会抛出异常。

这个注解的目的是确保在配置时对特定的属性进行设置，可以是通过明确的 bean 定义的属性值或通过自动装配。如果影响的 bean 属性没有被设置，容器会抛出异常。这样可以尽早明确地发现错误，避免后续出现空指针异常或类似问题。尽管如此，我们仍然建议您在 bean 类中加入断言（例如，在初始化方法中）。这样即使在容器外部使用类时，也可以确保所需的引用和值。

:::info
为了启用 `@Required` 注解的支持，必须注册 `RequiredAnnotationBeanPostProcessor`。
值得注意的是，从 Spring 框架 5.1 开始，官方已经弃用了 `@Required` 注解和 `RequiredAnnotationBeanPostProcessor`，推荐使用构造函数注入或者结合 bean 的 setter 方法使用自定义的 `InitializingBean.afterPropertiesSet()` 或 `@PostConstruct` 方法。
:::
考虑一个电影列表服务：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Autowired // 使用 @Autowired 替代 @Required
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // 其他代码...
}
```
使用 `@Autowired` 代替 `@Required`，表示该属性需要被自动注入。如果 Spring 容器中没有匹配的 bean，它会抛出异常。

为了强制 bean 属性在初始化后进行验证，可以使用 `@PostConstruct` 注解：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Autowired
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    @PostConstruct
    public void validateProperties() {
        if (movieFinder == null) {
            throw new IllegalArgumentException("Property 'movieFinder' is required");
        }
    }

    // 其他代码...
}
```
在这个例子中，`validateProperties` 方法会在 bean 初始化后立即执行，确保 `movieFinder` 属性已被设置。
### 9.2 使用 @Autowired
`@Autowired` 是一个 Spring 特有的注解，它告诉框架通过匹配数据类型自动注入 beans。
#### 9.2.1 构造函数注入
您可以在构造函数上使用 `@Autowired` 注解。例如：
```java
public class MovieRecommender {
    private final CustomerPreferenceDao customerPreferenceDao;

    @Autowired
    public MovieRecommender(CustomerPreferenceDao customerPreferenceDao) {
        this.customerPreferenceDao = customerPreferenceDao;
    }
}
```
> TIP：从 Spring 4.3 开始，如果您的类只有一个构造函数，您甚至不需要 `@Autowired` 注解。Spring 默认会使用它。但是，如果有多个构造函数，您应使用 `@Autowired` 来指定 Spring 应该使用哪一个。

#### 9.2.2 Setter 和字段注入
您可以在方法（通常是 setter）或直接在字段上使用 `@Autowired`：
```java
public class SimpleMovieLister {
    
    @Autowired
    private MovieFinder movieFinder;
}
```
这意味着 Spring 将尝试查找 `MovieFinder` 类型的 bean 并将其注入到 `SimpleMovieLister` 中。
#### 9.2.3 集合和映射注入
如果您想注入某种类型的所有 beans，可以使用数组或集合：
```java
public class MovieRecommender {
    
    @Autowired
    private Set<MovieCatalog> movieCatalogs;
}
```
如果您想要一个 bean 名称到 bean 的映射，请使用 `Map<String, YourType>`：
```java
public class MovieRecommender {
    
    @Autowired
    private Map<String, MovieCatalog> movieCatalogs;
}
```
#### 9.2.4 处理可选的依赖项
默认情况下，如果 Spring 找不到匹配的 bean，它会抛出错误。但有时，依赖关系可能是可选的。您可以通过多种方式处理它。
将 `required` 属性设置为 `false`：
```java
@Autowired(required = false)
private MovieFinder movieFinder;
```
使用 Java 8 的 `Optional`：
```java
@Autowired
public void setMovieFinder(Optional<MovieFinder> movieFinder) { /*...*/ }
```
使用 `@Nullable` 注解：
```java
@Autowired
public void setMovieFinder(@Nullable MovieFinder movieFinder) { /*...*/ }
```
#### 9.2.5 特殊的 Beans
Spring 有一些内置的类型，如 `ApplicationContext`、`Environment` 等，您可以直接使用 `@Autowired` 进行注入：
```java
public class MovieRecommender {
    
    @Autowired
    private ApplicationContext context;
}
```
#### 9.2.6 幕后工作原理
在内部，`@Autowired` 及类似的注解是因为 Spring 的 `BeanPostProcessor` 实现而起作用的。这意味着您不应在自定义的 `BeanPostProcessor` 或 `BeanFactoryPostProcessor` 类中使用 `@Autowired`。而是使用 JavaConfig 或 XML 明确设置它们。
> 请记住，虽然 `@Autowired` 非常方便，但始终确保您的设计保持清晰和可维护。过度使用自动装配有时会使您的应用程序变得难以理解和调试。

### 9.3 使用 @Primary 精细调整基于注解的自动装配
当你使用按类型的自动装配 (`@Autowired`) 时，可能会遇到多个符合条件的 bean。在这种情况下，我们需要有一种方式来指定哪一个 bean 是首选的，这可以通过使用 Spring 的 `@Primary` 注解来实现。即当有多个相同类型的 bean，并且只有一个需要被首选进行自动注入时，我们就可以使用 `@Primary`。

考虑以下配置，它定义了一个名为 `firstMovieCatalog` 的 bean 作为首选的 `MovieCatalog`：

```java
@Configuration
public class MovieConfiguration {

    @Bean
    @Primary
    public MovieCatalog firstMovieCatalog() {
        return new SimpleMovieCatalog();
    }

    @Bean
    public MovieCatalog secondMovieCatalog() {
        return new SimpleMovieCatalog();
    }
}
```
基于上述配置，当 `MovieRecommender` 里的 `MovieCatalog` 类型属性需要一个 bean 进行自动注入时，`firstMovieCatalog` 会被选为首选，因为它被标记为 `@Primary`：
```java
public class MovieRecommender {

    @Autowired
    private MovieCatalog movieCatalog;

    // 其他的代码...
}
```
这意味着，在这种情况下，`movieCatalog` 属性会自动注入 `firstMovieCatalog` bean，而不是 `secondMovieCatalog` bean。
### 9.4 使用 @Qualifier 注解微调基于注解的自动注入
在 Spring 中，有时我们有多个相同类型的 Bean，但我们希望在进行自动注入时能够指定特定的 Bean。例如，当我们有两个或多个 `MovieCatalog` 类型的 Bean 时，我们可能需要明确指定希望注入哪个。Spring 提供了两个注解来帮助我们做到这一点：`@Primary` 和 `@Qualifier`。

上一节我们已经讲过，`@Primary` 注解允许我们指定一个主要的 Bean，当有多个相同类型的 Bean 存在时，Spring 会优先选择标记为 `@Primary` 的 Bean 进行注入。但有时我们需要更精细的控制，这时可以使用 `@Qualifier` 注解。通过为 `@Qualifier` 注解提供一个值，我们可以指定希望注入哪个具体的 Bean。
首先，我们定义两个 `MovieCatalog` Bean 并使用 `@Qualifier` 分别给它们指定一个名称：

```java
@Configuration
public class MovieConfiguration {

    @Bean
    @Qualifier("main")
    public MovieCatalog mainMovieCatalog() {
        return new SimpleMovieCatalog();
    }

    @Bean
    @Qualifier("action")
    public MovieCatalog actionMovieCatalog() {
        return new SimpleMovieCatalog();
    }
}
```
在上述配置中，我们定义了两个 `MovieCatalog` 的 Bean，一个有 "main" 的限定符，另一个有 "action" 的限定符。

接下来，我们可以在 `MovieRecommender` 类中使用 `@Autowired` 和 `@Qualifier` 注解来指定希望注入哪个 `MovieCatalog`：

```java
@Component
public class MovieRecommender {

    private MovieCatalog movieCatalog;

    @Autowired
    public void prepare(@Qualifier("main") MovieCatalog movieCatalog) {
        this.movieCatalog = movieCatalog;
    }
    // ...
}
```
在上述示例中，我们明确指定希望将 "main" 的 `MovieCatalog` Bean 注入到 `MovieRecommender` 的 `prepare` 方法中。

如果需要同时注入多个不同的 Bean，只需为每个参数使用 `@Qualifier` 注解：

```java
@Component
public class MovieRecommender {

    private MovieCatalog mainMovieCatalog;
    private MovieCatalog actionMovieCatalog;

    @Autowired
    public void prepare(@Qualifier("main") MovieCatalog mainMovieCatalog, 
                        @Qualifier("action") MovieCatalog actionMovieCatalog) {
        this.mainMovieCatalog = mainMovieCatalog;
        this.actionMovieCatalog = actionMovieCatalog;
    }
    // ...
}
```
:::info
**相关补充：**

1. **Bean 名称作为默认的 Qualifier 限定符**

如果你没有指定 `@Qualifier`, Spring 会考虑 bean 的名称作为默认的限定符。这意味着，如果你有一个名为 "main" 的 bean，那么它会自动与标有 `@Qualifier("main")` 的注入点匹配。但请注意，尽管你可以这样做，`@Autowired` 的核心目的是基于类型的注入，`@Qualifier` 只是为了在有多个同类型的 Bean 时进行进一步的筛选。

2. **Qualifiers 和集合的使用**

当你有一个需要注入 `Set<MovieCatalog>` 的字段或参数时，`@Qualifier` 可以用来筛选合适的 Beans。例如，如果你有多个 `MovieCatalog` Beans 都有 "action" 作为限定符，它们都会被注入到用 `@Qualifier("action")` 标注的 `Set<MovieCatalog>` 中。

3. **注入的命名约定**

如果没有明确的 `@Qualifier` 或 `@Primary` 指示，Spring 会尝试根据注入点的名称（字段名或参数名）来匹配 Bean 名称。但如果你打算通过名称进行注入，推荐使用 JSR-250 的 `@Resource` 注解，它明确地按名称匹配，而不是类型。

4. **自引用注入**

从 Spring 4.3 版本开始，`@Autowired` 允许进行自引用注入，即一个 Bean 可以注入其自身的引用。但这是一种回退机制，仅在没有其他合适的 Bean 可用时才会发生。在实际开发中，你应该尽量避免这种做法。例如，尝试在同一个配置类中注入由 `@Bean` 方法返回的结果其实是自引用。要解决这种情况，可以将 `@Bean` 方法定义为 `static`，这样它就与包含它的配置类实例及其生命周期解耦。

5. **@Autowired vs @Resource**

`@Autowired` 可以应用于字段、构造函数和多参数方法，允许在参数级别通过限定符进行筛选。相反，`@Resource` 仅支持字段和带有单个参数的 `setter` 方法。因此，如果你的注入目标是构造函数或多参数方法，建议使用 `@Autowired` 和 `@Qualifier`。
:::

---

**创建自定义限定符注解：**
在 Spring 中，我们可以通过在自定义注解中加上 `@Qualifier` 注解来创建自定义限定符。
例如，定义一个叫 `Genre` 的限定符：
```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface Genre {

    String value();
}
```
您可以在想注入的字段或方法参数上使用这个限定符：
```java
public class MovieRecommender {
    @Autowired
    @Genre("Action")
    private MovieCatalog actionCatalog;

    private MovieCatalog comedyCatalog;

    @Autowired
    public void setComedyCatalog(@Genre("Comedy") MovieCatalog comedyCatalog) {
        this.comedyCatalog = comedyCatalog;
    }
}
```
在 JavaConfig 中使用也可以使用自定义限定符注解来定义 Bean：
```java
@Configuration
public class MovieConfig {
    @Bean
    @Genre("Action")
    public MovieCatalog actionMovieCatalog() {
        return new SimpleMovieCatalog();
    }

    @Bean
    @Genre("Comedy")
    public MovieCatalog comedyMovieCatalog() {
        return new SimpleMovieCatalog();
    }
}
```
此外，您还可以定义接受多个属性的自定义限定符：
```java
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
@Qualifier
public @interface MovieQualifier {
    String genre();
    Format format();
}

public enum Format {
    VHS, DVD, BLURAY
}
```
使用这个限定符：
```java
public class MovieRecommender {
    @Autowired
    @MovieQualifier(format=Format.VHS, genre="Action")
    private MovieCatalog actionVhsCatalog;

    // ... 其他字段
}
```
在 JavaConfig 中定义 Bean 时同样可以使用：
```java
@Configuration
public class MovieConfig {
    @Bean
    @MovieQualifier(format=Format.VHS, genre="Action")
    public MovieCatalog actionVhsCatalog() {
        return new SimpleMovieCatalog();
    }

    // ... 其他 Bean 定义
}
```
> 总结：自定义限定符为您提供了更多的灵活性来选择正确的 bean 进行注入。通过 JavaConfig，您可以完全摆脱 XML 并用类型安全的方式定义和注入 bean。

### 9.5 使用泛型作为自动装配限定符
在 Spring 中，除了使用 `@Qualifier` 注解来指定特定的 Bean 进行注入外，您还可以使用 Java 的泛型作为一种隐式的限定方式。这种方式允许我们根据泛型的类型自动注入对应的 Bean。

假设您有如下的配置类，其中定义了两个 Bean：`StringStore` 和 `IntegerStore`。它们分别实现了泛型接口 `Store<String>` 和 `Store<Integer>`：

```java
@Configuration
public class MyConfiguration {

    @Bean
    public StringStore stringStore() {
        return new StringStore();
    }

    @Bean
    public IntegerStore integerStore() {
        return new IntegerStore();
    }
}
```
这里，`StringStore` 和 `IntegerStore` 分别实现了泛型接口 `Store<String>` 和 `Store<Integer>`。它们的定义可能如下：
```java
public class StringStore implements Store<String> {
    // ...
}

public class IntegerStore implements Store<Integer> {
    // ...
}

public interface Store<T> {
    // ...
}
```
现在，当您需要自动注入 `Store` 接口的实现时，可以使用泛型作为限定符：
```java
@Autowired
private Store<String> s1;  // 使用 <String> 作为限定符，自动注入 stringStore bean

@Autowired
private Store<Integer> s2; // 使用 <Integer> 作为限定符，自动注入 integerStore bean
```
这里，s1 会自动注入 `StringStore` 的实例，而 s2 会自动注入 `IntegerStore` 的实例。
您还可以使用泛型来自动注入列表，这是非常有用的，特别是当您有多个相同类型但泛型不同的 Bean 时：
```java
// 注入所有类型为 Store<Integer> 的 bean
// 类型为 Store<String> 的 bean 不会被注入到这个列表中
@Autowired
private List<Store<Integer>> stores;
```
> 总结：泛型在 Spring 的自动装配中可以作为一种隐式的限定符，它为我们提供了一种更简洁和类型安全的方式来选择特定的 Bean 进行注入。

### 9.6 使用 CustomAutowireConfigurer
在 Spring 中，`CustomAutowireConfigurer` 是一个 `BeanFactoryPostProcessor` 实现。它允许您注册自己的自定义限定符注解类型，即使这些注解并没有使用 Spring 的 `@Qualifier` 进行标注。

这个功能的核心意义在于：Spring 提供了默认的 `@Qualifier` 注解来做限定符，但在某些情况下，您可能希望定义自己的注解来做为限定符。`CustomAutowireConfigurer` 提供了这样的能力。

首先，假设您有一个自定义的限定符注解：

```java
public @interface CustomQualifier {
    String value();
}
```
现在，为了让 Spring 识别这个自定义的注解作为限定符，您需要配置 `CustomAutowireConfigurer`：
```java
@Configuration
public class AppConfig {

    @Bean
    public CustomAutowireConfigurer customAutowireConfigurer() {
        CustomAutowireConfigurer configurer = new CustomAutowireConfigurer();
        Set<Class<?>> customQualifierTypes = new HashSet<>();
        customQualifierTypes.add(CustomQualifier.class);
        configurer.setCustomQualifierTypes(customQualifierTypes);
        return configurer;
    }
}
```
在上面的配置中，我们创建了 `CustomAutowireConfigurer` 的 Bean，并为其设置了自定义的限定符注解类型。
再介绍一下 `AutowireCandidateResolver` ，它也是一个核心组件，负责确定哪些 Bean 是自动装配的候选者。

考虑以下因素：

1. 每个 Bean 定义的 `autowire-candidate` 属性值。
2. 在上下文配置中设定的任何默认的 `autowire-candidates`。
3. `@Qualifier` 注解的存在以及通过 `CustomAutowireConfigurer` 注册的任何自定义注解。

当有多个 Bean 作为自动装配的候选者时，如何确定一个 “主要” 的 Bean 呢？答案是：如果候选者中只有一个 Bean 定义的 `primary` 属性设置为 true，那么它将被选中。

例如，您可以在您的配置中这样做：

```java
@Bean
@Primary
public MyService primaryService() {
    return new PrimaryServiceImpl();
}

@Bean
public MyService secondaryService() {
    return new SecondaryServiceImpl();
}
```
在上述情况中，如果您尝试自动装配 `MyService` 类型的 Bean，那么 `primaryService` 会被选中，因为它被标记为 `@Primary`。
### 9.7 使用 @Resource 进行注入
Spring 支持通过 JSR-250 的 `@Resource` 注解 (位于 `javax.annotation.Resource` 包内) 在字段或 Bean 属性的 setter 方法上进行注入。这是 Java EE 中的一个常见模式，例如在 JSF-managed beans 和 JAX-WS 端点中。Spring 也支持这种模式，用于管理 Spring 对象。

`@Resource` 接受一个 `name` 属性。默认情况下，Spring 将该值解释为要注入的 bean 的名称，换句话说，它按名称进行注入。例如：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Resource(name="myMovieFinder")
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```
在上面的例子中，通过 `@Resource(name="myMovieFinder")` 将名为 "myMovieFinder" 的 bean 注入到 `setMovieFinder` 方法中。

如果没有明确指定名称，那么默认的名称将从字段名或 setter 方法派生。例如：

```java
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Resource
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}
```
在这种情况下，因为我们没有指定 bean 的名称，所以 Spring 将尝试找一个名为 `movieFinder` 的 bean 来注入。

:::info
**@Resource 注解的高级用法和注意事项**

1. **Bean 名称与 ApplicationContext**

当我们使用 `@Resource` 注解并为其提供了一个 `name` 属性，例如 `@Resource(name="myBean")`，那么 Spring 会从其管理的 beans 中寻找一个名为 `myBean` 的 bean，并将其注入到相应的字段或方法中。
JNDI（Java Naming and Directory Interface）是 Java 提供的一种命名和目录服务的 API，使得应用程序可以与目录服务（如 LDAP）互动，以获取关于对象和查找对象等信息。在某些高级的 Spring 配置中，bean 的名称可以从 JNDI 中解析而来。但在大多数常规应用中，你可能并不需要使用 JNDI 功能。这里的建议是，除非有特殊需求，否则我们建议你依赖 Spring 的默认行为（即直接从 `ApplicationContext` 中查找 bean）并避免使用 JNDI。

2. **类型匹配 vs 名称匹配**

如果你使用 `@Resource` 注解，但没有明确指定 `name` 属性，Spring 将采用以下策略：

- 首先，尝试按照字段名或 setter 方法的属性名作为 bean 的名称进行查找。例如，对于 `@Resource` 注解的 `private CustomerPreferenceDao customerPreferenceDao;`，Spring 将尝试查找名为 `customerPreferenceDao` 的 bean。
- 如果没有找到匹配的 bean 名称，Spring 将尝试按类型查找 bean。例如，它会查找实现了 `CustomerPreferenceDao` 接口的 bean。
3. **特殊的可解析依赖**

除了常规的 bean，`@Resource` 还能自动注入以下类型的特殊对象：

- `BeanFactory`: Spring 的核心工厂接口，提供访问应用对象的能力。

- `ApplicationContext`: 继承自 `BeanFactory`，提供应用级服务。

- `ResourceLoader`: 提供对外部资源（如文件或 URL）的访问能力。

- `ApplicationEventPublisher`: 允许 beans 发布事件给其它 beans。

- `MessageSource`: 提供国际化消息的解析、格式化和检索。
  :::

  例如，下面的 `MovieRecommender` 类中，`customerPreferenceDao` 字段由于 `@Resource` 注解没有指定 name 属性，Spring 首先会基于字段名查找名为 "customerPreferenceDao" 的 bean，如果没有找到，则会回退到 `CustomerPreferenceDao` 类型进行匹配：
```java
public class MovieRecommender {

    @Resource
    private CustomerPreferenceDao customerPreferenceDao;

    @Resource
    private ApplicationContext context;

    public MovieRecommender() {}

    // ... 其他方法
}
```
在 `MovieRecommender` 类中，`context` 字段被注入了一个 `ApplicationContext` 实例。这是因为 `ApplicationContext` 是上述列表中的一个已知的可解析依赖类型。
### 9.8 使用 @Value
`@Value` 注解主要用于注入属性值。这些值通常来源于外部化的配置文件，例如 properties 或 yml 文件。Spring 提供了内置的转换器来处理简单的数据类型转换，如 `String` 转 `Integer`。
#### 9.8.1 基本使用
考虑以下类，其中我们注入了一个属性 `catalog.name`：
```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("${catalog.name}") String catalog) {
        this.catalog = catalog;
    }
}
```
为了使这个配置生效，我们需要在配置类中使用 `@PropertySource` 注解指定属性文件的位置：
```java
@Configuration
@PropertySource("classpath:application.properties")
public class AppConfig { }
```
在 application.properties 文件中：
```java
catalog.name=MovieCatalog
```
#### 9.8.2 严格控制属性值
默认情况下，如果 `@Value` 中指定的属性找不到，Spring 会注入属性名作为值。例如，如果 `catalog.name` 不存在，`this.catalog` 就会被设置为 "${catalog.name}"。但如果你想严格控制此行为并确保属性值必须存在，你可以添加一个 `PropertySourcesPlaceholderConfigurer` bean：
```java
@Configuration
public class AppConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer propertyPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
}
```
> 注意：使用 JavaConfig 配置 `PropertySourcesPlaceholderConfigurer` 时，`@Bean` 方法必须是 `static` 的。

#### 9.8.3 提供默认值
如果你想为某个属性提供一个默认值，你可以这样做：
```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("${catalog.name:defaultCatalog}") String catalog) {
        this.catalog = catalog;
    }
}
```
#### 9.8.4 自定义转换
Spring 提供了内置的转换器来处理简单的数据类型转换，如 String 转 Integer。如果超出该范围，你也可以为自己的自定义类型（如 `MyCustomConverter`）提供转换支持，只需要配置一个 `ConversionService` Bean 并在其默认实现 `DefaultFormattingConversionService` 中进行添加即可：
```java
@Configuration
public class AppConfig {

    @Bean
    public ConversionService conversionService() {
        DefaultFormattingConversionService conversionService = new DefaultFormattingConversionService();
        conversionService.addConverter(new MyCustomConverter());
        return conversionService;
    }
}
```
#### 9.8.5 使用 SpEL 表达式
SpEL (Spring Expression Language) 允许我们在 `@Value` 中进行动态计算：
```java
@Component
public class MovieRecommender {

    private final String catalog;

    public MovieRecommender(@Value("#{systemProperties['user.catalog'] + 'Catalog' }") String catalog) {
        this.catalog = catalog;
    }
}
```
你还可以使用更复杂的数据结构：
```java
@Component
public class MovieRecommender {

    private final Map<String, Integer> countOfMoviesPerCatalog;

    public MovieRecommender(
            @Value("#{{'Thriller': 100, 'Comedy': 300}}") Map<String, Integer> countOfMoviesPerCatalog) {
        this.countOfMoviesPerCatalog = countOfMoviesPerCatalog;
    }
}
```
由于 SpEL 表达式不是本文重点，感兴趣的请自行阅读官方文档：
[Core Technologies](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#expressions)
### 9.9 使用 @PostConstruct 和 @PreDestroy
Spring 提供了两个重要的注解 `@PostConstruct` 和 `@PreDestroy`，允许你定义在 Spring 容器中创建 bean 后和销毁 bean 前需要执行的方法。

- `@PostConstruct`：这个注解标记的方法会在 bean 的所有属性都被初始化并由 Spring 容器管理之后立即调用，可以用于执行一些初始化工作，比如数据加载或其他只需要执行一次的操作。
- `@PreDestroy`：当 bean 即将从 Spring 容器中移除或应用上下文即将关闭时，这个注解标记的方法会被调用。它通常用于执行资源清理操作。

考虑一个 `CachingMovieLister` 类，它在启动时需要填充电影缓存，并在应用结束时清除此缓存：
```java
public class CachingMovieLister {

    @PostConstruct
    public void populateMovieCache() {
        // 在bean初始化后填充电影缓存...
    }

    @PreDestroy
    public void clearMovieCache() {
        // 在bean销毁前清除电影缓存...
    }
}
```
`populateMovieCache` 方法会在 `CachingMovieLister` bean 完全初始化并由 Spring 容器管理后立即执行。`clearMovieCache` 方法会在 Spring 容器关闭或 `CachingMovieLister` bean 被销毁之前执行。

:::info
**Java 版本注意事项**
从 JDK 6 到 JDK 8，`@PostConstruct` 和 `@PreDestroy` 注解都是标准 Java 库的一部分。但从 JDK 9 开始，整个 `javax.annotation` 包被从核心 Java 模块中分离，并在 JDK 11 中最终被移除。如果你正在使用 JDK 11 或更高版本，你需要从 Maven Central 获取 `javax.annotation-api` 依赖，并像其他库一样添加到应用的类路径中才可以使用这两个注解。
对于 Maven 项目，你可以在 pom.xml 文件中添加以下依赖：
:::

```java
<dependency>
    <groupId>javax.annotation</groupId>
    <artifactId>javax.annotation-api</artifactId>
    <version>1.3.2</version>
</dependency>
```
## 10.类路径扫描与托管组件
在 Spring 框架中，我们可以利用特定的注解对类进行标记，使得 Spring 在启动时扫描特定的包（package）中的类，从而自动识别并生成对应的 Bean，这样，我们就不必显式地在配置文件中进行 Bean 的注册。

1. **扫描机制**: 使用特定注解如 `@Component`（及其衍生注解，如 `@Service`, `@Repository`, `@Controller` 等）可以标记一个类作为 Spring 管理的 Bean。当 Spring 启动并扫描特定包时，它会自动找到这些带有注解的类，并生成对应的 Bean 定义，进而在 Spring 容器中管理它们。
2. **JavaConfig**: 从 Spring 3.0 开始，许多由 Spring JavaConfig 项目提供的特性已被集成到 Spring 核心框架中。这意味着你可以用 Java 代码代替传统的 XML 来定义 Bean。以下是一些常用的注解说明：
   1. `@Configuration`: 标记一个类为 Spring 的配置类，表示这个类中可能包含有 Bean 定义。
   2. `@Bean`: 用在方法上，表示该方法返回的对象应该被注册为一个 Spring 管理的 Bean。
   3. `@Import`: 允许从其他的配置类中导入 Bean 定义。
   4. `@DependsOn`: 表示当前的 Bean 依赖于另一个或多个 Bean。

考虑以下的简单服务：
```java
@Service
public class SimpleService {
    public void performTask() {
        System.out.println("Task performed!");
    }
}
```
为了让 Spring 知道在哪里找到带有 `@Service` 注解的类，我们需要定义一个配置类并启用类路径扫描：
```java
@Configuration
@ComponentScan(basePackages = "com.example.myapp")  // 替代 XML 中的类路径扫描指令
public class AppConfig {
    // 可以在这里定义更多的 @Bean 方法
}
```
在这个示例中，我们使用 `@Configuration` 标记了 `AppConfig` 类作为一个配置类，并用 `@ComponentScan` 来指定 Spring 扫描的包路径。

通过上述方式，Spring 在启动时会扫描指定的 `com.example.myapp` 包下的所有类，寻找如 `@Service`, `@Repository`, `@Controller` 等注解，并为它们自动生成 Bean 定义。

### 10.1 @Component 及其衍生注解
在 Spring 中，我们有一系列的注解来标记和分类我们的组件，这些注解被称为 "stereotype" 注解。

| **注解** | **描述** |
| --- | --- |
| @Component | 这是一个通用的注解，用于标记任何 Spring 管理的组件。 |
| @Repository | 专门用于标记数据访问对象（DAO）或仓库类，它具有自动异常转换的功能。 |
| @Service | 专门用于标记服务层的类。 |
| @Controller | 专门用于标记表示层的类，如 MVC 控制器。 |

虽然你可以使用 `@Component` 来标记任何组件，但使用 `@Repository`、`@Service` 或 `@Controller` 可以为你的类提供更具体的语义。这些特定的注解使得工具处理或与切面关联更为合适。例如，它们是切入点的理想目标。此外，这些注解在未来的 Spring 版本中可能还会带有额外的语义。

因此，如果你在服务层选择使用 `@Component` 或 `@Service`，那么 `@Service` 显然是更好的选择。同样地，如前所述，`@Repository` 已经支持作为自动异常转换的标记。

```java
// 通用组件
@Component
public class SomeComponent {
    // ...
}

// 数据访问对象
@Repository
public class UserDao {
    // ...
}

// 服务层
@Service
public class UserService {
    @Autowired
    private UserDao userDao;
    // ...
}

// 控制器
@Controller
public class UserController {
    @Autowired
    private UserService userService;
    // ...
}
```
在上述代码中，我们使用了 `@Component`, `@Repository`, `@Service`, 和 `@Controller` 注解来标记不同的组件。这样，当 Spring 扫描我们的代码时，它可以识别并正确地管理这些组件。
### 10.2 使用元注解和组合注解
在 Spring 中，许多注解都可以作为元注解（meta-annotations）在你的代码中使用。元注解是可以应用于另一个注解的注解。例如，我们之前提到的 `@Service` 注解实际上是用 `@Component` 作为元注解的，这意味着 `@Service` 在功能上与 `@Component` 是相似的。

你还可以组合多个元注解来创建 “组合注解”（composed annotations）。例如，Spring MVC 中的 `@RestController` 注解是由 `@Controller` 和 `@ResponseBody` 组合而成的。

此外，组合注解可以选择性地重新声明元注解的属性以允许自定义。这在你只想公开元注解的部分属性时特别有用。例如，Spring 的 `@SessionScope` 注解将作用域名称硬编码为 session，但仍允许自定义 `proxyMode`。

> TIP：
> 在 Spring 中，`@SessionScope` 是一个注解，用于定义 bean 的生命周期。当一个 bean 被标记为 session 作用域时，它意味着对于一个 HTTP 会话，该 bean 只会被创建一次。换句话说，同一个 HTTP 会话中的所有请求都会共享同一个 bean 实例，但不同的 HTTP 会话会有各自的 bean 实例。

`@Service` 注解的定义，展示其是如何使用 `@Component` 作为元注解的：
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Component 
public @interface Service {
    // ...
}
```
`@SessionScope` 注解的定义，展示其如何允许自定义 `proxyMode`：
```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Scope(WebApplicationContext.SCOPE_SESSION)
public @interface SessionScope {

    /**
     * Alias for {@link Scope#proxyMode}.
     * Defaults to {@link ScopedProxyMode#TARGET_CLASS}.
     */
    @AliasFor(annotation = Scope.class)
    ScopedProxyMode proxyMode() default ScopedProxyMode.TARGET_CLASS;
}
```
使用 `@SessionScope` 注解的服务类，不声明 `proxyMode`：
```java
@Service
@SessionScope
public class SessionScopedService {
    // ...
}
```
在上面的例子中，`SessionScopedService` 是 session 作用域的，这意味着每个用户会话都有其自己的 `SessionScopedService` 实例。

`@SessionScope` 注解允许你自定义 `proxyMode`。这主要涉及到 Spring 如何在不同的上下文中管理 session 作用域的 bean。大多数情况下，默认的 `ScopedProxyMode.TARGET_CLASS` 就足够了，但在某些情况下，你可能需要使用接口代理，这时可以设置为 `ScopedProxyMode.INTERFACES`。

使用 `@SessionScope` 注解的服务类，并重写 `proxyMode` 的值：

```java
@Service
@SessionScope(proxyMode = ScopedProxyMode.INTERFACES)
public class SessionScopedUserService implements UserService {
    // ...
}
```
> 注意：
> 1. 使用 `@SessionScope` 时，确保你的应用是 web 应用，并且已经配置了 Spring 的 web 上下文。
> 2. session 作用域的 bean 通常与 HTTP 会话有关，因此在非 web 环境中使用可能会导致问题。

### 10.3 自动检测类并注册 Bean 定义
Spring 可以自动检测带有特定注解（如 `@Service`, `@Repository` 等）的类，并在 `ApplicationContext` 中为它们注册相应的 Bean 定义。

例如，以下两个类适合这种自动检测：

```java
@Service
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    public SimpleMovieLister(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }
}

@Repository
public class JpaMovieFinder implements MovieFinder {
    // 实现省略以简化
}
```
要自动检测这些类并注册相应的 beans，你需要在你的 `@Configuration` 类中添加 `@ComponentScan`，其中 `basePackages` 属性是这两个类的共同父包。
```java
@Configuration
@ComponentScan(basePackages = "org.example")
public class AppConfig  {
    // ...
}
```
为了简洁，上面的示例也可以使用 `@ComponentScan` 注解的 `value` 属性（即 `@ComponentScan("org.example")`）。
:::info
**注意事项：**

1. **类路径扫描**：

当 Spring 扫描你的项目以查找带有特定注解的类时（例如 `@Service` 或 `@Repository`），它会查看你的项目的类路径。如果你使用 Ant 工具来构建你的项目并生成 JAR 文件，确保你没有设置 JAR 任务以仅包含文件，而不是目录结构。否则，Spring 可能无法正确扫描你的类。在某些特定的环境或 Java 版本中，可能存在安全策略，这些策略可能会隐藏类路径目录，这也会影响 Spring 的扫描功能。

2. **JDK 9 的模块路径**：

JDK 9 引入了一个新的特性，叫做模块系统（也称为 Jigsaw）。这意味着你可以将你的应用程序分解为多个模块，并明确指定哪些模块可以访问哪些资源。当使用 Spring 扫描类时，你需要确保你的模块描述符（module-info.java 文件）允许 Spring 访问你的类。如果你希望 Spring 能够访问和调用你类中的非公共成员（例如私有字段或方法），你需要在你的模块描述符中使用 `opens` 声明，而不是 `exports` 声明。

3. **自动注入**：

当你使用 `@ComponentScan`，Spring 会自动启用一些功能，使得你可以使用 `@Autowired` 注解来自动注入依赖。这是由 `AutowiredAnnotationBeanPostProcessor` 和 `CommonAnnotationBeanPostProcessor` 这两个组件实现的，它们确保 Spring 可以自动检测和连接你的组件。如果你不希望启用这种自动注入功能，可以通过设置特定的属性来禁用这两个处理器。例如，可以通过包含 `annotation-config` 属性并为其设置值 `false` 来禁用 `AutowiredAnnotationBeanPostProcessor` 和 `CommonAnnotationBeanPostProcessor` 的注册。
:::
### 10.4 使用过滤器自定义扫描
默认情况下，只有带有 `@Component`, `@Repository`, `@Service`, `@Controller`, `@Configuration` 或带有 `@Component` 的自定义注解的类会被 Spring 自动检测并注册为 Bean。但是，你可以通过应用自定义过滤器来修改和扩展此行为。你可以在 `@ComponentScan` 注解中使用 `includeFilters` 或 `excludeFilters` 属性来添加这些过滤器。

以下是可用的过滤选项：

| **过滤器选项** | **示例** | **描述** |
| --- | --- | --- |
| annotation (默认) | org.example.SomeAnnotation | 目标组件应该有的注解。 |
| assignable | org.example.SomeClass | 目标组件可以分配给的类或接口（即它们应该扩展或实现的类或接口）。 |
| aspectj | org.example..*Service+ | 目标组件应匹配的 AspectJ 类型表达式。 |
| regex | org\\.example\\.Default.* | 目标组件的类名应匹配的正则表达式。 |
| custom | org.example.MyTypeFilter | 自定义实现的过滤器，它应该实现 org.springframework.core.type.TypeFilter 接口。 |

以下示例配置将忽略所有带有 `@Repository` 注解的类，并仅包括名称中包含 "Stub" 且以 "Repository" 结尾的类：
```java
@Configuration
@ComponentScan(basePackages = "org.example",
        includeFilters = @Filter(type = FilterType.REGEX, pattern = ".*Stub.*Repository"),
        excludeFilters = @Filter(Repository.class))
public class AppConfig {
    // ...
}
```
此配置意味着 Spring 在扫描 "org.example" 包时，会忽略所有带有 `@Repository` 注解的类，并只包括那些类名中包含 "Stub" 且以 "Repository" 结尾的类。

你还可以通过在 `@ComponentScan` 注解上设置 `useDefaultFilters=false` 来禁用默认的过滤器。这实际上会禁用自动检测带有或带有 `@Component`, `@Repository`, `@Service`, `@Controller`, `@RestController`, 或 `@Configuration` 的类。

### 10.5 在组件中定义 Bean 元数据
在 Spring 中，你可以在组件类中定义 Bean，就像在 `@Configuration` 类中一样。这是通过使用 `@Bean` 注解来完成的。
```java
@Component
public class FactoryMethodComponent {

    @Bean
    @Qualifier("public")
    public TestBean publicInstance() {
        return new TestBean("publicInstance");
    }

    public void doWork() {
        // ... 
    }
}
```
上述类 `FactoryMethodComponent` 是一个 Spring 组件，其中 `doWork()` 方法包含应用程序特定的代码。但是，它还定义了一个 Bean，该 Bean 的工厂方法是 `publicInstance()`。

你还可以在 `@Bean` 方法中使用 `@Autowired` 和 `@Value` 注解来自动注入依赖和属性值：

```java
@Component
public class FactoryMethodComponent {

    @Bean
    protected TestBean protectedInstance(
            @Qualifier("public") TestBean spouse,
            @Value("#{privateInstance.age}") String country) {
        TestBean tb = new TestBean("protectedInstance", 1);
        tb.setSpouse(spouse);
        tb.setCountry(country);
        return tb;
    }
}
```
在上述示例中，`protectedInstance()` 方法自动注入了一个名为 "public" 的 `TestBean` Bean，并从另一个名为 "privateInstance" 的 Bean 中获取其 "age" 属性的值。
:::info
**注意事项：**

1. **@Bean 方法的处理**：

在普通的 `@Component` 类中的 `@Bean` 方法与在 `@Configuration` 类中的处理方式不同。在 `@Configuration` 类中，Spring 使用 CGLIB 代理来拦截方法和字段的调用，以提供特定的生命周期管理和代理。但在普通的 `@Component` 类中，方法调用具有标准的 Java 语义。

2. **静态 @Bean 方法**：

你可以声明 `@Bean` 方法为静态，这样它们可以在不创建其包含的配置类实例的情况下被调用。这在定义某些特定的 Bean（如 `BeanFactoryPostProcessor`）时非常有用。

3. **@Bean 方法的可见性**：

`@Bean` 方法的 Java 语言可见性（如 `public`, `protected`, `private`）对于 Spring 容器中的结果 Bean 定义没有直接影响。但是，在 `@Configuration` 类中的常规 `@Bean` 方法需要是可覆盖的，也就是说，它们不能被声明为 `private` 或 `final`。

4. **多个 @Bean 方法**：

一个类可以为同一个 Bean 持有多个 `@Bean` 方法，这取决于运行时可用的依赖项。Spring 容器会选择具有最大数量可满足依赖项的变体。
:::
### 10.6 自动检测组件的命名
当 Spring 扫描你的项目并自动检测到一个组件时，这个组件的 Bean 名称是由 `BeanNameGenerator` 策略生成的。

:::info
**默认命名规则：**

1. 如果你在 Spring 的特定注解（如 `@Component`, `@Repository`, `@Service`, `@Controller`）中提供了名称，那么这个名称将被用作对应的 Bean 定义的名称。
2. 如果没有提供名称，或者是其他类型的组件（例如通过自定义过滤器发现的），默认的 Bean 名称生成器会返回未大写的非限定类名。
:::
例如：
```java
@Service("myMovieLister")
public class SimpleMovieLister {
    // ...
}

@Repository
public class MovieFinderImpl implements MovieFinder {
    // ...
}
```
在上述示例中，`SimpleMovieLister` 类的 Bean 名称是 "myMovieLister"，而 `MovieFinderImpl` 类的 Bean 名称是 "movieFinderImpl"。

---

如果你不想依赖默认的 Bean 命名策略，可以提供自定义的命名策略。首先，你需要实现 `BeanNameGenerator` 接口，并确保包含一个默认的无参数构造函数。然后，在配置 `@ComponentScan` 扫描时，通过 `nameGenerator` 属性提供完全限定的类名。
```java
@Configuration
@ComponentScan(basePackages = "org.example", nameGenerator = MyNameGenerator.class)
public class AppConfig {
    // ...
}
```
在上述示例中，我们使用了自定义的 `MyNameGenerator` 类来生成 Bean 的名称。

:::info
**注意事项：**
如果由于多个自动检测的组件具有相同的非限定类名（即，名称相同但位于不同的包中的类）而导致命名冲突，你可能需要配置一个默认使用完全限定类名作为生成的 Bean 名称的 `BeanNameGenerator`。从 Spring Framework 5.2.3 开始，你可以使用 `org.springframework.context.annotation.FullyQualifiedAnnotationBeanNameGenerator` 来实现这一目的。

作为一般规则，当其他组件可能明确引用某个组件时，考虑在注解中指定名称。另一方面，当容器负责连接时，自动生成的名称是足够的。
:::

### 10.7 为自动检测的组件提供作用域
在 Spring 中，组件默认的作用域是单例（singleton）。但有时，你可能需要不同的作用域。这可以通过 `@Scope` 注解来指定。
```java
@Scope("prototype")
@Repository
public class MovieFinderImpl implements MovieFinder {
    // ...
}
```
在上述示例中，`MovieFinderImpl` 组件的作用域被设置为原型（prototype），这意味着每次请求该 Bean 时都会创建一个新的实例。
:::info
**注意事项：**

1. `@Scope` 注解只在具体的 Bean 类或工厂方法上进行检查。
2. 与 XML Bean 定义不同，这里没有 Bean 定义继承的概念，类层次结构在元数据方面是不相关的。
3. Spring 还提供了一些 Web 特定的作用域，如 "request" 或 "session"。你也可以使用 Spring 的元注解方法来组合自己的作用域注解。
:::

---

如果你不想依赖基于注解的方法来解析作用域，可以实现 `ScopeMetadataResolver` 接口。`ScopeMetadataResolver` 接口定义了如何为特定的 Bean 定义解析作用域元数据。简单来说，它决定了一个 Bean 应该有哪个作用域（如 `singleton`, `prototype`, `request`, `session` 等）。

当你使用 `@ComponentScan` 进行组件扫描时，Spring 默认使用一个内置的 `ScopeMetadataResolver` 实现，它基于 `@Scope` 注解来确定 Bean 的作用域。但在某些情况下，你可能想要自定义如何为 Bean 分配作用域。这时，可以实现自己的 `ScopeMetadataResolver` 并在 `@ComponentScan` 中指定它。

假设你想要所有的 `Repository` Beans 默认都是 `prototype` 作用域，而不是 `singleton`，你可以这样做：

```java
public class CustomScopeMetadataResolver implements ScopeMetadataResolver {
    @Override
    public ScopeMetadata resolveScopeMetadata(BeanDefinition definition) {
        ScopeMetadata metadata = new ScopeMetadata();
        if (definition.getBeanClassName().contains("Repository")) {
            metadata.setScopeName(ConfigurableBeanFactory.SCOPE_PROTOTYPE);
        } else {
            metadata.setScopeName(ConfigurableBeanFactory.SCOPE_SINGLETON);
        }
        return metadata;
    }
}

@Configuration
@ComponentScan(basePackages = "org.example", scopeResolver = CustomScopeMetadataResolver.class)
public class AppConfig {
    // ...
}
```

---

当你有一个非单例作用域的 Bean（如 `request` 或 `session` 作用域）并且你想在一个单例 Bean 中注入它时，你会遇到问题。因为单例 Bean 在启动时只被创建一次，而你可能希望每次请求都能得到一个新的 request-scoped Bean 实例。

为了解决这个问题，Spring 提供了代理机制。通过为非单例作用域的 Bean 创建一个代理，每次访问该 Bean 时，代理都会确保返回正确作用域的实例。

`@ComponentScan` 注解的 `scopedProxy` 属性允许你指定如何创建这些代理：

- `ScopedProxyMode.NO`：不创建代理。
- `ScopedProxyMode.INTERFACES`：使用 JDK 动态代理，这要求你的 Bean 至少实现一个接口。
- `ScopedProxyMode.TARGET_CLASS`：使用 CGLIB 创建代理。这不需要接口，但会为目标类创建一个子类。

假设你有一个 request-scoped Bean，并且你想在一个单例 Bean 中注入它：
```java
@Scope(value = WebApplicationContext.SCOPE_REQUEST, proxyMode = ScopedProxyMode.TARGET_CLASS)
@Component
public class UserPreferences {
    // ...
}

@Service
public class UserService {
    @Autowired
    private UserPreferences userPreferences;

    // ...
}
```
在上述示例中，`UserPreferences` 是 request-scoped 的，并使用 CGLIB 代理。这意味着即使 `UserService` 是一个单例，每次请求时它都会看到一个新的 `UserPreferences` 实例。
### 10.8 为组件提供限定符元数据
在 Spring 中，当你有多个相同类型的 bean 并且想要注入其中的一个特定 bean 时，你可能会遇到一个问题：Spring 如何知道注入哪一个？这时，`@Qualifier` 注解就派上用场了。

`@Qualifier` 注解可以帮助你指定注入哪一个特定的 bean。除了使用 `@Qualifier`，你还可以创建自定义的限定符注解，以便更细粒度地控制自动装配。

以下是一些示例，展示如何在组件类上使用这些注解：

```java
@Component
@Qualifier("Action")
public class ActionMovieCatalog implements MovieCatalog {
    // ...
}
```
在上面的示例中，我们使用了 `@Qualifier` 注解并为其提供了一个值 "Action"。这意味着当我们在其他地方需要一个类型为 `MovieCatalog` 并且限定符为 "Action" 的 bean 时，Spring 会选择这个 bean 进行注入。

你还可以使用自定义的限定符注解，如下所示：

```java
@Component
@Genre("Action")
public class ActionMovieCatalog implements MovieCatalog {
    // ...
}

```
在这个示例中，我们使用了一个名为 `@Genre` 的自定义注解，并为其提供了一个值 "Action"。
还有另一个示例：
```java
@Component
@Offline
public class CachingMovieCatalog implements MovieCatalog {
    // ...
}
```
这里，我们使用了一个名为 `@Offline` 的自定义注解，没有为其提供任何值。
> 需要注意的是，当你使用注解来提供元数据时，这些元数据是绑定到类定义本身的。这意味着，对于同一类型的 bean，你不能为其提供不同的限定符元数据，因为这些元数据是基于类而不是基于实例的。如果你使用 XML 配置，你可以为同一类型的多个 bean 提供不同的限定符元数据，但在使用 Java 注解和 JavaConfig 的情况下，这是不可能的。

### 10.9 生成候选组件的索引
当你在一个大型的 Spring 项目中工作时，Spring 需要知道哪些类是组件，例如 `@Component`, `@Service`, `@Repository` 等。通常，Spring 会在启动时扫描你的类路径，查找这些注解并注册相应的 beans。这种扫描过程在大型项目中可能会消耗一些时间。

为了优化这个过程，Spring 提供了一个工具：`spring-context-indexer`。这个工具的工作原理是在编译时生成一个索引文件，该文件列出了所有的组件。这样，Spring 在启动时就可以直接读取这个索引文件，而不需要扫描整个类路径，从而加速启动过程。当你使用这种模式时，所有目标为组件扫描的模块都必须使用此机制。

即使你使用这种索引，你现有的 `@ComponentScan` 指令仍然需要保持不变，以便告诉 Spring 在哪些包中扫描组件。当 Spring 的 `ApplicationContext` 检测到这样的索引时，它会自动使用它，而不是扫描类路径。

为了生成这个索引，你需要为每个包含目标组件的模块添加一个额外的依赖。以下是如何使用 Maven 添加这个依赖的示例：

```xml
<dependencies>
  <dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context-indexer</artifactId>
    <version>5.3.29</version>
    <optional>true</optional>
  </dependency>
</dependencies>
```
这个 `spring-context-indexer` 依赖会生成一个名为 `META-INF/spring.components` 的索引文件，并将其包含在 jar 文件中。它包含了所有 Spring 组件的列表，这样 Spring 就不需要在启动时扫描整个类路径。

当你在开发过程中添加或删除组件时，为了确保索引文件是最新的，你需要在你的 IDE 中启用 `spring-context-indexer` 作为一个注解处理器。这样，每次你编译代码时，索引文件都会自动更新。

注解处理器是 Java 编译器的一部分，它们可以在编译时处理注解，并根据这些注解生成额外的源代码或其他文件。`spring-context-indexer` 就是这样的一个注解处理器，它会在编译时扫描你的代码，查找 Spring 组件注解（如 `@Component`, `@Service` 等），并生成相应的索引文件。

不同的 IDE 可能有不同的配置方法，但大多数现代 IDE（如 IntelliJ IDEA 或 Eclipse）都支持注解处理器，并允许你为项目启用或禁用它们。

以 IntelliJ IDEA 为例，以下是如何启用注解处理器的步骤：

1. 打开你的 Spring 项目。
2. 转到 File > Project Structure。
3. 在左侧导航栏中，选择 Modules。
4. 在顶部，选择你的模块，然后点击 Dependencies 选项卡。
5. 确保你已经添加了 spring-context-indexer 作为依赖。
6. 返回左侧导航栏，选择 Annotation Processors。
7. 勾选 Enable annotation processing 选项。
8. 确保 Processor path 设置为使用项目的类路径。
9. 点击 OK 保存设置。

现在，每次你编译项目时，`spring-context-indexer` 都会运行，并更新 `META-INF/spring.components` 文件。
当类路径上找到 `META-INF/spring.components` 文件时，索引会自动启用。如果索引只为某些库（或用例）部分可用，但不能为整个应用程序构建，你可以通过设置 `spring.index.ignore` 为 `true` 来回退到常规的类路径安排（就像根本没有索引一样）。这可以作为 JVM 系统属性或通过 SpringProperties 机制来设置。
## 11.使用 JSR 330 标准注解
从 Spring 3.0 开始，Spring 开始支持 JSR-330 标准注解，这是一个关于依赖注入的标准。这些注解的扫描方式与 Spring 的注解相同。为了使用它们，你需要在你的类路径中包含相关的 jar 文件。

JSR-330 提供了一些基本的注解，如 `@Inject`，它可以作为 Spring 的 `@Autowired` 注解的替代品。
要在 Maven 项目中使用 JSR-330 注解，你需要添加 `javax.inject` 依赖。以下是如何在 Maven 项目中添加这个依赖的示例：

```xml
<dependency>
    <groupId>javax.inject</groupId>
    <artifactId>javax.inject</artifactId>
    <version>1</version>
</dependency>
```
### 11.1 使用 @Inject 和 @Named 进行依赖注入
在 Spring 中，我们通常使用 `@Autowired` 进行依赖注入。但除此之外，还可以使用 `@javax.inject.Inject` 进行注入。以下是一个简单的示例：
```java
import javax.inject.Inject;

public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Inject
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    public void listMovies() {
        this.movieFinder.findMovies(...);
        // ...
    }
}
```
与 `@Autowired` 类似，你可以在字段、方法和构造函数参数级别使用 `@Inject`。此外，你还可以将注入点声明为 `Provider`，这允许按需访问较短作用域的 bean 或通过 `Provider.get()` 调用延迟访问其他 bean。

`javax.inject.Provider<T>` 是 JSR-330 标准中定义的一个接口，它允许用户在需要时按需获取对象实例，而不是在对象创建时立即注入。这种按需获取的方式在某些场景中非常有用，例如：

1. **延迟初始化**：如果你的 bean 需要进行复杂或耗时的初始化，但你又不希望在应用启动时立即进行这种初始化，那么 `Provider` 可以帮助你实现这种延迟初始化。
2. **原型作用域的 bean**：当你想每次从 `Provider` 获取 bean 时都获得一个新的实例，这在原型作用域的 bean 中非常有用。
3. **动态查找**：在某些情况下，你可能希望在运行时动态地决定要注入哪个具体的 bean 实例。使用 `Provider` 可以帮助你实现这种动态查找。

以下是一个示例：
```java
import javax.inject.Inject;
import javax.inject.Provider;

public class SimpleMovieLister {

    private Provider<MovieFinder> movieFinder;

    @Inject
    public void setMovieFinder(Provider<MovieFinder> movieFinder) {
        this.movieFinder = movieFinder;
    }

    public void listMovies() {
        this.movieFinder.get().findMovies(...);
        // ...
    }
}
```
如果你希望为应该注入的依赖使用限定名，你应该使用 `@Named` 注解。以下是一个示例：
```java
import javax.inject.Inject;
import javax.inject.Named;

public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Inject
    public void setMovieFinder(@Named("main") MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```
与 `@Autowired` 类似，`@Inject` 也可以与 `java.util.Optional` 或 `@Nullable` 一起使用。这在这里更为适用，因为 `@Inject` 没有 `required` 属性。以下是如何使用 `@Inject` 和 `@Nullable` 的示例：
```java
import javax.inject.Inject;
import org.springframework.lang.Nullable;

public class SimpleMovieLister {

    @Inject
    public void setMovieFinder(@Nullable MovieFinder movieFinder) {
        // ...
    }
}
```
或者使用 `Optional`：
```java
import javax.inject.Inject;
import java.util.Optional;

public class SimpleMovieLister {

    @Inject
    public void setMovieFinder(Optional<MovieFinder> movieFinder) {
        // ...
    }
}
```
### 11.2 使用 @Named 和 @ManagedBean：@Component 注解的标准等价物
在 Spring 中，我们通常使用 `@Component` 注解来标记一个类作为组件，这样它就可以被 Spring 容器管理。但除此之外，还有两个等价的注解：`@javax.inject.Named` 和 `javax.annotation.ManagedBean`。
以下是一个使用 `@Named` 的示例：
```java
import javax.inject.Inject;
import javax.inject.Named;

@Named("movieListener")
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Inject
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```
你也可以使用 `@ManagedBean("movieListener")` 替代 `@Named("movieListener")`，效果是相同的。
通常，我们使用 `@Component` 注解一个类时不指定名称，`@Named` 也可以这样使用：
```java
import javax.inject.Inject;
import javax.inject.Named;

@Named
public class SimpleMovieLister {

    private MovieFinder movieFinder;

    @Inject
    public void setMovieFinder(MovieFinder movieFinder) {
        this.movieFinder = movieFinder;
    }

    // ...
}
```
当你使用 `@Named` 或 `@ManagedBean` 时，组件扫描的方式与使用 Spring 的注解完全相同。以下是一个配置类的示例，它启用了组件扫描：
```java
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;

@Configuration
@ComponentScan(basePackages = "org.example")
public class AppConfig  {
    // ...
}
```
> 需要注意的是，与 `@Component` 不同，JSR-330 的 `@Named` 和 JSR-250 的 `@ManagedBean` 注解不是可组合的。如果你想构建自定义的组件注解，应该使用 Spring 的原型模型。

### 11.3 JSR-330 标准注解的局限性
当你使用标准注解时，应该知道有一些重要的功能是不可用的。以下是 Spring 组件模型元素与 JSR-330 变体之间的对比：

| **Spring** | **javax.inject.*** | **说明 / 限制** |
| --- | --- | --- |
| @Autowired | @Inject | @Inject 没有 'required' 属性。但可以与 Java 8 的 Optional 一起使用。 |
| @Component | @Named / @ManagedBean | JSR-330 不提供一个可组合的模型，只提供了一种标识命名组件的方式。 |
| @Scope("singleton") | @Singleton | JSR-330 的默认作用域类似于 Spring 的原型。但为了与 Spring 的默认设置保持一致，在 Spring 容器中声明的 JSR-330 bean 默认是单例的。要使用除单例之外的作用域，你应该使用 Spring 的 @Scope 注解。尽管 javax.inject 也提供了一个 @Scope 注解，但这只是用于创建自己的注解。 |
| @Qualifier | @Qualifier / @Named | javax.inject.Qualifier 只是用于构建自定义限定符的元注解。具体的 String 限定符（如带有值的 Spring 的 @Qualifier）可以通过 javax.inject.Named 关联。 |
| @Value | - | 没有等价物。 |
| @Required | - | 没有等价物。 |
| @Lazy | - | 没有等价物。 |
| ObjectFactory | Provider | javax.inject.Provider 是 Spring 的 ObjectFactor**y** 的直接替代品，只是 get() 方法名更短。它也可以与 Spring 的 @Autowired 或非注解的构造函数和 setter 方法结合使用。 |

## 12.基于 Java 的容器配置
### 12.1 基本概念：@Bean 和 @Configuration
在 Spring 的 Java 配置支持中，最核心的部分是使用 `@Configuration` 注解的类和 `@Bean` 注解的方法。

- `@Bean`：`@Bean` 注解用于标识一个方法，该方法负责创建、配置和初始化一个新对象，这个对象将由 Spring IoC 容器管理。对于熟悉 Spring XML 配置的人来说，`@Bean` 注解与 XML 中的 `<bean/>` 元素起到相同的作用。你可以在任何使用了 Spring `@Component` 注解的类中使用 `@Bean` 注解的方法，但它们最常与 `@Configuration` 一起使用。
- `@Configuration`：使用 `@Configuration` 注解一个类表示该类的主要目的是作为 bean 定义的来源。此外，`@Configuration` 类允许你通过在同一类中调用其他 `@Bean` 方法来定义 bean 之间的依赖关系。

以下是一个简单的 `@Configuration` 类的示例：
```java
@Configuration
public class AppConfig {

    @Bean
    public MyServiceImpl myService() {
        return new MyServiceImpl();
    }
}
```
这个 `AppConfig` 类与之前的 Spring XML 配置功能相同，但我们已经将其转换为 JavaConfig 形式。

:::info
**完整的 @Configuration 与 “轻量级” @Bean 模式是什么？**
当 `@Bean` 方法在没有使用 `@Configuration` 注解的类中声明时，我们称它们处于 “轻量级” 模式。在 `@Component` 或普通类中声明的 `@Bean` 方法被视为 “轻量级”，因为它们的主要目的与包含它们的类不同，而 `@Bean` 方法只是一个额外的功能。

与完整的 `@Configuration` 不同，轻量级的 `@Bean` 方法不能声明 bean 之间的依赖关系。它们只操作其包含组件的内部状态。因此，这样的 `@Bean` 方法不应调用其他 `@Bean` 方法。

在常见的场景中，`@Bean` 方法应在 `@Configuration` 类中声明，确保始终使用 “完整” 模式，从而确保跨方法引用被重定向到容器的生命周期管理。这可以防止同一个 `@Bean` 方法被意外地通过常规的 Java 调用，从而帮助减少在 “轻量级 ”模式下难以追踪的微妙错误。

接下来的部分将深入讨论 `@Bean` 和 `@Configuration` 注解。但首先，我们将介绍使用基于 Java 的配置创建 Spring 容器的各种方法。
:::

### 12.2 使用 AnnotationConfigApplicationContext 实例化 Spring 容器
在 Spring 框架中，我们可以使用不同的方式来实例化 Spring 容器。传统的方式是使用 XML 文件作为配置，然后通过 `ClassPathXmlApplicationContext` 来加载这些配置。但随着 Java 注解的普及，Spring 也提供了基于注解的配置方式，即使用 `AnnotationConfigApplicationContext`。

Spring 的 `AnnotationConfigApplicationContext` 是一个强大的 `ApplicationContext` 实现，它可以接受 `@Configuration` 类、普通的 `@Component` 类和带有 JSR-330 注解的类作为输入。

当你向 `AnnotationConfigApplicationContext` 提供一个带有 `@Configuration` 注解的类，以下两件事会发生：

1. 这个 `@Configuration` 类本身会被注册到 Spring 容器中，这意味着你可以像其他的 bean 一样注入和使用它。
2. 这个 `@Configuration` 类中所有带有 `@Bean` 注解的方法都会被注册为单独的 bean 定义。这些方法定义了如何创建、配置和初始化这些 bean。

而当你提供带有 `@Component` 或 JSR-330 注解（如 `@Named`）的类时，这些类会被注册为 bean 定义。这意味着 Spring 容器会管理这些类的实例。此外，这些类中的字段和方法可以使用依赖注入注解，如 `@Autowired` 或 `@Inject`，来自动注入所需的依赖。
#### 12.2.1 使用 @Configuration 类实例化
与使用 XML 文件不同，我们可以直接使用带有 `@Configuration` 注解的 Java 类来实例化 `AnnotationConfigApplicationContext`。这种方式的好处是我们可以完全摆脱 XML，使配置更加简洁。
```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```
#### 12.2.2 不仅限于 @Configuration
虽然 `@Configuration` 是一个常用的注解，但 `AnnotationConfigApplicationContext` 的构造函数也接受其他注解，如 `@Component` 或 JSR-330 标准的注解。
```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(MyServiceImpl.class, Dependency1.class, Dependency2.class);
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```
#### 12.2.3 程序化构建容器
如果你希望更加灵活地构建容器，可以使用无参数的构造函数来创建 `AnnotationConfigApplicationContext`，然后通过 `register()` 方法来注册配置类。
```java
public static void main(String[] args) {
    // 创建一个 AnnotationConfigApplicationContext 对象，用于加载 Spring 配置类和 Bean
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    
    // 注册 Spring 的 Bean
    ctx.register(AppConfig.class, OtherConfig.class);
    ctx.register(AdditionalConfig.class);
    
    // 刷新 Spring 上下文，使注册的 Bean 生效
    ctx.refresh();
    
    // 从 Spring 上下文中获取 MyService 类的实例
    MyService myService = ctx.getBean(MyService.class);
    myService.doStuff();
}
```
#### 12.2.4 启用组件扫描
组件扫描是 Spring 的一个强大功能，它可以自动发现并注册 Spring 容器中的 beans。要启用这个功能，你可以在 `@Configuration` 类上使用 `@ComponentScan` 注解。
```java
@Configuration
@ComponentScan(basePackages = "com.acme") 
public class AppConfig  {
    // ...
}
```
此外，`AnnotationConfigApplicationContext` 也提供了 `scan()` 方法，实现相同的功能。
```java
public static void main(String[] args) {
    // 创建一个 AnnotationConfigApplicationContext 对象，用于加载 Spring 配置类和容器管理 Bean
    AnnotationConfigApplicationContext ctx = new AnnotationConfigApplicationContext();
    
    // 扫描指定包路径下的 Spring 配置类，并将其注册到容器中
    ctx.scan("com.acme");
    
    // 刷新容器，使之前通过注解或 XML 配置的 Bean 得以初始化并注入到容器中
    ctx.refresh();
    
    // 从容器中获取 MyService 类型的 Bean 实例
    MyService myService = ctx.getBean(MyService.class);
}
```
#### 12.2.5 Web 应用程序支持
对于 Web 应用程序，Spring 提供了 `AnnotationConfigWebApplicationContext`，它是 `AnnotationConfigApplicationContext` 的 Web 版本。这使得我们可以在 Web 环境中，如配置 Spring 的 `ContextLoaderListener` servlet 监听器、Spring MVC `DispatcherServlet` 等，使用基于注解的配置方式。
如果你需要更多的灵活性，可以考虑使用 `GenericWebApplicationContext`，它是 `AnnotationConfigWebApplicationContext` 的一个替代品，适用于更加程序化的使用场景。
### 12.3 使用 @Bean 注解
#### 12.3.1 @Bean 注解简介
`@Bean` 是一个方法级别的注解，用于定义一个 Spring 容器中的 bean。你可以在带有 `@Configuration` 或 `@Component` 注解的类中使用它。
#### 12.3.2 声明一个 Bean
要声明一个 bean，你可以使用 `@Bean` 注解标注一个方法。这个方法的返回值定义了 bean 的类型，而方法名默认作为 bean 的名称。
```java
@Configuration
public class AppConfig {

    @Bean
    public TransferServiceImpl transferService() {
        return new TransferServiceImpl();
    }
}
```
上述配置定义了一个名为 `transferService` 的 bean，其类型为 `TransferServiceImpl`。
#### 12.3.3 使用接口定义 Bean
你可以使用接口（或基类）作为 `@Bean` 方法的返回类型，这意味着当你定义一个 Bean 时，你可以让 `@Bean` 方法返回一个接口类型，而不是一个具体的实现类：
```java
@Configuration
public class AppConfig {

    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl();
    }
}
```
但这样做可能会限制高级类型预测的可见性。这意味着，如果你使用接口作为 `@Bean` 方法的返回类型，某些高级的实现类型特性或方法可能不会被直接暴露或可见，因为你是通过接口来引用它的，而不是具体的实现类。

如果你始终按照声明的服务接口引用类型，那么你的 `@Bean` 返回类型可以安全地遵循这个设计决策。也就是说，如果你在应用中总是通过接口来引用这个 Bean（即，你不需要知道或使用到具体实现的特定方法），那么使用接口作为 `@Bean` 的返回类型是一个安全的做法。

#### 12.3.4 Bean 依赖
一个带有 `@Bean` 注解的方法可以有任意数量的参数，这些参数描述了构建该 bean 所需的依赖。例如，如果我们的 `TransferService` 需要一个 `AccountRepository`，我们可以通过方法参数来实现这个依赖：
```java
@Configuration
public class AppConfig {

    @Bean
    public TransferService transferService(AccountRepository accountRepository) {
        return new TransferServiceImpl(accountRepository);
    }
}
```
这种解决机制与基于构造函数的依赖注入非常相似。
#### 12.3.5 接收生命周期回调
使用 `@Bean` 定义的类支持常规的生命周期回调，并可以使用 JSR-250 的 `@PostConstruct` 和 `@PreDestroy` 注解。

此外，如果一个 bean 实现了 `InitializingBean`、`DisposableBean` 或 `Lifecycle`，它们的相应方法也会被容器调用。

你还可以使用 `@Bean` 注解来指定任意的初始化和销毁回调方法：

```java
public class BeanOne {

    public void init() {
        // initialization logic
    }
}

public class BeanTwo {

    public void cleanup() {
        // destruction logic
    }
}

@Configuration
public class AppConfig {

    @Bean(initMethod = "init")
    public BeanOne beanOne() {
        return new BeanOne();
    }

    @Bean(destroyMethod = "cleanup")
    public BeanTwo beanTwo() {
        return new BeanTwo();
    }
}
```
#### 12.3.6 指定 Bean 作用域
Spring 提供了 `@Scope` 注解，以便你可以指定 bean 的范围。默认范围是单例，但你可以使用 `@Scope` 注解来覆盖这个默认值：
```java
@Configuration
public class MyConfiguration {

    @Bean
    @Scope("prototype")
    public Encryptor encryptor() {
        // ...
    }
}
```
#### 12.3.7 自定义 Bean 命名
默认情况下，配置类使用 `@Bean` 方法的名称作为结果 bean 的名称。但这个功能可以使用 `name` 属性来覆盖：
```java
@Configuration
public class AppConfig {

    @Bean("myThing")
    public Thing thing() {
        return new Thing();
    }
}
```
#### 12.3.8 Bean 别名
有时，为一个 bean 设置多个名称是很有用的。`@Bean` 注解的 `name` 属性接受一个字符串数组，用于此目的：
```java
@Configuration
public class AppConfig {

    @Bean({"dataSource", "subsystemA-dataSource", "subsystemB-dataSource"})
    public DataSource dataSource() {
        // instantiate, configure and return DataSource bean...
    }
}
```
#### 12.3.9 Bean 描述
有时，为 bean 提供更详细的文本描述是很有帮助的。为了给 `@Bean` 添加描述，你可以使用 `@Description` 注解：
```java
@Configuration
public class AppConfig {

    @Bean
    @Description("Provides a basic example of a bean")
    public Thing thing() {
        return new Thing();
    }
}
```
### 12.4 使用 @Configuration 注解
`@Configuration` 是一个类级别的注解，表示该类是 bean 定义的来源。在 `@Configuration` 类中，你可以通过 `@Bean` 注解的方法来声明 bean。此外，你还可以通过在 `@Configuration` 类中调用 `@Bean` 方法来定义 bean 之间的依赖关系。
#### 12.4.1 注入 Bean 之间的依赖关系
当一个 bean 依赖于另一个 bean 时，你可以简单地在一个 `@Bean` 方法中调用另一个 `@Bean` 方法来表示这种依赖关系。例如：
```java
@Configuration
public class AppConfig {

    @Bean
    public BeanOne beanOne() {
        return new BeanOne(beanTwo());
    }

    @Bean
    public BeanTwo beanTwo() {
        return new BeanTwo();
    }
}
```
在上述示例中，`beanOne` 通过构造函数注入获得了对 `beanTwo` 的引用。
:::info
这种声明 bean 之间依赖关系的方法只在 `@Configuration` 类中的 `@Bean` 方法中有效。你不能在普通的 `@Component` 类中声明 bean 之间的依赖关系。
:::
#### 12.4.2 查找方法注入
查找方法注入是一个高级功能，通常很少使用。但在某些情况下，例如当一个单例作用域的 bean 依赖于一个原型作用域的 bean 时，它是非常有用的。以下示例展示了如何使用查找方法注入：
```java
public abstract class CommandManager {
    public Object process(Object commandState) {
        Command command = createCommand();
        command.setState(commandState);
        return command.execute();
    }

    protected abstract Command createCommand();
}

@Configuration
public class CommandConfig {

    @Bean
    @Scope("prototype")
    public AsyncCommand asyncCommand() {
        return new AsyncCommand();
    }

    @Bean
    public CommandManager commandManager() {
        return new CommandManager() {
            protected Command createCommand() {
                return asyncCommand();
            }
        };
    }
}
```
#### 12.4.3 关于 Java 配置如何在内部工作的进一步信息
考虑以下示例：
```java
@Configuration
public class AppConfig {

    @Bean
    public ClientService clientService1() {
        ClientServiceImpl clientService = new ClientServiceImpl();
        clientService.setClientDao(clientDao());
        return clientService;
    }

    @Bean
    public ClientService clientService2() {
        ClientServiceImpl clientService = new ClientServiceImpl();
        clientService.setClientDao(clientDao());
        return clientService;
    }

    @Bean
    public ClientDao clientDao() {
        return new ClientDaoImpl();
    }
}
```
在上述示例中，`clientDao()` 被 `clientService1()` 和 `clientService2()` 各调用了一次。由于这个方法每次都创建并返回一个新的 `ClientDaoImpl` 实例，你可能会认为会有两个实例（每个服务一个）。但实际上，Spring 默认将实例化的 bean 设置为单例作用域。这是因为所有的 `@Configuration` 类在启动时都会被 CGLIB 子类化。在子类中，子方法首先检查容器中是否有缓存的 bean，然后再调用父方法创建新实例。这种行为可能会根据你的 bean 的作用域而有所不同。这里我们讨论的是单例。

:::info
从 Spring 3.2 开始，你不再需要将 CGLIB 添加到你的类路径中，因为 CGLIB 类已经被重新打包到 `org.springframework.cglib` 下，并直接包含在 `spring-core` JAR 中。

由于 CGLIB 在启动时动态地添加了一些功能，所以有一些限制。特别是，配置类不能是 `final` 的。但从 Spring 4.3 开始，配置类上允许使用任何构造函数，包括使用 `@Autowired` 或声明一个单一的非默认构造函数进行默认注入。

如果你希望避免任何 CGLIB 带来的限制，可以考虑在非 `@Configuration` 类上声明你的 `@Bean` 方法（例如，在普通的 `@Component` 类上）。这样，`@Bean` 方法之间的跨方法调用不会被拦截，所以你必须完全依赖于构造函数或方法级别的依赖注入。
:::

### 12.5 组合基于 Java 的配置
Spring 基于 Java 的配置特性允许您编写 XML 注释，这可以降低配置的复杂性。
#### 12.5.1 使用 @Import 注解
在 Spring 中，我们经常需要将多个配置组合在一起。为了实现这一点，Spring 提供了一个名为 `@Import` 的注解，它允许我们从一个配置类加载另一个配置类中的 `@Bean` 定义。
考虑以下示例：
```java
@Configuration
public class ConfigA {

    @Bean
    public A a() {
        return new A();
    }
}

@Configuration
@Import(ConfigA.class)
public class ConfigB {

    @Bean
    public B b() {
        return new B();
    }
}
```
在上面的代码中，我们有两个配置类：`ConfigA` 和 `ConfigB`。`ConfigB` 通过 `@Import` 注解导入了 `ConfigA`，这意味着当我们初始化 Spring 上下文并只提供 `ConfigB` 时，`ConfigA` 中定义的所有 bean 也将被加载。
这是如何工作的：
```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(ConfigB.class);

    // 现在，A和B两个bean都可以获取...
    A a = ctx.getBean(A.class);
    B b = ctx.getBean(B.class);
}
```
这种方法简化了容器的实例化，因为我们只需要处理一个类，而不是在构建时记住多个 `@Configuration` 类。

:::info
从 Spring 框架 4.2 开始，`@Import` 还支持引用常规组件类，这与 `AnnotationConfigApplicationContext.register` 方法类似。这在你想避免组件扫描并使用几个配置类作为入口点来明确定义所有组件时特别有用。
:::

#### 12.5.2 在导入的 @Bean 定义中注入依赖
在实际的应用场景中，不同的配置类中定义的 beans 经常会互相依赖。当使用 `@Configuration` 类时，我们必须确保对其他 beans 的引用是有效的 Java 语法。

幸运的是，Spring 提供了简单的方法来解决这个问题。一个 `@Bean` 方法可以有任意数量的参数，这些参数描述了 bean 的依赖关系。以下是一个更实际的示例，其中有几个 `@Configuration` 类，每个类都依赖于其他类中声明的 beans：

```java
@Configuration
public class ServiceConfig {

    @Bean
    public TransferService transferService(AccountRepository accountRepository) {
        return new TransferServiceImpl(accountRepository);
    }
}

@Configuration
public class RepositoryConfig {

    @Bean
    public AccountRepository accountRepository(DataSource dataSource) {
        return new JdbcAccountRepository(dataSource);
    }
}

@Configuration
@Import({ServiceConfig.class, RepositoryConfig.class})
public class SystemTestConfig {

    @Bean
    public DataSource dataSource() {
        // 创建并返回一个新的DataSource
    }
}

public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(SystemTestConfig.class);
    TransferService transferService = ctx.getBean(TransferService.class);
    transferService.transfer(100.00, "A123", "C456");
}
```
:::info
此外，还有另一种方法来实现相同的结果。由于 `@Configuration` 类本身也是容器中的一个 bean，这意味着它们可以利用 `@Autowired` 和 `@Value` 注入和其他 beans 一样的功能。

但是，请确保你以这种方式注入的依赖关系只是最简单的类型。`@Configuration` 类在上下文的初始化过程中很早就被处理了，强制以这种方式注入依赖关系可能会导致意外的早期初始化。因此，尽可能使用基于参数的注入，如上面的示例所示。

特别注意，通过 `@Bean` 定义的 `BeanPostProcessor` 和 `BeanFactoryPostProcessor` 应该通常声明为静态 `@Bean` 方法，不触发其包含的配置类的实例化。否则，`@Autowired` 和 `@Value` 可能无法在配置类本身上工作，因为可能会在 `AutowiredAnnotationBeanPostProcessor` 之前将其创建为一个 bean 实例。
:::
以下示例显示了如何将一个 bean 自动装配到另一个 bean：

```java
@Configuration
public class ServiceConfig {

    @Autowired
    private AccountRepository accountRepository;

    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl(accountRepository);
    }
}

@Configuration
public class RepositoryConfig {

    private final DataSource dataSource;

    public RepositoryConfig(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Bean
    public AccountRepository accountRepository() {
        return new JdbcAccountRepository(dataSource);
    }
}

@Configuration
@Import({ServiceConfig.class, RepositoryConfig.class})
public class SystemTestConfig {

    @Bean
    public DataSource dataSource() {
        // 创建并返回一个新的DataSource
    }
}

public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(SystemTestConfig.class);
    TransferService transferService = ctx.getBean(TransferService.class);
    transferService.transfer(100.00, "A123", "C456");
}
```
> TIP：从 Spring 框架 4.3 开始，`@Configuration` 类支持构造函数注入。此外，如果目标 bean 只定义了一个构造函数，那么不需要指定 `@Autowired`。

#### 12.5.3 为了便于导航而完全限定导入的 beans
在前面的场景中，使用 `@Autowired` 很有效，并提供了所需的模块化，但确定哪里声明了自动装配的 bean 定义仍然有些模糊。例如，作为开发者，当你查看 `ServiceConfig` 时，你如何确切地知道 `@Autowired AccountRepository` bean 在哪里声明的？代码中并没有明确指出。

为了解决这种模糊性，并希望在 IDE 中从一个 `@Configuration` 类直接导航到另一个，你可以考虑自动装配配置类本身。以下示例展示了如何做到这一点：

```java
@Configuration
public class ServiceConfig {

    @Autowired
    private RepositoryConfig repositoryConfig;

    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl(repositoryConfig.accountRepository());
    }
}
```
在上述情况中，`AccountRepository` 的定义是完全明确的。但是，`ServiceConfig` 现在与 `RepositoryConfig` 紧密耦合。这是一个权衡。通过使用基于接口或基于抽象类的 `@Configuration` 类，可以在某种程度上减轻这种紧密耦合。考虑以下示例：
```java
@Configuration
public class ServiceConfig {

    @Autowired
    private RepositoryConfig repositoryConfig;

    @Bean
    public TransferService transferService() {
        return new TransferServiceImpl(repositoryConfig.accountRepository());
    }
}

@Configuration
public interface RepositoryConfig {

    @Bean
    AccountRepository accountRepository();
}

@Configuration
public class DefaultRepositoryConfig implements RepositoryConfig {

    @Bean
    public AccountRepository accountRepository() {
        return new JdbcAccountRepository(/* 数据源参数等 */);
    }
}

@Configuration
@Import({ServiceConfig.class, DefaultRepositoryConfig.class})
public class SystemTestConfig {

    @Bean
    public DataSource dataSource() {
        // 创建并返回一个新的DataSource
    }
}

public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(SystemTestConfig.class);
    TransferService transferService = ctx.getBean(TransferService.class);
    transferService.transfer(100.00, "A123", "C456");
}
```
现在，`ServiceConfig` 与具体的 `DefaultRepositoryConfig` 松散耦合，而内置的 IDE 工具仍然很有用：你可以轻松地获取 `RepositoryConfig` 实现的类型层次结构。这样，导航 `@Configuration` 类及其依赖关系与通常导航基于接口的代码的过程没有什么不同。

:::info
如果你想影响某些 beans 的启动创建顺序，可以考虑将其中一些声明为 `@Lazy`（首次访问时创建，而不是在启动时）或者 `@DependsOn` 某些其他 beans（确保在当前 bean 之前创建特定的其他 beans，超出后者的直接依赖关系）。
:::

#### 12.5.4 根据条件选择性地包含 @Configuration 类或 @Bean 方法
在 Spring 中，有时我们希望根据某些条件来决定是否启用某个配置类或某个 Bean 方法。这样，我们可以根据不同的环境或其他条件来动态地调整应用程序的配置。

一个常见的用例是使用 `@Profile` 注解。这个注解允许我们仅在 Spring 环境中启用了特定的配置文件时激活某些 beans。

但实际上，`@Profile` 是基于一个更通用的注解 `@Conditional` 来实现的。`@Conditional` 注解允许我们指定一个条件类，这个条件类决定了是否应该注册一个 `@Bean`。

这个条件类需要实现 `Condition` 接口，这个接口有一个 `matches(...)` 方法，返回 true 或 false 来决定是否满足条件。

例如，以下是 `@Profile` 注解背后的实际 `Condition` 实现：

```java
@Override
public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    // 读取@Profile注解的属性
    MultiValueMap<String, Object> attrs = metadata.getAllAnnotationAttributes(Profile.class.getName());
    if (attrs != null) {
        for (Object value : attrs.get("value")) {
            // 检查当前环境是否接受指定的配置文件
            if (context.getEnvironment().acceptsProfiles(((String[]) value))) {
                return true;
            }
        }
        return false;
    }
    return true;
}
```
简而言之，这个 `Condition` 实现检查了当前的 Spring 环境是否接受了 `@Profile` 注解指定的配置文件。如果接受了，那么与该 `@Profile` 注解关联的 `@Bean` 就会被注册。
> TIP：为了更深入地了解如何使用 `@Conditional` 来定义自己的条件，你可以查看 `@Conditional` 的javadoc。

[Conditional (Spring Framework 5.3.29 API)](https://docs.spring.io/spring-framework/docs/5.3.29/javadoc-api/org/springframework/context/annotation/Conditional.html)
#### 12.5.5 结合 Java 和 XML 配置
虽然 Spring 提供了 `@Configuration` 注解来支持 Java 配置，但这并不意味着它完全取代了传统的 XML 配置。实际上，有时候，XML 配置在某些场景下仍然是一个很好的选择。

但是，如果你更偏好使用 Java 配置，或者在项目中已经大量使用了 Java 配置，但又有一些旧的 XML 配置需要整合，Spring 为你提供了一个方便的解决方案。

你可以使用 `AnnotationConfigApplicationContext` 来加载 Java 配置，并通过 `@ImportResource` 注解来导入必要的 XML 配置。

例如，假设你有一个名为 legacy-config.xml 的 XML 配置文件，你可以这样整合它：

```java
@Configuration
@ImportResource("classpath:legacy-config.xml")
public class JavaConfig {
    // Your Java-based configuration beans go here
}
```
这样，当你使用 `AnnotationConfigApplicationContext` 来加载 `JavaConfig` 类时，它也会自动加载并应用 legacy-config.xml 中的配置。
#### 12.5.6 使用 @Configuration 类与 Java 配置结合

1. 将 `@Configuration` 类定义为普通的 Spring Bean

首先，你需要知道的是，`@Configuration` 注解的类最终也是容器中的 bean 定义。例如，我们可以创建一个名为 `AppConfig` 的 `@Configuration` 类，并在 Java 配置中将其定义为一个 bean。
```java
@Configuration
public class AppConfig {

    @Autowired
    private DataSource dataSource;

    @Bean
    public AccountRepository accountRepository() {
        return new JdbcAccountRepository(dataSource);
    }

    @Bean
    public TransferService transferService() {
        return new TransferService(accountRepository());
    }
}
```

2. 使用 `@ComponentScan` 自动扫描 `@Configuration` 类

由于 `@Configuration` 注解本身带有 `@Component` 元注解，因此使用 `@ComponentScan` 可以自动扫描和注册 `@Configuration` 注解的类。

例如，如果你的 `AppConfig` 类位于 com.acme 包中，你可以在主配置类中使用 `@ComponentScan` 来自动扫描和注册它：

```java
@Configuration
@ComponentScan(basePackages = "com.acme")
public class MainConfig {

    @Bean
    public DataSource dataSource() {
        // 创建并返回DataSource实例
    }
}
```
这样，当你使用 `AnnotationConfigApplicationContext` 来加载 `MainConfig` 类时，它会自动扫描 com.acme 包，并注册所有带有 `@Configuration` 注解的类。
#### 12.5.7 使用 @PropertySource 在 @Configuration 类中引入属性文件
在某些应用中，虽然我们主要使用 `@Configuration` 类来配置 Spring 容器，但我们仍然需要加载外部的属性文件，例如数据库连接信息。在这种情况下，我们可以使用 `@PropertySource` 注解来加载属性文件，而不需要使用 XML。

以下是如何使用 `@PropertySource` 在 `@Configuration` 类中加载属性文件的示例：

```java
@Configuration
@PropertySource("classpath:/com/acme/jdbc.properties")
public class AppConfig {

    @Value("${jdbc.url}")
    private String url;

    @Value("${jdbc.username}")
    private String username;

    @Value("${jdbc.password}")
    private String password;

    @Bean
    public DataSource dataSource() {
        return new DriverManagerDataSource(url, username, password);
    }
}
```
在上面的例子中，我们使用 `@PropertySource` 注解加载了一个名为 jdbc.properties 的属性文件。然后，我们使用 `@Value` 注解将属性文件中的值注入到 `AppConfig` 类的字段中。

jdbc.properties 文件内容可能如下：

```properties
jdbc.url=jdbc:hsqldb:hsql://localhost/xdb
jdbc.username=root
jdbc.password=root
```
最后，我们可以像往常一样使用 `AnnotationConfigApplicationContext` 来加载 `AppConfig` 类，并从容器中获取 bean：
```java
public static void main(String[] args) {
    ApplicationContext ctx = new AnnotationConfigApplicationContext(AppConfig.class);
    DataSource dataSource = ctx.getBean(DataSource.class);
    // ...
}
```
通过这种方式，我们可以方便地加载外部属性文件，而无需使用 XML。
## 13.环境抽象
在 Spring 中，`Environment` 接口是一个核心概念，它主要处理两个关键方面：配置文件（profiles）和属性（properties）。

1. **配置文件（Profiles）**：配置文件允许你定义一组 bean，这些 bean 只有在特定的配置文件被激活时才会被注册到容器中。例如，你可能有开发和生产两个环境，每个环境都需要不同的数据库配置。通过使用配置文件，你可以为每个环境定义不同的 bean 配置。`Environment` 对象的角色是确定哪些配置文件当前是活动的，以及默认情况下应该激活哪些配置文件。
2. **属性（Properties）**：属性是应用程序中的配置值，它们可以来自多种来源，例如：属性文件、JVM 系统属性、系统环境变量等。`Environment` 对象提供了一个方便的接口，用于配置属性来源并从中解析属性。
### 13.1 Bean 定义配置文件
在 Spring 中，配置文件提供了一种机制，允许你在不同的环境中注册不同的 beans。这意味着你可以为不同的运行环境（如开发、测试、生产等）定义不同的 bean 配置。
例如：

- 在开发环境中，你可能想使用内存数据库。
- 在生产环境中，你可能想使用 JNDI 来查找真实的数据库。
#### 13.1.1 使用 @Profile
`@Profile` 注解允许你指定当某个或多个特定的配置文件被激活时，哪些组件或配置类应该被注册。
例如，考虑以下的数据源配置：
```java
@Configuration
@Profile("development")
public class DevDataSourceConfig {

    @Bean
    public DataSource dataSource() {
        return new EmbeddedDatabaseBuilder()
            .setType(EmbeddedDatabaseType.HSQL)
            .addScript("classpath:sql/schema.sql")
            .addScript("classpath:sql/test-data.sql")
            .build();
    }
}

@Configuration
@Profile("production")
public class ProdDataSourceConfig {

    @Bean
    public DataSource dataSource() throws Exception {
        Context ctx = new InitialContext();
        return (DataSource) ctx.lookup("java:comp/env/jdbc/datasource");
    }
}
```
在上面的示例中，`DevDataSourceConfig` 只在 "development" 配置文件被激活时注册，而 `ProdDataSourceConfig` 只在 "production" 配置文件被激活时注册。
#### 13.1.2 激活配置文件
要激活特定的配置文件，你可以使用多种方法。最直接的方法是在应用程序启动时，通过 Environment API 来设置：
```java
AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
context.getEnvironment().setActiveProfiles("development");
context.register(AppConfig.class);
context.refresh();
```
此外，你还可以通过 `spring.profiles.active` 属性来声明式地激活配置文件。这可以通过 application 配置文件、系统环境变量、 JVM 系统属性等方式来设置。
#### 13.1.3 默认配置文件
如果没有明确激活任何配置文件，Spring 会查找名为 "default" 的配置文件。这可以作为没有任何特定配置文件激活时的后备选项。
```java
@Configuration
@Profile("default")
public class DefaultConfig {
    // bean definitions
}
```
如果你想更改默认配置文件的名称，可以使用 `Environment` 的 `setDefaultProfiles()` 方法，或者使用 `spring.profiles.default` 属性。
### 13.2 PropertySource 抽象
Spring 的 `Environment` 抽象提供了在一个可配置的属性源层次结构上进行搜索的操作。属性源是键值对的任何来源的简单抽象。例如，这可以是系统属性、环境变量等。
考虑以下代码：
```java
ApplicationContext ctx = new GenericApplicationContext();
Environment env = ctx.getEnvironment();
boolean containsMyProperty = env.containsProperty("my-property");
System.out.println("我的环境中是否包含'my-property'属性? " + containsMyProperty);
```
在上面的代码中，我们询问 Spring 当前环境是否定义了 my-property 属性。为了回答这个问题，`Environment` 对象在一组 `PropertySource` 对象上执行搜索。

默认情况下，Spring 的 `StandardEnvironment` 配置了两个 `PropertySource` 对象：

1. 代表 JVM 系统属性的对象（`System.getProperties()`）。
2. 代表系统环境变量的对象（`System.getenv()`）。

这些默认的属性源适用于独立应用程序中的 `StandardEnvironment`。对于 Web 应用程序，还会有其他的属性源，如 servlet 配置、servlet 上下文参数等。

当你使用 `StandardEnvironment` 时，如果在运行时存在 my-property 系统属性或环境变量， `env.containsProperty("my-property")` 将返回 true。

这种搜索是分层的。默认情况下，系统属性优先于环境变量。所以，如果在调用 `env.getProperty("my-property")` 时，my-property 属性同时在两个地方设置，系统属性的值会被返回。

最重要的是，整个机制都是可配置的。如果你有一个自定义的属性来源，你可以将其集成到这个搜索中。为此，你可以实现并实例化自己的 `PropertySource`，并将其添加到当前 `Environment` 的 `PropertySources` 集合中。以下是如何做到这一点的示例：

```java
ConfigurableApplicationContext ctx = new GenericApplicationContext();
MutablePropertySources sources = ctx.getEnvironment().getPropertySources();
sources.addFirst(new MyPropertySource());
```
在上面的代码中，`MyPropertySource` 已经被添加到搜索中，并具有最高的优先级。如果它包含一个 my-property 属性，该属性将被检测并返回，优先于任何其他 `PropertySource` 中的 my-property 属性。
### 13.3 使用 @PropertySource
`@PropertySource` 注解提供了一种方便和声明性的机制，用于将属性源添加到 Spring 的环境中。

考虑一个名为 app.properties 的文件，该文件包含键值对 `testbean.name=myTestBean`。以下的配置类使用 `@PropertySource`，这样当调用 `testBean.getName()` 时，会返回 `myTestBean`：

```java
@Configuration
@PropertySource("classpath:/com/myco/app.properties")
public class AppConfig {

    @Autowired
    Environment env;

    @Bean
    public TestBean testBean() {
        TestBean testBean = new TestBean();
        testBean.setName(env.getProperty("testbean.name"));
        return testBean;
    }
}
```
在 `@PropertySource` 的资源位置中存在的任何 `${…}` 占位符都会根据已经在环境中注册的属性源集合进行解析，如下例所示：
```java
@Configuration
@PropertySource("classpath:/com/${my.placeholder:default/path}/app.properties")
public class AppConfig {

    @Autowired
    Environment env;

    @Bean
    public TestBean testBean() {
        TestBean testBean = new TestBean();
        testBean.setName(env.getProperty("testbean.name"));
        return testBean;
    }
}
```
假设 `my.placeholder` 存在于已经注册的某个属性源中（例如，系统属性或环境变量），则占位符会被解析为相应的值。如果没有，则使用 `default/path` 作为默认值。如果没有指定默认值并且无法解析属性，则会抛出 `IllegalArgumentException`。

:::info
根据 Java 8 的约定，`@PropertySource` 注解是可重复的。但是，所有这样的 `@PropertySource` 注解都需要在同一级别上声明，要么直接在配置类上，要么作为同一自定义注解中的元注解。不建议混合直接注解和元注解，因为直接注解实际上会覆盖元注解。
:::

### 13.4 在语句中解析占位符
在 Spring 的早期版本中，元素中的占位符的值只能通过 JVM 系统属性或环境变量来解析。但现在，这种情况已经发生了变化。由于 Spring 的 `Environment` 抽象贯穿于整个容器中，我们可以轻松地通过它来解析占位符。这意味着你可以根据需要自定义解析过程。你可以更改搜索系统属性和环境变量的优先级，或完全删除它们。你还可以根据需要添加自己的属性源。

具体来说，只要 customer 属性在 `Environment` 中可用，无论它在哪里定义，以下语句都能正常工作：

```java
// 假设你有一个配置类
@Configuration
public class AppConfig {

    @Value("${customer}")
    private String customerConfig;

    // 其他的bean定义和方法...

    // 这里可以使用customerConfig变量来加载特定的配置或资源
}
```
在上述示例中，我们使用 `@Value` 注解来注入名为 customer 的属性值。这意味着，不论这个属性是从系统属性、环境变量，还是其他任何在 `Environment` 中定义的属性源中获取的，它都可以被正确地注入到 `customerConfig` 变量中。
## 14.注册 LoadTimeWeaver
`LoadTimeWeaver` 是 Spring 用来在类加载到 Java 虚拟机 (JVM) 时动态转换它们的工具。

要启用加载时织入，你可以在你的一个 `@Configuration` 类中添加 `@EnableLoadTimeWeaving` 注解，如下例所示：

```java
@Configuration
@EnableLoadTimeWeaving
public class AppConfig {
}
```
一旦为 `ApplicationContext` 配置了加载时织入，该 `ApplicationContext` 中的任何 bean 都可以实现 `LoadTimeWeaverAware` 接口，从而接收到加载时织入实例的引用。这与 Spring 的 [JPA 支持](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/data-access.html#orm-jpa)结合使用尤为有用，因为 JPA 类转换可能需要加载时织入。
> TIP：有关更多详细信息，请参考 [LocalContainerEntityManagerFactoryBean](https://docs.spring.io/spring-framework/docs/5.3.29/javadoc-api/org/springframework/orm/jpa/LocalContainerEntityManagerFactoryBean.html) 的 javadoc。要了解有关 AspectJ 加载时织入的更多信息，请参考 Spring 框架中的 [AspectJ 加载时织入](https://docs.spring.io/spring-framework/docs/5.3.29/reference/html/core.html#aop-aj-ltw)部分。

## 15.ApplicationContext 的附加功能
如章节介绍中所述，`org.springframework.beans.factory` 包为管理和操作 beans 提供了基本功能，包括以编程方式。而 `org.springframework.context` 包增加了 `ApplicationContext` 接口，该接口扩展了 `BeanFactory` 接口，并增加了其他接口以提供更多的应用框架导向的功能。许多人完全以声明式的方式使用 `ApplicationContext`，甚至不以编程方式创建它，而是依赖如 `ContextLoader` 这样的支持类在 Java EE web 应用的正常启动过程中自动实例化一个 `ApplicationContext`。

为了以更加框架导向的方式增强 `BeanFactory` 的功能，`context` 包还提供了以下功能：

1. **国际化消息访问**：通过 `MessageSource` 接口，你可以以国际化风格访问消息。
2. **资源访问**：通过 `ResourceLoader` 接口，你可以访问如 URLs 和文件等资源。
3. **事件发布**：通过使用 `ApplicationEventPublisher` 接口，你可以向实现 `ApplicationListener` 接口的 beans 发布事件。
4. **加载多个（分层的）上下文**：通过 `HierarchicalBeanFactory` 接口，你可以让每个上下文专注于特定的层，例如应用的 web 层。
### 15.1 使用 MessageSource 进行国际化
Spring 的 `ApplicationContext` 接口扩展了一个名为 `MessageSource` 的接口，为我们提供了国际化功能。Spring 还提供了 `HierarchicalMessageSource` 接口，支持层次化地解析消息。

以下是 `MessageSource` 接口中定义的主要方法：

- `getMessage(String code, Object[] args, String default, Locale loc)`: 基本方法，用于从 `MessageSource` 中检索消息。如果找不到指定语言环境的消息，则使用默认消息。传入的任何参数都会成为替换值。
- `getMessage(String code, Object[] args, Locale loc)`: 与上一个方法基本相同，但没有默认消息。如果找不到消息，将抛出 `NoSuchMessageException`。
- `getMessage(MessageSourceResolvable resolvable, Locale locale)`: 上述方法中使用的所有属性也都封装在一个名为 `MessageSourceResolvable` 的类中，你可以与此方法一起使用。

当加载 `ApplicationContext` 时，它会自动搜索上下文中定义的名为 `messageSource` 的 `MessageSource` bean。如果找到这样的 bean，所有对上述方法的调用都会委托给消息源。

Spring 提供了三种 `MessageSource` 实现：`ResourceBundleMessageSource`、`ReloadableResourceBundleMessageSource` 和 `StaticMessageSource`。其中，`StaticMessageSource` 很少使用，但提供了以编程方式向源添加消息的方法。

#### 15.1.1 配置 MessageSource
首先，你需要配置 `MessageSource`。在 Spring 中，你可以使用 `ResourceBundleMessageSource`，它从类路径下的属性文件中读取消息。
```java
@Configuration
public class AppConfig {

    @Bean
    public MessageSource messageSource() {
        ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
        messageSource.setBasenames("messages/format", "messages/exceptions", "messages/windows");
        messageSource.setDefaultEncoding("UTF-8");
        return messageSource;
    }
}
```
这里，我们指定了三个基本名称：`messages/format`、`messages/exceptions` 和 `messages/windows`。这意味着你应该在类路径下的 `messages` 目录中有 `format.properties`、`exceptions.properties` 和 `windows.properties` 文件。
#### 15.1.2 创建属性文件
在 `src/main/resources/messages` 目录下，创建以下属性文件：
format.properties
```java
message=Alligators rock!
```
exceptions.properties
```java
argument.required=The {0} argument is required.
```
#### 15.1.3 使用 MessageSource
在你的服务或控制器中，你可以注入 `MessageSource` 并使用它来获取消息。
```java
@Service
public class MyService {

    @Autowired
    private MessageSource messageSource;

    public String getFormattedMessage() {
        return messageSource.getMessage("message", null, Locale.ENGLISH);
    }

    public String getErrorMessage(String arg) {
        return messageSource.getMessage("argument.required", new Object[]{arg}, Locale.ENGLISH);
    }
}
```
#### 15.1.4 国际化
为了支持多种语言，你可以为每种语言创建一个属性文件。例如，为英国英语创建 `format_en_GB.properties` 和 `exceptions_en_GB.properties`。
exceptions_en_GB.properties
```java
argument.required=Oi mate, the ''{0}'' argument is required, innit?
```
当你的应用程序在英国英语的环境中运行时，它会使用这些特定的消息。
#### 15.1.5 使用
现在，当你调用 `MyService` 的 `getErrorMessage` 方法时，它会返回适当的消息，具体取决于当前的 `Locale`。
### 15.2 标准和自定义事件

### 15.3 便捷获取底层资源

### 15.4 应用程序启动跟踪

### 15.5 Web 应用程序的便捷 ApplicationContext 实例化

### 15.6 将 Spring ApplicationContext 部署为 Java EE RAR 文件

## 16.BeanFactory API


---
title: 01-KIE入门
---
## 1.KIE (Knowledge Is Everything)

**KIE (Knowledge Is Everything)** 是一个综合性的项目，它的主要目的是将我们的多种相关技术整合在同一个平台下。你可以将它想象成一个大房子，而这个房子里住着多个技术项目，它们都共享这个 “房子” 的核心资源。

在 KIE 的 “房子” 里，有以下几个主要的 “居民” 或项目：

1. **Drools**：这是一个<u>业务规则管理系统（business-rule management system，BRMS）</u>，它拥有前向链接和后向链接的推理规则引擎。简单来说，就是它**可以快速可靠地评估业务规则和复杂的事件处理**。你可以将其看作是一个专家系统的基石。在人工智能领域，专家系统是模仿人类专家决策能力的计算机系统。想象一下，有一个计算机程序可以像人类专家那样做决策，Drools 就是为实现这个目标提供支持的工具。
2. **jBPM**：这是一个灵活的<u>业务流程管理套件</u>。它帮助你通过描述实现业务目标所需的步骤来建模你的业务目标。就好比你有一个目标，jBPM 就是告诉你为了达到这个目标，你需要按照哪些步骤行动。
3. **OptaPlanner**：这是一个<u>约束求解器</u>，它优化了如员工排班、车辆路线、任务分配和云优化等使用场景。想象一下，你有一个复杂的问题需要解决，OptaPlanner 就是帮助你找到最佳解决方案的工具。
4. **Business Central**：这是一个功能齐全的网络应用程序，用于<u>可视化地组合自定义的业务规则和流程</u>。就像一个画板，你可以在上面绘制和组合你的业务规则。
5. **UberFire**：这是一个受到 Eclipse Rich Client Platform 启发的基于网络的工作台框架。如果你熟悉 Eclipse，那么你可以理解 UberFire 提供了一个类似但基于网络的工作环境。

其中，我们主要介绍的是 Drools 部分，对其他部分感兴趣的请自行在官网了解：[https://www.drools.org/](https://www.drools.org/)

## 2.构建（Building）

### 2.1 创建并构建 Kie 项目

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-122418.png)

**Kie 项目**与我们通常看到的 Maven 项目结构非常相似，但有一个小小的特点：它包含一个名为 `kmodule.xml` 的文件。这个文件的主要任务是**描述可以从这个项目中创建的 KieBases 和 KieSessions**。

📁 **文件位置**：你需要将 `kmodule.xml` 文件放在 Maven 项目的 `resources/META-INF` 文件夹中。而其他的 Kie 相关文件，比如 DRL 或 Excel 文件，应该存放在 `resources` 文件夹或其下的任何子文件夹中。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-123241.png)

📄 **简化的 kmodule.xml**：虽然你可以在 `kmodule.xml` 中进行各种配置，但为了简化，你可以只使用一个空的 kmodule 标签，如下所示：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<kmodule xmlns="http://www.drools.org/xsd/kmodule"/>
```

这样做的话，**kmodule 将只包含一个默认的 KieBase，并且 `resources` 文件夹下的所有 Kie 资源（比如 DRL 或 Excel 文件）都会被编译并添加到其中**。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-123555.png)

🛠️ **触发构建**：为了构建这些资源，你只需要为它们创建一个 KieContainer。这个过程很简单，只需从类路径中读取要构建的文件：

```java
// 从工厂中创建 KieServices 对象
KieServices kieServices = KieServices.Factory.get();
// 从 KieServices 中获取 KieContainer 对象，其会加载 kmodule.xml 文件并 load 规则文件
KieContainer kieContainer = kieServices.getKieClasspathContainer();
```

其中，`KieServices` 是一个接口，你可以通过它访问所有的 Kie 构建和运行时工具。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-123747.png)

最后，所有的 Java 源代码和 Kie 资源都会被编译并部署到 KieContainer 中，这样在运行时你就可以使用它们了。

### 2.2 kmodule.xml 文件

`kmodule.xml` 文件是 KIE 项目中的一个关键文件。你可以把它想象成一个 “菜单”，在这里你可以声明性地配置你想要创建的 KieBase(s) 和 KieSession(s)。

📚 **KieBase 是什么？**

KieBase 就像是一个图书馆，存储了应用程序的所有知识定义，包括规则、流程、函数和类型模型。但请注意，KieBase 本身不存储数据。你可以把它看作是一个书架，而不是书本。要操作数据，你需要从 KieBase 创建会话（KieSession），在这些会话中，你可以插入数据或启动流程实例。

> [!TIP]
>
> 🚀 **关于 KieBase 的性能建议**
>
> 创建 KieBase 可能会消耗较多的资源，而创建会话（KieSession）则相对轻量。因此，建议在可能的情况下缓存 KieBase，以便多次创建会话。但作为初学者，你不必过于担心这个问题，因为 KieContainer 已经自动为你提供了这个缓存机制。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-124709.png)

🖥️ **KieSession 的作用**

KieSession 是运行时数据的 “操作场所”。你可以从 KieBase 创建它，或者更简单地，如果在 `kmodule.xml` 文件中已经定义了，你可以直接从 KieContainer 创建它。你可以把 KieSession 想象成一个工作台，你在上面操作和执行数据。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-124809.png)

📄 **基本结构**：

`kmodule.xml` 文件是 Drools 项目中的一个核心配置文件。这个文件允许你定义和配置一个或多个 KieBases。对于每个 KieBase，你还可以定义可以从中创建的所有不同 KieSessions。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<kmodule xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xmlns="http://www.drools.org/xsd/kmodule">
  
    <configuration>
        <property key="drools.evaluator.supersetOf" value="org.mycompany.SupersetOfEvaluatorDefinition"/>
    </configuration>

    <!-- 配置 kiebase
        name: kiebase 名称，必须唯一
        default: 是否为默认 kiebase ，默认为 false
        eventProcessingMode: 事件处理模式，可选值为 cloud 和 stream ，默认为 cloud
            - cloud: 云模式，事件在规则引擎中被处理
            - stream: 流模式，事件在规则引擎之外被处理
        equalsBehavior: 等价行为，可选值为 identity 和 equality ，默认为 identity
            - identity: 使用 == 比较对象
            - equality: 使用 equals() 比较对象
        declarativeAgenda: 声明性 agenda ，可选值为 enabled 和 disabled ，默认为 enabled
        packages: kiebase 所在的包，多个包之间用逗号分隔，同一个 kiebase 下的 kiesession 可以访问同一个包下的规则
        includes: 引入其他 kiebase ，多个 kiebase 之间用逗号分隔
     -->
    <kbase name="KBase1" default="true" eventProcessingMode="cloud" equalsBehavior="equality" declarativeAgenda="enabled" packages="org.domain.pkg1">

        <!-- 配置 kiesession 
            name: kiesession 名称，必须唯一
            type: kiesession 类型，可选值为 stateful 和 stateless ，默认为 stateful
                - stateful: 有状态的 kiesession ，可以在多个规则之间共享数据
                - stateless: 无状态的 kiesession ，每个规则都有自己的数据，规则之间不共享数据
            default: 是否为默认 kiesession ，默认为 false
            clockType: 时钟类型，可选值为 pseudo 和 realtime ，默认为 pseudo
                - pseudo: 伪时钟，时间不会随着规则引擎的执行而改变
                - realtime: 真实时钟，时间会随着规则引擎的执行而改变
            beliefSystem: 信任系统，可选值为 simple 和 jtms ，默认为 simple
                - simple: 简单信任系统，规则引擎会在每次执行规则之前清空所有的事实（Fact），包括事实的历史记录
                - jtms: JTMS 信任系统，规则引擎会在每次执行规则之前清空所有的事实（Fact），但是会保留事实的历史记录
        -->
        <ksession name="KSession2_1" type="stateful" default="true"/>
        <ksession name="KSession2_2" type="stateless" default="false" beliefSystem="jtms"/>
    </kbase>
    
    <kbase name="KBase2" default="false" eventProcessingMode="stream" equalsBehavior="equality" declarativeAgenda="enabled" packages="org.domain.pkg2, org.domain.pkg3" includes="KBase1">
        <ksession name="KSession3_1" type="stateful" default="false" clockType="realtime">
            <fileLogger file="drools.log" threaded="true" interval="10"/>
            <workItemHandlers>
                <workItemHandler name="name" type="org.domain.WorkItemHandler"/>
            </workItemHandlers>
            <calendars>
                <calendar name="monday" type="org.domain.Monday"/>
            </calendars>
            <listeners>
                <ruleRuntimeEventListener type="org.domain.RuleRuntimeListener"/>
                <agendaEventListener type="org.domain.FirstAgendaListener"/>
                <agendaEventListener type="org.domain.SecondAgendaListener"/>
                <processEventListener type="org.domain.ProcessListener"/>
            </listeners>
        </ksession>
    </kbase>
</kmodule>
```

🔍 **例子解析**：

在上面给出的示例中，首先定义了一些关键值对，这些是用于配置 KieBases 构建过程的可选属性。例如，此示例的 `kmodule.xml` 文件定义了一个名为 `supersetOf` 的额外自定义操作符，由 `org.mycompany.SupersetOfEvaluatorDefinition` 类实现。

接下来，定义了两个 KieBases：

1. **KBase1**：可以从中实例化两种不同类型的 KieSessions。
2. **KBase2**：只能从中实例化一种 KieSession。

每个 KieBase 和 KieSession 都有其自己的特定配置，如事件处理模式、包、监听器等。

在 `kmodule.xml` 文件中，`kbase` 标签是用来定义 KieBase 的。每个 KieBase 可以有多个属性，这些属性决定了 KieBase 的行为和配置。

下面是这些属性的详细解释：

| 属性名              | 默认值   | 可接受的值                   | 含义                                                         |
| ------------------- | -------- | ---------------------------- | ------------------------------------------------------------ |
| name                | 无       | 任何名称                     | 这是从 KieContainer 获取此 KieBase 的名称。这是唯一必需的属性。 |
| includes            | 无       | 任何逗号分隔的 KieBases 列表 | 这个属性列出了此 `kmodule` 中包含的其他 KieBases。所有这些 KieBases 的工件也将包含在此 KieBase 中。 |
| packages            | 所有     | 任何逗号分隔的包列表         | 默认情况下，`resources` 文件夹下的所有 Drools 工件都会被包含在 KieBase 中。此属性允许你限制将在此 KieBase 中编译的工件，只包括属于包列表中的工件。 |
| default             | false    | true, false                  | 定义此 KieBase 是否为此模块的默认 KieBase，这样它可以从 KieContainer 创建，而无需传递任何名称给它。每个模块中最多只能有一个默认的 KieBase。 |
| equalsBehavior      | identity | identity, equality           | 定义当一个新事实（Fact）被插入到工作内存中时，Drools 的行为。使用 identity 时，除非工作内存中已经存在相同的对象，否则它总是创建一个新的 FactHandle，而使用 equality 时，只有当新插入的对象不等于（根据其等于方法）已经存在的事实时才会这样做。 |
| eventProcessingMode | cloud    | cloud, stream                | 当在 cloud 模式下编译时，KieBase 将事件视为正常的事实，而在 stream 模式下允许对它们进行时间推理。 |
| declarativeAgenda   | disabled | disabled, enabled            | 定义 Declarative Agenda 是否启用。                           |

在 `kmodule.xml` 文件中，`ksession` 标签是用来定义 KieSession 的。每个 KieSession 可以有多个属性，这些属性决定了 KieSession 的行为和配置。

下面是这些属性的详细解释：

| 属性名       | 默认值   | 可接受的值               | 含义                                                         |
| ------------ | -------- | ------------------------ | ------------------------------------------------------------ |
| name         | 无       | 任何名称                 | 这是 KieSession 的唯一名称。你可以使用这个名称从 KieContainer 中获取 KieSession。这是唯一必需的属性。 |
| type         | stateful | stateful, stateless      | stateful 会话允许你反复地与工作内存交互，而 stateless 会话则是使用提供的数据集对工作内存进行一次性执行。 |
| default      | false    | true, false              | 定义此 KieSession 是否为此模块的默认 KieSession，这样它可以从 KieContainer 创建，而无需传递任何名称给它。每个模块中最多只能有一个默认的 KieSession。 |
| clockType    | realtime | realtime, pseudo         | 定义事件时间戳是由系统时钟确定，还是由应用程序控制的伪时钟确定。这个时钟对于单元测试时间规则特别有用。 |
| beliefSystem | simple   | simple, jtms, defeasible | 定义 KieSession 使用的信仰系统类型。                         |

在前面的 `kmodule.xml` 示例中，我们看到了可以为每个 KieSession 声明性地创建文件日志记录器、一个或多个 WorkItemHandlers、日历以及三种不同类型的监听器：ruleRuntimeEventListener、agendaEventListener 和 processEventListener。

定义了类似前面示例中的 `kmodule.xml` 后，你可以简单地使用它们的名称从 KieContainer 获取 KieBases 和 KieSessions。

示例代码：

```java
// 从工厂中创建 KieServices 对象
KieServices kieServices = KieServices.Factory.get();
// 从 KieServices 中获取 KieContainer 对象，其会加载 kmodule.xml 文件并 load 规则文件
KieContainer kieContainer = kieServices.getKieClasspathContainer();

// 从 KieContainer 中获取 KieBase 对象(不提供 kBaseName 则获取默认的 KieBase)
KieBase kieBase = kieContainer.getKieBase("KBase1");
// 从 KieBase 中获取 KieSession 对象(不提供 kSessionName 则获取默认的 KieSession)
// 有状态的 KieSession
KieSession kieSession1 = kieContainer.newKieSession("KSession2_1");
// 无状态的 KieSession
kieContainer.newStatelessKieSession("KSession2_2");
```

> [!WARNING]
>
> 由于 KSession2_1 和 KSession2_2 是两种不同的类型（第一个是有状态的，而第二个是无状态的），因此需要根据它们在 kmodule.xml 中 type 属性声明的类型在 KieContainer 上调用两种不同的方法。

如果 KieBase 和 KieSession 被 default 属性标记为默认，那么可以不传递任何名称从 KieContainer 获取它们。

示例代码：

```java
KieContainer kContainer = ...

KieBase kBase1 = kContainer.getKieBase(); // 返回 KBase1
KieSession kieSession1 = kContainer.newKieSession(); // 返回 KSession2_1
```

由于 Kie 项目也是一个 Maven 项目，因此在 `pom.xml` 文件中声明的 groupId、artifactId 和 version 用于生成唯一标识应用程序中的此项目的 ReleaseId。

```java
KieServices kieServices = KieServices.Factory.get();
ReleaseId releaseId = kieServices.newReleaseId( "org.acme", "myartifact", "1.0" );
KieContainer kieContainer = kieServices.newKieContainer( releaseId );
```

> [!ATTENTION]
>
> 从 Drools 6 开始，KieBase 和 KiePackage 不支持序列化。你需要通过 KieContainer 构建 KieBase。另一方面，KieSession 可以通过 KieMashaller 进行序列化/反序列化。

### 2.3 使用 Maven 构建

Maven 是一个流行的项目管理工具，它可以帮助你管理项目的生命周期，包括依赖管理、构建、测试和部署。对于 Drools，KIE 提供了一个专门的 Maven 插件，确保项目中的资源得到验证和预编译。

❓**为什么使用 KIE Maven 插件？**

使用 KIE Maven 插件的主要好处是它确保你的 Drools 和 jBPM 资源在构建时得到正确的处理。这意味着在部署之前，任何潜在的问题或错误都会被捕获，从而减少运行时的问题。

❓**如何配置 KIE Maven 插件？**

要使用此插件，只需在 Maven 的 pom.xml 文件的构建部分中添加它，并通过使用 kjar 打包来激活它。

```xml
<packaging>kjar</packaging>
...
<build>
  <plugins>
    <plugin>
      <groupId>org.kie</groupId>
      <artifactId>kie-maven-plugin</artifactId>
      <version>7.74.1.Final</version>
      <extensions>true</extensions>
    </plugin>
  </plugins>
</build>
```

此插件支持所有的 Drools/jBPM 知识资源。但是，如果你在 Java 类中使用了特定的 KIE 注解，例如 `@kie.api.Position`，你需要在项目中添加对 kie-api 的编译时依赖。我们建议为所有额外的 KIE 依赖使用 provided 范围。这样，kjar 会保持尽可能轻量，并且不依赖于任何特定的 KIE 版本。

❓**不使用 Maven 插件的后果是什么？**

如果不使用 Maven 插件构建 KIE 模块，所有资源将按原样复制到生成的 JAR 中。当运行时加载该 JAR 时，它会尝试构建所有资源。如果存在编译问题，它将返回一个空的 KieContainer。这也将编译开销推到运行时。总的来说，这并不推荐，应始终使用 Maven 插件。

### 2.4 编程方式定义 KieModule

除了在 `kmodule.xml` 文件中声明性地定义 KieBases 和 KieSessions，你还可以通过编程方式来定义它们。这种方法还允许你明确地添加包含 Kie 工件的文件（如 DRL 文件），而不是自动从项目的资源文件夹中读取它们。

操作步骤：

1. **创建一个 KieFileSystem**：这是一个虚拟文件系统，你需要将项目中包含的所有资源添加到这个文件系统中。你可以从 KieServices 获取 KieFileSystem 的实例。
2. **添加 kmodule.xml 配置文件**：这是一个必要的步骤。Kie 提供了一个方便的流畅 API，由 KieModuleModel 实现，以编程方式创建此文件。

下面的示例展示了如何创建一个 KieModuleModel，如何配置它，并如何将其转换为 XML 并添加到 KieFileSystem 中：

```java
// 从工厂中创建 KieServices 对象
KieServices kieServices = KieServices.Factory.get();
// 创建 KieModuleModel 对象
KieModuleModel kieModuleModel = kieServices.newKieModuleModel();

// 通过 KieModuleModel 创建 KieBaseModel 对象
KieBaseModel kieBaseModel = kieModuleModel.newKieBaseModel("KBase1")
        .setDefault(true) // 设置为默认的 KieBase
        .setEqualsBehavior(EqualityBehaviorOption.EQUALITY) // 设置 KieBase 的 equals 行为
        .setEventProcessingMode(EventProcessingOption.STREAM); // 设置 KieBase 的事件处理模式

// 通过 KieBaseModel 创建 KieSessionModel 对象
KieSessionModel kieSessionModel = kieBaseModel.newKieSessionModel("KSession1")
        .setDefault(true) // 设置为默认的 KieSession
        .setType(KieSessionModel.KieSessionType.STATEFUL) // 设置 KieSession 的类型
        .setClockType(ClockTypeOption.get("realtime")); // 设置 KieSession 的时钟类型

// 通过 KieServices 创建 KieFileSystem 对象（虚拟文件系统）
KieFileSystem kieFileSystem = kieServices.newKieFileSystem();
// 将 KieModuleModel 转换成 XML 文件后存入虚拟文件系统
kieFileSystem.writeKModuleXML(kieModuleModel.toXML());
```

除了上述操作，你还需要通过其流畅的 API 将所有其他组成你的项目的 Kie 工件添加到 KieFileSystem 中。这些工件应该添加到与常规 Maven 项目相对应的位置。

示例代码：

```java
KieFileSystem kfs = ...
kfs.write( "src/main/resources/KBase1/ruleSet1.drl", stringContainingAValidDRL )
    .write( "src/main/resources/dtable.xls",
            kieServices.getResources().newInputStreamResource( dtableFileStream ) );
```

> [!TIP]
>
> 你可以将 Kie 工件以纯字符串或 Resource 的形式添加。在后一种情况下，Resource 可以由 KieResources 工厂创建，这也是由 KieServices 提供的。KieResources 提供了许多方便的工厂方法，可以将 InputStream、URL、File 或 String 转换为 KieFileSystem 可以管理的 Resource。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-135131.png)

在添加资源到 KieFileSystem 时，通常可以从资源名称的扩展名推断出资源的类型（如 .drl 或 .xls）。但是，如果你不遵循 Kie 关于文件扩展名的约定，你也可以明确地为资源分配特定的 ResourceType。

例如，你有一个名为 myDrl.txt 的文件，但你希望它被识别为 DRL 类型的资源：

```java
KieFileSystem kfs = ...
kfs.write( "src/main/resources/myDrl.txt",
           kieServices.getResources().newInputStreamResource( drlStream )
                      .setResourceType(ResourceType.DRL) );
```

将所有资源添加到 KieFileSystem 后，通过将 KieFileSystem 传递给 KieBuilder 来构建它。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-135606.png)

成功构建 KieFileSystem 的内容后，生成的 KieModule 会自动添加到 KieRepository 中。KieRepository 是一个单例，作为所有可用 KieModules 的存储库。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-09-135700.png)

之后，你可以通过 KieServices 为该 KieModule 创建一个新的 KieContainer，使用其 ReleaseId。但是，在这种情况下，由于 KieFileSystem 不包含任何 pom.xml 文件（可以使用 KieFileSystem.writePomXML 方法添加一个），Kie 无法确定 KieModule 的 ReleaseId 并为其分配一个默认值。这个默认的 ReleaseId 可以从 KieRepository 获取，并用于在 KieRepository 本身中标识 KieModule。

以下示例展示了整个过程：

```java
KieServices kieServices = KieServices.Factory.get();
KieFileSystem kfs = ...
kieServices.newKieBuilder(kfs).buildAll();
KieContainer kieContainer = kieServices.newKieContainer(kieServices.getRepository().getDefaultReleaseId());
```

此时，你可以从这个 KieContainer 获取 KieBases 并创建新的 KieSessions，就像直接从类路径创建的 KieContainer 一样。

当你使用 Drools 进行项目编译时，确保检查编译结果是非常重要的。这不仅可以帮助你确保规则正确无误，还可以确保你的应用程序在运行时不会遇到任何预期之外的问题。

KieBuilder 提供了三种不同的编译结果严重性级别：

* **ERROR**：这表示项目编译失败了。当出现这种错误时，不会产生任何 KieModule，并且 KieRepository 中也不会添加任何内容。
* **WARNING**：这些是潜在的问题，可能不会立即影响你的应用程序，但建议你查看并解决它们。
* **INFO**：这些只是一般的信息消息，通常可以忽略。

在编译项目后，你可以通过以下方式检查是否有任何错误：

```java
KieBuilder kieBuilder = kieServices.newKieBuilder(kfs).buildAll();
assertEquals(0, kieBuilder.getResults().getMessages(Message.Level.ERROR).size());
```

上述代码首先使用 KieBuilder 对项目进行编译。然后，它检查编译结果中是否有任何 ERROR 级别的消息。如果有，assertEquals 会失败，这意味着你需要检查并修复这些错误。

### 2.5 调整默认构建结果的严重性

在 Drools 规则引擎中，当你进行项目构建时，可能会遇到各种结果，如错误、警告或信息。默认情况下，每种类型的结果都有一个预设的严重性级别。但在某些情况下，你可能希望调整这些默认设置。

考虑一个常见的场景：当你向一个包中添加一个新规则，而这个新规则的名称与现有规则相同时，Drools 的默认行为是用新规则替换旧规则，并将此行为报告为信息（INFO）。这可能适用于大多数使用场景，但在某些部署中，用户可能希望阻止规则更新并将其报告为错误。

Drools 提供了多种方法来调整默认的严重性设置，包括 API 调用、系统属性或配置文件。

例如，要通过系统属性或配置文件配置它，你可以使用以下属性：

* 规则更新的严重性：如果你希望更改规则更新的默认严重性，可以使用以下属性。你可以选择 INFO、WARNING 或 ERROR 中的一个作为值。

  ```properties
  drools.kbuilder.severity.duplicateRule = <INFO|WARNING|ERROR>
  ```

* 函数更新的严重性：如果你希望更改函数更新的默认严重性，可以使用以下属性。同样，你可以选择 INFO、WARNING 或 ERROR 中的一个作为值。

  ```properties
  drools.kbuilder.severity.duplicateFunction = <INFO|WARNING|ERROR>
  ```

如果你使用的是配置文件（例如，一个特定于应用的配置文件或 drools.properties 文件），你可以在其中添加上述属性和相应的值。例如：

```properties
drools.kbuilder.severity.duplicateRule=ERROR
drools.kbuilder.severity.duplicateFunction=WARNING
```

如果你希望在代码中或在启动应用时设置这些属性，你可以使用系统属性来实现。这通常是通过 JVM 参数在应用启动时设置的，例如：

```bash
-Ddrools.kbuilder.severity.duplicateRule=ERROR -Ddrools.kbuilder.severity.duplicateFunction=WARNING
```

或者，你也可以在 Java 代码中设置这些属性：

```java
System.setProperty("drools.kbuilder.severity.duplicateRule", "ERROR");
System.setProperty("drools.kbuilder.severity.duplicateFunction", "WARNING");
```

总之，你可以选择在配置文件中设置这些属性，或者直接在代码中或应用启动时使用系统属性来设置。选择哪种方法取决于你的具体需求和你的应用的配置方式。

## 3.部署（Deploying）

### 3.1 KieBase

### 3.2 修改 KieSessions 和 KieBase

### 3.3 KieScanner

### 3.4 Maven 版本和依赖项

### 3.5 Settings.xml 和远程存储库设置

## 4.运行（Running）

### 4.1 KieBase

### 4.2 KieSession

### 4.3 KieRuntime

### 4.4 事件模型

### 4.5 KieRuntimeLogger

### 4.6 命令和 CommandExecutor

### 4.7 无状态 KieSession

### 4.8 Marshalling

### 4.9 持久化和事务

## 5.安装和部署备忘单



## 6.使用示例



## 7.可执行的规则模型



## 8.使用 KieScanner 监控和更新 KieContainers


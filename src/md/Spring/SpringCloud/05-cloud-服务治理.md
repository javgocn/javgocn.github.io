---
title: 05-cloud-服务治理
---
## 1.微服务治理与动态服务发现

微服务架构逐渐成为现代软件开发的标准模式，其中服务治理是确保其灵活性和可扩展性的关键。本节的重点是深入探究服务治理，同时具体分析 Nacos 作为服务注册中心的架构设计。

服务治理为微服务架构提供了自动化管理，是微服务之间协调工作的默默保障者。想象一下，如果缺乏有效的服务治理，当面临服务实例的动态变化时，整个系统的可维护性和扩展性将严重受限。以下场景将帮助我们更清晰地理解服务治理的价值：

设想你负责的系统中有两个关键的微服务：服务 A 和服务 B，每个微服务分布在 10 个虚拟节点上。服务 A 需要频繁调用服务 B 来完成业务逻辑。在没有服务治理的情况下，这种服务间调用会变得复杂和静态，因为服务 A 需要知道如何找到服务 B，并且随着服务 B 实例的增减，服务 A 的配置需要不断更新。

Nacos 应运而生，它通过中央服务注册中心来简化这一过程。服务 A 和服务 B 都会在 Nacos 注册中心注册自己，公布各自的可用实例。服务 A 现在可以直接查询 Nacos，动态地发现服务 B 的实例，并进行通信，而无需硬编码实例地址。

下面是 Nacos 注册中心的架构示意图，它展示了服务实例注册和服务发现的流程：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-055724.png)

在这个体系结构中，可以观察到以下关键优势：

1. **去中心化的服务发现**：通过 Nacos，服务之间的发现变得动态和去中心化，避免了对单点故障的依赖。
2. **动态负载均衡**：服务消费者（例如服务 A）可以实现客户端负载均衡，通过从 Nacos 获取的服务 B 的实例列表，选择最适合的实例进行调用。
3. **实时状态管理**：Nacos 对服务实例的健康检查可以实现实时状态同步，确保服务调用的稳定性。

总而言之，Nacos 提供的服务治理机制有效地支撑了微服务架构的灵活性和可扩展性，为微服务间的交互提供了流畅和自动化的支持。后面的内容，我们将具体探讨 Nacos 在服务注册和服务发现中的具体实现机制。

### 1.1 探索服务注册与发现的动态机制

在微服务的世界里，服务治理框架提供了两个至关重要的功能——**服务注册**和**服务发现**。这两项功能共同构成了微服务间高效通信的基础设施。让我们更深入地探讨这两个概念，并理解它们是如何在微服务架构中发挥作用的。

1. **服务注册：**

   服务注册是服务治理的首要步骤，可以被视为微服务世界中的 “地图绘制”。每个微服务实例都将自己的地址信息和服务标识注册到中心化的服务目录中，就像在地图上标记自己的位置。这个过程不仅涉及到服务的网络位置（IP和端口），还包括服务的逻辑标识和健康状态，这为服务发现奠定了基础。

2. **服务发现：**

   服务发现则是 “导航仪”，它允许一个服务实例找到并与其他服务实例进行通信。当服务 A 需要与服务 B 通信时，它会查询服务注册中心，获得服务 B 的实例列表。通过这种方式，服务 A 可以了解服务 B 的所有活跃节点，并选择一个合适的节点发起通信。

为了清晰展现服务注册和服务发现的过程，请参考以下图解：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-060620.png" style="zoom:50%;" />

该图展示了以下关键步骤：

1. **服务注册**：服务 B 的每个实例在启动时将其详细信息注册到服务注册中心。
2. **服务同步**：服务 A 定期从注册中心拉取服务 B 的节点信息，或者注册中心在服务 B 节点更新时推送最新信息给服务 A。
3. **服务选择**：服务 A 根据自己的负载均衡策略，从获取到的服务 B 实例列表中选择一个进行调用。

注册中心的核心角色是信息的中继站。每个服务实例都以其自身的逻辑名称和网络地址注册，这些信息对于实现服务间的精确查找和负载均衡至关重要。在服务注册过程中，除了基础的服务名称和地址信息外，通常还会包括以下维度的数据：

* **服务标识**：一般由应用配置中的 `spring.application.name` 属性提供，用于在服务查找时提供匹配。
* **网络位置**：明确服务实例的网络访问点，包括其IP地址和端口号。
* **服务状态**：包括服务实例的健康检查结果，以确保调用的实例是健康且能够处理请求的。
* **元数据信息**：额外的服务描述信息，可以用于更复杂的路由逻辑或服务选择。

> 接下来的内容，我们将具体演示如何在 Nacos 中实现服务注册与发现，并分析其中的工作原理与最佳实践，这里先暂时不深入。

在微服务架构中，**异常容错**机制扮演着守护者的角色，确保当个别服务实例出现问题时，整个系统仍能保持稳定和可用。让我们深入探讨这一概念及其在保障服务稳定性中的重要性。

考虑服务 A 调用服务 B 的场景。如果服务 B 由于某些问题无法响应，服务 A 若无妥善防御机制，则可能陷入长时间的等待状态，影响其性能，甚至导致级联故障。因此，我们需要设计一种机制，即使在部分服务实例不可用的情况下，也能保证系统整体的流畅运行。

1. **心跳检测：**

   心跳检测是异常容错中的关键策略。通过此机制，服务实例定期向注册中心报告状态，确认其活跃性。注册中心通过跟踪心跳，维护一个健康且可用的服务实例列表。

2. **服务剔除：**

   * **被动剔除**：如果在预设的时间窗口内未收到某服务实例的心跳，注册中心将其视为不可用，并从可用服务列表中移除。
   * **主动剔除**：服务实例在维护、升级或即将下线等情况下，可以主动向注册中心发送下线通知，请求从服务列表中移除自巀。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-061900.png)

除了心跳检测和服务剔除，现代微服务架构中还采用了其他多种容错手段，如超时设置、重试策略、断路器模式等，进一步提升系统的鲁棒性。

作为 Spring Cloud 生态中的一个重要组件，Nacos 提供了**服务发现**、**配置管理**、**服务监控**等功能。在实际应用中，它不仅承担了服务注册与发现的任务，还能通过健康检查等机制实现异常容错，为微服务架构提供了强大的支持。

### 1.2 Nacos 体系架构

在微服务体系中，Nacos 扮演着服务注册与发现的关键角色。为了深入理解 Nacos，我们必须从其三个基础构件入手：**领域模型**、**数据模型**以及其**基本架构**。这些构件是把握 Nacos 运行机制的根基。

#### 1.2.1 领域模型

Nacos 的领域模型清晰地定义了服务及其实例间的关系和界限。在 Nacos 的语境下，“服务” 代表的是逻辑上的微服务标识，并非物理上的服务器或硬件设备。

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-062432.png" style="zoom:50%;" />

我们可以将 Nacos 的服务领域模型划分为以下三个层次：

1. **服务层**

   在这个层级，我们配置服务相关的**元数据**（比如服务版本、环境标签等）以及**服务保护阈值**。服务保护阈值是一个关键指标，它是介于 0 到 1 之间的值，用以判断服务实例健康比例。当健康实例的比例下降至阈值以下时，Nacos 启动服务保护模式，避免进一步剔除实例，并且可能将不健康的实例也包含在服务消费者的返回结果中，从而保持基本的服务可用性。

2. **集群层**

   集群是由多个服务实例构成的。在每个服务实例启动时，可以指定其所属的集群，并在这个层级设置**元数据**和**健康检查模式**。**持久化节点**是那些即使客户端进程停止，也会在 Nacos 服务器上保留的实例。Nacos 对持久化节点执行 “主动探活” 以监测其健康状况。相对于持久化节点，**临时节点**则是默认的服务注册类型，它们不会长期存储在服务器上，而是通过周期性的心跳请求来维持其在服务列表中的存在。

3. **实例层**

   实例指的就是单个的服务节点，它们是服务可用性的最小单位。在 Nacos 控制台，你可以查看每个实例的详细信息，如 IP、端口、状态，并可以进行如元数据编辑、上下线状态更改、路由权重配置等操作。

在这三个层次中，“**元数据**” 扮演着至关重要的角色，它是包含服务描述信息的数据集合，可以包括服务版本信息、自定义标签等。通过服务发现机制，客户端能够获取到每个服务实例的元数据，实现特定的业务逻辑。

了解领域模型之后，接下来我们将探讨服务调用者是如何在这个模型中定位并调用具体的服务实例的。这一过程是通过 Nacos 的数据模型实现的，数据模型通过精确地描述服务和实例之间的映射关系，使得服务消费者能够准确地找到并请求到所需的服务实例。

#### 1.2.2 数据模型

Nacos 通过一个三级层次的数据模型进行服务管理，这些层次分别是 Namespace、Group 和 Service/DataId。这一模型设计能够灵活地支持不同的使用场景和需求。

为了更直观地展示这一结构，参考以下层次关系图：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-063009.png" style="zoom:50%;" />

从图中可以看出，这三个层次是嵌套关系，形成了从宏观到微观的数据分级。现在我们将逐层深入理解每个层次的作用和特点：

1. **Namespace（命名空间）**

   位于层次结构的最顶层，命名空间主要用于区分不同的环境或项目组。例如，我们可以将开发环境、测试环境和生产环境隔离开来，以避免相互干扰。默认的命名空间是 “public”，意味着如果没有特别指定，所有服务都会被自动归入这个公共命名空间中。

2. **Group（分组）**

   在命名空间的基础上，Group 为我们提供了进一步的微观管理能力，允许我们按服务类型或业务逻辑进一步细分服务集合。默认的分组名为 “DEFAULT_GROUP”，它为没有特定分组指定的服务提供了归宿。不同的分组之间的服务实例是隔离的，确保服务之间的逻辑清晰。

3. **Service/DataID（服务/数据标识）**

   这是最具体的层级，直接对应到各个微服务实体，例如订单服务、商品服务等。Service/DataID 是微服务寻址和发现的关键，它确保了我们能精确找到并调用所需的服务实体。

通过结合 **Namespace + Group + Service/DataID** 的唯一标识，我们可以实现对特定服务的精确定位。例如，要调用生产环境下 A 分组的订单服务，我们可能会使用如 `Production.A.orderService` 的服务路径。

掌握了 Nacos 的数据模型后，你现在对于如何精确地识别和调用微服务应该有了清晰的认识。这种结构化的方式大大简化了服务管理，提高了微服务架构的可维护性和扩展性。接下来，我们将介绍 Nacos 的基本架构，以便你对其功能模块有一个全面的了解。

#### 1.2.3 Nacos 基本架构

Nacos 在服务治理方面主打两大核心能力：服务发现和配置管理。具体来说，它由 **Naming Service** 和 **Config Service** 两大基石模块组成，前者负责服务的发现和注册，后者则管理配置信息并支持热更新。关于配置管理的深入探讨，我将在后内容节中专门进行讲解。

照下面的官方架构图，以获得功能模块的直观理解：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-063945.jpg)

图示表明，服务提供者（Provider APP）和消费者（Consumer APP）都是通过 Open API 与 Nacos Server 的核心模块进行交互的。这些 Open API 是一系列公开的、遵循 RESTful 风格的 HTTP 接口。

> 对 Open API 的更多细节，可以访问 [Nacos 官方网站](https://nacos.io/zh-cn/docs/open-api.html) 以获取丰富的 API 文档。

在 Nacos 的枢纽中，**Naming Service** 扮演了将服务名称映射到服务实体（如 IP 列表）的角色，这是实现服务发现的基础。比如，你若持有特定服务的 Namespace 和 Group 信息，Naming Service 将助你快速定位到该服务的实例集群。

另外，**Nacos Core** 是一组构成 Nacos 强大后盾的基础功能集合。以下表格列出了一些关键的 Nacos Core 组件及其职责：

| 组件         | 功能描述                                                     |
| ------------ | ------------------------------------------------------------ |
| 启动组件     | 支持多种模式，包括单机（Standalone）、集群（Cluster）、DNS 等，为服务的启动提供灵活性。 |
| 寻址组件     | 通过域名、服务名称、IP 端口、广播等多种方式进行服务寻址。    |
| 存储组件     | 负责 Nacos 服务信息的持久化，以及分片和复制数据以保证高可用。 |
| 插件组件     | 支持扩展和定制，包含用户管理、权限控制、审计功能、SMS 通知接入、监控统计等多样化功能。 |
| 缓存组件     | 实现本地、服务端缓存，以及容灾支持的功能，提高数据访问速度和系统容错能力。 |
| 事件通知组件 | 实现异步事件的通知和处理。                                   |
| 日志组件     | 保持日志记录的规范性和一致性，如管理日志的格式、日志级别和分类，保证日志的可移植性。 |
| 容量管理组件 | 防止数据过载，保证系统稳定运行。如管理每个 Namespace和 Group 维度下的容量，防止存储空间被写满而导致的服务不可用。 |

为了维护集群状态的一致性，Nacos 实现了两种一致性协议：**Raft** 和 **Distro**。Raft 强调强一致性，通过选举机制确定 Leader 节点来同步数据；而 Distro 更注重可用性和最终一致性，适用于临时节点的数据同步。

> 这里的介绍只是一瞥，但考虑到 **一致性协议是技术面试中的常见问题**，建议深入了解这些经典的协议理论。

下一步，我们将动手实践，建立一个 Nacos 服务器集群，并对一个 Spring Boot 应用进行改造，将其服务化。通过这一实战演练，你将学会如何在微服务架构中实现从本地方法调用到远程服务调用的转变。

## 2.构建 Nacos 集群环境

在本节中，我们将实践如何构建一个 Nacos 高可用服务注册中心。将学习建立高可用的 Nacos 集群，并将 MySQL 作为数据存储解决方案的详细步骤。这一过程不仅是技术实操，同时也深化了对高可用架构概念的理解。

系统架构的首要考量是确保**高可用性**。无论技术多么尖端，如果系统稳定性无法保障，所有的努力都可能付之东流。

把这个理念比作生活，就像健康是幸福生活的基石，高可用性在系统架构中扮演着类似的角色。我们的目标是确保架构设计中的每一步都贡献于这个基础上。

要构建高可用系统，有两个基本原则：

* **消除单点故障**：架构设计应考虑到任何组件都可能失败的可能性。依赖单一资源的任务可能形成系统的薄弱环节，一旦出现问题，会导致服务中断。目标是识别并解决这些潜在的单点风险。
* **快速故障恢复**：一旦故障发生，应迅速恢复到正常状态。对于中心化的服务注册中心，比如 Nacos，应保证下线后的节点能够从集群中的其他节点获取最新的服务列表并迅速恢复到服务中断前的状态。

Nacos 通过集群部署有效地解决了上述两大高可用性问题。不仅可以避免单一故障点的影响，而且确保了节点间数据的同步和快速故障恢复。下面，我将逐步引导你完成 Nacos 集群的搭建，让我们开始这个旅程吧。

### 2.1 获取 Nacos Server

开始搭建集群之前，我们需要下载 Nacos Server。请按照以下步骤操作：

1. 访问 Alibaba Nacos 在 GitHub 上的 [发布页面](https://github.com/alibaba/nacos/releases)。

2. 选择并下载当前最新的稳定版本（例如 2.2.3），它将作为我们实战项目的注册和配置中心。

   > ⚠️ **注意**：务必选择稳定版本进行安装，避免使用标有 BETA 的预发布版本，以免遇到潜在的 Bug 或兼容性问题。

3. 在发布页的 Assets 区域找到 `nacos-server-2.2.3.tar.gz` 或 `nacos-server-2.2.3.zip` 文件，选择一个进行下载。如果对 Nacos 源码感兴趣，也可以选择下载源码包。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-094434.png)

下载后，解压 Nacos Server 文件，并按以下步骤准备集群环境：

1. 将解压的文件夹重命名为 `nacos-cluster1`。
2. 复制 `nacos-cluster1` 文件夹，创建一个名为 `nacos-cluster2` 的副本。

这样，我们就模拟出了一个由两个 Nacos Server 节点组成的集群环境。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-20-021505.png)

完成这些步骤后，Nacos 服务器的初始安装和集群模拟已就绪。接下来，我们将进入配置环节，设置 Nacos Server 以支持集群模式运行。

### 2.2 配置 Nacos Server

要使 Nacos Server 支持集群模式和外部数据库，我们需要对其配置文件进行一些更改。

1. **修改服务端口**

   由于我们在同一台机器上运行两个 Nacos 实例来模拟集群，我们需要为它们指定不同的端口号。配置文件 `application.properties` 位于每个 Nacos Server 目录下的 `conf` 文件夹中。

   * 对于 `nacos-cluster1`，我们保留默认端口 `8848`。
   * 对于 `nacos-cluster2`，更改端口为 `8948` 以避免冲突。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-094801.png)

   修改 `server.port` 属性值以设置端口：

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-094844.png)

2. **配置数据库连接**

   默认情况下，Nacos 使用嵌入式数据库 Derby，但我们将转换为 MySQL 以提高可用性和稳定性。按照以下步骤配置 MySQL 数据源：

   * **启用 MySQL 数据源**：在 `application.properties` 文件中，取消注释或添加 `spring.datasource.platform=mysql`。
   * **配置数据库实例**：确认 `db.num=1` 行是启用的，以支持单数据库实例。
   * **设定 JDBC 连接串**：更改 `db.url.0` 为你的 MySQL 数据库地址（例如，`jdbc:mysql://localhost:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true`）。同样，更新 `db.user.0` 和 `db.password.0` 为相应的数据库用户名和密码。

   请确认你的数据库配置如下：

   ```properties
   spring.datasource.platform=mysql
   
   db.num=1
   db.url.0=jdbc:mysql://localhost:3306/nacos?characterEncoding=utf8&connectTimeout=1000&socketTimeout=3000&autoReconnect=true
   db.user.0=root
   db.password.0=你的密码
   ```

   对应配置文件位置如下：

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-095109.png)

完成以上配置后，你的 Nacos Server 将准备好连接到 MySQL 数据库。下一步，我们将在 MySQL 中创建所需的数据库和表。请确保你已经安装了 MySQL 并创建了一个名为 `nacos` 的数据库，接下来，我们将导入 Nacos 所需的数据库结构和初始数据。

### 2.3 初始化数据库

在 Nacos Server 集群部署中，所有的配置信息和服务细节都将存储在数据库中。首先，我们需要创建一个数据库 schema。

1. **登录到 MySQL**：使用命令行或 GUI 工具登录到你的 MySQL 实例。
2. **创建 Schema**：执行以下 SQL 命令来创建一个名为 `nacos` 的新数据库 schema。

```mysql
-- 新建一个 Nacos Schema
create schema nacos;
```

Nacos 提供了一组 SQL 脚本用于创建初始数据库结构和表。

1. **定位 SQL 脚本**：在 Nacos 的解压目录的 `conf` 文件夹中找到 `nacos-mysql.sql` 文件（在一些版本中可能命名为 `mysql-schema.sql`）。

   <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-095640.png" style="zoom:50%;" />

2. **执行 SQL 脚本**：将该 SQL 文件的内容在我们刚才创建的 `nacos` 数据库上执行。

   <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-095729.png" style="zoom: 67%;" />

   如果你使用的是命令行工具，可以通过以下命令导入：

   ```bash
   use nacos;
   source <file-path>;
   ```

3. **验证表创建**：执行成功后，你应该可以在 `nacos` 数据库中看到新创建的表。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-24-141447.png)

完成这些步骤后，数据库就已经准备好供 Nacos Server 使用了。接下来，我们需要配置 Nacos Server 集群节点，确保每个节点都能够在启动时找到对方，并且进行正确的数据同步。

### 2.4 配置集群节点信息

为了让 Nacos Server 集群中的各个节点能相互发现并同步数据，我们需要配置集群节点信息。

1. **创建 `cluster.conf` 文件**：在 Nacos Server 的 `conf` 目录下创建一个名为 `cluster.conf` 的文件。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-100233.png)

2. **编辑 `cluster.conf` 文件**：将所有 Nacos Server 节点的IP地址和端口号添加到该文件中。替换下面的 IP 地址和端口号为你自己集群的实际信息。

   ```tex
   # cluster.conf 示例（# 注意：这里的 IP 不能是 localhost 或者 127.0.0.1）
   10.138.177.62:8848
   10.138.177.62:8948
   ```

⚠️ 注意：

* **内网 IP 地址**：在 `cluster.conf` 文件中指定的 IP 地址应该是可以互相访问的内网 IP，不能使用 `localhost` 或 `127.0.0.1`。
* **获取 IP 地址**：如果你在 Linux 或 Mac 系统，使用 `ifconfig` 或 `ip addr` 命令获取本机 IP 地址。

```bash
ifconfig | grep "inet "
```

或者：

```bash
ip addr | grep "inet "
```

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-100607.png" style="zoom:67%;" />

对于 Windows 用户，可以使用 `ipconfig` 命令：

```bash
ipconfig
```

确认你的 IP 地址后，用它替换 `cluster.conf` 文件中的 IP 部分。

完成集群配置文件的创建后，每个 Nacos Server 节点在启动时都会读取这个文件，从而了解其他节点的存在，并进行集群通信。

接下来，确保你的数据库已正确初始化，然后你可以启动 Nacos Server 的每个实例以验证集群是否正常工作。我们将在下一步中启动 Nacos Server 实例。

### 2.5 启动 Nacos Server 集群

启动 Nacos Server 集群非常简单，一旦你完成了之前的配置，只需要运行相应的启动脚本即可。

1. **打开终端或命令行界面**：转到 Nacos 安装目录。

2. **导航到 `bin` 目录**：在 Nacos 服务器的安装目录中，找到 `bin` 文件夹，这里包含了启动和关闭服务器所需的脚本。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-24-142313.png)

3. **选择对应的脚本执行**：

   * **对于 Windows 用户**：使用 `startup.cmd` 来启动，`shutdown.cmd` 来关闭服务。
   * **对于 Mac/Linux 用户**：使用 `startup.sh` 和 `shutdown.sh` 脚本来启动和关闭服务。

4. **以集群模式启动 Nacos**：执行以下命令启动 Nacos Server。

   ```bash
   sh startup.sh
   ```

   这条命令将会启动 Nacos Server 并默认其为集群模式（因为你已经配置了 `cluster.conf` 文件）。

5. **查看启动日志**：控制台输出会告诉你启动日志的位置，例如：

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-101116.png)

   在 `logs/start.out` 文件中，查看启动日志，确认没有错误发生：

   ```bash
   tail -f logs/start.out
   # 或者
   cat logs/start.out
   ```

   查找类似 “Nacos started successfully in cluster mode” 的消息以确认成功启动。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-101143.png)

6. **验证集群状态**：在所有预定作为集群节点的机器上重复上述步骤，确保每个节点都正确启动。

### 2.6 登录和验证 Nacos 控制台

完成集群的配置和启动后，接下来要登录到 Nacos 控制台，确保集群状态良好。

1. **访问控制台**：在浏览器中输入集群中任一节点的地址，例如：

   * nacos-cluster1：http://127.0.0.1:8848/nacos
   * nacos-cluster2：http://127.0.0.1:8948/nacos

   > ⚠️ 注意：确保使用实际的服务器 IP 而非 `127.0.0.1` 或 `localhost`，除非你正在本机上进行操作。

2. **登录页面**：进入登录页面，你会看到如下所示的界面。使用默认的用户名和密码（通常是 `nacos`/`nacos`）登录。当然，你也可以在登录后的 `权限控制` -> `用户列表` 页面新增系统用户。

   <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-101655.png" style="zoom:67%;" />

3. **检查集群状态**：登录后，导航至 “集群管理” -> “节点列表” 查看所有 Nacos Server 节点及其状态。所有节点的状态应该显示为 “UP”，绿色的状态表示节点健康。如果节点状态不是 “UP”，请检查对应节点的日志文件以诊断问题。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-05-101829.png)


如果无法登录控制台或集群状态有异常，以下是排查步骤：

1. **日志检查**：查看 `/logs/start.out` 或其他相关日志文件，确定是否有错误信息。
2. **端口占用**：如果 `server.port` 指定的端口已被其他应用占用，更换端口后重新启动。
3. **数据库连接**：检查 `application.properties` 中的数据库连接配置，确保 MySQL 服务可达且运行中。
4. **网络配置**：确保服务器间的网络设置允许相互通信，没有被防火墙或安全组规则阻止。
5. **服务健康检查**：登录到每个节点的控制台，确认服务注册和服务发现功能正常。

集群环境配置正确并且每个节点都已经正确启动和同步，这时你的 Nacos 集群应该已经准备好可以正常使用了。可以进行服务注册和发现的相关操作，确保集群功能完全符合预期。

登录控制台后，建议进行一些基本的服务注册和配置操作，以验证集群的功能。你可以注册一个测试服务，然后在另一个节点上检查该服务是否可见，这样可以确保集群的服务同步功能正常工作。

### 2.7 阶段小结

在本节中，我们一步步完成了 Nacos 集群的搭建，并确保了其高可用性。通过引入 MySQL 作为配置存储，我们实现了配置的持久化和集群状态的共享。

关键步骤总结：

1. **存储切换**：切换到 MySQL 数据源，实现了配置的持久化存储。
2. **集群配置**：配置了集群节点，保证了服务注册信息在集群间的同步。
3. **服务启动**：启动了 Nacos 服务，并验证了集群模式下的正常运行。
4. **控制台登录**：登录到 Nacos 控制台，验证了集群状态。

服务注册最佳实践：

* **VIP（Virtual IP）**：在客户端配置中，使用一个虚拟 IP 地址代替硬编码的服务器列表。这有助于在服务器地址变化时，无需更改客户端配置。
* **动态服务发现**：VIP 通过动态服务发现机制，使客户端能自动发现后端的 Nacos 节点。

技术扩展：

* **Nginx+LVS/keepalived**：了解并实践如何使用这些工具创建高可用的服务代理和负载均衡。
* **自我学习**：研究 [Nacos 官方文档](https://nacos.io/zh-cn/docs/what-is-nacos.html)，增强对 Nacos 架构和功能特性的理解。

自学笔记建议：

* **Nacos 功能特性**：深入了解服务发现、服务配置、服务元数据等关键功能。
* **Nacos 集成方案**：掌握 Nacos 如何与微服务架构（如 Spring Cloud、Dubbo）集成。
* **高级话题**：研究服务分区、灰度发布和服务治理等高级功能。
* **故障模拟与排查**：模拟可能的故障场景，如数据库宕机、节点失联等，并学习如何快速定位和解决。

通过将理论与实践结合，不仅能提高你对 Nacos 的理解，还能锻炼你的问题解决能力。当你对基本的集群搭建有了充分理解后，尝试挑战更高级的集群管理和维护任务，如性能优化、故障恢复、数据迁移等。这样的实践有助于你在真实工作环境中更好地设计和管理分布式服务。

## 3.在 Nacos 中实现服务注册

在构建微服务架构的优惠券平台项目中，服务注册是实现服务发现的先决条件。本节详细介绍如何将服务提供者注册到 Nacos 服务器，是构建端到端微服务调用链路的关键一环。我们将讨论 Nacos 的自动装配机制、核心参数配置，确保你能够有效地使用 Nacos 进行服务治理。

服务注册是微服务架构中的基础环节。在 Nacos 生态中，每个下游服务（服务提供者）需要在 Nacos 注册中心进行注册，这样上游服务（服务消费者）才能通过服务发现机制找到并调用这些下游服务。

接下来，我们以 `coupon-template-serv` 和 `coupon-calculation-serv` 为例，展示如何利用 Nacos 实现服务的注册。在后面，我们再讨论作为服务消费者的 `coupon-customer-serv` 是如何通过服务发现机制向服务提供者发起调用的。

### 3.1 集成 Nacos 依赖以确保版本兼容性

在微服务项目中引入 Nacos 作为服务发现和配置管理的组件之前，确保版本匹配是非常关键的一步。由于 Spring Boot、Spring Cloud 和 Spring Cloud Alibaba 都维护着严格的版本依赖关系，这三者之间的版本兼容性必须得到保证，否则容易出现难以预料的问题。

版本兼容性查询：

* **Spring Boot 与 Spring Cloud 版本匹配**：可以在 [Spring Cloud 官方文档](https://spring.io/projects/spring-cloud#overview)中找到 Spring Cloud 支持的 Spring Boot 版本区间。

  <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-06-141955.png" style="zoom: 33%;" />

* **Spring Cloud Alibaba 与 Spring Cloud、Spring Boot 的版本匹配**：可通过 Spring Cloud Alibaba 的 [GitHub wiki页](https://github.com/alibaba/spring-cloud-alibaba/wiki/版本说明)进行查询。

  <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-06-142042.png" style="zoom:50%;" />

常用实战版本选择：

| Spring Cloud Version        | Spring Cloud Alibaba Version | Spring Boot Version |
| --------------------------- | ---------------------------- | ------------------- |
| Spring Cloud 2021.0.1       | 2021.0.1.0                   | 2.6.3               |
| Spring Cloud 2020.0.1       | 2021.1                       | 2.4.2               |
| Spring Cloud Hoxton.SR9     | 2.2.6.RELEASE                | 2.3.2.RELEASE       |
| Spring Cloud Hoxton.SR3     | 2.2.1.RELEASE                | 2.2.5.RELEASE       |
| Spring Cloud Hoxton.RELEASE | 2.2.0.RELEASE                | 2.2.X.RELEASE       |

根据版本匹配表格，推荐选择经过兼容性测试的稳定版本组合。例如，在此项目中，选用的版本组合为：Spring Cloud 2020.0.1、Spring Cloud Alibaba 2021.1 和 Spring Boot 2.4.2 作为实战项目的依赖版本。

首先，在项目的顶层 `pom.xml` 中声明 Spring Cloud 和 Spring Cloud Alibaba 的版本号，确保下层模块能够继承正确的版本。

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>2020.0.1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <dependency>
            <groupId>com.alibaba.cloud</groupId>
            <artifactId>spring-cloud-alibaba-dependencies</artifactId>
            <version>2021.1</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
   </dependencies>
   <!-- 省略部分代码 -->
</dependencyManagement>
```

然后，在需要集成 Nacos 的模块，比如 `coupon-template-impl` 和 `coupon-calculation-impl`，引入如下依赖项：

```xml
<dependency>
    <groupId>com.alibaba.cloud</groupId>
    <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
</dependency>
```

由于已在父级 `pom.xml` 中定义了版本管理，子模块无需再指定版本号，Maven 会自动解析适合的版本。

在依赖项添加完毕后，通过简单的配置，即可启用 Nacos 的服务注册功能。Nacos 利用 Spring Boot 的自动装配（auto configuration）机制，自动加载配置项并完成服务注册。

Spring Cloud 的组件都广泛使用了自动装配机制，这为组件的集成提供了极大的便利。了解这一机制的底层原理，不仅有助于深入理解组件的启动过程，而且为将来可能的自定义组件开发提供了模式借鉴。

在下一节中，我们将进一步探讨 Nacos 自动装配器的工作原理和细节，为你揭开 Spring Cloud 组件启动的神秘面纱。

### 3.2 Nacos 自动装配原理

随着 Spring Cloud 的演进，我们已不再需要在启动类上显式添加 `@EnableDiscoveryClient` 注解来激活服务治理功能。在较新的版本中，仅通过配置项，我们便可轻松开启 Nacos 的服务治理。这种简化是如何实现的呢？背后的秘密在于 Spring Framework 的自动装配机制。

当我们在项目中包含 Nacos 的依赖时，相关的自动装配器也随之加入，负责在启动阶段加载配置并激活 Nacos 的核心功能。以下是几个关键的自动装配器及其职责：

* `NacosDiscoveryAutoConfiguration`：负责服务发现功能，它读取配置项并初始化 `NacosServiceDiscovery` 类以实现服务发现。
* `NacosServiceAutoConfiguration`：负责实例化 `NacosServiceManager`，通过此类可获取服务列表等信息。
* `NacosServiceRegistryAutoConfiguration`：处理服务注册相关配置。

以 `NacosDiscoveryAutoConfiguration` 为例，让我们深入了解其工作原理。请看以下简化后的源码注释：

```java
@Configuration(proxyBeanMethods = false)
@ConditionalOnDiscoveryEnabled // 当 spring.cloud.discovery.enabled=true 时生效
@ConditionalOnNacosDiscoveryEnabled // 当 spring.cloud.nacos.discovery.enabled=true 时生效
public class NacosDiscoveryAutoConfiguration {

     // 读取 Nacos 所有配置项并封装到 NacosDiscoveryProperties
	@Bean
	@ConditionalOnMissingBean
	public NacosDiscoveryProperties nacosProperties() {
		return new NacosDiscoveryProperties();
	}

     // 声明服务发现的功能类 NacosServiceDiscovery
	@Bean
	@ConditionalOnMissingBean
	public NacosServiceDiscovery nacosServiceDiscovery(
			NacosDiscoveryProperties discoveryProperties,
			NacosServiceManager nacosServiceManager) {
		return new NacosServiceDiscovery(discoveryProperties, nacosServiceManager);
	}

}
```

可见，`NacosDiscoveryAutoConfiguration` 的激活依赖于两个条件的满足：

1. `spring.cloud.discovery.enabled=true`
2. `spring.cloud.nacos.discovery.enabled=true`

默认情况下，引入 Nacos 依赖后，这两个参数已预设为 `true`。除非开发者主动禁用，否则这些自动装配器将默认被激活。

`NacosDiscoveryAutoConfiguration` 类中的 `nacosProperties` 方法承担着读取和封装 Nacos 配置项的重任。通过 `@ConfigurationProperties` 注解，它将 `spring.cloud.nacos.discovery` 下的配置项绑定到 `NacosDiscoveryProperties` 对象的属性。

源码如下：

```java
@ConfigurationProperties("spring.cloud.nacos.discovery") // 定义配置项的读取路径
public class NacosDiscoveryProperties {
	// 类属性与配置项映射（省略具体属性）
}
```

这种设计使得在应用的其他部分，我们仅需注入 `NacosDiscoveryProperties` 对象，便可便捷地访问 Nacos 的各项配置参数，从而实现了配置的集中管理和高效利用。

`nacosServiceDiscovery` 方法的核心在于它声明的 `NacosServiceDiscovery` 类。这个类封装了服务发现的核心逻辑，如根据服务标识获取已注册的服务实例列表，或是获取所有服务的名称。

源码如下：

```java
public class NacosServiceDiscovery {
       // Nacos 配置项
  	private NacosDiscoveryProperties discoveryProperties;
       // 服务治理核心类
	  private NacosServiceManager nacosServiceManager;
  
       // 根据服务标识（名称）获取服务实例
       public List<ServiceInstance> getInstances(String serviceId) throws NacosException {
            String group = discoveryProperties.getGroup();
            List<Instance> instances = namingService().selectInstances(serviceId, group,
                true);
            return hostToServiceInstanceList(instances, serviceId);
        }
  
         // 获取所有服务的名称
    	public List<String> getServices() throws NacosException {
              String group = discoveryProperties.getGroup();
              ListView<String> services = namingService().getServicesOfServer(1,
                  Integer.MAX_VALUE, group);
              return services.getData();
          }
     
      // 省略其他代码...
}
```

`NacosServiceDiscovery` 类提供的方法允许我们根据服务标识（serviceId）查询可用服务实例，这对于发起远程服务调用至关重要。

通过掌握 `NacosDiscoveryAutoConfiguration` 的工作原理，我们可以更好地理解 Nacos 在服务治理方面的自动装配过程。下一步，我们应当考虑在项目配置中添加适当的 Nacos 配置项，以确保服务发现和注册的顺畅进行。

### 3.3 添加 Nacos 配置项

对于我们即将改造的 `coupon-template-impl` 服务，关键的一步是在 `application.properties` 中配置 Nacos 服务治理的相关参数。这些参数位于 `spring.cloud.nacos` 路径下，它们对于服务的注册、发现、健康检查等方面至关重要。以下是一些常用的 Nacos 配置参数及其说明：

```properties
##########################################################################################################
# 注册中心配置（Nacos）
##########################################################################################################
# 注册中心地址，可以配置多个地址，用逗号分隔
spring.cloud.nacos.discovery.server-addr=localhost:8848
# 服务名称（默认为应用名称）
spring.cloud.nacos.discovery.service=${spring.application.name}
# 心跳间隔（客户端主动发送心跳给服务端的间隔时间，单位毫秒）
spring.cloud.nacos.discovery.heart-beat-interval=5000
# 心跳超时时间（客户端等待服务端响应心跳的超时时间，单位毫秒）
# 注意：如果客户端在指定时间内没有接收到服务端的响应，则服务端将服务实例从注册中心移除。默认值为 15 秒。
spring.cloud.nacos.discovery.heart-beat-timeout=15000
# 元数据（可以由客户端向服务端注册元数据）
spring.cloud.nacos.discovery.metadata.mydata=mydata
# 是否在启动时加载注册中心中的服务列表
# 注意：推荐设置为 false，因为服务列表在启动时可能还没有准备好，这样客户端会从本地缓存中获取服务列表，而没有从注册中心获取最新的服务列表。
spring.cloud.nacos.discovery.naming-load-cache-at-start=false
# 命名空间（Nacos 通过命名空间来实现租户隔离或环境隔离（如：开发环境、测试环境、生产环境））
spring.cloud.nacos.discovery.namespace=dev
# 集群名称（创建不同的集群时，可以给集群起个名字）
spring.cloud.nacos.discovery.cluster-name=Cluster-A
# 服务分组（用于服务隔离，可为每个服务设置不同的分组）
# 注意：如果两个服务存在上下游调用关系，则必须配置相同的分组，否则调用会失败。（上游：调用方，下游：被调用方）
spring.cloud.nacos.discovery.group=myGroup
# 是否注册到注册中心（如果只是作为上游服务，则设置为 false，从而减少注册中心的负担和网络开销）
spring.cloud.nacos.discovery.register-enabled=true
# 是否启用服务监听（类似长连接监听 Nacos 服务端的配置变化，当配置发生变化时，客户端可以感知到，从而实现动态刷新配置）
spring.cloud.nacos.discovery.watch.enabled=true
# 监听延迟（监听服务端配置变化的延迟时间，单位毫秒）
spring.cloud.nacos.discovery.watch-delay=3000
```

理解并正确配置 Nacos 的参数对于确保服务治理的平稳运行至关重要。以下表格详细介绍了每个配置项的用途和应用场景：

| 配置项              | 描述                                                        | 应用场景                                                     |
| ------------------- | ----------------------------------------------------------- | ------------------------------------------------------------ |
| server-addr         | 指定 Nacos 服务器地址。                                     | 服务注册、状态同步、服务发现等，通常配置为 Nacos 集群的 VIP。所谓 VIP 就是虚拟 IP 地址，虚拟 IP 背后指向了 Nacos 服务器集群。我们可以通过 Keepalived 结合 Nacos 集群模式实现虚拟 IP 的配置。 |
| service             | 当前服务注册到 Nacos 的服务名称。                           | 服务识别，默认使用 `spring.application.name`。               |
| heart-beat-interval | 定义服务向 Nacos 发送心跳的间隔时间（毫秒）。               | 维持服务实例的存活状态，避免被错误剔除。心跳包是 Client 告诉 Nacos 服务器自己还活着的唯一证据。 |
| heart-beat-timeout  | 如果 Nacos 在此时间内未收到心跳，则认为服务不可用（毫秒）。 | 确定服务实例健康检测的超时界限。heart-beat-timeout（默认 15s）一定要比 heart-beat-interval 大，否则在注册服务的时候会抛出一个 NacosException 异常。 |
| metadata            | 服务注册时附带的自定义元数据。                              | 自定义服务治理策略，如实现金丝雀部署等高级功能。             |
| namespace           | 用于逻辑隔离的命名空间，如不同环境间隔离。                  | 实现多环境（开发、测试、生产）或多租户的服务治理。           |
| group               | 服务分组，用于进一步隔离服务。                              | 同一 namespace 同一 group 的服务可以互相调用，不同分组则隔离。如果当前服务没有指定 group，Nacos 会默认将其分配到 “default_group” 中。 |

> ⚠️ 注意：心跳间隔（`heart-beat-interval`）必须小于心跳超时时间（`heart-beat-timeout`），否则可能导致服务实例被错误地从注册中心移除。元数据（`metadata`）提供了灵活的自定义配置，可用于满足特定场景的需求，例如在服务注册时标注服务版本以实现蓝绿部署。（为了更全面地了解 Nacos 的配置选项，建议查阅 [Nacos 的官方 GitHub](https://github.com/alibaba/spring-cloud-alibaba) 或访问 [Nacos 项目主页](https://nacos.io/) 获取最新信息。）

在上面 Nacos 的配置中，`Namespace` 和 `Group` 是两个经常被提及且至关重要的参数。虽然它们在功能上有所重叠，但在实际应用中各自扮演着独特的角色。

**Namespace：** 主要用于逻辑隔离，具体应用如下：

* **环境隔离**：通过设置不同的命名空间（如 `production`, `pre-production`, `dev`），我们可以确保服务仅在相同环境的命名空间中发现并调用彼此，从而有效分隔开发、测试和生产环境。
* **多租户隔离**：在多租户架构中，每个租户被分配一个独立的 `Namespace`，保障了不同租户之间的服务隔离和数据隔离。

**Group：** 则在服务治理中用得更为灵活，应用场景包括：

* **同租户环境隔离**：在已通过 `Namespace` 实现租户隔离的基础上，`Group` 可用于进一步隔离同一租户内的不同环境。
* **线上测试隔离**：通过将上下游服务分配至特定的 `Group`（如 `group-A`），可以实现线上测试而不干扰正常的用户流量。
* **物理单元封闭**：在多机房部署的情况下，将同一物理单元的服务分配到同一个 `Group`，可以优化调用速度，实现单元内服务调用的封闭性。

理解了 `Namespace` 和 `Group` 的具体用途后，下一步是启动 Nacos 注册中心并将服务（如 `coupon-template-serv` 和 `coupon-calculation-serv`）注册至 Nacos，以验证服务注册和服务发现的功能。

### 3.4 验证 Nacos 服务注册功能

为了确保 Nacos 的服务注册功能正常工作，我们需要按照以下步骤进行操作和验证：

1. **启动 Nacos 服务器**：可以选择单机模式或集群模式启动 Nacos 服务器，具体选择取决于你的需求和资源。

2. **创建命名空间**：在 Nacos 的 UI 中，创建 `production`、`pre-production` 和 `dev` 命名空间，分别代表生产、预发和开发环境。确保这些命名空间的 ID 与项目配置中的 `namespace` 属性保持一致。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-110059.png)

3. **服务启动与注册**：在本地启动 `coupon-template-impl` 和 `coupon-calculation-impl` 服务，并检查启动日志中是否有错误信息。如果服务启动正常，你应该能够在 Nacos 服务列表的相应命名空间标签下看到这两个服务。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-111118.png)

<hr/>

<center>问题排查思路：</center>

* 如果服务未能注册，首先检查启动日志中是否有注册请求输出。
* 检查异常日志，确定问题是否出自网络配置或参数设置。
* 确认是否所有 Nacos 服务器实例都通过集群模式同步注册表。
* 检查你的服务是否注册在正确的命名空间下。

在此过程中，注意以下常见问题及其解决方法：

* **服务未注册**：验证是否引入了 Nacos 依赖并且未手动关闭注册功能。
* **异常信息**：逐个分析异常日志，找出问题原因，如服务器地址配置错误。
* **服务不可见**：如果使用了多个 Nacos 实例，确认它们是否在集群模式下同步。
* **命名空间问题**：服务将仅出现在其注册的命名空间下，确认你查看了正确的命名空间。

通过这些步骤，你将能够完成服务注册，并在需要时进行有效的问题排查。

### 3.5 阶段小结

在本节中，我们成功实现了服务注册功能，将 `coupon-template-serv` 和 `coupon-calculation-serv` 服务集成到 Nacos Server 中。我们以 `NacosDiscoveryAutoConfiguration` 为出发点，探究了 Nacos 自动装配器的内在机制，这不仅展示了 Nacos 的集成过程，也揭示了 Spring Cloud 组件普遍采用的自动装配策略。

自动装配器在 Spring 生态中是一个核心概念，许多 Spring Cloud 组件都采用此策略无缝集成进项目。这种模式不仅是学习现有组件的枢纽，也是设计新组件时值得借鉴的典范。透过这些自动装配器，我们可以从宏观上把握组件的结构和功能，形成全面的理解。

深入学习一个框架不仅要会用它，更要理解其工作原理。“知其然，知其所以然”，是技术精进的正确路径，而在这个过程中，源码始终是最佳的指导老师。

> 探索与实践：
>
> 现在，是时候测试你对自动装配器和 Spring Cloud 生态的理解了。当服务关闭时，服务的下线指令是如何被触发的呢？我邀请你不依赖网络搜索，而是通过追踪自动装配器的线索去深入源码，挑战自己的源码阅读和理解能力。这样的实践将加深你对 Spring Cloud 组件工作流程的洞察，锻炼你解决问题的本领。

## 4.实施服务发现与远程调用

继上一节将 `coupon-template-serv` 和 `coupon-calculation-serv` 服务成功注册至 Nacos Server 后，我们现在转向如何实现服务间的相互调用。这些服务目前作为服务提供者存在，独立无需相互通信。但为了完成一个完整的业务流程，我们需要一个服务消费者来调用这些注册的服务。

在本节中，我们将把 `coupon-customer-serv` 服务转化为这样一个消费者。它的任务是调用 `coupon-template-serv` 和 `coupon-calculation-serv` 服务。我们的目标是利用 Nacos 的服务发现功能来获取服务列表，并实现远程服务调用。

我们将讨论如下内容：

1. **服务发现的实现**：如何配置和使用 Nacos 的服务发现功能来检索服务列表。
2. **远程调用的执行**：借助 Spring Webflux，了解如何发起异步非阻塞的远程服务调用。
3. **服务治理方案构建**：如何整合上述知识点，搭建一套高效的基于 Nacos 的服务治理架构。

在本节结束时，不仅能够掌握服务消费者的构建流程，还能够深入理解服务治理的核心概念，确保能够在任何需要服务发现和远程调用的场景下，迅速而有效地部署和管理我们的微服务。

### 4.1 配置 Nacos 依赖项

要启动我们的服务消费者 `coupon-customer-serv`，第一步是确保项目中包含了必要的 Nacos 依赖项。这些依赖项将使我们能够使用 Nacos 服务发现、负载均衡以及发起响应式的 Web 请求。请在 `coupon-customer-impl` 子模块的 `pom.xml` 文件中加入以下依赖：

```xml
<dependencies>
    <!-- Nacos 服务发现组件 -->
    <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-starter-alibaba-nacos-discovery</artifactId>
    </dependency>

    <!-- 负载均衡组件 -->
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-loadbalancer</artifactId>
    </dependency>

    <!-- webflux 服务调用 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
</dependencies>
```

* `spring-cloud-starter-alibaba-nacos-discovery`：用于服务的注册与发现。
* `spring-cloud-starter-loadbalancer`：Spring Cloud 的负载均衡组件，替代了 Netflix Ribbon。
* `spring-boot-starter-webflux`：Spring Boot 的响应式编程框架，用于实现异步的非阻塞远程服务调用。

接着，确保项目结构清晰且服务之间的依赖关系合理。对于 `coupon-customer-impl`，需要执行以下操作：

1. **移除实现层依赖**：删除 `coupon-template-impl` 和 `coupon-calculation-impl` 模块的依赖项。

   <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-112645.png" style="zoom: 33%;" />

2. **增加接口层依赖**：添加 `coupon-template-api` 和 `coupon-calculation-api` 接口层的依赖项。

   <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-112849.png" style="zoom:33%;" />

这样，我们就明确了服务之间的边界：`coupon-customer-serv` 作为独立的微服务，不会直接包含其他服务的实现代码，而是通过定义的接口与它们交互。这种模式不仅有助于服务的独立部署和运行，也便于我们使用 Nacos 实现服务的发现和负载均衡。

为了让 `coupon-customer-impl` 服务能够发现和调用其他微服务，你还需要进行以下配置和代码调整：

1. **更新 `application.properties` 配置**：将 `coupon-template-impl` 服务的 `spring.cloud.nacos` 配置项复制到 `coupon-customer-impl` 的 `application.properties` 文件中。确保更改服务名称参数 `spring.cloud.nacos.discovery.service` 为 `coupon-customer-impl`，以反映服务消费者的身份。

2. **解决编译错误**：删除对 `coupon-template-impl` 和 `coupon-calculation-impl` 服务的本地依赖项后，`CouponCustomerServiceImpl` 中的代码需要调整。替换原有的 `@Autowire` 或 `@Resource` 注解方式，该方式原用于注入本地服务实现，现在再查看会出现编译错误。

   <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-113441.png" style="zoom:50%;" />

接下来，我们将实现远程服务调用。引入 WebClient 工具，替代本地服务注入的方式，实现对 `coupon-template-serv` 和 `coupon-calculation-serv` 的远程调用。这涉及到将现有的本地方法调用转换为创建远程请求的逻辑，涉及一定的重构工作。

通过这些步骤，你将能够将 `coupon-customer-impl` 服务从一个单体应用转变为一个真正的微服务消费者，能够通过 Nacos 服务发现机制发现并调用其他微服务。接下来，我们将着手实施这些变更，并确保服务消费者能够正确地与其他微服务进行交互。

### 4.2 配置 WebClient 实现远程调用

WebClient 是在 Spring 5 中引入的，用于发起响应式的非阻塞式 HTTP 请求。要在 `coupon-customer-impl` 中使用 WebClient，你需要按照以下步骤进行：

1. **创建配置类**：在 `coupon-customer-impl` 子模块中创建 `WebfluxConfiguration` 配置类。通过 `@Configuration` 注解，这个类会被 Spring 容器识别为配置类。
2. **声明 WebClient.Builder Bean**：使用 `@Bean` 注解定义一个 `WebClient.Builder` 的实例。加上 `@LoadBalanced` 注解以启用负载均衡功能。

```java
/**
 * Webflux 配置类
 *
 * @author javgo.cn
 * @date 2023/11/8
 */
@Configuration
public class WebfluxConfiguration {
    @Bean
    @LoadBalanced // 开启负载均衡
    public WebClient.Builder registerWebClient() {
        return WebClient.builder();
    }
}
```

这里的注解解释如下：

* `@Configuration`：指示 Spring 这是一个配置类，它内部声明的 Beans 会被自动扫描并加载。
* `@Bean`：表明方法 `webClientBuilder` 会返回一个对象，该对象应注册为容器中的 Bean。
* `@LoadBalanced`：开启 WebClient 的客户端负载均衡能力，确保请求被均匀地分配到服务实例上。

有了 WebClient 的配置，我们就可以在任何需要的地方注入 `WebClient.Builder`，然后构建出 `WebClient` 实例来发起远程调用。

接下来，我们将重构 `CouponCustomerServiceImpl` 类，替换现有的本地服务调用为通过 WebClient 发起的远程服务调用。

### 4.3 实现 WebClient 的远程服务调用

利用 `WebClient` 进行远程服务调用涉及到的关键步骤如下：⬇️

**注入 WebClient.Builder**：在 `CouponCustomerServiceImpl` 类中注入 `WebfluxConfiguration` 中声明的 `WebClient.Builder` 对象。

```java
@Resource
private WebClient.Builder webClientBuilder;
```

**调用远程服务接口**：使用 `WebClient.Builder` 构建 `WebClient` 实例，并替换原有的本地服务调用。

下面是改造之前的代码：

```java
// 加载优惠券模板信息
CouponTemplateInfo templateInfo = templateService.loadTemplateInfo(request.getCouponTemplateId());
```

远程接口调用的代码改造可以通过 WebClient 提供的 “链式编程” 轻松实现，下面是代码的完整实现：

```java
// 加载优惠券模板信息
CouponTemplateInfo templateInfo = webClientBuilder.build() // 创建 WebClient 实例
        .get() // 指定 HTTP 方法为 GET
        .uri("http://coupon-template-serv/template/getTemplate?id=" + request.getCouponTemplateId()) // 设置请求 URI
        .retrieve() // 提取响应内容
        .bodyToMono(CouponTemplateInfo.class) // 异步地将响应体转换为 CouponTemplateInfo 对象
        .block(); // 阻塞直到操作完成，返回结果
```

在这个过程中，关键方法的作用如下：

* `.get()`: 指定 HTTP 方法为 GET。
* `.uri(...)`: 设置请求的 URI，使用服务名称（coupon-template-serv）代替具体的服务地址。
* `.retrieve().bodyToMono(...)`: 提取并转换响应体为指定的对象类型。
* `.block()`: 以阻塞方式等待响应。

Nacos 服务发现机制会为我们找到 `coupon-template-serv` 的可用实例，而 WebClient 则负责负载均衡，选择一个合适的实例发起调用。开发者不需要关心服务的具体位置，整个过程都是透明且无需感知的。

在使用 WebClient 进行远程服务调用时，我们常常关注的是响应体（Response Body），但有时候我们也需要访问 HTTP 响应中的其他信息，如状态码（Status Code）和响应头（Headers）。

WebClient 提供了灵活的方法来捕获这些信息：

```java
Mono<ResponseEntity<CouponTemplateInfo>> responseEntityMono = webClientBuilder.build()
    .get() // 指定使用 GET 方法
    .uri("http://coupon-template-serv/template/getTemplate?id=" + request.getCouponTemplateId()) // 设置请求 URI
    .accept(MediaType.APPLICATION_JSON) // 指定期望接受的数据类型为 JSON
    .retrieve() // 提取响应内容
    .toEntity(CouponTemplateInfo.class); // 获取包含完整响应信息的 ResponseEntity 对象
```

在这里，`.toEntity(...)` 方法允许我们获取一个 `ResponseEntity` 对象，它不仅包含响应体，还封装了完整的响应详情。

此外，WebClient 的链式调用风格是一种流行的 Builder 模式实现，它简化了复杂对象的构造过程。这种模式在众多开源项目中广泛使用，你也可以在自己的项目中通过 Lombok 的 `@Builder` 注解来实现类似的构建器模式。

在成功重构 `requestCoupon` 方法后，你已经具备了将其他方法中的本地调用转换为 WebClient 远程调用的能力。接下来，以同样的方法继续替换 `findCoupon` 和 `placeOrder` 中的调用。这些替换将进一步巩固你对于远程服务调用的理解和实践。

在微服务架构中，服务间调用可能需要处理各种数据结构。`findCoupon` 方法展示了如何使用 `WebClient` 进行复杂类型响应的远程调用：

```java
Map<Long, CouponTemplateInfo> templateInfoMap = webClientBuilder.build()
    .get() // 定义 GET 方法
    .uri("http://coupon-template-serv/template/getBatch?ids=" + templateIds) // 设置请求 URI
    .retrieve() // 提取响应内容
    .bodyToMono(new ParameterizedTypeReference<Map<Long, CouponTemplateInfo>>() {}) // 指定泛型响应类型
    .block(); // 阻塞直到操作完成，返回结果
```

在这段代码中，`ParameterizedTypeReference` 被用来处理泛型的响应体，这是因为 Java 泛型在运行时有类型擦除，导致无法直接反序列化到特定的泛型类型。通过创建一个 `ParameterizedTypeReference` 的匿名内部类，我们提供了泛型类型信息，使 WebClient 能够正确地将响应体映射到一个 `Map<Long, CouponTemplateInfo>` 类型的对象。

这种方式对于处理复杂或非标准的 JSON 响应非常有用，尤其是当响应体的类型不是一个简单类而是一个泛型类型时。通过掌握 WebClient 和泛型处理，你将就能够灵活地调用任何返回复杂数据结构的服务。

在 `coupon-customer-impl` 服务中，`placeOrder` 方法负责调用 `coupon-calculation-serv` 服务以计算订单价格。以下是将本地调用改造为远程调用的过程：

```java
ShoppingCart checkoutInfo = webClientBuilder.build() // 构建 WebClient 实例
    .post() // 指定 HTTP 方法为 POST
    .uri("http://coupon-calculation-serv/calculator/checkout") // 设置请求 URI
    .bodyValue(order) // 提供请求体内容
    .retrieve() // 提取响应内容
    .bodyToMono(ShoppingCart.class) // 异步地将响应体转换为 ShoppingCart 对象
    .block(); // 阻塞直到操作完成，返回结果
```

不同于之前的 GET 请求，这里的 POST 请求使用了 `.post()` 方法，并通过 `.bodyValue(order)` 传递了请求体数据。这是因为 POST 请求通常用于发送数据给服务器，而 GET 请求主要用于从服务器检索数据。

至此，我们已经完成了所有服务方法从本地调用到远程调用的改造。随着这些服务的顺利启动和在 Nacos 中的注册，你的微服务治理基础设施已经搭建完成。你应该能够在 Nacos 控制台中看到 `coupon-template-serv`、`coupon-calculation-serv` 和 `coupon-customer-serv` 三个服务的注册信息，无论是单机还是集群模式。如果你是以集群模式启动了多台 Nacos 服务器，那么即便你在实战项目中只配置了一个 Nacos URL，并没有使用虚拟 IP 搭建单独的集群地址，注册信息也会传播到 Nacos 集群中的所有节点。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-09-052119.png)

掌握了如何使用 Nacos 进行服务治理后，下一步就是深入其底层实现。了解客户端如何从 Nacos Server 拉取服务注册信息，将使你对服务发现有更深层次的认识。这不仅增强了你的动手实践能力，也为你解锁更高级的微服务架构设计提供了宝贵的知识储备。

### 4.4 探索 Nacos 客户端服务发现实现原理

Nacos 客户端同步服务注册信息的机制基于**周期性的主动轮询**——这是一种典型的**客户端拉取（Pull）模式**。客户端定时向 Nacos 服务器发出请求，拉取最新的服务列表，并将这些信息（地址列表、group 分组、cluster 名称等）更新到本地缓存中。

简单来说，Nacos Client 会开启一个本地的定时任务，每间隔一段时间，就尝试从 Nacos Server 查询服务注册表，并将最新的注册信息更新到本地。这个过程主要由 `UpdateTask` 类实现（实现了 `Runnable` 接口），该类是 `HostReactor` 的一个内部类，它负责周期性地查询服务信息并更新本地状态。负责拉取服务的任务是 UpdateTask 类，它实现了 Runnable 接口。Nacos 以开启线程的方式调用 `UpdateTask` 类中的 `run()` 方法，触发本地的服务发现查询请求。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-122025.png)

以下是 `UpdateTask` 类的简化逻辑：

```java
public class UpdateTask implements Runnable {

     // ...省略代码...
  
    // 由线程池周期性执行的 run() 方法，用于拉取服务信息
    @Override
    public void run() {
        // 默认的下次执行延迟时间
        long delayTime = DEFAULT_DELAY;

        try {
             // 尝试从本地缓存的 serviceInfoMap 中获取服务信息，包含服务器地址列表等
            ServiceInfo serviceObj = serviceInfoMap.get(ServiceInfo.getKey(serviceName, clusters));

             // 如果本地缓存为空，则说明是首次查询或信息已被清除，需从 Nacos 服务器拉取最新信息
            if (serviceObj == null) {
                updateService(serviceName, clusters);
                return;
            }

             // 如果服务信息的最后更新时间戳小于等于上次记录的更新时间，则需要进行更新
            if (serviceObj.getLastRefTime() <= lastRefTime) {
                // 客户端拉取（Pull）Nacos 服务器最新信息
                updateService(serviceName, clusters);
                // 重新从缓存获取更新后的服务信息
                serviceObj = serviceInfoMap.get(ServiceInfo.getKey(serviceName, clusters));
            } else {
                 // 如果服务信息的最后更新时间戳较新，则表示 Nacos 服务通过主动 push 机制已被更新，只需刷新本地缓存
                refreshOnly(serviceName, clusters);
            }

             // 更新记录的最后一次引用时间
            lastRefTime = serviceObj.getLastRefTime();

            // 检查当前服务是否还有订阅者，若没有，则停止更新任务
            if (!notifier.isSubscribed(serviceName, clusters) && !futureMap
                    .containsKey(ServiceInfo.getKey(serviceName, clusters))) {
                // abort the update task
                NAMING_LOGGER.info("update task is stopped, service:" + serviceName + ", clusters:" + clusters);
                return;
            }
          
            // 检查服务信息中是否还有存活的主机列表，如果为空，则增加失败计数器（+1）
            if (CollectionUtils.isEmpty(serviceObj.getHosts())) {
                incFailCount();
                return;
            }
             
            // 设置下一次执行任务的延迟时间，通常取决于服务信息中指定的缓存周期
            delayTime = serviceObj.getCacheMillis();
            // 重置失败计数器（0）
            resetFailCount();
        } catch (Throwable e) {
            // 在捕获异常时增加失败计数器（+1），并记录警告日志
            incFailCount();
            NAMING_LOGGER.warn("[NA] failed to update serviceName: " + serviceName, e);
        } finally {
             // 计划下一次执行任务的时间，这里使用了指数退避策略，失败次数越多，间隔时间越长
            executor.schedule(this, Math.min(delayTime << failCount, DEFAULT_DELAY * 60), TimeUnit.MILLISECONDS);
        }
    }
}
```

在 `UpdateTask` 的源码中，通过调用 `updateService(serviceName, clusters)` 方法实现了服务查询和本地注册表更新。在每次执行结束时，`UpdateTask` 会计划自己的下一次执行，保证服务注册信息的持续更新。它是客户端与服务端之间同步状态的关键环节。具体来说就是在结尾处它通过 `finally` 代码块设置了下一次 `executor` 查询的时间，周而复始循环往复。

> 为了进一步理解这个机制，你可以探索以下问题：
>
> 1. `UpdateTask` 是如何被初始化和调度的？
> 2. 它是由哪个类负责首次触发？

## 5.总结

我们已经成功完成了基于 Nacos 的服务治理链路搭建。在这个过程中，我们实现了：

* **服务注册**：服务提供者如何在 Nacos 中注册自己，以便被发现。
* **服务发现**：服务消费者如何利用 Nacos 发现注册的服务。
* **远程调用**：如何使用 WebClient 在服务消费者中发起对服务提供者的远程调用。

这些步骤构成了微服务架构中服务治理的核心链路，确保服务间可以相互发现并通信。

> 思考 🤔：
>
> 当服务节点遇到问题，比如网络不稳定或资源限制，它们可能无法正常响应请求。这时候，Nacos 如何检测并处理这些故障节点呢？
>
> 这个问题关系到服务治理中的一个关键环节——故障检测和服务下线。Nacos 提供了几种机制来实现这一功能，包括健康检查、心跳机制和服务保护规则。例如，健康检查可以帮助 Nacos 监控服务实例的状态，而心跳机制可以确定一个服务是否仍然存活。
>
> * **健康检查**：周期性检测服务实例的健康状态。
> * **心跳机制**：服务实例定时向注册中心发送心跳，证明自己的可用性。
> * **服务保护规则**：在检测到异常时，自动隔离故障服务节点。
>
> 鼓励你探索 Nacos 的故障处理文档，理解这些机制是如何工作的。这将加深你对微服务稳定性和可靠性保障措施的理解。

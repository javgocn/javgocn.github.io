---
title: 02-cloud-SpringCloud概述
---
## 1.Spring Cloud：实现微服务的关键技术方案

在前文中，我们已经了解到 Spring Cloud 在微服务架构中的核心作用。它不仅与 Spring Boot 无缝集成，还提供了丰富的工具和框架，以支持微服务的各种需求，从服务发现和负载均衡到配置管理和断路器模式。

下面是 Spring 社区发布的一张简化的架构图：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-28-113533.png" style="zoom: 50%;" />

上图中，我们可以看到有几个 Spring Boot Apps 的应用集群，这就其实是经过拆分后的微服务。Spring Boot 和 Spring Cloud 的分工是非常明确的，**Spring Boot 负责应用的基础建设，而 Spring Cloud 则负责微服务的协调和管理**。

总之，Spring Boot 和 Spring Cloud 是微服务领域中的完美搭档，它们共同为开发者提供了一个全面、强大的微服务解决方案。

## 2.Spring Cloud 组件演变：Netflix 至 Alibaba

在深入探索 Spring Cloud 组件库的演进之旅时，了解 Netflix 和 Alibaba 这两家关键公司的影响尤为重要。它们对 Spring Cloud 组件库的发展起到了决定性的作用。

Netflix，作为流媒体服务领域的先锋，利用其出色的技术实力，开发并贡献了一系列高效的组件给 Spring Cloud 社区。其中包括：

* **Eureka 服务注册中心**：提供服务的注册与发现功能，是微服务架构中的关键组件。
* **Ribbon 负载均衡器**：在客户端实现负载均衡，增强系统的处理能力。
* **Hystrix 服务容错组件**：确保在服务出现故障时，系统仍然能够正常运行。

这些组件在 Netflix 大规模的线上业务环境中经受了考验，并因其出色的功能和稳定性赢得了业界的广泛认可。Netflix 将这些成熟的组件整合进 Spring Cloud，极大丰富了其生态系统，并为其初期的发展奠定了坚实的基础。

但是随着时间的推移，Netflix 开始减少对部分项目的投入，导致了与 Spring Cloud 的关系产生变化。显著的变化包括：

* **Eureka 2.0 项目搁置**：这一决定意味着不再有新功能添加至 Eureka。
* **Hystrix 进入维护模式**：表明 Hystrix 将不再迎来重大更新或新特性。

这些变化促使 Spring 社区寻找新的解决方案，减少对 Netflix 组件的依赖。举例来说，即便 Netflix 的 Zuul 2.0 经历多次推迟后发布，Spring Cloud 也已经决定放弃集成 Zuul 2.0，而是推出了自主开发的 Gateway 网关。

与 Netflix 组件库的逐渐衰落形成鲜明对比的是，**Spring Cloud Alibaba** 的崛起。随着阿里巴巴在开源领域的不断深入和投入，他们在开源界的影响力日益扩大。Spring Cloud Alibaba 融合了阿里巴巴处理高并发电商业务的宝贵经验，不断更新迭代，逐步成为 Spring Cloud 生态中的新宠。与 Netflix 组件库相比，Spring Cloud Alibaba 更加全面和综合，成为我们选择学习的重要因素之一。

总结而言，Spring Cloud 组件库的演进和变迁反映了开源社区的整体发展趋势和技术的更新换代。Netflix 和 Alibaba 在 Spring Cloud 的发展历程中均发挥了不可或缺的作用，对此我们应给予充分的认可和感谢。

## 3.Spring Cloud 组件库功能分类

为了便于深入理解 Spring Cloud 的核心组件，以下将这些组件按其主要功能进行分类和概述，让你能够迅速掌握每个组件的主要特点和用途。

**服务治理：**

| 技术方案 | 提供方            | 描述                                             |
| -------- | ----------------- | ------------------------------------------------ |
| Eureka   | Netflix           | 实现服务的注册与发现，是微服务架构中的关键部分。 |
| Nacos🌟   | Alibaba           | 不仅提供服务治理能力，还支持动态配置管理。       |
| Consul   | Spring Cloud 官方 | 一种提供服务治理及配置中心功能的工具。           |

**负载均衡：**

| 技术方案      | 提供方            | 描述                                  |
| ------------- | ----------------- | ------------------------------------- |
| Ribbon        | Netflix           | 在客户端实现负载均衡的工具。          |
| Loadbalancer🌟 | Spring Cloud 官方 | 新一代的负载均衡器，用于取代 Ribbon。 |

**服务调用：**

| 技术方案      | 提供方                | 描述                                                 |
| ------------- | --------------------- | ---------------------------------------------------- |
| Netflix Feign | 现 OpenFeign，Netflix | 声明式的 Web 服务客户端，简化了 RESTful API 的使用。 |
| Dubbo         | Alibaba               | 高性能的 Java RPC 框架。                             |
| Openfeign🌟    | Spring Cloud 官方     | 基于 Netflix Feign 发展而来，用于实现 RESTful 调用。 |

**服务容错：**

| 技术方案     | 提供方            | 描述                                 |
| ------------ | ----------------- | ------------------------------------ |
| Hystrix      | Netflix           | 提供服务熔断、降级等容错机制。       |
| Sentinel🌟    | Alibaba           | 流量控制、熔断降级的轻量级容错框架。 |
| Resilience4j | Spring Cloud 官方 | 适用于 Java8 和函数式编程的容错库。  |

**配置中心：**

| 技术方案            | 提供方            | 描述                                                 |
| ------------------- | ----------------- | ---------------------------------------------------- |
| Nacos🌟              | Alibaba           | 统一配置和服务管理平台。                             |
| Spring Cloud Config | Spring Cloud 官方 | 提供服务端和客户端支持的外部配置（分布式配置）工具。 |

**消息总线：**

| 技术方案 | 提供方            | 描述                                   |
| -------- | ----------------- | -------------------------------------- |
| Bus🌟     | Spring Cloud 官方 | 利用轻量消息代理连接分布式系统的节点。 |

**服务网关：**

| 技术方案 | 提供方            | 描述                                             |
| -------- | ----------------- | ------------------------------------------------ |
| Zuul     | Netflix           | 提供动态路由、监控、弹性、安全等边缘服务的网关。 |
| Gateway🌟 | Spring Cloud 官方 | 新一代的 API 网关，支持 API 路由、过滤、监控等。 |

**链路追踪：**

| 技术方案         | 提供方            | 描述                         |
| ---------------- | ----------------- | ---------------------------- |
| Sleuth + Zipkin🌟 | Spring Cloud 官方 | 提供服务调用的链路追踪功能。 |

**消息事件驱动：**

| 技术方案  | 提供方            | 描述                                                         |
| --------- | ----------------- | ------------------------------------------------------------ |
| RocketMQ🌟 | Alibaba           | 高性能、高吞吐量的分布式消息中间件。                         |
| Stream🌟   | Spring Cloud 官方 | 提供广泛的消息驱动能力，对多种消息中间件提供统一的编程模型。 |

**分布式事务：**

| 技术方案 | 提供方  | 描述                                       |
| -------- | ------- | ------------------------------------------ |
| Seata    | Alibaba | 高效且易于使用的微服务分布式事务解决方案。 |

上述表格列出了在业务开发中常用的功能组件。此外，Spring Cloud 还提供了其他扩展组件，以满足更多高级场景和特定需求，如：

* **Spring Cloud Cluster**：集群构建和管理的支持。
* **Spring Cloud Security**：提供微服务安全性增强功能。
* **Spring Cloud Data Flow**：适用于云原生应用的数据流处理和集成框架。

你可以在 [Spring Cloud 官方文档](https://spring.io/projects/spring-cloud) 中查看更多组件的详细列表：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-16-154828.png)

Spring Cloud Alibaba 组件则可以访问 [spring-cloud-alibaba 的官方 GitHub 页面](https://github.com/alibaba/spring-cloud-alibaba) :

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-16-154907.png)

或 Spring 官方 [开源社区文档](https://spring.io/projects/spring-cloud-alibaba) 以获取更多信息：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-16-154954.png)

## 4.Spring Cloud 版本更新策略

Spring Cloud 的版本更新策略显示了其独特的发展路径和对持续创新的承诺。了解这种更新策略对于选择正确的版本、规划升级路径以及确保系统稳定性至关重要。

字母序列与年份版本：

* **初期的字母序列**：Angel、Brixton、Camden 等，每个字母代表一个主要版本。这种命名模式易于记忆且有序，从字母 A 开始，按照字母表的顺序标识其重大版本迭代。

  <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-28-115936.png" style="zoom: 33%;" />

* **H 版以后的年份命名**：从 H 版本开始，Spring Cloud 采用了年份命名策略。这个转变让版本命名与发布时间直接相关联，更易于理解和追踪。

  <img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-28-115959.png" style="zoom:33%;" />

版本迭代节奏：

* **早期的半年一更新**：体现了 Spring Cloud 在微服务初期的积极创新和快速发展。
* **现在的年更节奏**：随着生态的成熟和稳定，年更节奏更适合企业级开发和维护。

除了主要版本的迭代，Spring Cloud 在发布大版本之前还会经历多个小版本的迭代。以下是你需要了解的 Spring Cloud 的小版本更新策略：

| 版本                   | 说明                                                         |
| ---------------------- | ------------------------------------------------------------ |
| SNAPSHOT               | 代表开发分支的最新代码，频繁更新，适用于开发测试，不宜在生产环境使用。 |
| Milestone              | 主要版本的预览版，体现了即将到来的变化和新特性，适合早期测试和探索，但在生产环境中的使用风险较高。 |
| Release Candidate (RC) | 候选版本，接近正式发布，用于公共测试和重大问题修复，尽管接近稳定，但仍需谨慎用于生产。 |
| Release (GA)           | 正式发布的稳定版本，适合在生产环境中使用。                   |

总体而言，Spring Cloud 的更新策略不仅体现了其对创新的承诺，也反映了其适应企业需求和市场变化的灵活性。这种策略使 Spring Cloud 成为了一个可靠、持续进化的微服务框架。

---
title: 04-cloud-实战项目搭建
---
## 1.搭建开发环境

“工欲善其事，必先利其器”——这个古代的格言在现代软件开发中依然适用。开发环境的搭建是进行高效软件开发的基础，确保在项目实施过程中系统运行的稳定性与一致性。在深入项目实战之前，关键在于建立一个健全且可靠的开发环境，以避免后期由于环境配置不当带来的种种问题和挑战。

1. **开发环境的统一标准化**

   首先，统一的开发环境配置是保障项目团队协作顺畅的重要因素。我们需确保各开发组件，如 Java、Maven 和其他相关中间件的版本统一。版本的统一有助于减少因环境差异导致的问题，如兼容性问题或功能差异，从而保证项目的进度和质量。

2. **关键中间件的选择与搭建**

   在本项目中，我们选用了多个重要的中间件，包括但不限于 Spring Cloud 的核心组件如 Nacos、Sentinel、Zipkin 和 Seata。选择这些中间件是为了提高项目的可靠性、监控能力及分布式事务管理。我们将在后续章节中逐一深入介绍这些中间件的作用、安装过程和配置方法。

3. **集成开发环境（IDE）和数据库的设置**

   我们还需要搭建集成开发环境（IDE），安装数据库，并导入必要的数据库脚本。一个高效的 IDE 可以极大提高开发效率，而适当配置的数据库是确保数据存取效率和安全的关键。此外，我们还会探讨如何安装和配置一些常用的中间件，以便更好地支持后续的开发工作。

OK，不说废话了，我们正式开始！

### 1.1 环境准备：选择一个合适的操作系统

选择一个适合的操作系统是开发过程中的第一步。针对 Java 开发，强烈推荐 **Mac 笔记本或者基于 Linux 的操作系统**。Linux 系统由于其稳定性、灵活性以及与生产环境的一致性，被广泛认为是服务器端应用和开发的首选。而 Mac 系统，凭借其优秀的用户体验和对开发者友好的环境，同样是一个不错的选择。

如果你目前是 Windows 用户，有以下几种方式可以获得类似 Linux 的开发体验：

1. **安装双系统**：这是最接近真实 Linux 系统的体验，但可能需要额外的分区或硬盘空间。
2. **使用 Cygwin 或 Ubuntu 虚拟机**：这些工具可以在 Windows 系统中模拟出 Linux 环境，方便且高效。

接下来，我将介绍如何在 Mac 系统上配置开发环境。尽管这里以 Mac 系统为例，但相同的步骤也适用于 Linux，只是安装方式可能略有不同。Windows 用户可以参考官方下载链接进行相应软件的安装。

### 1.2 Homebrew：Mac 上的软件管理神器

Homebrew 是 Mac 上的一款强大的包管理工具，它可以大大简化软件的安装和管理过程。你可以通过下面的步骤在 Mac 上安装 Homebrew。

首先，访问 [Homebrew 官方网站](https://brew.sh/) 查看详细的安装指南。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-023042.png)

使用以下命令进行安装：

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

由于某些网络环境的限制，你可能会遇到安装速度缓慢的问题。这里有两个解决方案：

1. **使用 VPN**：这可以有效提高下载速度，但可能需要额外的费用或配置。
2. **切换到国内镜像源**：如清华大学或中国科技大学的镜像。官方安装文档中有详细的替换方法。

安装完成后，执行 `brew -v` 来验证安装是否成功。你应该能看到类似以下的输出信息：

```bash
➜  ~ brew -v
Homebrew 4.0.28-67-ge9ac36a
```

有了 Homebrew，你可以方便地使用 `brew install` 命令安装所需软件。但是，使用国内镜像时，请注意某些软件或依赖项可能因网络问题安装失败，此时可以尝试根据错误日志单独安装有问题的依赖然后再尝试安装目标软件。

### 1.3 Java 和 Maven：高效 Java 开发的关键

Java 和 Maven 是 Java 开发的核心工具，其版本选择和配置直接影响到开发的效率和项目的稳定性。以下将详细介绍如何配置这两个工具，确保一个顺畅的开发流程。

Java 和 Maven 版本选择：

* **JDK 8**：这是 Java 长期支持的版本之一，广泛用于企业级应用。你可以从 [Oracle 官网](https://www.oracle.com/sg/java/technologies/javase/javase8u211-later-archive-downloads.html) 下载 JDK 8 的最新小版本。尽管较旧，但其稳定性和广泛的应用支持是选择它的主要原因。
* **Maven 版本**：建议使用 Maven 3.6 或更高版本，以确保与现代 Java 生态的兼容性。在本文中，我使用的是 Maven 3.9.3，可从 [Maven 官网](https://maven.apache.org/download.cgi) 下载。

由于 Maven 中央仓库在国内访问可能受限，我们可以通过配置 `settings.xml` 来指定国内的镜像仓库，以提高依赖包的下载速度。这里介绍两个常用的国内镜像：

**阿里云镜像**：速度快，覆盖广泛，适合大多数场景。

```xml
<mirror>
  <id>aliyunmaven</id>
  <mirrorOf>*</mirrorOf>
  <name>阿里云公共仓库</name>
  <url>https://maven.aliyun.com/repository/public</url>
</mirror>
```

**华为云镜像**：这是一个高速且稳定的替代选项，我在这里使用华为云镜像。

```xml
<mirror>
  <id>huaweicloud</id>
  <mirrorOf>*</mirrorOf>
  <url>https://repo.huaweicloud.com/repository/maven/</url>
</mirror>
```

通过以上步骤，Java 和 Maven 的基本配置就完成了。

### 1.4 IntelliJ IDEA：Java 开发的利器

IntelliJ IDEA 是一个功能强大且流行的 Java 集成开发环境（IDE），由 JetBrains 开发。它不仅支持 Java，还支持多种其他编程语言和框架。以下是其安装步骤：

1. **下载**：前往 [JetBrains 官方网站](https://www.jetbrains.com/zh-cn/idea/download) 下载 IntelliJ IDEA。你可以选择免费的社区版，或是具有更多特性的付费商业版。
2. **安装**：根据你的操作系统，执行安装程序。过程中，你可以选择安装位置、创建桌面快捷方式等。
3. **配置**：初次启动 IntelliJ IDEA 后，你会被引导完成一些基础配置，比如界面主题、编辑器设置等。
4. **激活**：如果你使用商业版，需要进行激活。学生和教师可通过教育邮箱申请免费的商业版授权。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-024538.png)

### 1.5 Lombok：代码简化神器

Lombok 是一个非常实用的 Java 库，用于自动化常见的模板代码，如 getters、setters、equals、hashCode 和 toString 方法。

在 IntelliJ IDEA 中，安装 Lombok 非常简单。只需在 IDEA 的插件市场中搜索并安装 Lombok 插件即可：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-024723.png)

接着启用注解处理器，在 “Settings” 中，进入  “Build, Execution, Deployment” > “Compiler” > “Annotation Processors”。确保勾选 “Enable annotation processing”：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-121745.png)

为了在项目中使用 Lombok，确保你的 `pom.xml` 或 `build.gradle` 文件中加入了 Lombok 依赖。Maven 示例：

```xml
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <version>最新版本</version>
  <scope>provided</scope>
</dependency>
```

### 1.6 MySQL 及其可视化工具：构建高效数据环境

我们将使用 MySQL 作为核心数据库。如果你的系统中已经安装了 MariaDB，无需担心，因为 MariaDB 是 MySQL 的一个分支，由 MySQL 的创始人之一开发，并保持与 MySQL 的高度兼容性。

安装 MySQL 非常简便。Mac 用户可以通过 Homebrew 进行安装，只需执行以下命令：

```bash
brew install mysql
```

Windows 或 Linux 用户可访问 [MySQL 官方网站](https://dev.mysql.com/downloads/mysql)，下载相应平台的社区版安装包。社区版已充分满足我们实战项目的需求。

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-025049.png" style="zoom: 33%;" />

完成安装后，可以用以下任一方法启动 MySQL：

```bash
# 使用 mysql.server 启动
mysql.server start

# 使用 brew services 启动（推荐）
brew services start mysql
```

同样地，要关闭 MySQL，可用对应的命令：

```bash
# 使用 mysql.server 停止
mysql.server stop

# 使用 brew services 停止（推荐）
brew services stop mysql
```

> TIP：使用 `brew services` 管理 MySQL 服务时，`brew services stop mysql` 不仅能方便地停止服务，还可防止系统重启时 MySQL 自动启动。

为验证 MySQL 是否正确安装，尝试使用以下命令登录：

```bash
mysql -uroot -p
```

这里使用默认的 root 用户登录（初始密码为空）。登录成功后，会见到类似下方的界面，表示 MySQL 安装并运行正常：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-030049.png" style="zoom:50%;" />

登录后，建议立即修改 root 用户的密码，提高数据库安全性：

```sql
ALTER USER 'root'@'localhost' IDENTIFIED BY '新密码';
```

继 MySQL 安装后，为了更高效地管理数据库，我推荐使用 DataGrip，它是 JetBrains 开发的一款强大的数据库管理工具。DataGrip 支持 MySQL 以及多种其他数据库，提供丰富的功能，如代码自动完成、分析和重构等。

访问 [DataGrip 官网](https://www.jetbrains.com/zh-cn/datagrip/download)，选择适合你操作系统的版本下载：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-025527.png" style="zoom: 33%;" />

安装并启动 DataGrip 后，需要添加一个数据源来连接本地的 MySQL 数据库：

1. 在 DataGrip 中，点击 "添加数据源"。
2. 选择 MySQL。
3. 输入数据库连接详情：
   * **用户名**：root（或你的自定义用户名）
   * **密码**：（留空或输入你设置的密码）
   * **JDBC URL**：`jdbc:mysql://localhost:3306`
4. 确保已安装 MySQL JDBC 驱动。如果未安装，DataGrip 通常会提示下载。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-032416.png)

完成这些步骤后，点击 "测试连接" 检查是否能够成功连接到数据库。连接成功意味着你现在可以通过 DataGrip 来管理 MySQL 数据库，进行查询、编辑、管理数据表等操作。

在实战项目开始之前，我们需要先在 MySQL 中构建项目所需的数据库和数据表。这个过程对于整个项目的数据管理至关重要。

**创建数据库**：我们首先创建一个名为 `coupon_db` 的数据库，用于存储所有与优惠券相关的数据。

```sql
-- 创建数据库 coupon_db
CREATE DATABASE IF NOT EXISTS coupon_db;
```

**创建 `coupon_template` 数据表**：该表用于存储优惠券模板的相关信息，如优惠券名称、类型、适用门店等。

```sql
-- 如果存在同名表则删除，然后创建 coupon_template 数据表
DROP TABLE IF EXISTS `coupon_db`.`coupon_template`;
CREATE TABLE IF NOT EXISTS `coupon_db`.`coupon_template` (
     `id`                   int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
     `available`        boolean NOT NULL DEFAULT false COMMENT '优惠券可用状态，默认为 false 表示不能使用',
     `name`              varchar(64) NOT NULL DEFAULT '' COMMENT '优惠券名称',
     `description`     varchar(256) NOT NULL DEFAULT '' COMMENT '优惠券详细信息',
     `type`                varchar(10) NOT NULL DEFAULT '' COMMENT '优惠券类型',
     `shop_id`           bigint(20) COMMENT '适用的门店，空代表全场适用',
     `created_time`   datetime NOT NULL DEFAULT '2023-09-17 00:00:00' COMMENT '创建时间',
     `rule`                 varchar(2000) NOT NULL DEFAULT '' COMMENT '使用规则',
     
     PRIMARY KEY (`id`),
     KEY `idx_shop_id` (`shop_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='优惠券模板';
```

**创建 `coupon` 数据表**：此表记录用户领取的优惠券信息，包括用户ID、领券时间、优惠券状态等。

```sql
-- 如果存在同名表则删除，然后创建 coupon 数据表
DROP TABLE IF EXISTS `coupon_db`.`coupon`;
CREATE TABLE IF NOT EXISTS `coupon_db`.`coupon` (
    `id`                    int(11) NOT NULL AUTO_INCREMENT COMMENT '主键',
    `template_id`    int(20) NOT NULL DEFAULT '0' COMMENT '优惠券模版ID',
    `user_id`           bigint(20) NOT NULL DEFAULT '0' COMMENT '用户ID',
    `created_time`  datetime NOT NULL DEFAULT '2023-09-17 00:00:00' COMMENT '领券时间',
    `status`              int(2) NOT NULL DEFAULT '0' COMMENT '优惠券状态',
    `shop_id`          bigint(20) COMMENT '冗余字段，方便查找',

    PRIMARY KEY (`id`),
    KEY `idx_user_id` (`user_id`),
    KEY `idx_template_id` (`template_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COMMENT='领到的优惠券';
```

以上 SQL 脚本创建了一个专注于优惠券相关数据的数据库和两个主要数据表。`coupon_template` 表格用于定义优惠券的基本模板，而 `coupon` 表格记录了具体的优惠券发放情况。确保在执行这些脚本前，MySQL 服务正在运行。

> ✏️ 数据表设计要点：
>
> * **数据类型选择**：合理选择数据类型能够优化存储空间和查询效率。例如，使用 `int` 类型表示主键，`varchar` 存储字符串。
> * **冗余字段**：`coupon` 表中的 `shop_id` 作为冗余字段，便于快速查询优惠券适用门店，这减少了与 `coupon_template` 表的联合查询需求。
> * **默认值与注释**：表中字段的默认值及注释的设置增强了数据的可读性和维护性。

### 1.7 消息中间件：RabbitMQ 的安装与配置

RabbitMQ 是目前使用最广泛的消息中间件之一。后续 Spring Cloud 项目中，我们将结合 Stream 组件和 RabbitMQ 来实现异步消息传递。

**对于 Mac 用户**：使用 Homebrew 快速安装 RabbitMQ 的命令很方便，如下命令将自动安装 RabbitMQ 的最新稳定版本。

```bash
brew install rabbitmq
```

**非 Mac 用户或手动安装**：访问 [RabbitMQ 官网](https://www.rabbitmq.com/) 下载相应的安装包。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-031755.png)

**启动 RabbitMQ**：启动 RabbitMQ 服务的命令根据安装方式略有不同。如果通过 Homebrew 安装，可以使用：

```bash
rabbitmq-server
# 或者（推荐）
brew services start rabbitmq
```

> TIP：如果是手动安装，确保 RabbitMQ 的安装路径已添加至 PATH 环境变量。

**关闭 RabbitMQ**：正确关闭 RabbitMQ 服务是非常重要的，尤其是在处理重要数据和配置时。

```bash
rabbitmqctl stop
# 或者（推荐）
brew services stop rabbitmq
```

> TIP：确保在停止 RabbitMQ 之前保存所有的重要数据和配置，以防数据丢失或配置被重置。

在浏览器中输入 `http://localhost:15672/` 访问 RabbitMQ 的管理界面，默认端口为 `15672`。默认的用户名和密码均为 `guest`。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-043816.png)

登录成功后，你可以看到 RabbitMQ 的管理界面，它提供了关于消息、队列等的详细统计信息和管理选项。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-043834.png)

至此，你已经成功安装并运行了 RabbitMQ。

> 注意：
>
> * **更新 RabbitMQ**：如果之前已经安装了 RabbitMQ，但非最新版本，建议更新到最新稳定版本，以便使用所有最新功能和插件。
> * **数据和配置的保存**：在停止 RabbitMQ 服务之前，确保已经保存了所有重要的数据和配置，以避免数据丢失或配置被重置。

### 1.8 存储系统：Redis 的安装与配置

Redis 是一个高性能的 key-value 存储系统，广泛应用于缓存、会话管理等场景。在微服务架构中，我们将使用 Redis 来实现网关层的限流功能。

**通过 Homebrew 安装**：对于 Mac 用户，使用 Homebrew 安装 Redis 非常方便，以下命令将安装 Redis 的最新版本。

```bash
brew install redis
```

**手动安装**：也可以选择手动安装 Redis，访问 [Redis 官方网站](https://redis.io/download) 下载源码包。

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-044049.png" style="zoom: 33%;" />

然后按照官方[安装指南](https://redis.io/docs/getting-started/installation/)进行本地编译和安装：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-044136.png" style="zoom: 29%;" />

**启动和停止 Redis 服务**：

```bash
# 启动 Redis 服务
brew services start redis

# 停止 Redis 服务
brew services stop redis
```

执行 `redis-cli` 连接至默认的 Redis 服务地址（localhost:6379）：

```bash
➜  ~ redis-cli
127.0.0.1:6379>
```

在 Redis 控制台中，可以执行 Redis 命令以测试和管理您的 Redis 实例：

```bash
127.0.0.1:6379> set test 955
OK
127.0.0.1:6379> get test
"955"
127.0.0.1:6379>
```

当然，还可以使用 DataGrip 连接 Redis 数据库，进行更直观的数据管理和操作：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-044757.png" style="zoom:50%;" />

连接信息基本保持默认即可：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-044901.png)

至此，我们已经完成了所有必要工具的安装。在接下来的 Spring Cloud 微服务实战中，我们还将介绍和使用更多的中间件和工具。

> 🚀 **下一步：Spring Boot 快速入门**
>
> 已经配置好基础环境后，我们可以进一步深入到 Spring Boot 的学习和应用中了！让我们开始 Spring Boot 的旅程吧！**加油！**🔥

## 2.搭建优惠券模板服务

在本节，我们将详细探索如何从零开始搭建一个基于 Spring Boot 的优惠券平台，特别聚焦于优惠券模板服务（`coupon-template-serv`）的构建过程。这一服务是优惠券平台的核心，因为优惠券的生成与管理都依赖于模板。

项目结构概览：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-01-160815.png" style="zoom:67%;" />

我们的优惠券平台项目（`coupon-center`）包含四个主要子模块，它们在 Maven 管理下形成一个层次分明的结构：

1. **coupon-template-serv**：此模块负责创建、查找、克隆和删除优惠券模板。
2. **coupon-calculation-serv**：处理优惠后的订单价格计算，以及评估各类优惠券的优惠程度。
3. **coupon-customer-serv**：与用户相关的服务，包括领取优惠券、模拟计算优惠、删除优惠券和订单处理。
4. **middleware**：存储跨业务的、平台级组件。

每个以 `-serv` 结尾的子模块进一步细分为以下三个子模块，确保职责单一，代码管理清晰：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-01-161047.png" style="zoom:67%;" />

* **coupon-template-api**：包含公共类和外部接口，如 Request 和 Response 对象。
* **coupon-template-dao**：定义数据库实体和数据访问对象（DAO）。
* **coupon-template-impl**：具体实现服务的核心业务逻辑和 REST API。

接下来，我们将具体介绍如何配置和启动 `coupon-template-serv` 模块，包括数据库配置、核心业务逻辑的实现，以及如何通过 REST API 对外提供服务。

### 2.1 添加 Maven 依赖项

在构建基于 Maven 的 Spring Boot 项目时，合理的依赖管理策略对于项目的结构和后续维护至关重要。以下内容将详细介绍如何在多模块项目中添加和配置 Maven 依赖项，以及它们在项目中的层级关系。

#### 2.1.1 编写 part01-springboot-quick 依赖项

在我们的实战项目 `part01-springboot-quick` 中，它作为顶层项目，主要承担着定义公共 Maven 依赖版本的责任，类似于一个公司的战略管理层，指明大方向而不涉足具体业务。这些配置均在项目的 `pom.xml` 文件中指定。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>2.4.2</version>
  </parent>

  <groupId>cn.javgo</groupId>
  <artifactId>ch0-springboot-monolithic</artifactId>
  <version>1.0-SNAPSHOT</version>
  <packaging>pom</packaging>

  <name>ch0-springboot-monolithic</name>
  <url>http://maven.apache.org</url>

  <!-- 子模块 -->
  <modules>
    <module>coupon-template-serv</module>
    <module>coupon-calculation-serv</module>
    <module>coupon-customer-serv</module>
    <module>middleware</module>
  </modules>

  <!-- 属性 -->
  <properties>
    <java.version>1.8</java.version>
    <maven.compiler.source>8</maven.compiler.source>
    <maven.compiler.target>8</maven.compiler.target>
  </properties>

  <!-- 依赖管理 -->
  <dependencyManagement>
    <dependencies>
      <!-- Spring Cloud 版本 -->
      <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-dependencies</artifactId>
        <version>2020.0.1</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>

      <!-- Spring Cloud Alibaba 版本 -->
      <dependency>
        <groupId>com.alibaba.cloud</groupId>
        <artifactId>spring-cloud-alibaba-dependencies</artifactId>
        <version>2021.1</version>
        <type>pom</type>
        <scope>import</scope>
      </dependency>

      <!-- Apache Commons -->
      <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
        <version>3.0</version>
      </dependency>

      <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-collections4</artifactId>
        <version>4.0</version>
      </dependency>

      <dependency>
        <groupId>commons-codec</groupId>
        <artifactId>commons-codec</artifactId>
        <version>1.9</version>
      </dependency>

      <!-- Alibaba FastJson -->
      <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
        <version>1.2.31</version>
      </dependency>

      <!-- Lombok -->
      <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.20</version>
      </dependency>

      <!-- Jakarta Bean Validation -->
      <dependency>
        <groupId>jakarta.validation</groupId>
        <artifactId>jakarta.validation-api</artifactId>
        <version>2.0.2</version>
      </dependency>

      <!-- Google Guava -->
      <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
        <version>16.0</version>
      </dependency>
    </dependencies>

  </dependencyManagement>
</project>
```

在这份 `pom.xml` 文件中，重点关注以下三个标签：

1. **\< parent \> 标签**

   通过 `<parent>` 标签的配置，我们确定了顶层项目的父依赖为 `spring-boot-starter-parent`，它为我们的子模块提供了所需的 Spring Boot 组件版本，这样的做法利于保持依赖的一致性和简化管理。

2. **\< packaging \> 标签**

   这里我们指定 `<packaging>` 的值为 `pom`，意味着该模块聚焦于策略性的定义，包括子模块的整合和依赖版本管理，而不包含具体的业务逻辑实现。

3. **\< dependencyManagement \> 标签**

   与 `<parent>` 类似，`<dependencyManagement>` 用于集中管理项目依赖版本。这样，子模块在声明依赖时，只需指出 `groupId` 和 `artifactId`，无需指定版本，避免了版本冲突和混乱。

#### 2.1.2 编写 coupon-template-serv 依赖项

接下来是 `coupon-template-serv` 子模块的依赖配置。作为 `part01-springboot-quick` 的直接子模块，它的 `pom.xml` 配置同样将 `<packaging>` 类型设为 `pom`，并且主要内容集中在确定其父模块，并定义下层子模块的配置。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>cn.javgo</groupId>
        <artifactId>ch0-springboot-monolithic</artifactId>
        <version>1.0-SNAPSHOT</version>
    </parent>

    <artifactId>coupon-template-serv</artifactId>
    <packaging>pom</packaging>

    <name>coupon-template-serv</name>
    <url>http://maven.apache.org</url>

    <modules>
        <module>coupon-template-api</module>
        <module>coupon-template-impl</module>
        <module>coupon-template-dao</module>
    </modules>

    <properties>
        <maven.compiler.source>8</maven.compiler.source>
        <maven.compiler.target>8</maven.compiler.target>
    </properties>
</project>
```

在完成了顶级模块和直接子模块的依赖配置后，我们的下一步是构建 `coupon-template-serv` 下属的三个子模块：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-081052.png)

以 `coupon-template-api` 子模块为起点，其主要职责是提供接口的请求和响应类模板，它是其他两个模块共享资源的基础，我们将着手于此模块的构建工作。

### 2.4 搭建 coupon-template-api 模块

#### 2.4.1 概览

`coupon-template-api` 模块担任了整个服务中**共享数据类型和接口规范**的角色。它包含了所有的 REST API 消息传输对象（DTO），例如请求和响应对象，这些都是以 POJO（Plain Old Java Object）类的形式实现的。在微服务体系中，这样做可以避免在服务之间共享完整的业务逻辑，从而促进服务的独立性和可重用性。

#### 2.4.2 依赖配置

在这个模块的 `pom.xml` 中，我们加入了若干便于开发的工具类库，如 `lombok`（用于简化对象的创建和管理），`guava`（提供额外的集合处理能力），以及 `validation-api`（用于数据有效性校验）。

下面是这些依赖项的具体配置：

```xml
<dependencies>
    <!-- Apache Commons -->
    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-lang3</artifactId>
    </dependency>

    <dependency>
        <groupId>org.apache.commons</groupId>
        <artifactId>commons-collections4</artifactId>
    </dependency>

    <dependency>
        <groupId>commons-codec</groupId>
        <artifactId>commons-codec</artifactId>
    </dependency>

    <!-- Alibaba FastJson -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
    </dependency>

    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
    </dependency>

    <!-- Jakarta Validation -->
    <dependency>
        <groupId>jakarta.validation</groupId>
        <artifactId>jakarta.validation-api</artifactId>
    </dependency>

    <!-- Google Guava -->
    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
    </dependency>
</dependencies>
```

#### 2.4.3 核心组件

<center>优惠券类型枚举（CouponType）</center>

在 `cn.javgo.coupon.calculation.template.api.constant` 包中，`CouponType `枚举定义了一系列的优惠券类型。为了增加代码的**鲁棒性**，这里还设计了一个特殊的枚举值 `UNKNOWN`，用于处理无效的输入。

```java
/**
 * 优惠卷类型枚举
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
@Getter
@AllArgsConstructor
public enum CouponType {
    UNKNOWN("unknown", "0"),
    MONEY_OFF("满减券", "1"),
    DISCOUNT("折扣券", "2"),
    RANDOM_DISCOUNT("随机折扣券", "3"),
    LONELY_NIGHT_MONEY_OFF("晚间双倍满减券", "4");

    private final String desc;

    private final String code;


    /**
     * 将给定的代码转换为相应的优惠券类型
     *
     * @param code 优惠券类型的代码
     * @return 转换后的优惠券类型
     */
    public static CouponType convert(String code) {
        return Stream.of(CouponType.values())
                .filter(bean -> bean.code.equalsIgnoreCase(code))
                .findFirst()
                // 防御性编程：处理恶意请求中故意输入的错误代码
                .orElse(UNKNOWN);
    }
}
```

<hr/>

<center>优惠券模板规则（TemplateRule）</center>

`TemplateRule `类位于 `cn.javgo.coupon.calculation.template.api.beans.rules` 包下，描述了优惠券模板的两个基本规则：领取规则和使用规则。这些规则对于理解和执行优惠券的行为至关重要。

1. **领券规则**：描述了每个用户可以领取的优惠券数量和优惠券的过期时间。
2. **优惠券的计算规则**：描述了优惠券的具体折扣规则。

```java
/**
 * 优惠卷领取规则
 * @author javgo.cn
 * @date 2023/11/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TemplateRule {

    /**
     * 优惠卷折扣规则
     */
    private Discount discount;

    /**
     * 优惠卷领取限制
     */
    private Integer limitation;

    /**
     * 优惠卷过期时间
     */
    private Long deadline;
}
```

<hr/>

<center>折扣规则（Discount）</center>

`Discount `类定义了具体的折扣逻辑，这里使用 `Long` 类型以分为单位表示金额，以避免浮点数计算的精度问题。

```java
/**
 * 优惠规则
 * @author javgo.cn
 * @date 2023/11/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Discount {

    /**
     * 优惠金额
     * <p>
     * 注意：对于不同的优惠卷有不同的含义<br>
     * 1、满减劵：满足一定金额后可以减去的金额<br>
     * 2、折扣劵：折扣比例，如 90 表示打9折<br>
     * 3、随机立减劵：随机减去的金额<br>
     * 4、晚间发放劵：晚间优惠卷翻倍
     */
    private Long quota;

    /**
     * 优惠条件：使用优惠卷的最低金额，单位：分
     */
    private Long threshold;
}
```

<hr/>

<center>优惠券模板信息（CouponTemplateInfo）</center>

`CouponTemplateInfo `类提供了模板的基础描述，并使用了 `jakarta.validation-api` 中的校验注解确保数据的完整性。

```java
/**
 * 优惠卷模板信息
 * @author javgo.cn
 * @date 2023/11/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponTemplateInfo {

  @ApiModelProperty("主键")
  private Long id;

  @NotNull
  @ApiModelProperty("优惠卷模板名称")
  private String name;

  @NotNull
  @ApiModelProperty("优惠卷模板描述")
  private String desc;

  @NotNull
  @ApiModelProperty("优惠卷模板类型")
  private String type;

  @ApiModelProperty("店铺id")
  private Long shopId;

  @NotNull
  @ApiModelProperty("优惠卷模板规则")
  private TemplateRule templateRule;

  @ApiModelProperty("是否可用")
  private Boolean available;
}
```

<hr/>

<center>其他类</center>

> 此外，模块中还包括了如分页查询和搜索优惠券模板所需的参数类等。这些类进一步增强了服务的功能。

生成的优惠券则使用另一个对象 `CouponInfo` 来封装。`CouponInfo` 对象包含了优惠券的模板信息、领券用户ID、适用门店 ID 等关键属性：

```java
/**
 * 优惠卷信息（基于 {@link CouponTemplateInfo} 生成）
 * @author javgo.cn
 * @date 2023/11/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CouponInfo {

  @ApiModelProperty("主键")
  private Long id;

  @ApiModelProperty("优惠卷模板ID")
  private Long templateId;

  @ApiModelProperty("用户ID")
  private Long userId;

  @ApiModelProperty("店铺ID")
  private Long shopId;

  @ApiModelProperty("优惠卷状态")
  private Integer status;

  @ApiModelProperty("优惠卷模板信息")
  private CouponTemplateInfo templateInfo;
}
```

分页查询优惠券模板信息参数：

```java
/**
 * 分页查询优惠卷模板
 * @author javgo.cn
 * @date 2023/11/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PagedCouponTemplateInfo {

  @ApiModelProperty("优惠卷模板列表")
  public List<CouponTemplateInfo> couponTemplateInfoList;

  @ApiModelProperty("当前页")
  public int page;

  @ApiModelProperty("总页数")
  public long total;
}
```

优惠券模板搜索参数：

```java
/**
 * 优惠卷模版查询参数
 * @author javgo.cn
 * @date 2023/11/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TemplateSearchParams {

  @ApiModelProperty(value = "优惠卷ID")
  private Long id;

  @ApiModelProperty(value = "优惠卷名称")
  private String name;

  @ApiModelProperty(value = "优惠卷类型")
  private String type;

  @ApiModelProperty(value = "门店ID")
  private Long shopId;

  @ApiModelProperty(value = "是否可用")
  private Boolean available;

  @ApiModelProperty(value = "页码")
  private int page;

  @ApiModelProperty(value = "每页大小")
  private int pageSize;
}
```

`coupon-template-api ` 模块为我们提供了标准化的数据交换格式，使得其他服务能够基于这些格式构建自己的逻辑。随着模块的进一步丰富，它将成为保证微服务间通信一致性和减轻耦合的关键。

在完成 `coupon-template-api` 模块后，我们接下来将聚焦于 `coupon-template-dao` 模块，这个模块负责实现数据访问逻辑，包括与数据库的交互和数据持久化。

### 2.5 搭建 coupon-template-dao 模块

#### 2.5.1 依赖配置

在动手实现 `coupon-template-dao `模块前，确认已经添加了以下关键依赖项至 `pom.xml` 文件：

- **coupon-template-api**: 引入该模块以使用 API 层定义的公共类。
- **spring-boot-starter-data-jpa**: 利用 Spring Data JPA 简化数据持久化操作。
- **mysql-connector-java**: 确保所用 MySQL 驱动与数据库版本兼容。

```xml
<dependencies>
    <!--
        持久层（Persistence Layer）是应用程序中的一个模块，负责管理和存储数据。在实际情况下，持久层不应该直接依赖于 API 层
        （Application Programming Interface Layer），因为这两层的功能分离应该是相对独立的。然而，为了简化示例，这里假设
        持久层直接依赖于 API 层的 POJO 类（Plain Old Java Object，简单的 Java 对象）。

        在实际开发中，持久层应该定义自己的 DTO（Data Transfer Object），即数据传输对象。上层模块可以通过转换器（converter）将
        API 层的 POJO 类转换成适合持久层使用的 DTO。这样做的好处是，持久层的 DTO 可以灵活修改，而不会影响到 API 层的 POJO 类。
        因为 API 层的 POJO 类是应用程序的外部接口，不应该频繁修改。

        总之，在实际开发中，持久层应该与 API 层解耦合，并且通过自定义 DTO 进行数据传输。这样做可以提高应用程序的灵活性和可维护性。
    -->
    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-template-api</artifactId>
        <version>${project.version}</version>
    </dependency>

    <!-- Spring Data JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Spring Boot Validation -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- MySQL -->
    <dependency>
        <groupId>mysql</groupId>
        <artifactId>mysql-connector-java</artifactId>
        <version>8.0.21</version>
        <scope>runtime</scope>
    </dependency>
</dependencies>
```

#### 2.5.2 实体定义

在 `cn.javgo.template.dao.model` 包下创建 `CouponTemplate` 类，该类表示数据库中 `coupon_template` 表的实体。

```java
/**
 * 优惠卷模版实体
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity // 实体
@EntityListeners(AuditingEntityListener.class) // 审计
@Table(name = "coupon_template") // 表名
public class CouponTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "type", nullable = false)
    @Convert(converter = CouponTypeConverter.class)
    private CouponType category;

    @Column(name = "rule", nullable = false)
    @Convert(converter = RuleConverter.class)
    private TemplateRule templateRule;

    // 如果为空，则表示全店通用优惠卷
    @Column(name = "shop_id")
    private Long shopId;

    @Column(name = "available", nullable = false)
    private Boolean available;

    @CreatedDate
    @Column(name = "created_time", nullable = false)
    private Date createdTime;
}
```

使用 JPA 注解可以将类属性映射到数据库表字段，以下是一些核心注解及其作用的概述：

| 注解            | 描述                                                         |
| --------------- | ------------------------------------------------------------ |
| @Entity         | 指明该类为实体类，它将映射到数据库表。                       |
| @Table          | 明确指出实体对应于数据库中的哪个表。                         |
| @ID             | 标记一个字段作为唯一的主键。                                 |
| @GeneratedValue | 指定主键生成策略，如自增。                                   |
| @Column         | 将实体的属性映射到表的特定列，并可定义列的特性（如非空）。   |
| @CreatedDate    | 自动记录实体创建的时间。                                     |
| @Convert        | 当数据库字段与实体属性不是直接映射关系时，使用该注解指定一个实现了 `AttributeConverter<X,Y>` 接口的转换器。 |

> ⚠️ 注意：
>
> 尽管 JPA 提供了强大的关系映射功能（如 @ManyToOne 和 @OneToOne），在高并发场景下过度使用这些关系可能会影响性能，由于可能导致复杂的 SQL 语句和大量的数据库操作。推荐在实际开发中尽可能避免级联查询，通过业务逻辑重构或查询优化来减轻数据库负担。

在需要将特定的数据库列值转换为 Java 对象时，定义相应的 `AttributeConverter` 实现类即可：

```java
/**
 * 优惠卷类型转换器
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
public class CouponTypeConverter implements AttributeConverter<CouponType, String> {

    @Override
    public String convertToDatabaseColumn(CouponType attribute) {
        return attribute.getCode();
    }

    @Override
    public CouponType convertToEntityAttribute(String dbData) {
        return CouponType.convert(dbData);
    }
}
```

#### 2.5.3 数据访问对象（DAO）

为了与数据库交互，我们将定义 DAO 接口。例如，`CouponTemplateDAO `可以通过继承 `JpaRepository` 接口，提供对 `CouponTemplate` 实体的 CRUD 操作。通过这种方式，我们避免了编写大量的 SQL 语句，同时 Spring Data JPA 提供的方法已经足够应对大多数数据访问需求。

```java
/**
 * 优惠卷模版 Dao ( 第一个泛型：实体类，第二个泛型：主键类型 )
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
public interface CouponTemplateDao extends JpaRepository<CouponTemplate, Long> {

    /**
     * 根据店铺id查询优惠卷模版
     *
     * @param shopId 店铺id
     * @return 优惠卷模版列表
     */
    List<CouponTemplate> findAllByShopId(Long shopId);

    /**
     * 根据给定的id列表和分页信息，查找所有的优惠券模板
     *
     * @param ids      优惠券id列表
     * @param pageable 分页信息
     * @return 包含匹配的优惠券模板的分页对象
     */
    Page<CouponTemplate> findAllByIdIn(List<Long> ids, Pageable pageable);

    /**
     * 根据商店ID和可用状态计数
     *
     * @param shopId    商店ID
     * @param available 可用状态
     * @return 计数
     */
    Integer countByShopIdAndAvailable(Long shopId, Boolean available);

    /**
     * 将优惠券模板设置为不可用
     *
     * @return 更新成功时返回修改的行数
     * @Modifying 表示该注解用于修改数据库中的数据
     * @Query 表示该注解用于执行一个 JPA 查询语句
     */
    @Modifying
    @Query("update CouponTemplate c set c.available = 0 where c.id = :id")
    int makeCouponUnavailable(@Param("id") Long shopId);
}
```

在 `coupon-template-dao` 模块中，您可能好奇如何实现增加、删除和修改功能，因为代码示例中主要展示了查询操作。实际上，这些基础的数据库操作方法都隐含在 `CouponTemplateDao` 继承的 `JpaRepository` 接口内。

`JpaRepository `接口是 Spring Data JPA 的心脏，它提供了包括：

- `save()`: 添加或更新数据
- `delete()`: 删除数据
- `findOne()`, `findAll()`: 查询数据

等等一系列标准的数据操作方法。

除了基本的 CRUD 功能，`JpaRepository `还提供了多样化的查询方式，例如：

- **基于方法名称的查询**：可以通过在接口方法中声明查询条件的方式来构建查询。
- **基于 Example 的查询**：使用一个实体对象作为查询模板。
- **自定义查询**：通过 `@Query` 注解来定义 SQL 或 JPQL 查询语句。

例如，使用基于方法名称的查询方式可以这样定义：

```java
List<CouponTemplate> findAllByShopId(Long shopId);
```

在 Spring Data JPA 中，这种查询方式的优势在于其 "**约定优于配置**" 的设计理念，简化了查询操作。你只需要按规则构造方法名称，框架就能为你生成 SQL。

但需遵守命名规则，包括：

- **起始词**（如`find`、`count`）
- **属性名称**（需与实体属性匹配）
- **连接词**（如`And`、`Or`）

基于方法名称的查询在简单场景下易于使用，但可能难以应对复杂查询。对于更复杂的查询，我们可以使用 `@Query` 注解来自定义 SQL 语句，如：

```java
@Query("update CouponTemplate c set c.available = false where c.id = :id")
int makeCouponUnavailable(@Param("id") Long id);
```

或者采用 Example 查询，创建一个查询模板实例：

```java
CouponTemplate couponTemplate = new CouponTemplate();
couponTemplate.setName("优惠券名称");
List<CouponTemplate> results = templateDao.findAll(Example.of(couponTemplate));
```

通过这种方式，我们可以根据模板对象的属性进行查询。

OK，有了 API 和 Dao 层的基础，下一步我们将进入业务逻辑层的开发，即 `coupon-template-impl` 模块。在这一层中，我们会利用已经搭建好的结构来实现具体的业务功能。

### 2.6 搭建 coupon-template-impl 模块

#### 2.6.1 依赖配置

当我们开始搭建 `coupon-template-impl` 模块时，我们将其定义为实现业务逻辑的核心。它将依赖于之前构建的 `coupon-template-api` 和 `coupon-template-dao` 模块，同时，还会引入一些外部依赖来增强功能。

```xml
<dependencies>
    <!-- API 模块 -->
    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-template-api</artifactId>
        <version>${project.version}</version>
    </dependency>

    <!-- DAO 模块 -->
    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-template-dao</artifactId>
        <version>${project.version}</version>
    </dependency>

    <!-- Alibaba FastJson -->
    <dependency>
        <groupId>com.alibaba</groupId>
        <artifactId>fastjson</artifactId>
    </dependency>

    <!-- Spring Boot Web -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Apache Commons Codec -->
    <dependency>
        <groupId>commons-codec</groupId>
        <artifactId>commons-codec</artifactId>
    </dependency>

    <!-- Google Guava -->
    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
    </dependency>

    <!-- Spring Boot Actuator 对微服务端点进行管理和配置监控 -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>

</dependencies>
```

#### 2.6.2 定义 Service 层接口

首先，定义 `CouponTemplateService` 接口是关键，这个接口会规定了几个主要方法：

- 创建优惠券模板
- 查询优惠券模板
- 修改优惠券模板状态

```java
/**
 * 优惠卷模版服务接口
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
public interface CouponTemplateService {

    /**
     * 创建优惠券模板
     *
     * @param couponTemplateInfo 优惠券模板信息
     * @return 创建的优惠券模板信息
     */
    CouponTemplateInfo createCouponTemplate(CouponTemplateInfo couponTemplateInfo);

    /**
     * 克隆优惠券模板
     *
     * @param templateId 模板ID
     * @return 克隆的优惠券模板信息
     */
    CouponTemplateInfo cloneCouponTemplate(Long templateId);

    /**
     * 搜索优惠券模板
     *
     * @param templateSearchParams 搜索参数
     * @return 搜索到的优惠券模板信息
     */
    PagedCouponTemplateInfo searchCouponTemplate(TemplateSearchParams templateSearchParams);

    /**
     * 加载优惠券模板
     *
     * @param id 模板ID
     * @return 加载的优惠券模板信息
     */
    CouponTemplateInfo loadCouponTemplate(Long id);

    /**
     * 删除优惠券模板
     *
     * @param id 模板ID
     */
    void deleteCouponTemplate(Long id);

    /**
     * 根据模板ID列表获取优惠券模板Map
     *
     * @param ids 模板ID列表
     * @return 优惠券模板Map
     */
    Map<Long, CouponTemplateInfo> getCouponTemplateMap(Collection<Long> ids);

}
```

#### 2.6.3 实现 Service 层逻辑

`CouponTemplateServiceImpl `类将实现上述接口中定义的方法。通过与 `CouponTemplateDao` 交互，Service 层能够实现对优惠券模板的 CRUD 操作。

```java
/**
 * 优惠卷模板服务实现
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
@Slf4j
@Service
public class CouponTemplateServiceImpl implements CouponTemplateService {

    @Resource
    private CouponTemplateDao couponTemplateDao;

    @Override
    public CouponTemplateInfo createCouponTemplate(CouponTemplateInfo couponTemplateInfo) {
        // 单个商户最多可以创建 100 张优惠卷模版
        if (couponTemplateInfo.getShopId() != null) {
            Integer count = couponTemplateDao.countByShopIdAndAvailable(couponTemplateInfo.getShopId(), true);
            if (count > 100) {
                log.error("该店铺优惠卷模板数量超过100");
                throw new UnsupportedOperationException("该店铺优惠卷模板数量超过100");
            }
        }

        CouponTemplate couponTemplate = CouponTemplate.builder()
                .name(couponTemplateInfo.getName())
                .description(couponTemplateInfo.getDesc())
                .templateRule(couponTemplateInfo.getTemplateRule())
                .available(couponTemplateInfo.getAvailable())
                .shopId(couponTemplateInfo.getShopId())
                .category(CouponType.convert(couponTemplateInfo.getType()))
                .build();

        CouponTemplate template = couponTemplateDao.save(couponTemplate);
        return CouponTemplateConverter.converterTemplateInfo(template);
    }

    @Override
    public CouponTemplateInfo cloneCouponTemplate(Long templateId) {
        log.info("cloneCouponTemplate templateId: {}", templateId);

        // 准备拷贝源和目标对象
        CouponTemplate source = couponTemplateDao.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException("无效的优惠卷模版ID"));
        CouponTemplate target = new CouponTemplate();

        // 浅拷贝
        BeanUtils.copyProperties(source, target);

        // 其他数据处理
        target.setAvailable(true);
        target.setId(null);

        // 存储并返回
        couponTemplateDao.save(target);
        return CouponTemplateConverter.converterTemplateInfo(target);
    }

    @Override
    public PagedCouponTemplateInfo searchCouponTemplate(TemplateSearchParams templateSearchParams) {
        // 创建 JPA Example 查询条件
        CouponTemplate example = CouponTemplate.builder()
                .shopId(templateSearchParams.getShopId())
                .category(CouponType.convert(templateSearchParams.getType()))
                .name(templateSearchParams.getName())
                .available(templateSearchParams.getAvailable())
                .build();

        // 封装分页查询参数
        PageRequest pageRequest = PageRequest.of(templateSearchParams.getPage(), templateSearchParams.getPageSize());

        Page<CouponTemplate> result = couponTemplateDao.findAll(Example.of(example), pageRequest);
        List<CouponTemplateInfo> couponTemplateInfoList = result.stream()
                .map(CouponTemplateConverter::converterTemplateInfo)
                .collect(Collectors.toList());

        return PagedCouponTemplateInfo.builder()
                .couponTemplateInfoList(couponTemplateInfoList)
                .page(templateSearchParams.getPage())
                .total(result.getTotalElements())
                .build();
    }

    @Override
    public CouponTemplateInfo loadCouponTemplate(Long id) {
        Optional<CouponTemplate> couponTemplate = couponTemplateDao.findById(id);
        return couponTemplate.map(CouponTemplateConverter::converterTemplateInfo).orElse(null);
    }

    @Override
    public void deleteCouponTemplate(Long id) {
        int rows = couponTemplateDao.makeCouponUnavailable(id);
        if (rows == 0) {
            throw new UnsupportedOperationException("无效的优惠卷模版ID");
        }
    }

    @Override
    public Map<Long, CouponTemplateInfo> getCouponTemplateMap(Collection<Long> ids) {
        List<CouponTemplate> couponTemplateList = couponTemplateDao.findAllById(ids);
        return couponTemplateList.stream()
                .map(CouponTemplateConverter::converterTemplateInfo)
                .collect(Collectors.toMap(CouponTemplateInfo::getId, Function.identity()));
    }
}
```

#### 2.6.4 转换类的使用

在实现过程中，可能会使用到各种转换类（DTOs、VOs等）来在不同层（Controller、Service、DAO）间传输数据。这些转换类通常负责将数据库实体转换为客户端可以使用的数据模型，或者反之。

涉及到的转换类：

```java
/**
 * 优惠卷模板转换器
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
public class CouponTemplateConverter {

    public static CouponTemplateInfo converterTemplateInfo(CouponTemplate couponTemplate) {
        return CouponTemplateInfo.builder()
                .id(couponTemplate.getId())
                .name(couponTemplate.getName())
                .desc(couponTemplate.getDescription())
                .type(couponTemplate.getCategory().getCode())
                .shopId(couponTemplate.getShopId())
                .templateRule(couponTemplate.getTemplateRule())
                .available(couponTemplate.getAvailable())
                .build();
    }
}
```

#### 2.6.5 构建 Controller

接着，创建 `CouponTemplateController` 类来提供 RESTful 服务。通过使用 Spring MVC 的注解，我们可以轻松地将后端服务以 API 的形式提供给客户端或前端。

控制器通常使用以下注解：

| 注解                                 | 描述                                               |
| ------------------------------------ | -------------------------------------------------- |
| @RestController                      | 声明这是一个控制器，并将其加载到 Spring 上下文中。 |
| @RequestMapping                      | 定义类级别的路由信息。                             |
| @PostMapping/@GetMapping/@PutMapping | 定义具体的 HTTP 操作和路由。                       |

以下是其核心代码：

```java
/**
 * 优惠卷模板控制器
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
@Slf4j
@RestController
@RequestMapping("/template")
public class CouponTemplateController {

    @Resource
    private CouponTemplateService couponTemplateService;

    @PostMapping("/addTemplate")
    public CouponTemplateInfo addTemplate(@Valid @RequestBody CouponTemplateInfo request) {
        log.info("Create coupon template: data={}", request);
        return couponTemplateService.createCouponTemplate(request);
    }

    @PostMapping("/cloneTemplate")
    public CouponTemplateInfo cloneTemplate(@RequestParam("id") Long templateId) {
        log.info("Clone coupon template: data={}", templateId);
        return couponTemplateService.cloneCouponTemplate(templateId);
    }

    @GetMapping("/getTemplate")
    public CouponTemplateInfo getTemplate(@RequestParam("id") Long id) {
        log.info("Load template, id={}", id);
        return couponTemplateService.loadCouponTemplate(id);
    }

    @GetMapping("/getBatch")
    public Map<Long, CouponTemplateInfo> getTemplateInBatch(@RequestParam("ids") Collection<Long> ids) {
        log.info("getTemplateInBatch: {}", JSON.toJSONString(ids));
        return couponTemplateService.getCouponTemplateMap(ids);
    }

    @PostMapping("/search")
    public PagedCouponTemplateInfo search(@Valid @RequestBody TemplateSearchParams request) {
        log.info("search templates, payload={}", request);
        return couponTemplateService.searchCouponTemplate(request);
    }

    @DeleteMapping("/deleteTemplate")
    public void deleteTemplate(@RequestParam("id") Long id) {
        log.info("Load template, id={}", id);
        couponTemplateService.deleteCouponTemplate(id);
    }
}
```

#### 2.6.6 启动类的创建

最后，我们创建了`Application`类，这是整个应用的入口点。`@SpringBootApplication` 注解将触发 Spring Boot 的自动配置机制。

这个注解还负责扫描启动类所在包及其子包中的组件，并在 Spring 上下文中自动注册它们。如果需要包含其他路径下的组件，`@ComponentScan `注解可以帮助我们指定那些路径。

```java
@SpringBootApplication
@EnableJpaAuditing // 启用 JPA 的审计功能
@ComponentScan(basePackages = {"cn.javgo"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

#### 2.6.7 配置文件

完成代码编写后，接下来的步骤是创建和配置 `.properties `文件。这个配置文件在 `src/main/resources` 目录下是项目的关键部分，因为它包含了连接数据库和各种服务的必要参数。

配置文件的撰写不仅需要精确，还需要考虑到可读性和未来的可维护性。以下是一些推荐的最佳实践：

- 使用清晰的注释来描述每个配置项的作用，特别是那些不常见或容易引起混淆的参数。
- 为了保证在不同环境下的兼容性，例如开发环境、测试环境和生产环境，可以采用 `application-{profile}.properties` 的方式来管理不同的配置。
- 对于 JDBC 连接字符串，确保其格式和参数与你使用的数据库版本兼容。如果使用 MySQL 8.x，不要忘记包括如 `serverTimezone` 的必要参数。
- 鉴于安全考虑，敏感信息（比如数据库密码、API 密钥等）不应该直接硬编码在配置文件中。考虑使用环境变量或加密工具来管理这些敏感数据。

```properties
# 服务器端口
server.port=20000

# 是否在错误信息中包含消息
server.error.include-message=always

# 应用名称
spring.application.name=coupon-template-serv

# 数据库驱动类名
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
# 数据库连接URL
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/coupon_db?autoReconnect=true&useUnicode=true&characterEncoding=utf8&useSSL=false&allowPublicKeyRetrieval=true&zeroDateTimeBehavior=convertToNull&serverTimezone=UTC
# 数据库用户名
spring.datasource.username=root
# 数据库密码
spring.datasource.password=root

# 数据源类型
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
# 数据源连接池名称
spring.datasource.hikari.pool-name=CouponHikari
# 连接超时时间
spring.datasource.hikari.connection-timeout=5000
# 空闲超时时间
spring.datasource.hikari.idle-timeout=30000
# 最大连接池大小
spring.datasource.hikari.maximum-pool-size=10
# 最小连接池大小
spring.datasource.hikari.minimum-idle=5
# 连接生命周期
spring.datasource.hikari.max-lifetime=60000
# 自动提交
spring.datasource.hikari.auto-commit=true

# 是否显示 Hibernate SQL 语句
spring.jpa.show-sql=true
# JPA 生成DDL的方式
spring.jpa.hibernate.ddl-auto=none
# Hibernate SQL 语句格式化
spring.jpa.properties.hibernate.format_sql=true
# Hibernate SQL 语句显示
spring.jpa.properties.hibernate.show_sql=true
# 是否在视图中打开 JPA 连接
spring.jpa.open-in-view=false

# 日志级别
logging.level.cn.javgo.coupon=debug
```

至此，我们的优惠券平台的首个模块  `coupon-template-serv`  已经构建完成。你可以在本地启动项目，并使用 Postman 工具进行测试。你也可以自行加入 Swagger：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-17-134423.png)

#### 2.6.8 模块小结

在本模块中，我们完成了 `coupon-template-serv` 的搭建，这是优惠券平台的一个重要组成部分。我们展示了如何有效利用 Spring Boot 的功能，简化了服务的实现，并介绍了如何通过 Spring Data JPA 高效地操作数据库。

关键技术点回顾：

* 使用 `spring-data-jpa` 进行数据库操作，实现了 CRUD 功能，并通过它体验到了 Spring 的 “约定优于配置” 的理念。
* 强调了代码的防御性编程、自动化生成、和精确的金额计算等编码技巧。
* 探讨了数据校验的简化方法和避免级联关系的常见陷阱。

通过以上的探索和学习，你现在应该对构建一个模块化、可扩展的 Spring Boot  应用有了深入的理解。下一步，我们将继续搭建`coupon-calculation-serv` 和 `coupon-customer-serv` 模块，进一步扩展我们的优惠券平台。

## 3.搭建优惠券计算服务

通过前面的章节，我们已经完成了优惠券模板服务 `coupon-template-serv` 的搭建，并对 Spring Boot 有了更深层次的理解。接下来，我们将深入开发优惠券系统的两个关键组件：`coupon-calculation-serv`（负责优惠计算）和`coupon-customer-serv`（向用户提供服务）。在这一过程中，中间件模块 `middleware` 的详细探讨将放在涉及 Spring Cloud 的部分进行。

我们的第一步是建立 `coupon-calculation-serv`，一个专注于为订单提供优惠计算的服务接口。`coupon-calculation-serv` 作为典型的计算密集型服务，其主要特点包括：

1. 不受网络 I/O 和磁盘空间限制；
2. 在运行时主要消耗 CPU 和内存等计算资源。

在构建大型应用的过程中，我们通常会把**计算密集型服务和 I/O 或存储密集型服务分离**开，这样做的目的是优化资源使用效率。以一个实际的例子来说明，假设我们同时运行一个计算密集型的微服务 A 和一个 I/O 密集型的微服务 B。在高流量时，我们可以为服务 A 分配更多的 CPU 和内存资源来应对压力；对于服务 B，则可以增加云存储资源。这样 “**按需分配**” 的策略能够有效地提高资源使用率。

如果我们将服务 A 和 B 合并在一起，就会失去对资源分配的精确控制，全链路压力测试也无法准确评估性能指标，从而可能造成资源的浪费。因此，我建议将优惠计算服务独立出来，以实现更合理的资源配置。

现在让我们着手构建 `coupon-calculation-serv`。它将包含多个子模块，类似于 `coupon-template-serv` 的结构，包括 API 层和业务逻辑层。API 层负责定义公共的 POJO 类，而业务逻辑层则专注于优惠计算逻辑的实现。由于优惠计算服务不涉及数据库操作，我们将不包含 DAO 模块。

我们首先从 `coupon-calculation-api` 子模块入手，这是整个服务的接口层。

### 3.1 搭建 coupon-calculation-api 模块

为了使 `coupon-calculation-serv` 能够计算订单的优惠价格，它需要知道当前订单使用了哪些优惠券。因此，我们首先需要引入封装优惠券信息的 Java 类`CouponInfo`，该类位于 `coupon-template-api` 包中。为此，我们在 `coupon-calculation-api` 中添加 `coupon-template-api` 的依赖项。

```xml
<dependencies>
    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-template-api</artifactId>
        <version>${project.version}</version>
    </dependency>
</dependencies>
```

依赖项添加完毕后，我们继续定义用于封装订单信息的 `ShoppingCart `类：

```java
/**
 * 封装订单信息
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingCart {

    /**
     * 商品信息
     */
    @NotEmpty
    private Product product;

    /**
     * 优惠券ID
     */
    private Long couponId;

    /**
     * 订单总价
     */
    private long cost;

    /**
     * 优惠券信息列表
     * 说明：目前仅支持单张优惠券，但是为了以后的扩展考虑，你可以添加多个优惠券的计算逻辑
     */
    private List<CouponInfo> couponInfos;

    /**
     * 用户ID
     */
    @NotNull
    private Long userId;
}
```

从上述代码中，我们可以看到 `ShoppingCart` 订单类使用了 `Product` 对象来封装当前订单的商品列表。`Product` 类中包含了商品的单价、数量以及门店ID。

```java
/**
 * 封装商品信息
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    /**
     * 你可以试着搭建一个商品中心，用来存储商品信息，逐步完善这个应用
     */
    private Long productId;

    /**
     * 商品的价格
     */
    private long price;

    /**
     * 商品在购物车里的数量
     */
    private Integer count;

    /**
     * 商品销售的门店
     */
    private Long shopId;
}
```

> 在电商行业，商品数量通常不仅仅是整数。例如，对于蔬菜或肉类这样的非标准商品，它们的计量单位可能不是 “个”。因此，在实际的项目中，特别是零售业务系统中，计量单位应该允许小数。但为了简化本项目，我们假设所有商品都是标准商品。

在下单时，可能有多张优惠券可供选择。为了确定哪张优惠券提供的折扣最大，你需要进行 “**价格试算**” 来模拟计算每张优惠券的折扣金额。`SimulationOrder` 和 `SimulationResponse` 分别代表了 “价格试算” 的订单类和返回的计算结果。接下来，我们来看这两个类的代码。

```java
/**
 * 封装模拟订单信息：用于试算最优的优惠券
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimulationOrder {

    /**
     * 商品信息列表
     */
    @NotEmpty
    private List<Product> products;
    
    /**
     * 优惠券ID列表
     */
    @NotEmpty
    private List<Long> couponIDs;
    
    /**
     * 优惠券信息列表
     */
    private List<CouponInfo> couponInfos;
    
    /**
     * 用户ID
     */
    @NotNull
    private Long userId;
}
```

```java
/**
 * 封装模拟计算结果
 */
@Data
@NoArgsConstructor
public class SimulationResponse {

    /**
     * 最省钱的优惠卷 ID
     */
    private Long bestCouponId;

    /**
     * 每一个优惠卷对应的订单价格
     */
    private Map<Long, Long> couponToOrderPrice = Maps.newHashMap();
}
```

至此，`coupon-calculation-api `模块的搭建已经完成。由于计算服务不需要访问数据库，我们可以跳过 dao 模块的搭建，直接进入 `coupon-calculation-impl` 业务层的代码实现。

### 3.2 搭建 coupon-calculation-impl 模块

#### 3.2.1 依赖配置

在实现 `coupon-calculation-impl` 模块之前，我们需要在其 `pom.xml `中明确加入三个核心依赖。这些依赖项，尤其是 `coupon-template-api` 和 `coupon-calculation-api`，将为我们提供完成订单优惠计算所需的 POJO 对象。这是构建优惠计算逻辑的基础。

```xml
<dependencies>
    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-template-api</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-calculation-api</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

#### 3.2.2 模版设计模式分析

为了优雅地实现优惠计算逻辑，我选择了**模板设计模式**。该模式通过抽象类定义算法的框架，将具体实现留给子类完成。鉴于优惠券类型的多样性（如满减、折扣、随机立减等），它们的计算流程具有共性，但每个的计算细节各不相同，模板设计模式为处理这一问题提供了完美解决方案。

以下是我们的计算逻辑类结构图：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-04-134259.png" style="zoom: 50%;" />

在此结构中，`RuleTemplate ` 顶层接口定义了 `calculate` 方法用于计算优惠券：

```java
/**
 * 模版模式：优惠券计算规则接口
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
public interface RuleTemplate {

    /**
     * 计算购物车金额
     *
     * @param shoppingCart 购物车对象
     * @return 计算后的购物车金额
     */
    ShoppingCart calculate(ShoppingCart shoppingCart);
}
```

我们设计了一个 `AbstractRuleTemplate` 抽象类封装通用逻辑，并为不同类型的优惠券各提供一个具体子类来实现其独有的计算逻辑。`AbstractRuleTemplate `类提供了一个 `calculate` 方法的实现框架，并定义了一个待子类实现的 `calculateNewPrice` 抽象方法。

```java
/**
 * 模版抽象类：实现通用优惠卷计算规则以复用，同时提供抽象方法给子类实现各自的计算规则（设计策略模式）
 *
 * @author javgo.cn
 * @date 2023/11/3
 */
@Slf4j
public abstract class AbstractRuleTemplate implements RuleTemplate {

    /**
     * 计算优惠后的购物车价格
     *
     * @param order 购物车订单
     * @return 计算后的购物车订单
     */
    @Override
    public ShoppingCart calculate(ShoppingCart order) {
        // 计算订单总金额
        long orderTotalAmount = getTotalPrice(order.getProducts());
        // 按店铺分组计算订单总金额
        Map<Long, Long> orderTotalAmountGroupByShop = getTotalPriceGroupByShop(order.getProducts());

        // 获取优惠券模板信息
        CouponTemplateInfo templateInfo = order.getCouponInfos().get(0).getTemplateInfo();
        // 获取优惠券的最低消费限制
        Long threshold = templateInfo.getTemplateRule().getDiscount().getThreshold();
        // 获取优惠券的使用限额
        Long quota = templateInfo.getTemplateRule().getDiscount().getQuota();

        // 获取优惠券所属店铺ID
        Long shopId = templateInfo.getShopId();
        // 计算店铺总金额（如果shopId为空，则使用订单总金额；否则使用按店铺分组的订单总金额）
        Long shopTotalAmount = (shopId == null) ? orderTotalAmount : orderTotalAmountGroupByShop.get(shopId);
        // 如果店铺总金额小于最低消费限制，不适用优惠券
        if (shopTotalAmount < threshold) {
            log.warn("订单总价小于优惠卷的最低消费限制，不适用优惠卷！");
            order.setCost(orderTotalAmount);
            order.setCouponInfos(Collections.emptyList());
            return order;
        }

        // 计算新的价格（根据订单总金额、店铺总金额和使用限额）
        Long newCost = calculateNewPrice(orderTotalAmount, shopTotalAmount, quota);
        // 如果新的价格小于最小成本，设为最小成本（至少 1 分钱）
        if (newCost < minCost()) {
            newCost = minCost();
        }

        // 更新订单的成本和优惠券信息
        order.setCost(newCost);
        log.info("优惠券计算成功，订单总价：{}，优惠券优惠金额：{}，优惠后订单总价：{}", orderTotalAmount, orderTotalAmount - newCost, newCost);
        return order;
    }

    /**
     * 计算新的价格（策略模式，留给子类根据不同类型的优惠卷计算规则实现）
     *
     * @param orderTotalAmount 订单总金额
     * @param shopTotalAmount  店铺总金额
     * @param quota            使用限额
     * @return 计算后的新价格
     */
    protected abstract Long calculateNewPrice(Long orderTotalAmount, Long shopTotalAmount, Long quota);

    /**
     * 计算订单的总金额
     *
     * @param products 订单产品列表
     * @return 订单的总金额
     */
    protected long getTotalPrice(List<Product> products) {
        return products.stream()
                .mapToLong(product -> product.getPrice() * product.getCount())
                .sum();
    }

    /**
     * 按店铺分组计算订单的总金额
     *
     * @param products 订单产品列表
     * @return 按店铺分组的订单总金额 map
     */
    protected Map<Long, Long> getTotalPriceGroupByShop(List<Product> products) {
        return products.stream()
                .collect(
                        Collectors.groupingBy(
                                Product::getShopId,
                                Collectors.summingLong(product -> product.getPrice() * product.getCount()))
                );
    }

    /**
     * 获取最小成本
     *
     * @return 最小成本
     */
    protected long minCost() {
        return 1L;
    }
}
```

例如，满减规则的实现 `MoneyOffTemplate` 继承了 `AbstractRuleTemplate`，只需提供 `calculateNewPrice` 方法的具体实现即可，这样的设计简洁且减少了代码重复。

```java
/**
 * 优惠卷策略：满减
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
@Slf4j
@Component
public class MoneyOffTemplate extends AbstractRuleTemplate implements RuleTemplate {

    /**
     * 计算新的价格
     *
     * @param orderTotalAmount 订单总金额
     * @param shopTotalAmount  商店总金额
     * @param quota            优惠额度(这里指满减额度）
     * @return 新的价格
     */
    @Override
    protected Long calculateNewPrice(Long orderTotalAmount, Long shopTotalAmount, Long quota) {
        // 计算优惠额度：取商店总金额和优惠额度的最小值
        Long benefitAmount = shopTotalAmount < quota ? shopTotalAmount : quota;
        // 计算最终的价格：订单总金额减去优惠额度
        return orderTotalAmount - benefitAmount;
    }
}
```

下面给出其他优惠卷计算模版：

```java
/**
 * 优惠卷策略：折扣卷
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public class DiscountTemplate extends AbstractRuleTemplate implements RuleTemplate {

    /**
     * 计算新的价格
     *
     * @param orderTotalAmount 订单总金额
     * @param shopTotalAmount  商店总金额
     * @param quota            优惠额度
     * @return 新的价格
     */
    @Override
    protected Long calculateNewPrice(Long orderTotalAmount, Long shopTotalAmount, Long quota) {
        return convertToDecimal(shopTotalAmount, quota);
    }

    /**
     * 将商店总金额转换为小数，并按比例转换为实际金额
     *
     * @param shopTotalAmount 商店总金额
     * @param quota           比例
     * @return 转换后的小数金额
     */
    private Long convertToDecimal(Long shopTotalAmount, Long quota) {
        double v = shopTotalAmount * (quota.doubleValue() / 100);
        return (long) v;
    }
}
```

```java
/**
 * 优惠卷策略：空策略
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public class DummyTemplate extends AbstractRuleTemplate implements RuleTemplate {

    /**
     * 计算新的价格
     *
     * @param orderTotalAmount 订单总金额
     * @param shopTotalAmount  商店总金额
     * @param quota            优惠额度
     * @return 新的价格
     */
    @Override
    protected Long calculateNewPrice(Long orderTotalAmount, Long shopTotalAmount, Long quota) {
        return orderTotalAmount;
    }

    @Override
    public ShoppingCart calculate(ShoppingCart order) {
        order.setCost(super.getTotalPrice(order.getProducts()));
        return order;
    }
}
```

```java
/**
 * 优惠卷策略：夜间单身狗翻倍卷（22:00 - 02:00）
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public class LonelyNightTemplate extends AbstractRuleTemplate implements RuleTemplate {

    /**
     * 计算新的价格
     *
     * @param orderTotalAmount 订单总金额
     * @param shopTotalAmount  商店总金额
     * @param quota            优惠额度
     * @return 新的价格
     */
    @Override
    protected Long calculateNewPrice(Long orderTotalAmount, Long shopTotalAmount, Long quota) {
        Calendar calendar = Calendar.getInstance();
        int hourOfDay = calendar.get(Calendar.HOUR_OF_DAY);
        if (hourOfDay >= 22 || hourOfDay < 2) {
            quota *= 2;
        }

        Long benefitAmount = shopTotalAmount < quota ? shopTotalAmount : quota;
        return orderTotalAmount - benefitAmount;
    }
}
```

```java
/**
 * 优惠卷策略：随机立减卷
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public class RandomReductionTemplate extends AbstractRuleTemplate implements RuleTemplate {

    /**
     * 计算新的价格
     *
     * @param orderTotalAmount 订单总金额
     * @param shopTotalAmount  商店总金额
     * @param quota            优惠额度
     * @return 新的价格
     */
    @Override
    protected Long calculateNewPrice(Long orderTotalAmount, Long shopTotalAmount, Long quota) {
        // 计算最大的优惠额度：取商店总金额和优惠额度的最小值
        long maxBenefit = Math.min(shopTotalAmount, quota);
        // 计算优惠额度：随机生成一个整数，范围为 0 ~ maxBenefit-1
        int reductionAmount = new Random().nextInt((int) maxBenefit);
        // 计算新的价格：订单总金额减去优惠额度
        return orderTotalAmount - reductionAmount;
    }
}
```

在未来，如果业务拓展新增了更多类型的优惠券，当前的设计允许我们通过添加新的子类或在必要时创建更多层次的抽象类来应对，这样做一方面保持了现有代码的稳定，另一方面又保持了系统的灵活性和可扩展性。

#### 3.2.3 Service 层

接下来的步骤是实现 Service 层。Service 层中的 `calculateOrderPrice` 方法通过`CouponTemplateFactory`工厂类来获取具体的计算规则，然后调用 `calculate` 方法来计算订单的优惠后价格。其中，`simulate `方法提供了一种试算机制，帮助用户在实际下单前预估各优惠券的折扣金额，以便选择最优惠的选项。

`CouponTemplateFactory `的设计是根据订单中包含的优惠券信息来返回相应的优惠券模板实例，以便进一步计算。

```java
/**
 * 工厂模式：用于创建不同类型的优惠券模板
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
@Slf4j
@Component
public class CouponTemplateFactory {

    @Resource
    private MoneyOffTemplate moneyOffTemplate;

    @Resource
    private DiscountTemplate discountTemplate;

    @Resource
    private RandomReductionTemplate randomReductionTemplate;

    @Resource
    private LonelyNightTemplate lonelyNightTemplate;

    @Resource
    DummyTemplate dummyTemplate;

    public RuleTemplate getTemplate(ShoppingCart order) {
        if (CollectionUtils.isEmpty(order.getCouponInfos())) {
            return dummyTemplate;
        }

        CouponTemplateInfo templateInfo = order.getCouponInfos().get(0).getTemplateInfo();
        CouponType couponType = CouponType.convert(templateInfo.getType());

        switch (couponType) {
            case MONEY_OFF:
                return moneyOffTemplate;

            case DISCOUNT:
                return discountTemplate;

            case RANDOM_DISCOUNT:
                return randomReductionTemplate;

            case LONELY_NIGHT_MONEY_OFF:
                return lonelyNightTemplate;

            default:
                return dummyTemplate;
        }
    }
}
```

定义 `CouponCalculationService` 接口以及其具体实现，这样的设计遵循了**开闭原则**，即对修改封闭，对扩展开放，提高了代码的可维护性和可扩展性。

`CouponCalculationService` 接口用于提供优惠计算的 API 定义：

```java
/**
 * 优惠卷计算服务
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public interface CouponCalculationService {

    /**
     * 计算订单价格
     *
     * @param cart 购物车
     * @return 订单价格
     */
    ShoppingCart calculateOrderPrice(ShoppingCart cart);

    /**
     * 优惠试算
     *
     * @param order 订单
     * @return 响应
     */
    SimulationResponse simulateOrder(SimulationOrder order);
}
```

对应实现如下：

```java
/**
 * 优惠卷计算服务实现
 * @author javgo.cn
 * @date 2023/11/4
 */
@Slf4j
@Service
public class CouponCalculationServiceImpl implements CouponCalculationService {

    @Resource
    private CouponTemplateFactory couponTemplateFactory;

    /**
     * 正常计算
     * @param cart 购物车
     * @return 计算后的购物车
     */
    @Override
    public ShoppingCart calculateOrderPrice(ShoppingCart cart) {
        log.info("calculateOrderPrice: {}", JSON.toJSONString(cart));
        RuleTemplate ruleTemplate = couponTemplateFactory.getTemplate(cart);
        return ruleTemplate.calculate(cart);
    }

    /**
     * 模拟计算
     * @param order 订单
     * @return 模拟计算结果
     */
    @Override
    public SimulationResponse simulateOrder(SimulationOrder order) {
        // 创建一个模拟响应对象
        SimulationResponse response = new SimulationResponse();
        // 初始化最小订单价格为 Long 最大值
        Long minOrderPrice = Long.MAX_VALUE;

        // 遍历传入的优惠券信息列表
        for (CouponInfo couponInfo : order.getCouponInfos()) {
            // 创建一个购物车对象
            ShoppingCart shoppingCart = new ShoppingCart();
            // 设置购物车的产品为传入订单的产品
            shoppingCart.setProducts(order.getProducts());
            // 将优惠券信息添加到购物车中
            shoppingCart.setCouponInfos(Lists.newArrayList(couponInfo));

            // 根据购物车模板计算后的购物车对象（决定使用哪个优惠券，对上层业务透明）
            shoppingCart = couponTemplateFactory.getTemplate(shoppingCart).calculate(shoppingCart);

            // 获取当前优惠券信息的ID
            Long couponInfoId = couponInfo.getId();
            // 获取计算后的购物车价格
            long orderPrice = shoppingCart.getCost();
            // 将优惠券ID和对应的订单价格添加到模拟响应的优惠券到订单价格映射中
            response.getCouponToOrderPrice().put(couponInfoId, orderPrice);

            // 如果最小订单价格大于当前订单价格
            if (minOrderPrice > orderPrice){
                // 设置最佳优惠券ID为当前优惠券信息的ID
                response.setBestCouponId(couponInfoId);
                // 更新最小订单价格
                minOrderPrice = orderPrice;
            }
        }
        return response;
    }
}
```

#### 3.2.4 Controller 层

完成 Service 层的构建后，我们需要通过创建一个 `CouponCalculationController` 类来向外界提供接口。这个控制器将暴露至少两个 POST 接口，一个用于完成订单的优惠计算，另一个用于进行优惠券的价格试算。这些接口的实现将依赖于之前构建的 Service 层逻辑。

这里是一个简化的示例，展示了如何定义这些 REST 接口：

```java
/**
 * 优惠卷计算 Controller
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
@Slf4j
@RestController
@RequestMapping("calculator")
public class CouponCalculationController {

    @Resource
    private CouponCalculationService calculationService;

    @PostMapping("/checkout")
    public ShoppingCart calculateOrderPrice(@RequestBody ShoppingCart settlement) {
        log.info("do calculation: {}", JSON.toJSONString(settlement));
        return calculationService.calculateOrderPrice(settlement);
    }

    @PostMapping("/simulate")
    public SimulationResponse simulate(@RequestBody SimulationOrder simulator) {
        log.info("do simulation: {}", JSON.toJSONString(simulator));
        return calculationService.simulateOrder(simulator);
    }
}
```

在这个控制器中，我们注入了 `CouponCalculationService` 来调用计算和试算的相关方法，并返回结果。

#### 3.2.5 启动类

接着，我们需要创建 `Application` 类来启动 Spring Boot 应用。这个类通常很简单，包含一个 main 方法和 `@SpringBootApplication` 注解：

```java
@SpringBootApplication
@ComponentScan(basePackages = {"cn.javgo"})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(com.apple.eawt.Application.class, args);
    }
}
```

#### 3.2.6 配置文件

最后，我们需要配置 `application.yml` 文件，为我们的服务提供必要的配置，如端口号、数据库连接的配置等。

```properties
# 服务端口
server.port=20002
# 错误信息是否包含堆栈信息
server.error.include-message=always

# 应用名称
spring.application.name=coupon-calculation-serv

# 日志级别
logging.level.cn.javgo.coupon=debug

# 开启 Spring Boot Actuator 的所有端点
management.endpoints.web.exposure.include=*
```

至此，我们就完成了 `coupon-calculation-impl` 模块的构建。我们可以通过编写单元测试和集成测试来验证服务的正确性，并使用 Spring Boot 的 Actuator 来监控服务的健康状况和性能。

下一步，我们将继续前进，构建 `coupon-customer-serv` 模块，这是优惠券项目的最后一个服务，专门用于与用户交互，比如领取优惠券、查询优惠券等。

## 4.搭建用户服务

在电子商务系统中，用户优惠券服务（以下简称 “用户服务”）是至关重要的一环。本模块的设计重点在于实现用户与优惠券交互的功能，包括用户领取优惠券、查询持有优惠券以及在订单结算时使用优惠券。类似地，该模块的架构设计参照了优惠券模板服务，也分为 API 层、DAO 层和业务逻辑层。

为了保持文章的聚焦，我们将不会深入 “用户注册” 等功能，而是假设你已经熟悉用户身份验证的流程，通过 `userId` 来标识一个经过认证的用户身份。

### 4.1 搭建 coupon-customer-api 模块

#### 4.1.1 依赖配置

在用户服务的 API 层构建中，首先要确保用户服务能够与系统中的其他服务进行交互。具体来说，我们需要在用户服务的项目对象模型（POM）文件中添加优惠券模板服务（coupon-template-api）和优惠券计算服务（coupon-calculation-api）的依赖。这一步确保用户服务能够使用这两个服务提供的请求和响应对象。

```xml
<dependencies>
    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-template-api</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-calculation-api</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>com.google.guava</groupId>
        <artifactId>guava</artifactId>
    </dependency>
</dependencies>
```

#### 4.1.2 封装 DTO

接下来，我们定义 `RequestCoupon` 类，用于封装用户领取优惠券时所需提供的信息，这通常包括用户 ID 和优惠券模板 ID。通过这个类，用户可以请求系统为其生成基于指定模板的优惠券。

```java
/**
 * 用户领取优惠券请求
 * @author javgo.cn
 * @date 2023/11/4
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RequestCoupon {

    @NotNull
    private Long userId;

    @NotNull
    private Long couponTemplateId;
}
```

此外，`SearchCoupon` 类被定义用于封装查询优惠券请求时的参数。它允许用户根据自己的需要进行优惠券查询，例如，可以根据优惠券的状态进行筛选。

```java
/**
 * 优惠卷查询
 * @author javgo.cn
 * @date 2023/11/4
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchCoupon {

  @NotNull
  private Long userId;

  private Long shopId;

  private Integer status;
}
```

```java
/**
 * 优惠卷状态枚举
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
@Getter
@AllArgsConstructor
public enum CouponStatus {

    AVAILABLE("未使用", 1),
    USED("已使用", 2),
    INACTIVE("已注销", 3);

    private String desc;
    private Integer code;

    public static CouponStatus convert(Integer code) {
        if (code == null) {
            return null;
        }
        return Stream.of(CouponStatus.values())
                .filter(bean -> bean.code.equals(code))
                .findAny()
                .orElse(null);
    }
}
```

至此，我们已经搭建好了用户服务的 API 子模块的基本结构。下一步，我们会进入到数据访问层（DAO），在这一层我们将实现优惠券数据的持久化操作，包括优惠券的存储、检索、更新和删除。

### 4.2 搭建 coupon-customer-dao 模块

#### 4.2.1 数据库映射对象

在用户优惠券服务的数据访问层（DAO 层）的搭建中，核心任务是设计和实现与数据库交互的实体和接口。在这一环节，我定义了 `Coupon` 实体类，这是一个数据库映射对象，专门用来表示和存储用户所领取的优惠券信息。

```java
/**
 * 优惠卷
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "coupon")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "template_id", nullable = false)
    private Long templateId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "shop_id")
    private Long shopId;

    @Column(name = "status", nullable = false)
    @Convert(converter = CouponStatusConverter.class)
    private CouponStatus status;

    @Transient // 标记该字段不参与数据库映射
    private CouponTemplateInfo templateInfo;

    @CreatedDate
    @Column(name = "created_time", nullable = false)
    private Date createTime;
}
```

针对 `Coupon` 实体类，我还编写了相应的转换器类，其作用是在不同数据类型的实体属性和表字段进行映射时，能够将数据库实体属性和对应字段进行互相转换，保证数据处理的一致性和准确性。

```java
/**
 * 优惠卷状态转换器
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public class CouponStatusConverter implements AttributeConverter<CouponStatus, Integer> {
    @Override
    public Integer convertToDatabaseColumn(CouponStatus attribute) {
        return attribute.getCode();
    }

    @Override
    public CouponStatus convertToEntityAttribute(Integer dbData) {
        return CouponStatus.convert(dbData);
    }
}
```

在上述代码中，使用了 Lombok 库来简化实体类的编写，通过注解自动生成常用的方法如 `getter`、`setter`、`toString` 等，大大提升了开发效率。对 Lombok 感兴趣的读者可以访问其[官方网站](https://projectlombok.org/)以获得更多信息。

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-18-061309.png" style="zoom: 33%;" />

此外，我想分享关于 “**数据冗余**” 的设计考量。例如，在 `Coupon` 实体中，我们决定引入一个冗余字段——Shop ID。虽然该数据可以通过关联的 `CouponTemplate` 实体获取，但将其直接存储在 `Coupon` 实体中可以极大提升数据查询效率，这种设计在面向大规模并发的系统时尤为常见。它体现了 “**以空间换时间**” 的策略，即通过增加存储消耗来换取更快的响应速度。

#### 4.2.2 持久层

接下来，创建了 `CouponDAO` 接口，这是一个遵循 Spring Data JPA 规范的数据访问接口。在这里，我们定义了必要的数据操作方法。例如，一个用于统计优惠券数量的方法。而基于 `JpaRepository` 提供的标准 CRUD 操作则不需要额外定义，这展示了 Spring Data JPA 框架的便捷性和高效性。

```java
/**
 * 优惠卷 DAO
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public interface CouponDao extends JpaRepository<Coupon, Long> {

    /**
     * 根据用户ID和模板ID统计数量
     *
     * @param userId     用户ID
     * @param templateId 模板ID
     * @return 统计数量
     */
    long countByUserIdAndTemplateId(Long userId, Long templateId);
}
```

至此，用户优惠券服务的数据访问层已经搭建完成。我们将继续前进，下一步是进入实现层（impl 层），在那里我们将具体实现业务逻辑。

### 4.3 搭建 coupon-customer-impl 模块

在本节中，我们将详述用户优惠券服务的业务逻辑层——`coupon-customer-impl`模块的构建。

#### 4.3.1 依赖配置

在微服务的完全实践之前，我们首先将模板服务（template）和计算服务（calculation）的功能临时集成到用户服务（customer）中，形成一个集成的单体应用。这个过渡性的单体结构为未来拆分成独立微服务打下了基础。

在开始实现业务逻辑之前，需要在 `coupon-customer-impl` 的配置中加入模板和计算服务的实现层依赖项。这一步至关重要，因为它确保了用户服务不仅能够调用其他服务的 API，还能够利用它们的具体实现来完成复杂的业务操作。

```xml
<dependencies>
    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-customer-dao</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-calculation-impl</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>${project.groupId}</groupId>
        <artifactId>coupon-template-impl</artifactId>
        <version>${project.version}</version>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
</dependencies>
```

#### 4.3.2 Service 层

完成依赖配置之后，我定义了一个核心业务接口 `CouponCustomerService`，它规定了领取优惠券、查询优惠券、核销优惠券以及执行优惠券试算等关键业务功能的方法。

```java
/**
 * 用户优惠卷服务
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public interface CouponCustomerService {

    /**
     * 获取优惠券
     *
     * @param request 优惠券请求对象
     * @return 优惠券对象
     */
    Coupon requestCoupon(RequestCoupon request);

    /**
     * 核销优惠卷（即下单）
     *
     * @param order 购物车对象
     */
    ShoppingCart placeOrder(ShoppingCart order);

    /**
     * 模拟订单试算
     *
     * @param order 模拟订单对象
     * @return 模拟响应对象
     */
    SimulationResponse simulateOrderPrice(SimulationOrder order);

    /**
     * 删除优惠券
     *
     * @param userId   用户ID
     * @param couponId 优惠券ID
     */
    void deleteCoupon(Long userId, Long couponId);

    /**
     * 查找优惠券
     *
     * @param request 查找优惠券请求对象
     * @return 优惠券信息列表
     */
    List<CouponInfo> findCoupon(SearchCoupon request);
}
```

然后，重点关注 `placeOrder` 方法的实现，这个方法是处理用户下单及优惠券核销流程的关键。在实现这个方法时，`Coupon` 对象的构造过程采用了构建者模式，这一模式通过 Lombok 的 `@Builder` 注解得以简化实现，使得对象的创建过程既直观又易于管理，提升了代码的整洁度和可维护性。

```java
@Transactional
@Override
public ShoppingCart placeOrder(ShoppingCart order) {
    // 如果订单商品为空
    if (CollectionUtils.isEmpty(order.getProducts())) {
        log.error("订单商品为空");
        throw new IllegalArgumentException("订单商品为空");
    }

    Coupon coupon = null;
    // 如果订单中含有优惠券ID
    if (order.getCouponId() != null) {
        // 创建优惠券查询示例
        Coupon example = Coupon.builder()
                .userId(order.getUserId())
                .id(order.getCouponId())
                .status(CouponStatus.AVAILABLE)
                .build();

        // 查询符合条件的优惠券
        coupon = couponDao.findAll(Example.of(example)).stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("优惠券不存在"));

        // 将优惠券转换为优惠券信息对象
        CouponInfo couponInfo = CouponConverter.convertToCoupon(coupon);
        // 加载优惠券模板信息
        couponInfo.setTemplateInfo(templateService.loadCouponTemplate(coupon.getTemplateId()));
        // 将优惠券信息添加到订单中
        order.setCouponInfos(Lists.newArrayList(couponInfo));
    }

    // 计算订单价格
    ShoppingCart checkoutInfo = calculationService.calculateOrderPrice(order);

    // 如果含有优惠券
    if (coupon != null) {
        // 如果订单中没有优惠券信息
        if (CollectionUtils.isEmpty(checkoutInfo.getCouponInfos())) {
            log.error("没有优惠券信息");
            throw new IllegalArgumentException("没有优惠券信息");
        }

        log.info("更新优惠券状态");
        // 更新优惠券状态为已使用
        coupon.setStatus(CouponStatus.USED);
        // 保存优惠券信息
        couponDao.save(coupon);
    }
    // 返回结账信息对象
    return checkoutInfo;
}
```

完整实现类如下：

```java
/**
 * 用户优惠券业务逻辑实现类
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
@Slf4j
@Service
public class CouponCustomerServiceImpl implements CouponCustomerService {

    @Resource
    private CouponDao couponDao;

    @Resource
    private CouponTemplateService templateService;

    @Resource
    private CouponCalculationService calculationService;

    @Override
    public Coupon requestCoupon(RequestCoupon request) {
        // 加载优惠券模板信息
        CouponTemplateInfo templateInfo = templateService.loadCouponTemplate(request.getCouponTemplateId());
        // 如果模板信息为空，则抛出异常
        if (templateInfo == null) {
            log.error("优惠券模板不存在");
            throw new IllegalArgumentException("优惠券模板不存在");
        }

        // 获取当前时间
        long now = Calendar.getInstance().getTimeInMillis();
        // 获取模板规则的截止时间
        Long expTime = templateInfo.getTemplateRule().getDeadline();
        // 如果截止时间不为空且当前时间超过截止时间，或者可用性为false，则抛出异常
        if (expTime != null && now > expTime || BooleanUtils.isFalse(templateInfo.getAvailable())) {
            log.error("优惠券模板不可用");
            throw new IllegalArgumentException("优惠券模板不可用");
        }

        // 统计用户使用该模板的优惠券数量
        long count = couponDao.countByUserIdAndTemplateId(request.getUserId(), request.getCouponTemplateId());
        // 如果数量达到限制，则抛出异常
        if (count >= templateInfo.getTemplateRule().getLimitation()) {
            log.error("优惠券模板已达上限");
            throw new IllegalArgumentException("优惠券模板已达上限");
        }

        // 创建优惠券对象
        Coupon coupon = Coupon.builder()
                .templateId(request.getCouponTemplateId())
                .userId(request.getUserId())
                .shopId(templateInfo.getShopId())
                .status(CouponStatus.AVAILABLE)
                .build();

        // 保存优惠券到数据库
        couponDao.save(coupon);
        // 返回生成的优惠券对象
        return coupon;
    }

    @Transactional
    @Override
    public ShoppingCart placeOrder(ShoppingCart order) {
        // 如果订单商品为空
        if (CollectionUtils.isEmpty(order.getProducts())) {
            log.error("订单商品为空");
            throw new IllegalArgumentException("订单商品为空");
        }

        Coupon coupon = null;
        // 如果订单中含有优惠券ID
        if (order.getCouponId() != null) {
            // 创建优惠券查询示例
            Coupon example = Coupon.builder()
                    .userId(order.getUserId())
                    .id(order.getCouponId())
                    .status(CouponStatus.AVAILABLE)
                    .build();

            // 查询符合条件的优惠券
            coupon = couponDao.findAll(Example.of(example)).stream()
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("优惠券不存在"));

            // 将优惠券转换为优惠券信息对象
            CouponInfo couponInfo = CouponConverter.convertToCoupon(coupon);
            // 加载优惠券模板信息
            couponInfo.setTemplateInfo(templateService.loadCouponTemplate(coupon.getTemplateId()));
            // 将优惠券信息添加到订单中
            order.setCouponInfos(Lists.newArrayList(couponInfo));
        }

        // 计算订单价格
        ShoppingCart checkoutInfo = calculationService.calculateOrderPrice(order);

        // 如果含有优惠券
        if (coupon != null) {
            // 如果订单中没有优惠券信息
            if (CollectionUtils.isEmpty(checkoutInfo.getCouponInfos())) {
                log.error("没有优惠券信息");
                throw new IllegalArgumentException("没有优惠券信息");
            }

            log.info("更新优惠券状态");
            // 更新优惠券状态为已使用
            coupon.setStatus(CouponStatus.USED);
            // 保存优惠券信息
            couponDao.save(coupon);
        }
        // 返回结账信息对象
        return checkoutInfo;
    }


    @Override
    public SimulationResponse simulateOrderPrice(SimulationOrder order) {
        // 创建一个空的CouponInfo列表
        ArrayList<CouponInfo> couponInfos = Lists.newArrayList();

        // 遍历订单中的优惠券ID列表
        for (Long couponID : order.getCouponIDs()) {
            // 创建一个Coupon的构建器对象，并设置用户ID、优惠券ID和状态
            Coupon example = Coupon.builder()
                    .userId(order.getUserId())
                    .id(couponID)
                    .status(CouponStatus.AVAILABLE)
                    .build();

            // 通过优惠券ID查询优惠券信息，并将结果转换为Observable
            Optional<Coupon> couponOptional = couponDao.findAll(Example.of(example)).stream().findFirst();

            // 如果查询到了优惠券
            if (couponOptional.isPresent()) {
                // 获取优惠券对象
                Coupon coupon = couponOptional.get();

                // 将优惠券转换为CouponInfo对象
                CouponInfo couponInfo = CouponConverter.convertToCoupon(coupon);

                // 加载优惠券模板信息
                couponInfo.setTemplateInfo(templateService.loadCouponTemplate(coupon.getTemplateId()));

                // 将CouponInfo对象添加到列表中
                couponInfos.add(couponInfo);
            }
        }

        // 将生成的优惠券信息列表设置回订单对象
        order.setCouponInfos(couponInfos);

        // 调用计算服务的simulateOrder方法，返回模拟订单结果
        return calculationService.simulateOrder(order);
    }


    @Override
    public void deleteCoupon(Long userId, Long couponId) {
        // 构建优惠券查询示例
        Coupon example = Coupon.builder()
                .userId(userId)
                .id(couponId)
                .status(CouponStatus.AVAILABLE)
                .build();

        // 根据查询示例获取符合条件的优惠券
        Coupon coupon = couponDao.findAll(Example.of(example))
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("优惠券不存在"));

        // 将优惠券状态设置为无效
        coupon.setStatus(CouponStatus.INACTIVE);

        // 保存修改后的优惠券
        couponDao.save(coupon);
    }


    @Override
    public List<CouponInfo> findCoupon(SearchCoupon request) {
        // 根据搜索条件查询优惠券列表
        // 注意：在生产中此处应该使用分页查询且查询条件应该封装为一个类
        Coupon example = Coupon.builder()
                .userId(request.getUserId())
                .status(CouponStatus.convert(request.getStatus()))
                .shopId(request.getShopId())
                .build();

        List<Coupon> coupons = couponDao.findAll(Example.of(example));
        // 如果优惠券列表为空,返回空列表
        if (coupons.isEmpty()) {
            return Lists.newArrayList();
        }

        // 获取优惠券模板ID列表
        List<Long> templateIds = coupons.stream()
                .map(Coupon::getTemplateId)
                .collect(Collectors.toList());
        // 根据模板ID获取优惠券模板信息映射
        Map<Long, CouponTemplateInfo> templateMap = templateService.getCouponTemplateMap(templateIds);
        // 将优惠券模板信息设置到优惠券对象中
        coupons.forEach(coupon -> coupon.setTemplateInfo(templateMap.get(coupon.getTemplateId())));

        // 将优惠券列表转换为优惠券信息列表
        return coupons.stream()
                .map(CouponConverter::convertToCoupon)
                .collect(Collectors.toList());
    }
}
```

涉及到的转换器如下：

```java
/**
 * 优惠卷转换器
 *
 * @author javgo.cn
 * @date 2023/11/4
 */
public class CouponConverter {

    public static CouponInfo convertToCoupon(Coupon coupon) {
        return CouponInfo.builder()
                .id(coupon.getId())
                .status(coupon.getStatus().getCode())
                .templateId(coupon.getTemplateId())
                .shopId(coupon.getShopId())
                .userId(coupon.getUserId())
                .templateInfo(coupon.getTemplateInfo())
                .build();
    }
}
```

在这里，转换器的作用是确保实体对象与数据传输对象（DTO）之间的准确转换，这对保证系统的数据一致性至关重要。

#### 4.3.3 Controller 层

在业务逻辑层的实现之后，紧接着是将服务逻辑与前端交互的控制器层。在 `CouponCustomerController` 中，我定义了几个对外接口，这些接口通过调用 `CouponCustomerServiceImpl` 中的方法来具体实现相应的业务逻辑。

```java
/**
 * @author javgo.cn
 * @date 2023/11/4
 */
@Slf4j
@RestController
@RequestMapping("coupon-customer")
public class CouponCustomerController {
    @Resource
    private CouponCustomerService customerService;

    @PostMapping("requestCoupon")
    public Coupon requestCoupon(@Valid @RequestBody RequestCoupon request) {
        return customerService.requestCoupon(request);
    }

    @DeleteMapping("deleteCoupon")
    public void deleteCoupon(@RequestParam("userId") Long userId,
                             @RequestParam("couponId") Long couponId) {
        customerService.deleteCoupon(userId, couponId);
    }

    @PostMapping("simulateOrder")
    public SimulationResponse simulate(@Valid @RequestBody SimulationOrder order) {
        return customerService.simulateOrderPrice(order);
    }

    @PostMapping("placeOrder")
    public ShoppingCart checkout(@Valid @RequestBody ShoppingCart info) {
        return customerService.placeOrder(info);
    }

    @PostMapping("findCoupon")
    public List<CouponInfo> findCoupon(@Valid @RequestBody SearchCoupon request) {
        return customerService.findCoupon(request);
    }
}
```

在完成了用户优惠券服务的业务逻辑层和控制层实现后，接下来的步骤是进行应用启动类的配置以及相关配置文件的设置。

#### 4.3.4 启动类

启动类是 Spring Boot 应用的入口点，通过一系列的注解，Spring Boot 可以自动配置其上下文环境并启动应用。

以下是启动类代码的核心片段：

```java
@SpringBootApplication
@EnableJpaAuditing // 开启审计功能
@ComponentScan(basePackages = {"cn.javgo"})
@EnableTransactionManagement // 开启事务管理
@EnableJpaRepositories(basePackages = {"cn.javgo"}) // 扫描 JPA 相关的 DAO 层
@EntityScan(basePackages = {"cn.javgo"}) // 扫描 JPA 相关的实体类
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
```

- `@SpringBootApplication`：这是一个组合注解，它整合了`@Configuration`，`@EnableAutoConfiguration`，和 `@ComponentScan` 注解。通过这个注解，Spring Boot 自动扫描并加载定义好的组件。
- `@ComponentScan(basePackages = "cn.javgo")`：这个注解告诉 Spring Boot 在 `cn.javgo` 包下以及其子包中查找组件、配置和服务。

在这里，我们需要注意 Spring Boot 的一个约定：它默认会扫描启动类所在包以及其子包中的组件。如果需要加载其他包路径下的组件，则需要通过 `@ComponentScan` 注解明确指定扫描路径。

例如，如果启动类位于 `cn.javgo.customer` 包中，但项目中需要加载 `cn.javgo.template` 包下的组件，就需要在 `@ComponentScan` 中指定这些包作为额外的扫描路径。

#### 4.3.5 模块配置

对于配置文件，我们通常使用 `application.yml`（或 `application.properties`）。这里，我们可以借鉴已有的 `coupon-template-impl` 服务的配置文件，复制并调整必要的配置项来满足当前服务的需求。最重要的是，确保修改 `spring.application.name `属性，将其设置为 `coupon-customer-serv`，以反映服务的实际身份。

配置文件的详细内容：

```properties
# 服务器端口
server.port=20001

# 是否在错误信息中包含消息
server.error.include-message=always

# 应用名称
spring.application.name=coupon-customer-serv

# 数据库驱动类名
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
# 数据库连接URL
spring.datasource.url=jdbc:mysql://127.0.0.1:3306/coupon_db?autoReconnect=true&useUnicode=true&characterEncoding=utf8&useSSL=false&allowPublicKeyRetrieval=true&zeroDateTimeBehavior=convertToNull&serverTimezone=UTC
# 数据库用户名
spring.datasource.username=root
# 数据库密码
spring.datasource.password=root

# 数据源类型
spring.datasource.type=com.zaxxer.hikari.HikariDataSource
# 数据源连接池名称
spring.datasource.hikari.pool-name=CouponHikari
# 连接超时时间
spring.datasource.hikari.connection-timeout=5000
# 空闲超时时间
spring.datasource.hikari.idle-timeout=30000
# 最大连接池大小
spring.datasource.hikari.maximum-pool-size=10
# 最小连接池大小
spring.datasource.hikari.minimum-idle=5
# 连接生命周期
spring.datasource.hikari.max-lifetime=60000
# 自动提交
spring.datasource.hikari.auto-commit=true

# 是否显示 Hibernate SQL 语句
spring.jpa.show-sql=true
# JPA 生成DDL的方式
spring.jpa.hibernate.ddl-auto=none
# Hibernate SQL 语句格式化
spring.jpa.properties.hibernate.format_sql=true
# Hibernate SQL 语句显示
spring.jpa.properties.hibernate.show_sql=true
# 是否在视图中打开 JPA 连接
spring.jpa.open-in-view=false

# 日志级别
logging.level.cn.javgo.coupon=debug
```

配置完启动类和 `application.properties` 之后，用户优惠券服务的 Spring Boot 版本就配置完成了。现在，通过在本地启动单体应用 `coupon-customer-serv`，我们能够整合并使用用户服务、模板服务和计算服务的功能。

在本地环境下，你可以直接运行启动类来启动服务，并通过不同的测试用例来验证服务的功能，确保它们按预期工作。

## 5.项目总结

我们共同打造了一个基于 Spring Boot 的优惠券平台，涵盖了用户、模板和计算等三个核心服务模块。本项目采纳了**分层设计原则**，细化为 API、DAO 和业务逻辑层，以确保架构的清晰性和维护的便捷性。在实现过程中，spring-data-jpa 的加入极大简化了数据操作，而 spring-web 则为我们提供了构建 RESTful 接口的强大工具。

下面，我们即将踏入 Spring Cloud 的学习之旅。在这个篇章中，我们将深入了解 Nacos、Loadbalancer、OpenFeign 等关键组件，它们是构建微服务架构中跨服务调用系统的基石。通过 Spring Cloud，我们能够实现服务的自动注册与发现、负载均衡、服务熔断和链路追踪等高级功能，这将极大地提高系统的可用性和可靠性。

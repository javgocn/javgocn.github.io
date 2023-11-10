---
title: Maven
---
## 1.生命周期阶段

```bash
# 清理阶段：清除 target 目录中之前构建的生成物。
mvn clean

# 编译阶段：将 Java 源代码编译成 .class 字节码文件。
mvn compile

# 测试阶段：使用测试框架（如 JUnit 或 TestNG）运行单元测试。不会生成包。
mvn test

# 打包阶段：将编译后的代码打包为指定类型的文件，如 JAR、WAR 等。
# -DskipTests：跳过测试阶段
mvn package [-DskipTests]

# 测试编译阶段 (不是主生命周期阶段，但也很常用)：编译测试代码。不会运行测试。
mvn test-compile

# 安装阶段：将打包的构件安装到本地仓库，以便其他项目可以使用。
mvn install

# 部署阶段：将项目构件部署到远程仓库。需要正确配置仓库信息。
mvn deploy

# 验证阶段 (不是每个项目都会使用，但仍然很常用)：在集成测试之前执行，确保项目是正确的、完整的。
mvn verify

# 集成测试 (不是主生命周期阶段，但也很常用)：运行集成测试。
mvn integration-test
```


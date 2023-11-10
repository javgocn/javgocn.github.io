---
title: 规则语言-DRL
---
# DRL (Drools Rule Language) 规则

DRL，即 Drools Rule Language，是 Drools 使用的规则定义语言。通过 DRL，您可以定义一系列的规则，这些规则描述了在某些条件下应该执行的操作。

DRL (Drools Rule Language) 是您直接在 .drl 文本文件中定义的业务规则。想象一下，这些 DRL 文件就像是 Business Central 中所有其他规则资产的 “蓝图”。您可以在 Business Central 界面内创建和管理 DRL 文件，或者在 Red Hat CodeReady Studio 或其他集成开发环境中作为 Maven 或 Java 项目的一部分创建它们。

> [!TIP]
>
> Business Central 是 Drools 和 jBPM（一个开源的业务流程管理工具）的 web 用户界面。它提供了一个集中的环境，用于创建、部署、管理和监控 Drools 和 jBPM 项目。可以简单把 Business Central 看成是一个完整的开发和管理环境，专为 Drools 和 jBPM 设计，使您可以在一个集中的地方进行规则和流程的开发、部署和管理。
> Red Hat CodeReady Studio 是 Red Hat 提供的一个集成开发环境（IDE），它是基于 Eclipse 的。它为 Java 开发者提供了一系列的工具和功能，以帮助他们更高效地开发、测试和部署应用程序。其实就是是一个为 Java 和中间件开发者设计的强大的 IDE，它为 Drools 和 jBPM 开发提供了强大的支持。

简单来说，每个 DRL 文件都包含一系列的规则。每条规则至少定义了**规则的条件（when）**和**动作（then）**。在 Business Central 的 DRL 设计器中，为 Java、DRL 和 XML 提供了语法高亮功能，使您更容易编写和阅读规则。

DRL 文件由以下组件组成：

* package：定义了规则所在的包。
* import：允许您引入其他包中的类或功能。
* function（可选）：定义函数，这些函数可以在规则中使用。
* query（可选）：定义查询，用于检索符合特定条件的数据。
* declare（可选）：声明新的事实类型。
* global（可选）：定义全局变量，这些变量可以在多个规则中使用。
* rule：定义规则，包括规则的名称（唯一）、属性、条件和动作。

DRL 文件中的组件：

```drl
package

import

function  // Optional

query  // Optional

declare   // Optional

global   // Optional

rule "rule name"
    // Attributes
    when
        // Conditions
    then
        // Actions
end

rule "rule2 name"

...
```

例如，以下是一个简单的 DRL 规则，它决定了贷款申请中的年龄限制：

```drl
// 定义名为 "Underage" 的规则
rule "Underage" {
  // 设置规则的显著性为 15
  salience 15;
  // 将规则所属的议程分组设置为 "applicationGroup"
  agenda-group "applicationGroup";
  // 当满足以下条件时执行规则
  when {
    // 创建一个 LoanApplication 对象
    $application : LoanApplication();
    // 判断申请者年龄是否小于 21 岁
    Applicant( age < 21 );
  }
  // 执行规则的操作
  then {
    // 将贷款申请的状态设置为未批准
    $application.setApproved( false );
    // 设置贷款申请的解释为 "Underage"
    $application.setExplanation( "Underage" );
  }
}
```

这条规则的意思是：当一个贷款申请中的申请人年龄小于 21 岁时，该申请将不被批准，并给出 “未成年” 作为解释。

下面进行 DRL 文件的简单概括：

1. DRL 文件可以包含单个或多个规则（rule）、查询（query）和函数（function），并可以定义资源声明，如导入（import）、全局变量（global）和属性，这些都可以被您的规则和查询使用。
2. **DRL 包必须列在 DRL 文件的顶部，而规则通常列在最后。所有其他的 DRL 组件可以按任意顺序列出**。

3. 每条规则在规则包内必须有一个**唯一的名称**。如果在包中的任何 DRL 文件中多次使用相同的规则名称，规则将无法编译。为了避免可能的编译错误，尤其是在规则名称中使用空格时，**始终使用双引号括起规则名称（如 rule "rule name"）**。
4. **所有与 DRL 规则相关的数据对象必须与 Business Central 中的 DRL 文件位于同一个项目包中。同一包中的资产默认被导入**。可以使用 DRL 规则导入其他包中的现有资产。

## 1.DRL 中的包

在 Drools 中，**包（Package）**可以被看作是一个<u>文件夹</u>，它包含了<u>相关的规则资产</u>。这些资产可能包括<u>数据对象、DRL文件、决策表等</u>。您可以将其想象为一个书架上的特定类别的书籍集合。

为什么我们需要包？

1. **组织**：就像您不会将所有书籍放在一个大堆里一样，您也不会希望所有的规则都混在一起。包帮助您有条理地组织它们。
2. **命名空间**：包为规则组提供了独特的命名空间，确保规则名称不会发生冲突。

通常，您会将一个包中的所有规则存储在与包声明相同的文件中，这样包就是自包含的。但是，如果需要，您可以从其他包中导入对象，并在规则中使用它们。

例如，考虑一个用于抵押贷款申请决策服务的 DRL 文件。它可能有如下的包名和命名空间：

```
package org.mortgages;
```

> 这就像告诉系统：“嘿，我正在为抵押贷款创建一组规则，它们都在这个特定的包里。”

下面的链路显示了可能组成一个包的所有组件：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-03-033440.png)

> [!ATTENTION]
>
> 1. **命名规则**：包的命名应遵循标准的 Java 命名约定。这意味着不允许有空格。这与规则名称不同，规则名称是允许有空格的。
> 2. **位置**：在规则文件中，包声明必须位于文件的顶部。
> 3. **分号**：在声明结束时，分号是可选的。
>
> 最后，值得注意的是，任何规则属性（在 “规则属性” 会部分描述）也可以在包级别编写，这将覆盖属性的默认值。但在规则内部，您仍然可以替换这个默认值。

## 2.DRL 中的导入语句

在编写代码或规则时，我们经常需要使用一些预先定义的对象或函数。但是，为了避免每次都写出完整的名称，我们使用 `import` 语句。这使我们能够简洁地引用这些对象。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-03-034206.png)

`Import` 语句在 DRL 中的作用与 Java 中的作用非常相似。它告诉 Drools 引擎：“嘿，我将在我的规则中使用这个特定的对象，所以当我提到它时，请确保您知道我在说什么。”

您只需指定您想使用的对象的完整路径和名称。格式是 `packageName.objectName`。如果您有多个对象要导入，每个对象都应该在新的一行上。

例如，考虑一个用于抵押贷款申请决策服务的 DRL 文件。您可能想使用一个名为 `LoanApplication` 的对象。为了在规则中使用它，您需要告诉 Drools 您要使用哪个 `LoanApplication`。这就是 `import` 语句的作用：

```
import org.mortgages.LoanApplication;
```

这样，每当您在规则中提到 `LoanApplication` 时，Drools 就知道您是指 `org.mortgages.LoanApplication`。

> [!ATTENTION]
>
> 1. **自动导入**：Drools 引擎会自动导入与 DRL 包同名的 Java 包中的类，以及 `java.lang` 包中的类。这意味着您不需要手动导入这些类。
> 2. **格式**：确保您正确地指定了对象的完整路径和名称。一个小小的拼写错误都可能导致规则失败。

## 3.DRL 中的函数

在编写规则时，我们经常遇到一些重复的操作或逻辑。为了避免重复编写相同的代码，DRL 提供了 functions 功能，让您可以在规则文件中定义函数。

Functions 在 DRL 文件中允许您直接在规则源文件中放置语义代码，而不是在 Java 类中。如果规则的动作部分（then）被重复使用，并且每个规则的参数只是稍有不同，那么函数就特别有用。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-03-035132.png)

您可以在 DRL 文件的规则上方声明函数，或者从一个帮助（工具）类中导入一个静态方法作为函数，然后在规则的动作部分（then）中通过函数名使用该函数。

例如，以下是在 DRL 文件中声明的函数：

```
/*
 	这是一个名为 hello 的函数，它接受一个字符串参数 applicantName，并返回一个拼接后的字符串。
 	@param applicantName 申请人姓名
 	@return 拼接后的欢迎字符串
 */
function String hello(String applicantName) {
    return "Hello " + applicantName + "!";
}

/*
 	这是规则名为 "Using a function" 的规则。
 	当满足某些条件时，执行下面的代码块。
 */
rule "Using a function"
  when
    // Some conditions here
  then
    System.out.println( hello( "James" ) );
end
```

您也可以从 Java 类中导入一个静态方法，并在规则中使用它，如下所示：

```java
package org.example.applicant;

public class MyFunctions {

    public static String hello(String applicantName) {
        return "Hello " + applicantName + "!";
    }
}
```

在 DRL 文件中，您可以这样导入和使用它：

```
import static org.example.applicant.MyFunctions.hello;

rule "Using a function"
  when
    // Some conditions here
  then
    System.out.println( hello( "James" ) );
end
```

> [!ATTENTION]
>
> 1. **作用域**：在一个 DRL 文件中声明的函数不能被导入到另一个包中的规则，而在另一个包中的 Java 静态方法可以被导入。
> 2. **优势**：使用函数可以使您的规则更加简洁，避免重复的代码，并提高代码的可读性。

## 4.DRL 中的查询



## 5.DRL 中的类型声明和元数据



## 6.DRL 中的全局变量

在 Drools 中，global 变量充当了一种特殊的角色。它们不同于我们在 Java 或其他编程语言中所说的 “全局变量”。**在 Drools 中，global 变量主要用于在规则之间共享数据或服务**。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-03-040112.png)

Global 变量通常为规则提供数据或服务，例如<u>在规则后果中使用的应用服务，或从规则返回的数据，如在规则后果中添加的日志或值</u>。您可以在 Drools 引擎的工作内存中通过 KIE 会话配置或 REST 操作设置 global 值，然后在 DRL 文件的<u>规则上方声明 global 变量</u>，再<u>在规则的动作部分使用</u>它。

考虑以下示例，它展示了如何为 Drools 引擎配置一个 global 变量列表，以及如何在 DRL 文件中定义相应的 global 变量：

```java
// Java 代码中的配置
List<String> list = new ArrayList<>();
KieSession kieSession = kiebase.newKieSession();
kieSession.setGlobal( "myGlobalList", list );
```

```
// DRL 文件中的定义
global java.util.List myGlobalList;

rule "Using a global"
  when
    // Some conditions here
  then
    myGlobalList.add( "My global list" );
end
```

> [!ATTENTION]
>
> 1. **不要用于条件判断**：除非 global 变量具有恒定的不可变值，否则不要使用它来建立规则中的条件。因为 global 变量不会插入到 Drools 引擎的工作内存中，所以 Drools 引擎无法跟踪变量的值变化。
> 2. **不要用于规则间共享数据**：规则总是根据工作内存的状态进行推理和反应，所以如果您想从规则传递数据到规则，请将数据作为事实插入到 Drools 引擎的工作内存中而不是通过  global 变量。
> 3. **实际应用场景**：一个 global 变量的使用场景可能是一个电子邮件服务的实例。在调用 Drools 引擎的集成代码中，您获取您的 emailService 对象，然后将其设置在 Drools 引擎的工作内存中。在 DRL 文件中，您声明您有一个类型为 emailService 的 global，并给它命名为 "email"，然后在您的规则后果中，您可以使用诸如 email.sendSMS(number, message) 之类的操作。
> 4. **命名冲突**：如果在多个包中声明了具有相同标识符的 global 变量，那么您必须设置所有的包具有相同的类型，这样它们都引用相同的 global 值。

## 7.DRL 中的规则属性

在 Drools 中，规则不仅仅是一组条件（WHEN）和动作（THEN）。有时，我们需要为规则提供额外的指导或修改其行为。这就是 Rule Attributes 的用武之地。

Rule Attributes 可以看作是规则的 “元数据” 或 “配置”。它们为规则提供了额外的指导，告诉 Drools 引擎如何处理或优先考虑这些规则。简而言之，它们是用来调整规则行为的。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-03-040419.png)

在 DRL 文件中，规则属性通常定义在规则的条件（WHEN）和动作（THEN）之上。如果您有多个属性，每个属性都应该在单独的一行上。以下是一个基本的格式：

```
rule "Your_Rule_Name"
    // Attribute 1
    // Attribute 2
    // ... and so on
    when
        // Conditions here
    then
        // Actions here
end
```

想象一下，您有一个规则库，其中有数百个规则。某些规则可能比其他规则更重要，或者在某些情况下，您可能希望一些规则在其他规则之前执行。这就是为什么我们需要规则属性的原因。它们允许我们为规则提供额外的上下文和指导，以确保它们按照我们的预期执行。

### salience

* 定义：用于定义规则的优先级。
* 类型：integer
* 默认值：如果不明确设置 `salience`，其默认值为 0。
* 工作原理：在 Drools 的激活队列中，规则会根据 `salience` 值的大小进行排序。具有较高 `salience` 值的规则会被赋予更高的优先级，因此它们会在具有较低 `salience` 值的规则之前执行。

假设您希望某个规则在其他规则之前执行，可以为该规则设置一个较高的 `salience` 值：

```
rule "High Priority Rule"
salience 10
when
    // 条件
then
    // 动作
end
```

由于该规则的 `salience` 值为 10，它会在 `salience` 值小于 10 的规则之前执行。

### enabled

* 定义：用于确定规则是否处于激活状态。
* 类型：boolean
* 默认值：如果不明确设置 `enabled`，其默认值为 `true`，意味着规则默认是启用的。
* 工作原理：当 `enabled` 值为 `true` 时，规则是激活的，可以被触发和执行。当 `enabled` 值为 `false` 时，规则是禁用的，即使其条件满足也不会被触发。

假设您有一个规则，但您暂时不希望它执行，您可以设置其 `enabled` 值为 `false`：

```
rule "Temporarily Disabled Rule"
enabled false
when
    // 条件
then
    // 动作
end
```

在上述示例中，尽管规则的条件可能满足，但由于 `enabled ` 值为 `false`，该规则不会被触发或执行。

### date-effective

* 定义：用于指定规则生效的开始日期和时间。只有在此日期和时间之后，规则才可以被激活和执行。
* 类型：String
* 默认值：如果不明确设置 `date-effective`，则没有默认值，意味着规则没有生效日期的限制。
* 工作原理：如果当前的日期和时间在 `date-effective` 指定的日期和时间之前，那么该规则不会被触发，即使其条件满足。只有当当前日期和时间超过 `date-effective` 指定的日期和时间时，规则才可以被触发和执行。

假设您有一个规则，但您希望它只在 2018 年 9 月 4 日之后生效：

```
rule "Rule Effective After Specific Date"
date-effective "4-Sep-2018"
when
    // 条件
then
    // 动作
end
```

在上述示例中，即使规则的条件在 2018 年 9 月 4 日之前满足，该规则也不会被触发或执行。只有在这一日期之后，当条件满足时，规则才会执行。

### date-expires

* 定义：用于指定规则的失效日期和时间。一旦当前日期和时间超过了这个属性指定的日期和时间，该规则将不再被激活或执行。
* 类型：String
* 默认值：如果不明确设置 `date-expires`，则没有默认值，意味着规则没有失效日期的限制。
* 工作原理：如果当前的日期和时间在 `date-expires` 指定的日期和时间之后，那么该规则不会被触发，即使其条件满足。只有在当前日期和时间之前或等于 `date-expires` 指定的日期和时间时，规则才可以被触发和执行。

假设您有一个规则，但希望它只在 2018 年 10 月 4 日之前有效：

```
rule "Rule Expires After Specific Date"
date-expires "4-Oct-2018"
when
    // 条件
then
    // 动作
end
```

在上述示例中，即使规则的条件在 2018 年 10 月 4 日之后满足，该规则也不会被触发或执行。只有在这一日期之前，当条件满足时，规则才会执行。

### no-loop

* 定义：用于控制规则是否可以在其结果导致其条件再次满足时重新激活或循环执行。
* 类型：Boolean
* 默认值：如果不明确设置 `no-loop`，则默认值为 `false`，意味着规则可以在满足上述情况时循环执行。
* 工作原理：当 `no-loop` 设置为 `true` 时，如果规则的结果导致其条件再次满足，该规则不会重新激活或循环执行。当 `no-loop` 设置为 `false` 时，如果规则的结果导致其条件再次满足，该规则会重新激活并可能再次执行。

假设您有一个规则，但您希望它在执行后不会因其结果而重新激活：

```
rule "No Loop Example Rule"
no-loop true
when
    // 条件
then
    // 动作，可能导致上述条件再次满足
end
```

在上述示例中，即使规则的动作导致其条件再次满足，由于 `no-loop` 属性设置为 `true`，该规则不会重新激活或执行。

### agenda-group

* 定义：允许您为规则指定一个议程组。议程组是一种机制，使您能够将议程（即待执行的规则集）划分为不同的部分，从而对规则组的执行提供更多的控制。
* 类型：String
* 默认值：如果不明确设置 `agenda-group`，规则将不属于任何特定的议程组，而是属于默认的议程。
* 工作原理：规则只有在其所属的议程组获得焦点时才能被激活。在一个时刻，只有一个议程组可以获得焦点，这意味着在该议程组内的规则将优先于其他议程组中的规则被执行。通过设置议程组并控制哪个议程组获得焦点，您可以更精确地控制规则的执行顺序。

假设您有一组规则，您希望它们在其他规则之前执行：

```
rule "Agenda Group Example Rule"
agenda-group "PriorityGroup"
when
    // 条件
then
    // 动作
end
```

在上述示例中，该规则被分配到名为 "PriorityGroup" 的议程组。为了执行这个议程组中的规则，您需要确保 "PriorityGroup" 获得了焦点。

### activation-group

* 定义：它允许您为规则指定一个激活组。激活组是一种确保在组内只有一个规则被激活的机制。简而言之，它是一个互斥的组，确保组内的规则不会同时触发。
* 类型：String
* 默认值：如果不明确设置 `activation-group`，规则将不属于任何特定的激活组。
* 工作原理：在激活组内，只有一个规则可以被激活。当组内的一个规则被触发（fire）时，该组内的所有其他规则的激活都将被取消。这意味着，即使多个规则的条件都为真，也只有一个规则会执行其后果。

假设您有一组规则，但您只希望其中一个规则在给定的条件下被触发：

```
rule "Activation Group Example Rule 1"
activation-group "ExclusiveGroup"
when
    // 条件1
then
    // 动作1
end

rule "Activation Group Example Rule 2"
activation-group "ExclusiveGroup"
when
    // 条件2
then
    // 动作2
end
```

在上述示例中，两个规则都属于名为 "ExclusiveGroup" 的激活组。如果两个规则的条件都为真，只有一个规则（首先满足条件的规则）会执行其后果，而另一个规则的激活将被取消。

### duration

* 定义：它允许您为规则设置一个延迟激活的时间。这意味着，即使规则的条件满足了，规则也不会立即被激活，而是会等待指定的毫秒数后再激活。
* 类型：long integer（毫秒）
* 默认值：如果不明确设置 `duration`，规则将立即被激活，前提是其条件已经满足。
* 工作原理：当规则的条件满足时，规则不会立即进入激活队列。规则会等待指定的 `duration` 时间后，再检查其条件是否仍然满足。如果条件仍然满足，规则将被激活并可以被触发。

假设您有一个规则，但您希望在条件满足后等待 10 秒再激活该规则：

```
rule "Duration Example Rule"
duration 10000
when
    // 某些条件
then
    // 执行的动作
end
```

在上述示例中，即使规则的条件满足了，它也会等待 10 秒（10000 毫秒）后再检查条件。如果条件仍然满足，规则将被激活并可以被触发。

### timer

* 定义：允许您为规则设置一个定时器，使得规则可以在特定的时间间隔或者特定的时间点进行激活。
* 类型：一个整数（代表间隔时间）或者一个 cron 表达式（代表特定的时间点或周期）
* 默认值：如果不明确设置 `timer`，规则将不会基于时间进行激活，而是仅仅基于其条件是否满足。
* 工作原理：
  * 使用整数值：规则将在每个指定的时间间隔后进行激活，前提是其条件满足。
  * 使用 ron 表达式：规则将在 cron 表达式定义的特定时间点或周期进行激活，前提是其条件满足。


使用整数值（例如，每隔 10 秒激活规则）：

```
rule "Timer Interval Example Rule"
timer (int: 0 10)
when
    // 某些条件
then
    // 执行的动作
end
```

使用 cron 表达式（例如，每隔15分钟激活规则）：

```
rule "Timer Cron Example Rule"
timer (cron: 0 0/15 * * * ?)
when
    // 某些条件
then
    // 执行的动作
end
```

### calendar

* 定义：允许您为规则设置一个 [Quartz](http://www.quartz-scheduler.org/) 日历，以便在特定的时间段内激活或排除规则。
* 类型：一个 Quartz 日历表达式，它定义了一系列的时间点或时间段。
* 默认值：如果不明确设置 `calendar`，规则将不会基于特定的日历时间进行激活或排除，而是仅仅基于其条件是否满足。
* 工作原理：使用 `calendar` 属性，您可以定义规则在哪些特定的时间点或时间段内应该被激活或排除。例如，您可以设置规则仅在工作时间内激活，或者在非工作时间排除。

假设您希望规则仅在工作时间（即 8:00-18:00）之外激活，您可以使用以下定义：

```
rule "Calendar Example Rule"
calendar "* * 0-7,18-23 ? * *"
when
    // 某些条件
then
    // 执行的动作
end
```

在上述示例中，规则将在每天的 0:00-8:00 和 18:00-24:00 之间激活，前提是其条件满足。这意味着规则在工作时间（8:00-18:00）之外被激活。

### auto-focus

* 定义：当规则被激活时，是否自动将焦点赋予其所属的议程组（agenda group）。
* 类型：Boolean
* 默认值：如果不明确设置 `auto-focus`，其默认值为 `false`，意味着规则激活时不会自动将焦点赋予其所属的议程组。
* 工作原理：在 Drools 中，议程组允许您对规则进行分组，并控制哪个组的规则应该首先执行。当 `auto-focus` 设置为 `true` 时，一旦规则被激活，它所属的议程组会自动获得执行的焦点，从而优先执行该组内的规则。

假设您有一个名为 "PaymentGroup" 的议程组，其中包含处理付款的规则。您希望当任何规则被激活时，该组的所有规则都优先执行。您可以这样定义规则：

```
rule "Payment Rule Example"
agenda-group "PaymentGroup"
auto-focus true
when
    // 某些条件，例如检测到付款
then
    // 执行的动作，例如处理付款
end
```

在上述示例中，当 "Payment Rule Example" 规则被激活时，它所属的 "PaymentGroup" 议程组会自动获得执行的焦点，从而优先处理付款相关的规则。

### lock-on-active

* 定义：决定了当规则所属的规则流组（ruleflow group）变为活动状态或其所属的议程组（agenda group）获得焦点时，该规则是否可以再次被激活。
* 类型：Boolean
* 默认值：如果不明确设置 `lock-on-active`，其默认值为 `false`，意味着规则可以在其所属的规则流组或议程组活跃时被重新激活。
* 工作原理：当 `lock-on-active` 设置为 `true` 时，一旦规则所属的规则流组变为活动状态或其议程组获得焦点，该规则将不会再次被激活，直到规则流组不再活跃或议程组失去焦点。这是 `no-loop` 属性的加强版本，因为无论更新的来源如何（不仅仅是由规则本身引起的），匹配的规则的激活都会被丢弃。这个属性非常适合于计算规则，当您有多个规则修改一个事实，并且您不希望任何规则重新匹配和再次触发时。

假设您有一个名为 "CalculationGroup" 的议程组，其中包含处理某些计算的规则。您希望当任何规则被激活时，该组的所有规则都不会再次被激活，直到该组失去焦点。您可以这样定义规则：

```
rule "Calculation Rule Example"
agenda-group "CalculationGroup"
lock-on-active true
when
    // 某些条件，例如检测到某种计算需求
then
    // 执行的动作，例如进行计算
end
```

在上述示例中，当 "Calculation Rule Example" 规则被激活并且其所属的 "CalculationGroup" 议程组获得焦点时，该规则及该组内的其他规则都不会再次被激活，直到该组失去焦点。

### ruleflow-group

* 定义：允许您将规则分配到一个特定的规则流组中。规则流组是一组规则的集合，这些规则只有在其关联的规则流激活该组时才能触发。
* 类型：String
* 默认值：如果不明确设置 `ruleflow-group`，则规则不属于任何特定的规则流组，这意味着它不受任何规则流的约束。
* 工作原理：在 Drools 中，规则流是一个定义了规则执行顺序的工作流。通过使用 `ruleflow-group`，您可以确保只有在特定的工作流步骤中才激活和触发一组规则。这为复杂的业务逻辑提供了更细粒度的控制。

假设您正在为一个购物流程定义规则，其中包括检查库存、应用折扣和计算运费等步骤。您可以将与每个步骤相关的规则分组到不同的 `ruleflow-group` 中：

```
rule "Check Stock Level"
ruleflow-group "StockCheck"
when
    // 条件，例如检查库存是否足够
then
    // 执行的动作，例如更新库存状态
end

rule "Apply Discount"
ruleflow-group "DiscountApplication"
when
    // 条件，例如检查购物车的总价是否超过某个值
then
    // 执行的动作，例如应用折扣
end
```

在上述示例中，"Check Stock Level" 规则只有在 "StockCheck" 规则流组被激活时才会触发，而 "Apply Discount" 规则只有在 "DiscountApplication" 规则流组被激活时才会触发。

### dialect

* 定义：允许您为规则中的代码表达式指定使用的语言。它可以是 JAVA 或 MVEL。
* 类型：String（JAVA or MVEL）
* 默认值：如果不明确设置 `dialect`，规则将使用在包级别指定的方言。在此规则中指定的任何方言都会覆盖包级别的方言设置。
* 工作原理：
  * JAVA：当选择 JAVA 方言时，规则中的所有代码表达式都将使用 Java 语言进行解析和执行。
  * MVEL：MVEL 是一种轻量级的表达式语言，当选择 MVEL 方言时，规则中的代码表达式将使用 MVEL 进行解析和执行。


> [!WARNING]
>
> 当您在没有可执行模型的情况下使用 Drools 时，使用 "JAVA" 方言的规则后果只支持 Java 5 语法。关于可执行规则模型的更多信息，请参考 “[可执行规则模型](https://docs.drools.org/7.74.1.Final/drools-docs/html_single/index.html#executable-model-con_packaging-deploying)”。

```
rule "Sample Rule"
dialect "JAVA"
when
    // 条件
then
    // 使用Java语法的执行动作
end
```

在上述示例中，"Sample Rule" 规则将使用 Java 语法进行解析和执行。

## 8.DRL 中的规则条件（WHEN）





## 9.DRL 中的规则操作（THEN）



## 10.DRL 中的注释

在 DRL 文件中，注释是一种有效的方式来为读者提供有关规则或其组件的额外信息。Drools 引擎在处理 DRL 文件时会忽略这些注释，因此它们不会影响规则的执行。

1. **单行注释**：使用双斜线 `//` 前缀来创建单行注释，这种注释只持续到行的末尾。
2. **多行注释**：使用 `/*` 开始并使用 `*/` 结束来创建多行注释，这种注释可以跨越多行。

示例规则中的注释：

```
rule "Underage"
  // 判断申请人是否未成年
  when
    $application : LoanApplication()  // 申请贷款的实例
    Applicant( age < 21 )
  then
    /* 当申请人年龄小于21岁时，
       贷款申请将被拒绝。 */
    $application.setApproved( false );
    $application.setExplanation( "Underage" );
end
```

## 11.DRL 故障排除的错误消息



## 12.DRL 规则集中的规则单元



## 13.DRL 的性能调整注意事项


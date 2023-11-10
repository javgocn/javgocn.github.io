---
title: 03-源码-HashMap
---
---
title: 03-源码-HashMap
---

## 1.从 Map 接口入手

`Map` 是 Java 集合框架中的一个核心接口，用于存储键值对（key-value）。它确保每个**键都是唯一**的，并且**每个键只能映射到一个值**。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-020022.png)

### 1.1 从 JDK 1.0 的 Dictionary\<K,V\> 抽象类讲起

在 Java 的早期（JDK 1.0）版本中，`java.util.Dictionary` 是一个用于存储键值对的抽象类：

```java
public abstract class Dictionary<K,V> {...}
```

它为所有映射键到值的类（例如  `Hashtable`）提供了一个抽象的父类：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-021323.png)

在 `Dictionary` 类中，每一个键和每一个值都是一个对象。在任何一个 `Dictionary` 对象中，每个键最多只能与一个值关联。给定一个 `Dictionary` 和一个键，可以查找与之关联的元素。任何非 null 对象都可以作为键和值使用。为了确定两个键是否相同，实现这个类的方法通常需要重写  `equals`  方法。

然而，随着 Java 的发展，`Dictionary` 类逐渐被视为过时。新的实现应该实现  `Map`  接口，而不是扩展 `Dictionary` 抽象类。因为 `Map` 接口提供了更加丰富和灵活的功能，同时也更加符合 Java 集合框架的设计原则。

通过查看源码，我们发现 `Dictionary` 是一个完全抽象的类，定义了为数不多的抽象方法：

| 方法签名                                    | 描述                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| public Dictionary()                         | 构造方法                                                     |
| abstract public int size()                  | 返回此字典中的键值对的数量                                   |
| abstract public boolean isEmpty()           | 测试此字典是否不包含键值对                                   |
| abstract public Enumeration\<K\> keys()     | 返回此字典中的所有键的枚举                                   |
| abstract public Enumeration\<V\> elements() | 返回此字典中的所有值的枚举                                   |
| abstract public V get(Object key)           | 返回指定键所映射到的值；如果此字典不包含该键的映射，则返回 `null`。 |
| abstract public V put(K key, V value)       | 将指定 `key` 映射到此字典中的指定 `value`。返回先前与 `key` 关联的值，或者如果 `key` 之前没有映射，则返回 `null`。 |
| abstract public V remove(Object key)        | 从此字典中移除 `key`（及其相应的 `value`）。返回先前与 `key` 关联的值，或者如果 `key` 之前没有映射，则返回 `null`。 |

> ❓ **"字典"（Dictionary）应该如何理解？**
>
> 在计算机科学中，"字典"（Dictionary）是一个抽象数据类型，用于存储键值对，其中每个键都是唯一的。这种数据结构允许我们根据键来存取、插入或删除相应的值。在不同的编程语言或框架中，这种数据结构可能有不同的名称，如 “Map”、“Table” 或 “Associative Array”。
>
> 在 Java 的 `Dictionary` 类描述中，"字典" 是一个抽象类，它定义了键值对存储的基本操作，但没有提供具体的实现。也就是说，其他类（如 `Hashtable`）需要继承 `Dictionary` 并提供具体的实现。
>
> 下面对 “字典” 的一些关键点进行总结：
>
> 1. **键值对**：字典存储的基本单位是键值对。每个键都是唯一的，与之关联的是一个值。
> 2. **唯一键**：在字典中，键是唯一的。不能有两个键值对具有相同的键。
> 3. **查找**：字典的主要优势之一是查找速度。理论上，如果键的哈希函数设计得当，查找操作可以是常数时间的。
> 4. **插入和删除**：字典还支持插入新的键值对和删除现有的键值对。
> 5. **无序**：大多数基本的字典实现（如 `Hashtable`）不保证键值对的顺序。但也有一些实现（如 `TreeMap`）保证了特定的顺序。

🤔 **那么，Dictionary 的键值对是如何表示的呢？**

我们注意到 `Dictionary` 获取键或值集合的方法中有一个 `Enumeration<E>` 泛型枚举，它也是 Java 早期版本（JDK 1.0）中用于遍历集合元素的接口。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-022803.png)

从源码中可以看到，它提供了两个主要的方法：`hasMoreElements()` 和 `nextElement()`。这两个方法允许用户遍历集合的元素，而不需要知道集合的内部结构或大小。

1. **hasMoreElements()** ：此方法返回一个布尔值，指示是否还有更多的元素可以遍历。如果还有更多元素，则返回 `true`；否则返回 `false`。
2. **nextElement()** ：此方法返回集合中的下一个元素。每次调用此方法都会移动到下一个元素。如果没有更多的元素，此方法可能会抛出 `NoSuchElementException`。

在 `Dictionary` 类中，`keys()` 方法会返回一个 `Enumeration<K>`，它可以遍历字典中的所有键，而 `elements()` 方法返回一个可以遍历字典中所有值的 `Enumeration<V>`。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-022949.png)

尽管 `Enumeration` 在 Java 的早期版本中很受欢迎，但在 Java 2 平台（即 JDK 1.2）引入 `Iterator` 接口后，它逐渐被淘汰。`Iterator` 提供了与 `Enumeration` 类似的功能，但具有更丰富的操作，例如 `remove()`，并且命名更加直观。

> 📒 简单总结 `Enumeration` 和 `Iterator` 之间的一些关键差异：
>
> * `Enumeration` 有 `hasMoreElements()` 和 `nextElement()` 方法，而 `Iterator` 有 `hasNext()` 和 `next()` 方法。
> * `Iterator` 允许从集合中删除元素，而 `Enumeration` 不允许。
> * 从命名和设计的角度看，`Iterator` 更加现代和直观。

### 1.2 Map 接口中的集合视图又是怎样的？

在 Java 中，`Map` 接口提供了一种机制，允许我们查看其内容的不同 **“视图”**。这些视图是 Map 中数据的表示，它们提供了不同的方式来查看和操作 Map 中的数据。

具体来说，`Map` 提供了三种集合视图：

1. **键集（keySet()）**：

   这个视图提供了 Map 中所有键的集合。使用这个方法，你可以遍历所有的键，但不能直接访问与这些键关联的值。

   ```java
   Set<K> keySet();
   ```

   注意到 `keySet()` 的返回值是一个 `Set<K>` 集合，根据 `Set` 集合元素的唯一性得出结论：`Map 集合的 Key 唯一`。

2. **值集（values()）**：

   这个视图提供了 Map 中所有值的集合。与 `keySet()` 相反，你可以遍历所有的值，但不能直接访问产生这些值的键。

   ```java
   Collection<V> values();
   ```

   注意到 `values()` 的返回值是一个 `Collection<V>` 集合，该集合在不指定具体实现的条件下允许存入重复值，得出结论：**Map 集合的 Value 可以重复**。

3. **键值映射集（entrySet()）**：

   这可能是最有用的视图。它提供了 Map 中所有键值对的集合。每个键值对都是 `Map.Entry<K,V>` 的一个实例。

   ```java
   Set<Map.Entry<K, V>> entrySet();
   ```

那么， `Entry<K,V>` 是什么？通过翻阅源码发现它是定义在 Map 接口中的一个内部接口：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-024233.png)

这个内部接口在 Map 中用来**代表一个键值对**，简单理解就是它的一个实例就是一个键值对，多个实例就组成了一个 Map 集合。

这个接口很重要，因为它提供了一种方法来访问和修改 Map 中的数据，而不仅仅是通过键或值来操作。我们单独来看其中三个比较重要的方法：

* **K getKey()** ：返回与此条目关联的键。
* **V getValue()** ：返回与此条目关联的值。
* **V setValue(V value)** ：将此条目的值替换为指定的值。

Map 中也提供了对应的方法来获取所有的键值对集合，通过一个 Set 集合来进行存储：

```java
Set<Map.Entry<K, V>> entrySet();
```

当你调用 `map.entrySet()` 时，你会得到一个 `Set<Map.Entry<K, V>>`，也就是你得到了一个包含 `Map.Entry` 对象的集合。每个 `Map.Entry` 对象都代表 Map 中的一个键值对。

> ✏️ 与 Dictionary 的 Enumeration 对比：
>
> 在早期的 Java 版本中，`Dictionary` 是用来存储键值对的主要方式。但是，与现代的 `Map` 接口相比，`Dictionary` 的功能相对有限。最大的区别是 `Dictionary` 是一个完全的抽象类，而 `Map` 是一个接口。
>
> 此外，`Dictionary` 没有提供类似 `entrySet()` 这样的方法来直接访问其键值对。而 `Map` 通过其 `Map.Entry` 内部接口，提供了一种更加灵活和强大的方式来访问和修改其内容。
>
> 可见，`Map` 和其 `Map.Entry` 接口提供了一种更加现代、灵活和强大的方式来处理键值对，这也是为什么 `Dictionary` 在现代 Java 开发中已经被淘汰的原因。

### 1.3 为什么 JDK 官方不推荐使用可变对象作为 Map 的键？

看下面 Map 源码中的一段关键注释：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-025308.png)

> 📖 大致翻译：
>
> 注意：如果你选择一个可以更改的对象作为映射的键，那么你需要格外小心。假设你更改了这个键对象的某些属性，这可能会影响它的 `equals` 方法的结果。如果这种更改发生在你已经将该对象放入映射后，那么映射的行为可能会变得不可预测。此外，一个映射不应该将自己作为键，尽管它可以将自己作为一个值。但是，如果你这样做，那么这个映射的 `equals` 和 `hashCode` 方法可能不会正常工作。

从官方的警告中我们能总结出如下两个关键问题：

1. **如果一个可变对象被用作映射的键并在后续被修改，映射的行为会如何？**
2. **为什么映射不应该将自己作为键，而可以作为值？**

先来看第一个问题。在 Java 中，`Map` 的键是唯一的，因为内部使用了 Set 集合来进行存储，而 Set 集合可以通过对象的 `hashCode()` 和 `equals()` 方法来保证元素的唯一性。当你向 `Map` 中添加一个键值对时，`Map` 会使用键的 `hashCode()` 方法来确定该键值对应该存储在哪里。如果两个键的哈希码相同，`Map` 会进一步使用 `equals()` 方法来检查这两个键是否真的相等。

现在，考虑一个可变对象作为 `Map` 的键。如果在将这个对象添加到 `Map` 之后，你修改了这个对象的状态，那么这个对象的 `hashCode()` 或 `equals()` 方法的结果可能会改变。也就是说，从 `Map` 的角度看，这个键已经 “移动” 到了一个新的位置，但实际上它还在原来的位置。这会导致一系列的问题，例如：

1. **数据丢失**：由于键的哈希码已经改变，你可能无法再通过这个键来找到对应的值。
2. **数据不一致**：如果你尝试使用新的状态的对象作为键来获取值，你可能会得到一个不同的值，或者得到 `null`。
3. **内存泄漏**：由于原始的键值对无法被访问和删除，它们可能会在 `Map` 中一直存在，导致内存泄漏。

考虑一个简单的 `Person` 类，其中 `name` 是可变的：

```java
class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }

    public void setName(String name) {
        this.name = name;
    }

    // 重写 equals
    @Override
    public boolean equals(Object o) {
        // 同一个对象（地址相同）直接返回 true
        if (this == o) return true;
      
        // 检查类型
        if (o == null || getClass() != o.getClass()) return false;
      
        // 强制类型转换
        Person person = (Person) o;
        // 最终通过 equals 比较内容
        return Objects.equals(name, person.name);
    }

    // 基于 name 值进行 hash 计算
    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
```

现在，考虑以下代码：

```java
Map<Person, String> map = new HashMap<>();
Person person = new Person("Alice");

// 使用可变对象 person 作为键
map.put(person, "Developer");

// 修改键的状态（内部是通过 name 进行 hash 计算的）
person.setName("Bob");

// 尝试获取值
String role = map.get(person);  // 这里返回的是 null
```

上面的代码中，我们首先将一个 `Person` 对象和一个字符串添加到 `Map` 中。然后，我们修改了 `Person` 对象的状态。当我们尝试使用这个对象作为键来获取值时，我们得到 `null`，因为 `Map` 无法找到这个键。

为什么？

因为我们重写了 `hashCode` 方法通过 `name` 属性进行 hash 计算元素的位置，然而当我们修改了 `name` 属性值之后，再次查找元素时由于 `name` 的改变导致 hash 结果不同，因而定位到一个错误的位置进行查找。这时只有两种可能，要么查找到一个错误的值，要么结果为 `null`。同时，由于键状态的改变，是我们获取不到原本的元素的位置，那么原始的键值对就无法被访问和删除，它们可能会在 `Map` 中一直存在，最终导致内存泄漏。

### 1.4 为什么映射不应该将自己作为键，而可以作为值？

回顾一下上面提到的第二个关键问题：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-031057.png)

❓ **为什么映射不应该将自己作为键，而可以作为值？**

这个问题涉及到映射的基本工作原理和 Java 对象的 `equals()` 和 `hashCode()` 方法。

1. **基于 hashCode() 的存储：**

   当你将一个键值对放入映射时，映射首先会计算键的 `hashCode()`。这个哈希码决定了键值对在映射内部数组的存储位置。如果映射将自己作为键，那么每次映射的内容发生变化时，它的 `hashCode()` 都可能会改变，这会导致存储位置不断变化，从而使得映射无法正确地找到或存储键值对。

2. **equals() 方法的问题：**

   映射使用 `equals()` 方法来确定两个键是否相同。如果映射将自己作为键，那么它需要在 `equals()` 方法中处理**自引用**的情况，这会增加实现的复杂性。此外，如果映射的内容发生变化，那么它与其他对象的相等性也可能会改变，这会导致不可预测的行为。

假设你有一个映射，你尝试将映射自己作为键插入。当你再次尝试获取这个键时，由于上述的 `hashCode()` 和 `equals()` 问题，你可能会得到**意外的结果**，或者可能会遇到**无限循环**和**栈溢出**的问题。

看下面这段代码：

```java
import java.util.HashMap;

public class MapSelfReference {

    public static void main(String[] args) {
        HashMap<Object, String> map = new HashMap<>();

        // 将映射自己作为键插入
        map.put(map, "self");

        // 尝试获取这个键
        String value = map.get(map);
        System.out.println("Value for self-referential key: " + value);

        // 尝试调用 toString 方法
        try {
            System.out.println(map.toString());
        } catch (StackOverflowError e) {
            System.out.println("StackOverflowError when calling toString on the map!");
        }
    }
}
```

执行结果：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-032300.png)

当我们执行 `map.get(map)` 时，实际上是在尝试获取与映射自身相对应的值。为了获取这个值，`HashMap` 需要计算键的 `hashCode()`，然后使用这个哈希码来找到对应的桶。但是，当 `HashMap` 作为其自己的键时，调用 `hashCode()` 会导致递归，因为 `HashMap` 的 `hashCode()` 实现会尝试计算其所有键值对的哈希码。

也就是说，由于 `HashMap` 包含自己作为键，当它尝试计算自己的哈希码时，它会再次尝试计算自己的哈希码，这导致了无限递归。这就是为什么我们在尝试获取映射自身作为键的值时会遇到 `StackOverflowError`。

上述导致 `StackOverflowError` 的问题我们一般称之为：**自引用**问题。

因此，为了处理该问题，我们可以在 `equals()` 方法中首先检查是否正在与自身进行比较。如果是，我们可以立即返回 `true`，因为一个对象总是等于其自身。

```java
@Override
public boolean equals(Object o) {
    if (this == o) return true;  // 处理自引用
    if (o == null || getClass() != o.getClass()) return false;
    // ... 其他比较逻辑
}
```

在 `hashCode()` 方法中，我们可以为映射自身定义一个特定的哈希码，或者简单地返回超类的 `hashCode()`，从而确保每次的 hash 结果相同：

```java
@Override
public int hashCode() {
    if (this == key) return super.hashCode();  // 处理自引用
    // ... 其他哈希计算逻辑
}
```

考虑一个简单的 `HashMap`，其中我们已经重写了 `equals()` 和 `hashCode()` 方法以处理自引用：

```java
public class SelfReferencingMap<K, V> extends HashMap<K, V> {

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;  // 处理自引用
        return super.equals(o);
    }

    @Override
    public int hashCode() {
        if (this == key) return super.hashCode();  // 处理自引用
        return super.hashCode();
    }
}
```

使用上述 `SelfReferencingMap`，我们就可以避免由于自引用而导致的 `StackOverflowError`。

> ⚠️ 注意：尽管我们可以通过这种方式处理自引用，但最佳做法仍然是避免将映射自身作为键或值插入。

### 1.5 对于 Map 构造函数的规定

先看 JDK 官方建议：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-033246.png)

> 📖 大致翻译：
>
> 所有通用的 map 实现类都应该提供两个 “标准” 构造函数：创建空映射的 void (无参数) 构造函数，以及具有单个 map 类型参数的构造函数，它创建具有与其参数相同的键值映射的新映射。实际上，后一种构造函数允许用户复制任何映射，生成所需类的等效映射。没有办法强制执行这个建议 (因为 Map 接口本身不能包含构造函数)，但是 JDK 中的所有通用映射实现都遵循这个建议。

Java 中的 `Map` 接口推荐所有通用目的的 `Map` 实现类都应提供两个 "标准" 构造函数。这是为了确保开发者在使用任何 `Map` 实现时，都有一致的构造函数可以使用。这种约定使得开发者可以轻松地在不同的 `Map` 实现之间切换，而不必担心构造函数的差异。

让我们结合 `HashMap` 的源码来详细展开这两个构造函数：

1. **无参数构造函数**

   这是最常用的构造函数，它创建一个空的 `HashMap` 实例。

   ```java
   // 在构造函数中未指定时使用的默认负载因子
   static final float DEFAULT_LOAD_FACTOR = 0.75f;
   
   // 哈希表的负载因子
   final float loadFactor;
   
   // 使用默认初始容量 (16) 和默认负载因子 (0.75) 构造一个空 HashMap。
   public HashMap() {
       this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
   }
   ```

2. **带有 Map 类型单一参数的构造函数**

   这个构造函数允许用户复制另一个 `Map` 的内容到新创建的 `HashMap` 实例中。

   ```java
   public HashMap(Map<? extends K, ? extends V> m) {
       // 设置默认的负载因子 (0.75)
       this.loadFactor = DEFAULT_LOAD_FACTOR;
       // 将传入的 Map 中的所有键值对添加到新创建的 HashMap 中
       putMapEntries(m, false);
   }
   ```

   这个构造函数中，首先设置了默认的负载因子（0.75）。然后，使用 `putMapEntries` 方法将传入的 `Map` 中的所有键值对添加到新创建的 `HashMap` 中。新创建的 `HashMap` 将具有与传入的 `Map` 相同的键值映射。

这两个构造函数为开发者提供了创建 `HashMap` 的灵活性。无参数构造函数允许开发者创建一个空的 `HashMap`，而带有 `Map` 参数的构造函数则允许开发者基于现有的 `Map` 创建一个新的 `HashMap`。

### 1.6 Map 如何处理不支持的操作？

先看 JDK 官方建议：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-034700.png)

> 📖 大致翻译：
>
> 在这个接口中，有些方法可以修改它们操作的 `Map`。如果某个 `Map` 实现不支持这些修改操作，那么这些方法会抛出 `UnsupportedOperationException`。但有些情况下，即使调用这些方法不会改变 `Map` 的状态，它们也可能（但不是必须）抛出这个异常。例如，如果你尝试使用 `putAll(Map)` 方法将一个空的映射添加到一个不可修改的 `Map` 中，这个方法可能会抛出异常，尽管它实际上并不改变 `Map`。

在 Java 的 `Map` 接口中，有些方法是可选的，也就是说实现这个接口的类可以选择是否提供这些方法的具体实现。如果一个 `Map` 实现不支持某个操作，并且该操作被调用，那么通常会抛出 `UnsupportedOperationException`。

这种设计模式允许创建只读或部分可写的 `Map` 实现，或者在某些特定的上下文中禁止某些操作。

让我们通过 `Map` 接口的部分方法和其底层实现来详细展开这一点：

1. **V put(K key, V value)：**

   这是一个基本的方法，用于将指定的值与此映射中的指定键关联。大多数 `Map` 实现都会提供这个方法的实现，但如果某个特定的 `Map` 实现是只读的，那么这个方法可能会抛出 `UnsupportedOperationException`。

2. **V remove(Object key)：**

   此方法用于从 `Map` 中移除指定键的映射（如果存在）。如果一个 `Map` 实现不允许元素被移除，那么这个方法会抛出 `UnsupportedOperationException`。

3. **void putAll(Map\<? extends K, ? extends V\> m)：**

   此方法用于将指定 `Map` 中的所有映射复制到此 `Map`。如果 `Map` 实现不支持批量添加操作，那么这个方法会抛出 `UnsupportedOperationException`。

考虑 `Collections.unmodifiableMap()` 方法，它返回一个不可修改的 `Map`。这个返回的 `Map` 的任何修改操作（如 `put`, `remove` 等）都会抛出 `UnsupportedOperationException`。

关键源码如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-035701.png)

示例如下：

```java
Map<String, String> originalMap = new HashMap<>();
originalMap.put("key1", "value1");

Map<String, String> unmodifiableMap = Collections.unmodifiableMap(originalMap);

// 下面的操作会抛出 UnsupportedOperationException
unmodifiableMap.put("key2", "value2");
```

📒 总结：

`UnsupportedOperationException` 是一个运行时异常，用于指示请求的操作不受支持。在 `Map` 接口中，这通常意味着实现类是只读的或者不支持某些特定的修改操作。当开发者尝试执行不支持的操作时，应该捕获并适当处理这个异常，以确保程序的稳定性。

### 1.7 Map 对于键和值有哪些限制？

先看 JDK 官方建议：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-035908.png)

> 📖 简单翻译：
>
> 不同的 `Map` 实现可能对可以包含的键和值有不同的限制。例如，有些实现不允许使用 `null` 作为键或值，而有些则对键的类型有特定要求。如果尝试插入不合规的键或值，通常会抛出未经检查的异常，如 `NullPointerException` 或 `ClassCastException`。查询不合规的键或值时，可能会抛出异常，或者只是返回 `false`；具体行为取决于具体的实现。更广泛地说，对不合规的键或值执行某些操作，即使这不会导致将不合规的元素插入 `Map`，也可能会抛出异常，或者可能会成功执行，这取决于具体实现。这种异常在接口规范中被标记为 “可选”。

在 Java 的 `Map` 接口实现中，不同的实现类对键和值有不同的限制。这些限制主要是为了确保数据的完整性和避免潜在的错误。

1. **禁止 null 键和值**：

   **`HashMap`** ：它允许使用 `null` 作为键和值。但是，只能有一个 `null` 键，而可以有多个 `null` 值。

   ```java
   HashMap<String, String> hashMap = new HashMap<>();
   hashMap.put(null, "value");
   hashMap.put("key", null);
   ```

   **`Hashtable`** ：与 `HashMap` 不同，`Hashtable` 不允许 `null` 键或值。尝试插入 `null` 键或值会抛出 `NullPointerException`。

   ```java
   Hashtable<String, String> hashtable = new Hashtable<>();
   // 下面的代码会抛出 NullPointerException
   hashtable.put(null, "value");
   hashtable.put("key", null);
   ```

2. **键的类型限制**：

   **`TreeMap`** ：它是一个有序的 `Map`，基于红黑树实现。因此，它需要键是可比较的。如果键的类没有实现 `Comparable` 接口，那么在创建 `TreeMap` 时必须提供一个 `Comparator`。否则，尝试插入键时会抛出 `ClassCastException`。

   ```java
   TreeMap<CustomKey, String> treeMap = new TreeMap<>();
   // 如果 CustomKey 没有实现 Comparable 接口，下面的代码会抛出 ClassCastException
   treeMap.put(new CustomKey(), "value");
   ```

3. **其他实现的限制**：

   有些自定义的 `Map` 实现可能会对键和值有特定的限制，例如只接受某种特定类型的键或值，或者对键和值的大小或格式有限制。

可见，当使用 `Map` 的不同实现时，了解其对键和值的限制是很重要的，这可以帮助避免运行时错误。在尝试插入或查询键和值之前，最好先查看该实现的文档或源代码，以确保满足其要求。

以下是 `Map` 的常见实现对于 `null` 键和值的限制的总结：

| Map 实现          | null 键支持 | 允许的 null 键数量 | null 值支持 | 允许的 null 值数量 |
| ----------------- | ----------- | ------------------ | ----------- | ------------------ |
| HashMap           | 是          | 1                  | 是          | 无限制             |
| Hashtable         | 否          | 0                  | 否          | 0                  |
| TreeMap           | 否          | 0                  | 是          | 无限制             |
| LinkedHashMap     | 是          | 1                  | 是          | 无限制             |
| ConcurrentHashMap | 否          | 0                  | 否          | 0                  |
| WeakHashMap       | 是          | 1                  | 是          | 无限制             |

> ⚠️ 注意：虽然 `TreeMap` 本身不支持 `null` 键，但如果提供了自定义的 `Comparator`，并且该 `Comparator` 可以处理 `null`，那么 `TreeMap` 可以接受 `null` 键。但在实际使用中，这种情况很少见。

## 2.HashMap 基本描述

先看 JDK 官方说明：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-042924.png)

> 📖 大致翻译：
>
> `HashMap` 是基于哈希表的 `Map` 接口的实现。这种实现支持所有可选的映射操作，并且允许存储 `null` 值和 `null` 键。与 `Hashtable` 相比，`HashMap` 大致相同，但两者有两个主要区别：`HashMap` 不是线程同步的，并且它允许存储 `null`。此外，`HashMap` 不保证映射的顺序，特别是不保证这个顺序会随时间保持不变。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-014018.png)

`HashMap` 是 Java 集合框架中的一个核心组件，它实现了 `Map` 接口，提供了基于哈希表的映射功能。在开始了解 HashMap 的内部结构之前我们先来简单了解一下什么是哈希表。

### 2.1 重温哈希表的基本概念

在许多搜索技术中，如线性搜索、二分搜索和搜索树，搜索元素所需的时间取决于该数据结构中存在的元素总数。在所有这些搜索技术中，随着元素数量的增加，搜索元素所需的时间也线性增加。

**哈希（Hash）**是另一种方法，其中**搜索元素所需的时间不取决于元素的总数**。使用哈希数据结构，给定的元素可以在**常数时间复杂度内被搜索到**。简单理解：**哈希是一种有效减少数据结构中搜索元素所需比较次数的方法**。

这里给哈希（Hash）一个定义：

> 哈希是在数据结构中索引和检索元素的**过程**，目的是使用**哈希键**更快地找到元素。这里的哈希键是一个值，它提供了实际数据可能存储在数据结构中的**索引值**。

在这种数据结构中，我们使用一个称为**哈希表（Hash Table）**的概念来存储数据。**所有的数据值都根据哈希键值插入到哈希表中**。哈希键值用于将数据与哈希表中的索引关联起来。并且，**每个数据的哈希键都是使用哈希函数生成的**。这意味着哈希表中的每个条目都基于使用哈希函数生成的哈希键值。

同样，这里给哈希表（Hash Table）一个定义：

> 哈希表只是一个**数组**，它**使用哈希函数将键（数据）映射到数据结构中**，从而实现插入、删除和搜索操作的常数时间复杂度（即 O(1)）。哈希表用于在数据结构中非常快速地执行插入、删除和搜索操作。使用哈希表的概念，插入、删除和搜索操作都能在常数时间复杂度内完成。通常，每个哈希表都使用一个称为哈希函数的函数来将数据映射到哈希表中。

那什么是**哈希函数（hash function）**呢？

> 哈希函数是一个函数，它接受一块数据（即键）作为输入，并产生一个整数（即哈希值）作为输出，该整数将数据映射到哈希表中的特定索引。

哈希和哈希表的基本概念图解：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-054540.png)

辅助理解：想象一个分为多个隔室的盒子（数组）。每个隔室（桶）代表哈希表中的一个索引。在盒子上方，有一个元素，箭头指向标有 “哈希函数” 的函数。这个函数然后指向盒子中的一个特定隔室，表示根据哈希值将元素存储在哪里。

可见，哈希表是一种高效的数据结构，它使用哈希函数将数据映射到一个固定大小的数组中。当设计得当时，哈希表可以实现常数时间复杂度的插入、删除和搜索操作。

### 2.2 底层数据结构剖析

在 JDK1.8 之前，`HashMap `的底层实现主要是基于**数组和链表的组合**，这种结构也被称为 **“链表散列”**。`HashMap` 通过键（key）的 `hashCode` 方法得到的散列值，再经过一个特定的**扰动函数**处理，从而得到最终的 hash 值。

通过 `hashCode` 方法，其实就是我们上面所说的通过哈希函数计算出一个哈希值。那么 “扰动函数” 又是什么呢？为什么需要 “扰动函数” 对计算 key 得到的哈希值进行处理？

“扰动函数” 在哈希表的上下文中是一个特定的技术，用于**进一步处理原始的哈希码，以改善元素在哈希表中的分布**。这是为了解决某些不良的 `hashCode()` 实现可能导致的问题，例如导致大量的键聚集在哈希表的某些部分，从而导致性能下降。

因此，我们可以得出添加扰动函数的结论：

1. **不均匀的分布**：即使是良好设计的 `hashCode()` 方法，也可能导致哈希表中的不均匀分布。这种不均匀分布可能导致哈希表的某些部分过于拥挤，而其他部分则相对空闲。这会导致查找、插入和删除操作的性能下降。
2. **减少冲突**：哈希冲突是当两个不同的键产生相同的哈希值时发生的。扰动函数可以帮助分散这些冲突，使它们在哈希表中更均匀地分布。

具体来说，扰动函数通过对原始的哈希码进行某种形式的变换来工作。这种变换旨在确保哈希值在哈希表中更均匀地分布，而不是聚集在某些 “热点”。（具体体现我们在下面的具体源码进行分析）

<hr/>

🤔 那么，经过扰动函数处理后的哈希值就是我们最终在数组中的索引位置了吗？

我们知道，哈希表的核心思想是将键映射到一个**固定大小的数组**中。这里的 “固定大小” 很关键，数组的大小通常是在使用前就需要确定好的，进而对应的会分配一片连续的存储空间。那么，这个数组的大小多大合适呢？

不知道你会不会这么猜想：既然通过哈希函数计算得来的哈希值比较大，那么我一开始就申请一块充足的内存空间不就可以了吗？

这种想法也不是不可以，只是会显得你很呆。因为这带来的资源浪费是不可估量的。那么，有没有一种办法能够通过一个合适的数组大小（不会很大），但是却能对哈希值进一步处理得到允许范围内的数组索引值作为存储槽点呢？

为了做到这一点，我们需要一个方法来**将任意长度的哈希值转换为数组的有效索引**。在 HashMap 的实现中是通过：`(n - 1) & hash` 操作（这里的 `n` 是数组的长度）来完成的。

<hr/>

说到这里，我们就不得不提 HashMap 对于数组大小的设计细想了。这里先给你一个结论：**HashMap 中的数组大小总是 2 的幂次方！**

> ⚠️ 注意：这部分可能不太好理解，能理解其大概目的 即可。

对于为什么这么设计，主要是考虑到 HashMap 本身的性能优化、简化计算和冲突分布。下面进行简单解释：

1. **快速计算索引**：

   当数组的大小为 2 的幂次方时（也就是说数组大小只会是 0，2，4，8，16，...），确定元素在数组中的位置可以通过简单的**位操作**来完成，而不是更加耗时的**模运算**。具体来说，对于一个哈希值 `hash` 和数组大小 `n`，其索引可以通过 `hash & (n-1)` 来计算，而不是 `hash % n`。

   为什么这样有效？因为 2 的幂次方代表的数在二进制表示中只有一个位是 1，其余位都是 0。例如，16 在二进制中表示为 `10000`，而 15（即 16-1）表示为 `01111`。因此，`&` 操作实际上只是保留了哈希值的低位，这与模运算的效果相同，但计算速度更快。

   如果你还是不能理解，那么就接着看。补充一波二进制和位操作的基础知识：

   二进制表示：

   * 在二进制系统中，每个位置上的数字（位）只能是 0 或 1。
   * 从右到左，每个位置的权重是 2 的幂次方，从 0 开始。例如，第一个位置是 2<sup>0</sup>（即 1），第二个位置是 2<sup>1</sup>（即 2），第三个位置是 2<sup>2</sup>（即 4），依此类推。

   2 的幂次方在二进制中的特点：任何 2 的幂次方在二进制表示中都只有一个 1。例如：

   * 2<sup>0</sup> = 1，二进制表示为 `1`
   * 2<sup>1</sup> = 2，二进制表示为 `10`
   * 2<sup>2</sup> = 4，二进制表示为 `100`
   * 2<sup>3</sup> = 8，二进制表示为 `1000`
   * 2<sup>4</sup> = 16，二进制表示为 `10000`

   可以观察到，每次幂次增加时，1 都向左移动一个位置。接着我们继续看 `&` 位操作符，它称为 **“按位与”**。工作原理是：只有当两个相应的位都为 1 时，结果才为 1，否则为 0。

   当你从 2 的幂次方的数中减去 1 时，你实际上是将该数的二进制表示中的最左边的 1 变为 0，并将其右边的所有 0 变为 1。因此，16是 `10000`，减去 1 后得到 15，其二进制表示为 `01111`。当你使用 `&` 操作将一个数与 `01111`（例如 15）进行按位与操作时，你实际上只保留了该数的低 5 位，因为 `01111` 的高位是 0，与任何数的按位与操作都会得到 0。并且，对于 2 的幂次方，使用 `&` 操作与模运算得到的结果是相同的。例如，对于数组大小为 16，`hash & 15` 的效果与 `hash % 16` 相同。

2. **均匀分布**：

   哈希函数的目的是将输入（通常是键）转换为一个固定范围内的整数值，这个整数值然后用于确定在哈希表数组中的位置。理想的哈希函数会产生一个均匀分布的哈希值，这意味着每个数组索引都有大致相同的机会被选中，从而最小化冲突。

   但是哈希函数的设计通常使得哈希值在其整个可能的范围内都有随机性。这意味着哈希值的高位和低位都可能变化，并且都可能包含有用的信息。

   当数组大小为 2 的幂次方时，确定数组索引的位操作（如 `hash & (n-1)`）主要关注哈希值的低位。这是因为 `n-1` 的二进制表示形式将包含一系列的 1，然后是一系列的 0。例如，如果 `n=16`，那么 `n-1=15`，其二进制表示为 `01111`。这意味着低 5 位会被保留，而高位会被忽略。

   在某些情况下，哈希值的高位可能包含更多的随机性或变化，特别是当哈希函数产生的哈希值范围远大于数组大小时。如果我们只关注低位，那么我们可能会错过这种随机性，从而增加冲突的可能性。

   为了利用哈希值的高位随机性，哈希函数（或扰动函数）可能会将高位与低位混合。例如，在 Java 的 `HashMap` 中，哈希值的高 16 位与低 16 位异或，从而将高位的随机性混入到最终的数组索引中。

3. **扩容简化**：

   `HashMap` 的性能部分取决于其负载因子，即数组中的元素数量与数组大小的比率。当元素数量超过一个特定的阈值（通常是数组大小与负载因子的乘积）时，可能会导致更多的哈希冲突，从而降低查找、插入和删除操作的性能。为了维持性能，当元素数量超过阈值时，`HashMap` 需要扩容。

   翻倍数组的大小是一种简单且高效的策略。首先，它确保了新的数组大小仍然是 2 的幂次方，这对于上面讨论的位操作至关重要。其次，由于内存分配通常是按块进行的，翻倍数组的大小可能比增加一个固定的数量更加高效。

   在二进制表示中，左移操作相当于乘以 2。例如，数字 2 在二进制中表示为 `10`，左移一位后变为 `100`，即数字4。因此，通过简单地将当前大小左移一位，我们可以快速地翻倍数组的大小。在 Java 中，左移操作可以使用 `<<` 操作符来完成。例如，如果 `n` 是当前的数组大小，那么` n << 1` 将是新的数组大小。

   使用左移操作来翻倍数组的大小比其他方法更简单、更快。我们不需要进行复杂的算术运算或查找下一个最大的素数作为新的数组大小。只需一个简单的位操作即可。此外，由于新的数组大小仍然是 2 的幂次方，我们可以继续使用上面讨论的位操作来计算元素的位置，而不需要修改哈希算法或其他部分的代码。

4. **减少冲突**：

   哈希函数和扰动函数的设计目标是确保哈希值在整数范围内均匀分布。这意味着哈希表中的每个位置都有大致相同的机会被选中，从而最小化冲突。一个好的哈希函数和扰动函数组合会确保不同的键尽可能地映射到不同的哈希值，即使这些键在某种意义上是 “相似” 的。

   当数组大小为 2 的幂次方时，我们可以使用简单的位操作来确定元素在数组中的位置。这主要关注哈希值的低位，但由于扰动函数的设计，高位的信息也被混入了低位。这意味着哈希值的整个范围都被用于确定元素的位置，而不仅仅是某个子集。这有助于确保哈希值在数组中均匀分布，因为我们利用了哈希值的全部信息，而不仅仅是一部分。

   在某些情况下，哈希值的高位可能包含更多的随机性或变化。如果我们只关注低位，那么我们可能会错过这种随机性，从而增加冲突的可能性。扰动函数的设计通常考虑到这一点，将高位的随机性混入到低位中，从而确保我们在确定元素位置时利用了哈希值的全部信息。

5. **历史和经验**：

   这种设计选择也是基于过去的经验和实践。许多高效的哈希表实现都采用了这种策略，因为它在实践中被证明是有效的。

> 📒 巴拉巴拉一大堆，就是为了告诉你：**为什么使用 `(n - 1) & hash` 而不是 `hash % n`？**
>
> 数组的大小`n`总是选择为 2 的幂。这样，`(n - 1)`的二进制表示形式总是由一串 1 组成，例如，如果`n = 16`，那么`n - 1 = 15`，其二进制表示为`1111`。使用位操作`&`比使用取模操作`%`要快得多。当`n`是 2 的幂时，`hash & (n - 1)`的效果等同于`hash % n`，但性能更好。

<hr/>

那么。通过 `(n - 1) & hash` 我们终于拿到了对应元素应该在 HashMap 内部的哈希表中的存储位置了，如果该位置没有元素，那么肯定就能直接进行插入操作了。但是，万一此处已经存在元素呢？这是完全可能的，因为我们上面讨论的哈希函数、扰动函数、`(n - 1) & hash` 都明确说了，他们只能尽可能的避免或者说减少哈希冲突，并不能彻底避免。

> **哈希冲突**：即使经过扰动函数处理，不同的键仍然可能映射到数组的同一位置。这就是所谓的哈希冲突。

这时，显然光依靠 `hashCode()` 方法已经不能解决眼下的问题了，好在 Java 中还有一个 `equals()` 方法，我们可以在哈希值相同时通过 `equals()` 方法进一步判断当前元素（键值）是否相同：

1. **覆盖**：如果两个键相同（即它们的`hashCode()`值和实际的键值都相同），那么新的键值对应该**覆盖**旧的键值对。这确保了`HashMap`中的键是唯一的。（可以理解为更新操作）
2. **拉链法**：如果两个键的哈希值相同但实际的键不同，这意味着我们遇到了一个哈希冲突。为了解决这个问题，我们可以使用 “拉链法”，其中每个数组位置都链接到一个链表。当发生冲突时，新的键值对被添加到这个链表的末尾。

> 在 Java 中，两个不同的键对象可能具有相同的 `hashCode()` 值。因此，即使两个键的哈希值相同，它们也可能不相等。这就是为什么我们需要进一步检查键的相等性的原因。

<hr/>

单独来看看这所谓的 “拉链法” 道理是个什么玩意儿。

> 应用背景：哈希冲突发生在两个或多个不同的键产生相同的哈希值时。由于哈希表的大小是有限的，而可能的键的数量是无限的，所以冲突是不可避免的。即使哈希函数设计得很好，也不能保证完全避免冲突，特别是当哈希表开始填满时。

**在拉链法中，哈希表的每个位置不再存储单个键值对，而是存储一个链表。这个链表包含了所有哈希到该位置的键值对。**

> 在大多数实现的`HashMap`中，为了解决哈希冲突，使用的是**单链表**。这是因为单链表结构简单，空间开销较小，且满足了基本的需求：在冲突位置添加新的键值对和遍历该位置的所有键值对。

当要插入一个新的键值对时，首先计算其哈希值，然后找到对应的数组位置。如果该位置的链表不存在，就创建一个新的链表。然后，将新的键值对添加到链表的末尾。

当两个不同的键具有相同的哈希值时，它们会被映射到哈希表的同一个位置。但由于该位置链接到一个链表，所以两个键值对都可以被存储在同一个位置，只是它们在链表中的位置不同。

当查找一个键时，首先找到其在数组中的位置，然后在链表中线性搜索该键。由于链表中的元素数量相对较少，所以这种搜索通常很快。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-073032.png)

❓ 拉链法的优缺点：

优点：

* **灵活性**：拉链法允许在一个固定大小的数组中存储无限数量的键值对。
* **均匀分布**：由于冲突的键值对被存储在链表中，所以冲突不会导致键值对被映射到哈希表的其他位置，从而确保了哈希值的均匀分布。

缺点：

* **空间开销**：每个链表节点都需要额外的空间来存储指向下一个节点的指针。
* **性能下降**：如果很多键哈希到同一个位置，那么链表可能会变得很长，从而导致查找性能下降。但在实际应用中，如果哈希函数设计得当，这种情况是相对罕见的。

<hr/>

铺垫了那么理论了，现在我们结合源码来看看具体的实现。在 JDK1.8 中，`hash` 方法相对于 JDK1.7 进行了一些简化，但基本原理保持不变。

以下是 JDK1.8 的`hash`方法实现：

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

而在 JDK1.7 中，`HashMap `的 `hash` 方法如下：

```java
static int hash(int h) {
    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}
```

与 JDK1.8 的 `hash` 方法相比，JDK1.7 的版本在性能上可能稍微逊色一些，因为它进行了四次扰动。

<hr/>

相比于之前的版本，JDK1.8 在解决哈希冲突时引入了一些重要的优化。

在 JDK1.8 的 `HashMap` 实现中，当一个桶中的链表长度超过了特定的**阈值（默认为8）**时，系统会考虑将该链表转换为**红黑树**。这种转换的主要目的是**优化查找性能**，因为红黑树的查找时间复杂度为 O(log n)，远优于长链表的 O(n)。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-074036.png)

但是，这种转换并不是在每次链表长度超过阈值（8）时都会立即执行。首先，`treeifyBin() `方法会检查 `HashMap` 的当前数组大小。只有当**数组的长度大于或等于 64 时**，才会真正执行链表到红黑树的转换。这是因为红黑树结构相对复杂，对于小数组，简单地扩容数组可能更为高效。

如果数组长度小于 64，而某个桶中的链表长度超过了阈值，那么 `HashMap` 会选择执行 `resize()` 方法，对数组进行扩容，而不是转换为红黑树。这样做的目的是尽量保持数据结构的简单性，同时还能有效地分散哈希冲突。

可见，JDK1.8 的 `HashMap` 在处理哈希冲突时采用了更加智能和高效的策略，旨在根据实际情况选择最佳的数据结构，从而优化性能。

### 2.3 HashMap 的属性

HashMap 中的属性如下：

```java
// 默认初始容量-必须是 2 的幂（16）
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16

// 最大容量
// 如果其中任何一方隐式指定了更高的值，则使用最大容量带参数的构造函数的。必须是 2 的幂
static final int MAXIMUM_CAPACITY = 1 << 30;

// 在构造函数中未指定时使用的默认负载因子
static final float DEFAULT_LOAD_FACTOR = 0.75f;

// 当桶 (bucket) 上的结点数大于等于这个值（8）时链表会转成红黑树
static final int TREEIFY_THRESHOLD = 8;

// 当桶 (bucket) 上的结点数小于等于这个值（6）时红黑树会转为链表
static final int UNTREEIFY_THRESHOLD = 6;

// 可以对桶 (bucket) 进行树化的最小表（table）容量
static final int MIN_TREEIFY_CAPACITY = 64;

// 存储元素的数组
// 在第一次使用时初始化，并根据需要调整大小
// 在分配时，长度总是 2 的幂
transient Node<K,V>[] table;

// 存放具体元素（键值对）的集合
transient Set<Map.Entry<K,V>> entrySet;

// 此映射中包含的键值映射的数量（注意：这个值不等于数组的长度）
transient int size;

// 每次扩容和更改 HashMap 结构的计数器
// 结构修改是指改变 HashMap 中的映射数量或以其他方式修改其内部结构 (例如，重新散列)
transient int modCount;

// 要调整大小的阈值 (容量*负载因子)
// 当实际大小超过阈值时才会进行扩容
int threshold;

// 哈希表的负载因子
 final float loadFactor;
```

这里先有个映像，这些属性后面用到时都会进行分析：

| 属性名                   | 描述                                                         |
| ------------------------ | ------------------------------------------------------------ |
| DEFAULT_INITIAL_CAPACITY | 默认的初始容量为 16。这是 HashMap 在创建时的默认大小，除非在构造函数中明确指定了其他值。必须是 2 的幂。 |
| MAXIMUM_CAPACITY         | 最大容量为 2^30。这是 HashMap 可以有的最大容量。任何尝试超过此容量的操作都可能导致异常。必须是 2 的幂。 |
| DEFAULT_LOAD_FACTOR      | 默认负载因子为 0.75。这是一个平衡时间和空间成本的值，用于确定何时扩展哈希表的大小。 |
| TREEIFY_THRESHOLD        | 当一个桶中的元素数量达到或超过 8 时，链表结构会被转换为红黑树结构，以提高查找效率。 |
| UNTREEIFY_THRESHOLD      | 当红黑树结构的桶中的元素数量减少到 6 或以下时，红黑树会被转换回链表结构。 |
| MIN_TREEIFY_CAPACITY     | 哈希表的最小容量为 64，只有当哈希表的容量达到或超过这个值时，链表才会被转换为红黑树。 |
| table                    | 这是实际存储键值对的数组。它的长度总是 2 的幂。在 HashMap 首次插入元素时进行初始化，并在需要时进行调整。 |
| entrySet                 | 这是一个集合，包含 HashMap 中的所有键值对。它主要用于迭代和其他集合视图操作。 |
| size                     | 表示 HashMap 中实际键值对的数量。注意，这与 table 数组的长度不同，因为数组可能包含未使用的空间。 |
| modCount                 | 这是一个计数器，记录 HashMap 结构的修改次数。结构修改是指改变键值对数量或以其他方式修改其内部结构（例如，通过 `resize`）。 |
| threshold                | 这是下一次调整 HashMap 大小的阈值。它是当前容量与负载因子的乘积。当 size 超过此值时，HashMap 会进行扩容。 |
| loadFactor               | 这是 HashMap 的负载因子，用于确定何时扩展哈希表的大小。它在构造函数中设置，并在 HashMap 的生命周期中保持不变。 |

其中有两个属性比较重要，我们单独先行理解，后面会多次出现：

1. **负载因子：loadFactor**

   `loadFactor`（负载因子）是一个非常重要的性能参数。它决定了哈希表的密度，即桶的平均大小。负载因子越高，意味着哈希表的密度越高，每个桶中的元素数量越多，这可能会增加查找的时间。相反，负载因子越低，哈希表的密度越低，空间利用率就越低。

   当哈希表中的元素数量超过当前容量与负载因子的乘积时，哈希表会进行扩容。这是为了保持哈希表的效率，防止过多的哈希冲突。

   0.75 是一个在时间和空间效率之间的折中。这个值是经过实验和实践得出的，它提供了良好的性能。如果负载因子太低，例如 0.25，那么哈希表会过于稀疏，这意味着会浪费大量的内存。此外，哈希表会频繁地进行扩容，这是一个相对昂贵的操作。如果负载因子太高，例如 0.9 或 1.0，哈希表会变得非常密集，这会增加查找元素时的冲突概率，从而降低查找效率。

2. **扩容阈值：threshold**

   `threshold`是哈希表的一个内部参数，表示哈希表可以容纳的最大元素数量，超过这个数量时，哈希表会进行扩容。它是当前容量与负载因子的乘积。这确保了当哈希表的实际大小超过这个值时，哈希表会进行扩容，从而保持了哈希表的效率。通过这种方式，`HashMap`可以在保持查找效率的同时，动态地调整其内部存储结构的大小。

   `threshold`与`loadFactor`直接相关。`threshold`是根据当前容量和`loadFactor`计算得出的。这意味着，如果你有一个固定的`loadFactor`，那么随着哈希表容量的增加，`threshold`也会相应地增加。

### 2.3 HashMap 的构造器

HashMap 一共提供了 4 个构造器，其中前两个遵循了 Map 接口的约定，下面我们一一分析。

1. **无参数构造函数**：

   这是最常用的构造函数，创建一个空的 `HashMap `实例。将负载因子设置为默认值（0.75），其他所有字段都使用默认值。

   ```java
   // 在构造函数中未指定时使用的默认负载因子
   static final float DEFAULT_LOAD_FACTOR = 0.75f;
   
   // 哈希表的负载因子
    final float loadFactor;
   
   public HashMap() {
       this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
   }
   ```

2. **带有`Map`参数的构造函数**：

   允许用户创建一个新的 `HashMap` 实例，并从另一个 `Map` 中复制所有键值对。它首先将负载因子设置为默认值（0.75），然后调用 `putMapEntries `方法将给定 `Map` 中的所有键值对添加到新的 `HashMap `中。

   ```java
   /**
    * 构造一个新的 HashMap，其中包含指定 Map 中的所有键值对。
    * @param m 源 Map，其键值对将被放入新的 HashMap
    */
   public HashMap(Map<? extends K, ? extends V> m) {
       // 设置负载因子为默认值（0.75）
       this.loadFactor = DEFAULT_LOAD_FACTOR;
       // 将指定 Map 中的所有键值对添加到新的 HashMap
       putMapEntries(m, false);
   }
   
   /**
    * 将指定 Map 中的所有键值对添加到当前 HashMap。
    * @param m     要从中复制键值对的源 Map
    * @param evict 如果为 true，则不尝试重新创建已有的键值对
    */
   final void putMapEntries(Map<? extends K, ? extends V> m, boolean evict) {
       // 获取源 Map 的大小
       int s = m.size();
     
       if (s > 0) {
           // 如果当前 HashMap 还未初始化
           if (table == null) { // pre-size
               // 预计算新的 HashMap 的大小
               float ft = ((float)s / loadFactor) + 1.0F;
               int t = ((ft < (float)MAXIMUM_CAPACITY) ?
                        (int)ft : MAXIMUM_CAPACITY);
             
               // 如果计算出的大小大于当前的阈值，则更新阈值
               if (t > threshold)
                   threshold = tableSizeFor(t);
           }
         
           // 如果源 Map 的大小大于当前的阈值，则对 HashMap 进行扩容
           else if (s > threshold)
               resize();
         
           // 遍历源 Map 的每一个键值对，并将其添加到当前 HashMap
           for (Map.Entry<? extends K, ? extends V> e : m.entrySet()) {
               K key = e.getKey();
               V value = e.getValue();
               // 使用 putVal 方法将键值对添加到 HashMap
               putVal(hash(key), key, value, false, evict);
           }
       }
   }
   ```

3. **带有初始容量参数的构造函数**：

   这个构造函数允许用户指定 `HashMap` 的初始容量。它将负载因子设置为默认值（0.75），并调用第四个构造函数来完成实例化。

   ```java
   public HashMap(int initialCapacity) {
       this(initialCapacity, DEFAULT_LOAD_FACTOR);
   }
   ```

4. **带有初始容量和负载因子参数的构造函数**：

   这是最灵活的构造函数，允许用户同时指定初始容量和负载因子。它首先检查初始容量和负载因子的有效性。如果它们超出了允许的范围或是非法值，它会抛出 `IllegalArgumentException`。然后，它将负载因子设置为给定的值。`tableSizeFor `方法确保初始容量是 2 的幂。这是为了确保哈希值在数组中均匀分布。

   ```java
   // 最大容量（2^30）
   // 如果其中任何一方隐式指定了更高的值，则使用最大容量带参数的构造函数的。必须是 2 的幂
   static final int MAXIMUM_CAPACITY = 1 << 30;
   
   /**
    * 构造一个新的空 HashMap，具有指定的初始容量和负载因子。
    * @param initialCapacity 初始容量。HashMap 在达到此容量之前不会进行扩容。
    * @param loadFactor      负载因子。当 HashMap 的大小超过初始容量与负载因子的乘积时，它会进行扩容。
    */
   public HashMap(int initialCapacity, float loadFactor) {
       // 检查初始容量是否为负数。如果是，则抛出异常。
       if (initialCapacity < 0)
           throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
       
       // 如果初始容量超过了最大允许的容量，则将其设置为最大容量。
       if (initialCapacity > MAXIMUM_CAPACITY)
           initialCapacity = MAXIMUM_CAPACITY;
       
       // 检查负载因子是否为非正数或NaN（不是一个数字）。如果是，则抛出异常。
       if (loadFactor <= 0 || Float.isNaN(loadFactor))
           throw new IllegalArgumentException("Illegal load factor: " + loadFactor);
       
       // 设置负载因子为指定的值。
       this.loadFactor = loadFactor;
       
       // 计算并设置阈值。阈值是 HashMap 在进行扩容之前可以达到的大小。
       // tableSizeFor 方法确保容量是 2 的幂，这有助于哈希值在数组中均匀分布。
       this.threshold = tableSizeFor(initialCapacity);
   }
   ```

这里将其中的 `tableSizeFor(int cap)` 方法单独提出来看看：

```java
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}
```

这个方法的主要目的是为了找到大于或等于给定数值 `cap` 的最小 2 的幂次方值。这是为了确保 `HashMap` 的容量总是 2 的幂次方，从而使得哈希值在数组中均匀分布。

让我们逐步剖析这个方法：

```java
static final int tableSizeFor(int cap) {
    int n = cap - 1;
```

首先，从 `cap` 中减去 1。这是为了确保，如果 `cap` 已经是 2 的幂次方，我们不会选择下一个 2 的幂次方。例如，如果 `cap` 是 16（一个 2 的幂次方），我们希望返回 16 而不是 32。

```java
n |= n >>> 1;
n |= n >>> 2;
n |= n >>> 4;
n |= n >>> 8;
n |= n >>> 16;
```

这一系列的位操作是为了将整数 `n `的二进制表示中的最高位之后的所有位都设置为 1。例如，如果 `n` 的二进制表示是 `100100`，那么这一系列的操作后，`n` 将变为 `111111`。

这是如何工作的：

* `n >>> 1` 将 `n` 右移一位，然后与原始的 `n `进行或操作，这会将 `n` 的最高位之后的第一位设置为 1。
* `n >>> 2` 将 `n` 右移两位，然后与原始的 `n` 进行或操作，这会将 `n` 的最高位之后的两位设置为 1。
* 以此类推，直到 `n` 的所有位都被设置为 1。

```java
return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
```

最后，我们检查`n`的值：

* 如果 `n `小于 0（这意味着 `cap` 是负数或 0），我们返回 1，因为 `HashMap` 的最小容量是 1，也就是 2<sup>0</sup>。
* 如果 `n `大于或等于 `MAXIMUM_CAPACITY`（这是 `HashMap` 的最大容量 2<sup>30</sup>），我们返回 `MAXIMUM_CAPACITY`。
* 否则，我们返回 `n + 1`。由于 `n` 的所有位都被设置为 1，所以 `n + 1` 将是 2 的下一个幂次方。

> 结论：这个方法确保了返回的容量总是 2 的幂次方，并且是大于或等于给定值 `cap` 的最小的 2 的幂次方。

### 2.4 HashMap 中的链表设计

1. `Node `类代表了 `HashMap` 中的一个单独的键值对。每个 `Node` 都有一个哈希值、键、值和一个指向下一个 `Node` 的引用（单链表体现）。

2. 当多个键的哈希值映射到同一个桶（数组索引）时，这些 `Node `通过 `next` 引用链接在一起，形成一个链表。这种方法称为我们前面说的 “拉链法”，用于解决哈希冲突。

3. `hash `字段存储的是键的哈希值，它用于确定键值对在 `HashMap` 的数组（`Node<K,V>[] table`）中的位置。通过这个哈希值，`HashMap`可以快速定位到键值对的存储位置。
4. `key `和 `value` 字段分别存储键和值。`Node` 类提供了方法来获取和设置这些值。
5. `Node` 类的 `equals `方法定义了什么构成两个 `Node` 相等：它们的键和值都必须相等。`hashCode` 方法则返回由键和值的哈希码异或得到的结果。
6. `setValue `方法允许更新 `Node` 的值，并返回之前的值。这在 `put` 操作中是有用的，当键已经存在时，它允许 `HashMap` 更新值并返回旧值。（也就是我们前面说的覆盖）

```java
/**
 * Node 类代表 HashMap 中的一个节点（或称为桶、条目）。
 * 它包含一个键值对，并且可以链接到下一个节点，从而形成一个链表。
 * 这种设计用于解决哈希冲突。
 *
 * @param <K> 键的类型
 * @param <V> 值的类型
 */
static class Node<K,V> implements Map.Entry<K,V> {
    // hash 是键的哈希值，用于确定节点在数组中的位置。（不可变）
    final int hash;
    // 键（不可变）
    final K key;
    // 值
    V value;
    // 指向下一个节点的引用，形成链表结构。（单链表）
    Node<K,V> next;

    /**
     * 构造一个新的节点。
     *
     * @param hash  键的哈希值
     * @param key   键
     * @param value 值
     * @param next  下一个节点
     */
    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }

    // 获取键
    public final K getKey()        { return key; }
    // 获取值
    public final V getValue()      { return value; }
    // 返回键值对的字符串表示形式
    public final String toString() { return key + "=" + value; }

    // 返回节点的哈希码，由键和值的哈希码异或得到。
    public final int hashCode() {
        return Objects.hashCode(key) ^ Objects.hashCode(value);
    }

    /**
     * 设置新值并返回旧值。
     *
     * @param newValue 新值
     * @return 旧值
     */
    public final V setValue(V newValue) {
        V oldValue = value;
        value = newValue;
        return oldValue;
    }

    /**
     * 判断两个节点是否相等。
     * 两个节点相等当且仅当它们的键和值都相等。
     *
     * @param o 要与之比较的对象
     * @return 如果指定的对象等于此节点，则返回 true
     */
    public final boolean equals(Object o) {
        if (o == this)
            return true;
        if (o instanceof Map.Entry) {
            Map.Entry<?,?> e = (Map.Entry<?,?>)o;
            // 键和值都必须相等
            if (Objects.equals(key, e.getKey()) &&
                Objects.equals(value, e.getValue()))
                return true;
        }
        return false;
    }
}
```

### 2.5 HashMap 中的红黑树设计

1. `TreeNode` 类继承自 `LinkedHashMap.Entry`，因此它也包含了键、值、哈希值和下一个节点的引用。但为了支持红黑树结构，它增加了额外的属性，如 `parent`、`left`、`right`、`prev `和 `red`。
2. `parent`, `left`, 和 `right` 分别表示红黑树中的父节点、左子节点和右子节点。`red`属性表示节点的颜色。在红黑树中，每个节点都有一个颜色，要么是红色，要么是黑色。
3. `prev `属性在删除操作中很有用。当一个 `TreeNode` 被删除时，`prev `属性帮助断开与下一个节点的链接。
4. `root()` 方法用于查找红黑树的根节点。由于每个节点都有指向其父节点的引用，所以可以通过不断地向上遍历来找到根节点。

```java
/**
 * TreeNode 类代表了 HashMap 中的一个红黑树节点。
 * 它继承自 LinkedHashMap.Entry，因此它也是一个键值对节点。（具有双向连链表的特点）
 * 但它增加了红黑树所需的额外属性和方法。
 *
 * @param <K> 键的类型
 * @param <V> 值的类型
 */
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    // 父节点的引用
    TreeNode<K,V> parent;
    // 左子节点的引用
    TreeNode<K,V> left;
    // 右子节点的引用
    TreeNode<K,V> right;
    // 在删除时，用于断开与下一个节点的链接
    TreeNode<K,V> prev;
    // 节点的颜色，true 表示红色，false 表示黑色
    boolean red;

    /**
     * 构造一个新的红黑树节点。
     *
     * @param hash  键的哈希值
     * @param key   键
     * @param val   值
     * @param next  下一个节点
     */
    TreeNode(int hash, K key, V val, Node<K,V> next) {
        super(hash, key, val, next);
    }

    /**
     * 返回红黑树的根节点。
     * 通过不断地向上遍历父节点，直到父节点为 null。
     *
     * @return 红黑树的根节点
     */
    final TreeNode<K,V> root() {
        for (TreeNode<K,V> r = this, p;;) {
            if ((p = r.parent) == null)
                return r;
            r = p;
        }
    }

    // ...... 其他红黑树相关的方法
}
```

### 2.6 HashMap 对于 null 键/值的限制

`HashMap `和 `Hashtable` 都是 Java 集合框架中的重要组件，用于存储键值对。但它们在处理 `null` 键和值时有所不同。`Hashtable `是一个较早的哈希表安全实现，它不允许 `null` 键或值。如果尝试将 `null` 键或值插入 `Hashtable`，它会抛出 `NullPointerException`。

`HashMap `是 `Hashtable` 的一个更现代的替代品，它在设计时考虑到了更多的用例。其中一个明显的改进是允许 `null` 键和值。这种设计选择为开发者提供了更大的灵活性，因为在某些应用场景中，`null` 可能是一个有效的或有意义的键或值。

🤔 **为什么  null 键存储在第一个位置？**

在 `HashMap` 中，键的哈希值用于确定其在内部数组中的位置。但是，`null` 没有真正的哈希值。为了简化设计和处理，Java 的设计者决定将 `null` 键的哈希值定义为 0。由于数组的索引是从 0 开始的，这意味着 `null` 键总是存储在哈希表的第一个位置。

与 `null` 键类似，`HashMap` 也允许 `null` 值。但值的哈希值不用于确定其位置，因为只有键的哈希值用于这个目的。因此，`null `值的处理方式与其他非 `null` 值没有太大区别。

将 `null` 键存储在固定位置可以简化 `HashMap` 的某些操作。例如，当检查一个键是否存在于 `HashMap` 中时，如果该键是 `null`，那么只需要检查数组的第一个位置。这避免了不必要的哈希计算和其他检查。

我们通过具体源码来看看处理关键点：

1. 在向 hashMap 添加一个元素时，会先根据键计算哈希值：

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-091404.png)

2. 在具体计算中，通过一个三目运算符检查键是否为 null，如果为 null，则直接返回 0。这意味着所有 null 键都会被放在哈希表的同一个位置（即数组的第一个位置）

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-091505.png)

3. hash 值为 0，那么  `(n - 1) & hash` 必然也为 0，最终键为 null 的数据将被存储在第一个桶中（数组索引为 0）：

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-091825.png)

4. 当再次插入 null 键时，会检查到给定的键已经存在于 HashMap 中，那么其值将被新值替换（除非 onlyIfAbsent 为 true 并且当前值不为 null）。具体来说就是首先检查哈希值是否相同（这一步都为 0），然后检查键（相同）是否相同。如果两个键都为 `null`，它们被认为是相同的。如果一个键为 `null` 而另一个键不为 `null`，它们被认为是不同的。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-092832.png)

> `HashMap`不对值进行任何特殊处理。可以有多个 `null` 值，因为值的`null`状态不影响哈希表的结构或功能。在`putVal`方法中，新值简单地替换了旧值，不论新值或旧值是否为`null`。

### 2.7 HashMap 的插入无序性

`HashMap`不保证元素的顺序，这是由其内部结构和工作原理决定的。相信不用说你大概也能想到了。下面简单指点一二：

1. **基于哈希值的存储**：

   当插入一个新的键值对时，`HashMap`首先计算键的哈希值。这个哈希值决定了键值对在内部数组（称为`table`）中的位置。由于哈希函数的性质，不同的键可能会有相同的哈希值，这称为哈希冲突。为了解决这种冲突，`HashMap`使用链表或红黑树（在链表长度超过一定阈值时）来存储具有相同哈希值的元素。由于这种基于哈希值的存储方式，元素的物理存储顺序与插入顺序可能不同。

2. **动态扩容**：

   当`HashMap`中的元素数量超过其容量与负载因子的乘积（称为`threshold`）时，`HashMap`会进行扩容。扩容意味着创建一个新的、更大的内部数组，并将旧数组中的所有元素重新放入新数组。在这个过程中，元素的位置可能会改变，因为它们的位置是基于数组的大小和哈希值计算的。

3. **不维护插入顺序的数据结构**：

   `HashMap`的内部数据结构（数组、链表、红黑树）都不维护元素的插入顺序。如果需要维护插入顺序，那么`HashMap`的插入、删除和查找操作的时间复杂度可能会增加。

4. **设计目标**：

   `HashMap`的主要设计目标是提供快速的插入、删除和查找操作，而不是维护元素的顺序。如果需要保持插入顺序，可以使用`LinkedHashMap`，它在`HashMap`的基础上增加了指向前一个和后一个元素的链接，从而维护了插入顺序。

## 3.HashMap 的性能如何？

先看 JDK 官方说明：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-042935.png)

> 📖 大致翻译：
>
> 这种实现为基本操作（如 `get` 和 `put`）提供了近乎恒定的执行时间，前提是哈希函数能够在各个桶之间均匀地分布元素。遍历集合视图的时间与 `HashMap` 实例的 “容量”（桶的数量）和其大小（键值对的数量）成正比。因此，如果遍历性能很重要，那么初始容量不应设置得太大，同时加载因子也不应设置得太低。

`HashMap`的性能在很大程度上取决于哈希函数的质量。理想的哈希函数应该将键均匀地分布在所有的桶中，这样每个桶中的元素数量就会大致相同。如果哈希函数的质量不好，某些桶可能会有很多元素，而其他桶可能只有很少或没有元素。这种情况称为哈希碰撞。当一个桶中的元素数量过多时，查找、插入和删除操作的性能就会下降，因为它们需要在链表或红黑树中进行。

`HashMap`的容量是其内部数组（桶）的数量。当我们插入新的键值对时，`HashMap`会使用哈希函数计算键的哈希值，然后使用这个哈希值来确定键值对应该存储在哪个桶中。如果容量太小，会有很多哈希碰撞，这会降低性能。但如果容量太大，那么内存使用率会降低，因为很多桶可能都是空的。

加载因子是一个测量 `HashMap` 满载程度的指标。它是 `HashMap` 中元素数量与容量的比值。当 `HashMap` 的大小超过其容量与加载因子的乘积时，`HashMap` 会进行扩容。扩容操作会创建一个新的、更大的桶数组，并将旧数组中的所有元素重新放入新数组。如果加载因子太低，那么 `HashMap` 会频繁地进行扩容，这会浪费时间和空间。但如果加载因子太高，那么哈希碰撞的可能性就会增加，这会降低性能。

遍历 `HashMap` 的性能取决于其容量和大小。如果容量太大，那么遍历操作就会浪费时间，因为它需要遍历很多空的桶。如果遍历性能很重要，那么应该选择一个适中的初始容量，并设置一个合适的加载因子。

<hr/>

### 3.1 get(Object key)

以 `HashMap` 的 `get(Object key)` 方法为例。这个方法的主要目的是根据给定的键来检索对应的值。它首先计算键的哈希值，然后使用`getNode`方法来查找对应的节点。如果找到了节点，它就返回节点的值；否则，返回`null`。

```java
public V get(Object key) {
    Node<K,V> e;
    // 计算键的哈希值，使用 getNode 方法来查找对应的节点
   // 如果找到了节点，它就返回节点的值；否则，返回 null
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    // 检查哈希表是否已初始化并且长度大于 0
    if ((tab = table) != null && (n = tab.length) > 0 &&
        // 计算键应该存储在哪个桶中
        (first = tab[(n - 1) & hash]) != null) {
        // 检查桶的第一个节点是否与给定的键匹配
        if (first.hash == hash && 
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        // 如果第一个节点不匹配，检查是否有其他节点
        if ((e = first.next) != null) {
            // 如果节点是 TreeNode （红黑树）类型，使用红黑树查找
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            // 否则，遍历链表查找匹配的节点
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    // 如果没有找到匹配的节点，返回 null
    return null;
}
```

✏️ 查找流程：

`HashMap`的`get`方法首先计算给定键的哈希值，然后使用这个哈希值来确定键应该存储在哪个桶中。然后，它检查桶的第一个节点是否与给定的键匹配。如果不匹配，它会检查桶中是否有其他节点。如果桶中的节点是 `TreeNode` 类型，它会使用红黑树查找；否则，它会遍历链表查找。如果找到了匹配的节点，它就返回节点的值；否则，返回 `null`。

### 3.2 put(K key, V value)

HashMap 添加元素的 API 中有且仅有一个 `put(K key, V value)` 是公共的，内部还使用了一个 `putVal` 进行具体的插入（或更新）逻辑：

```java
public V put(K key, V value) {
    // 主要的 put 操作，其中 hash(key) 计算键的哈希值
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent, boolean evict) {
    Node<K,V>[] tab; Node<K,V> p; int n, i;
  
    // 检查哈希表是否已初始化，如果没有，则进行初始化
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
  
    // 计算键应该存储在哪个桶中，并检查该桶是否为空
    if ((p = tab[i = (n - 1) & hash]) == null)
        // 如果桶为空，创建一个新节点并放入桶中
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
      
        // 检查桶的第一个节点是否与给定的键匹配
        if (p.hash == hash && 
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
      
        // 如果节点是 TreeNode 类型，使用红黑树插入
        else if (p instanceof TreeNode)
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
            // 否则，遍历链表查找匹配的节点或插入位置
            for (int binCount = 0; ; ++binCount) {
                if ((e = p.next) == null) {
                    p.next = newNode(hash, key, value, null);
                  
                    // 如果链表长度超过阈值，转换为红黑树
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        treeifyBin(tab, hash);
                    break;
                }
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                p = e;
            }
        }
      
        // 如果找到了匹配的节点，更新其值
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
  
    // 修改计数器增加
    ++modCount;
  
    // 如果大小超过阈值，进行扩容
    if (++size > threshold)
        resize();
  
    afterNodeInsertion(evict);
    return null;
}
```

以下是 `put` 操作的详细步骤：

1. **计算哈希值**：首先，为给定的键计算哈希值。确保键值对在哈希表中的分布是均匀的。
2. **确定桶位置**：使用计算出的哈希值确定键值对应该存储在哪个桶中。
3. **初始化或扩容**：如果哈希表尚未初始化，或者其大小为 0，则首先进行初始化或扩容。
4. **检查桶的第一个节点**：查看计算出的桶位置是否已有节点存在。
   * 如果桶为空，直接在该位置创建一个新节点。
   * 如果桶的第一个节点与给定的键匹配，更新该节点的值。
5. **处理哈希冲突**：如果桶中已有节点，并且与给定的键不匹配，需要处理哈希冲突。
   * 如果桶中的节点是 `TreeNode `类型（即红黑树的节点），则在红黑树中插入或更新节点。
   * 如果桶中的节点是普通链表节点，则遍历链表，查找匹配的节点或插入位置。
     * 如果在链表中找到与给定键匹配的节点，更新该节点的值。
     * 如果链表中没有与给定键匹配的节点，将新节点添加到链表的末尾。
     * 如果链表的长度超过了预定的阈值（例如 8），则将链表转换为红黑树，以提高后续操作的效率。
6. **更新计数器和扩容**：每次添加新节点时，都会增加 `modCount`（修改计数器）。此外，如果哈希表的大小（即键值对的数量）超过了预定的阈值，哈希表会进行扩容，以确保其性能。
7. **返回值**：如果给定的键在哈希表中已有对应的值，`put`方法会返回旧值；否则，返回`null`。

## 4.HashMap 如何高效存储？

先看 JDK 官方说明：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-043026.png)

> 📖 大致翻译：
>
> 如果你计划在一个 `HashMap` 实例中存储大量的映射，最好一开始就为它设置一个足够大的容量。这样，映射的存储效率会比让它在需要时自动进行重新哈希来增长表格更高。需要注意的是，使用很多具有相同 `hashCode()` 的键会显著降低任何哈希表的性能。为了减轻这种影响，当键是可比较的（`Comparable`），`HashMap` 可能会使用键之间的比较顺序来帮助解决冲突。

假设你正在为一个大型电商网站设计一个购物车系统。每个用户都有一个购物车，购物车中可能包含数百个商品。为了快速查找、添加和删除商品，你决定使用 `HashMap` 来存储购物车中的商品，其中键是商品 ID，值是商品的详细信息。

* **问题1：** 如果你预计每个购物车平均会有 500 个商品，那么初始容量应该设置为多少？

  由于 `HashMap` 的默认负载因子是 0.75，这意味着当其 75% 的容量被使用时，它会自动扩容。为了避免频繁的扩容操作，你可以一开始就将其容量设置为大约 667（500/0.75）。（阈值 = 容量*负载因子）

* **问题2：** 如果大多数商品 ID 的哈希值都相同怎么办？

  这会导致大多数商品都存储在同一个桶中，从而导致哈希冲突。这样，`HashMap` 的性能会大大降低，因为它必须遍历链表或红黑树来查找、添加或删除商品。为了解决这个问题，你需要确保商品 ID 的哈希函数能够产生均匀分布的哈希值。

* **问题3：** 如果商品 ID 是可比较的（例如，它们是整数或字符串），`HashMap` 如何帮助解决冲突？

  当链表长度超过一定阈值时，`HashMap`会将链表转换为红黑树。红黑树是一种自平衡的二叉搜索树，它可以保证在最坏的情况下也有对数级的查找、插入和删除时间。由于商品 ID 是可比较的，`HashMap`可以使用它们的自然顺序来组织红黑树，从而提高性能。

📒 结论：当使用 `HashMap` 时，为了获得最佳性能，你应该确保：

1. 根据预期的元素数量正确设置初始容量。
2. 使用能够产生均匀分布哈希值的哈希函数。
3. 利用 `HashMap` 的红黑树特性来处理可比较的键。

## 5.HashMap 为什么不是同步的？

先看 JDK 官方说明：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-043047.png)

> 📖 大致翻译：
>
> 请注意，这个 `HashMap` 实现不是线程同步的。如果多个线程同时访问一个哈希映射，并且至少有一个线程在结构上修改了映射，那么你需要在外部对其进行同步。结构修改指的是增加或删除一个或多个映射的任何操作；仅仅更改已存在的键的关联值并不算作结构修改。通常，我们通过在封装映射的对象上进行同步来实现这一点。如果不存在这样的对象，你应该使用 `Collections.synchronizedMap` 方法来 “包装” 映射。最好在创建映射时就这样做，以防止对映射的意外非同步访问：
>
> ```java
> Map m = Collections.synchronizedMap(new HashMap(...));
> ```

`HashMap `在多线程环境下的线程不安全性主要体现在以下几个方面：

1. **扩容操作（resize）**：当多个线程同时发现 `HashMap` 需要扩容时，它们可能会并发地尝试扩容。这可能导致数据丢失或者链表形成环状结构，从而导致无限循环。
2. **链表转红黑树**：当链表长度超过 `TREEIFY_THRESHOLD` 时，`HashMap` 会尝试将链表转换为红黑树。如果多个线程同时尝试这个转换，可能会导致树的结构出现问题。
3. **并发插入**：当两个线程同时尝试在同一个桶中插入不同的节点时，一个线程的更改可能会被另一个线程覆盖，导致数据丢失。
4. **并发修改**：当一个线程正在读取一个键的值，而另一个线程正在修改该键的值时，第一个线程可能会看到不一致的数据。

结合 HashMap 的 `putVal()` 源码进行分析：

1. 在 `if ((tab = table) == null || (n = tab.length) == 0) n = (tab = resize()).length;`这一行，多个线程可能会同时认为数组需要初始化或扩容，从而导致多次初始化或扩容。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-101759.png)

2. 在 `tab[i] = newNode(hash, key, value, null);` 这一行，如果两个线程计算出相同的索引并尝试同时插入，一个线程的插入可能会被另一个线程覆盖。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-101948.png)

3. 在链表遍历的部分，两个线程可能会同时尝试在链表的末尾添加新的节点，导致其中一个线程的节点丢失。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-102153.png)

4. 在 `if (binCount >= TREEIFY_THRESHOLD - 1) treeifyBin(tab, hash);` 这一行，多个线程可能会同时尝试将链表转换为红黑树。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-102358.png)

5. 在 `++modCount; `和 `if (++size > threshold) resize();` 这两行，多个线程可能会导致 `modCount `和 `size` 的不正确更新。

   ![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-102430.png)

可见，由于`HashMap`的内部结构和算法，它在多线程环境下是不安全的。为了确保 `HashMap` 在多线程环境下的线程安全性，你可以使用 Java 的 `synchronized` 关键字进行外部同步。

```java
import java.util.HashMap;
import java.util.Map;

public class SynchronizedHashMap<K, V> {
    private final Map<K, V> map = new HashMap<>();

    public synchronized V get(K key) {
        return map.get(key);
    }

    public synchronized V put(K key, V value) {
        return map.put(key, value);
    }

    public synchronized boolean containsKey(K key) {
        return map.containsKey(key);
    }

    public synchronized V remove(K key) {
        return map.remove(key);
    }

    // ... 其他方法也应该进行同步 ...
}
```

上述示例中，我们创建了一个 `SynchronizedHashMap` 类，它内部包含一个 `HashMap`。我们为每个公开的方法添加了 `synchronized` 关键字，确保在任何时候只有一个线程可以访问 `map` 的方法。

> 这种方法确实增加了线程安全性，但可能会降低性能，因为每次只有一个线程可以访问`HashMap`。如果你需要更高的并发性能，可以考虑使用`ConcurrentHashMap`，它是为并发访问设计的。

## 6.HashMap 迭代器的 fail-fast

先看 JDK 官方说明：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-21-043105.png)

> 📖 大致翻译：
>
> 此类的 “集合视图方法” 返回的迭代器是快速失败的：如果在创建迭代器后的任何时候映射在结构上被修改（除非通过迭代器自己的 `remove` 方法），迭代器将抛出 `ConcurrentModificationException` 异常。这意味着，当面临并发修改时，迭代器会迅速且明确地失败，而不是在未来某个不确定的时间里冒着产生随机、不确定行为的风险。

✏️ **Fail-Fast 机制：**

"Fail-fast" 是一个编程术语，描述了当某个问题出现时，系统能迅速报告错误，而不是尝试继续执行并可能导致不确定的行为。在 Java 集合框架中，**fail-fast 机制主要是通过迭代器实现**的。当**多个线程同时修改一个集合**时，迭代器可以**快速检测到这种并发修改**并立即抛出 `ConcurrentModificationException` 异常。

🤔 **为什么需要 Fail-Fast 机制？**

这种机制的主要目的是为了提早发现问题。如果没有这种机制，可能会导致难以追踪的错误或不可预测的结果。通过 fail-fast，开发者可以立即知道有并发修改的问题，并可以采取相应的措施。

看如下示例代码：

```java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

public class FailFastExample {
    public static void main(String[] args) {
        Map<String, String> cityMap = new HashMap<>();
        cityMap.put("USA", "Washington DC");
        cityMap.put("Germany", "Berlin");
        cityMap.put("India", "New Delhi");

        // 获取 keys 的迭代器
        Iterator<String> iterator = cityMap.keySet().iterator();

        while (iterator.hasNext()) {
            System.out.println(cityMap.get(iterator.next()));

            // 这里我们尝试在迭代过程中修改 map，这将导致 ConcurrentModificationException
            cityMap.put("France", "Paris");
        }
    }
}
```

上述代码中，我们创建了一个 `HashMap` 并尝试在迭代其键的同时修改它。当我们尝试这样做时，迭代器检测到结构上的修改并立即抛出 `ConcurrentModificationException` 异常。

> ⚠️ 注意：fail-fast 机制不能保证在所有场景下都能检测到并发修改，它只能在最好努力的基础上进行检测。如果你需要一个真正线程安全的集合，应该考虑使用如 `ConcurrentHashMap` 这样的并发集合。

## 7.HashMap 扩容原理

最后看看 HashMap 的扩容细节。`HashMap` 的 `resize` 方法在 `HashMap` 的大小超过其阈值时被调用，以增加哈希表的容量并重新哈希现有的条目。

```java
final Node<K,V>[] resize() {
    // 旧的哈希表
    Node<K,V>[] oldTab = table;
    // 旧的容量
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    // 旧的阈值
    int oldThr = threshold;
    int newCap, newThr = 0;

    // 如果旧容量大于0
    if (oldCap > 0) {
        // 如果旧容量已经达到最大值（2^30）
        if (oldCap >= MAXIMUM_CAPACITY) {
            // 将阈值修改为 int 最大值（21亿左右）
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        // 否则，新容量是旧容量的两倍
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // 阈值也翻倍
    }
    // 如果旧的阈值大于0，但旧的容量为0
    else if (oldThr > 0) 
        newCap = oldThr; // 使用旧的阈值作为新的容量
    else { // 使用默认值
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }

    // 如果新的阈值为0
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;

    // 创建新的哈希表
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;

    // 如果旧的哈希表不为空
    if (oldTab != null) {
        // 遍历旧的哈希表
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
                oldTab[j] = null;
                // 如果节点没有后续节点
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                // 如果节点是 TreeNode 类型
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // 保持原有的顺序
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {
                        next = e.next;
                        // 根据节点的哈希值决定它应该放在新的哈希表的哪个位置
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

`HashMap` 的扩容过程可以总结为以下步骤：

1. **确定新的容量和阈值**：
   * 如果旧的哈希表容量大于 0，新的容量将是旧容量的**两倍**，除非旧容量已经达到最大值。
   * 如果旧的哈希表容量为 0，但阈值大于 0，新的容量将是旧的阈值。
   * 如果旧的哈希表容量和阈值都为 0，新的容量和阈值将设置为默认值。
   * 最后，基于新的容量和负载因子来计算新的阈值。
2. **创建新的哈希表**：基于新的容量创建一个新的哈希表。
3. **重新哈希旧的条目**：
   * 遍历旧的哈希表中的每个桶。
   * 对于每个桶中的每个节点，根据其哈希值和新的容量确定它在新的哈希表中的位置。
   * 如果节点是一个 `TreeNode`（红黑树的节点），则调用 `split` 方法来处理它。
   * 如果节点是一个普通节点，并且有多个节点在同一个桶中，那么需要保持它们（链表）的相对顺序不变。
4. **返回新的哈希表**：完成重新哈希后，返回新的哈希表。

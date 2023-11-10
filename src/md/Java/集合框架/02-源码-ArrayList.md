---
title: 02-源码-ArrayList
---
---
title: 02-源码-ArrayList
---

`ArrayList` 的底层是 `Object[]` 数组队列，相当于动态数组。与 Java 中的数组相比，它的容量能动态增长。在添加大量元素前，应用程序可以使用 `ensureCapacity `操作来增加 `ArrayList` 实例的容量。这可以减少递增式再分配的数量。

`ArrayList` 继承于 `AbstractList` ，实现了 `List`、 `RandomAccess`（随机访问）、 `Cloneable`（克隆）、 `java.io.Serializable`（序列化） 这些接口。、

```java
public class ArrayList<E> extends AbstractList<E>
        implements List<E>, RandomAccess, Cloneable, java.io.Serializable
{...}
```

* `List` : 表明它是一个列表，支持添加、删除、查找等操作，并且可以通过下标进行访问。
* `RandomAccess` ：这是一个标志接口，表明实现这个接口的 `List` 集合是支持 **快速随机访问** 的。在 `ArrayList` 中，我们即可以通过元素的序号快速获取元素对象，这就是快速随机访问。
* `Cloneable` ：表明它具有拷贝能力，可以进行深拷贝或浅拷贝操作。
* `Serializable` : 表明它可以进行序列化操作，也就是可以将对象转换为字节流进行持久化存储或网络传输。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-09-20-092511.png)

## 2.ArrayList 核心源码解读

以 JDK1.8为例，分析一下 `ArrayList` 的底层源码：

```java

```

## 3.ArrayList 扩容机制分析

### 3.1 从 ArrayList 的构造器入手

ArrayList 有三种方式来初始化，构造方法源码如下（JDK8）：

```java
public class ArrayList<E> extends AbstractList<E>  implements List<E>, RandomAccess, Cloneable, java.io.Serializable {
  
  // 默认初始容量大小为 10
  private static final int DEFAULT_CAPACITY = 10;
  
  // 空实例的共享空数组实例
  private static final Object[] EMPTY_ELEMENTDATA = {};
  
  // 默认大小的空实例的共享空数组实例（将其与 EMPTY_ELEMENTDATA 区分开来，以便知道添加第一个元素时要膨胀多少）
  private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
  
  /**
    *  默认构造函数，构造一个初始容量为 10 的空列表 (无参构造)
 	*/
  public ArrayList() {
        // 使用默认大小的空实例的共享空数组实例，此时数组大小为 0
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
  
   /**
    *  构造具有指定初始容量的空列表
 	*/
    public ArrayList(int initialCapacity) {
          // 如果初始容量大于 0，创建指定大小的数组
          if (initialCapacity > 0) {
              this.elementData = new Object[initialCapacity];
          } else if (initialCapacity == 0) { // 如果初始容量为 0，使用空实例的共享空数组实例
              this.elementData = EMPTY_ELEMENTDATA;
          } else { // 如果初始容量小于 0，抛出异常
              throw new IllegalArgumentException("Illegal Capacity: "+
                                                 initialCapacity);
          }
      }
  
     /**
      *  按照指定集合的迭代器返回的顺序，构造一个包含指定集合元素的列表
      */
    public ArrayList(Collection<? extends E> c) {
          // 将制定集合转为数组（如果集合为 null 这里会抛出 NullPointerException）
          Object[] a = c.toArray();
          // 如果不是空集合
          if ((size = a.length) != 0) {
              // 进行类型检查
              if (c.getClass() == ArrayList.class) {
                  elementData = a;
              } else { // 不是 ArrayList 类型则转为 ArrayList 类型再赋值
                  elementData = Arrays.copyOf(a, size, Object[].class);
              }
          } else { // 如果是空集合，则使用空实例的共享空数组实例
              // replace with empty array.
              elementData = EMPTY_ELEMENTDATA;
          }
      }
  	
    // ... ...
}
```

细心的你一定发现了：

**以无参数构造方法 ArrayList() 创建 ArrayList 实例时，实际上初始化赋值的是一个空数组（DEFAULTCAPACITY_EMPTY_ELEMENTDATA）。只有当我们第一次对该数组进行添加元素操作时才会真正分配内存，这种情况下数据将会扩容为默认初始容量大小 10（DEFAULT_CAPACITY）**。

> ⚠️ 注意：JDK 1.6 版本的无参构造函数是直接使用 DEFAULT_CAPACITY 创建大小为 10 的数组作为初始容量，而不是在首次添加元素时。

### 3.2 进一步分析 ArrayList 扩容机制

这里以 `ArrayList()` 无参构造函数创建的 `ArrayList` 实例为例进行分析。

首先先来看看 `add(E e)` 方法的源码：

```java
/**
 * 将指定的元素追加到此列表的末尾
 */
public boolean add(E e) {
    // 添加元素之前，先进行容量检查，以确定是否需要扩容
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    // 添加元素的数组末尾，其实就是基本的数组赋值操作
    elementData[size++] = e;
    return true;
}
```

> ⚠️ 注意：JDK 11 移除了 ensureCapacityInternal(int minCapacity) 和 ensureExplicitCapacity(int minCapacity) 方法。

先来看看 `ensureCapacityInternal(int minCapacity)` 方法源码：

```java
/**
 * 确保内部容量达到指定的最小容量（size + 1，即至少有一个空间存储需要添加的元素）
 */
private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

/**
 * 根据给定的最小容量和当前数组元素来计算所需容量
 */
private static int calculateCapacity(Object[] elementData, int minCapacity) {
    // 如果当前数组元素为空数组（初始情况），返回默认容量（10）和最小容量（size + 1）中的较大值作为所需容量
   // 这是考虑使用默认大小的空实例的共享空数组实例，第一次添加元素时扩容为默认容量 10（重要）
    if (elementData == DEFAULTCAPACITY_EMPTY_ELEMENTDATA) {
        return Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    // 否则直接返回最小容量
    return minCapacity;
}
```

再来看看 `ensureExplicitCapacity(int minCapacity)` 方法源码：

```java
/**
 * 判断是否需要扩容
 */
private void ensureExplicitCapacity(int minCapacity) {
    // 增加一次列表在结构上被修改的次数
    modCount++;

    // 判断当前数组容量是否足以存储 minCapacity 个元素
    if (minCapacity - elementData.length > 0)
        // 如果不够，则进行扩容到 minCapacity 大小
        grow(minCapacity);
}
```

OK，现在先分析一下：

* 当我们要 `add` 第 1 个元素到 `ArrayList` 时，`elementData.length` 为 0 （因为此时还是一个空的 list）。因为执行了 `ensureCapacityInternal()` 方法 ，所以 `minCapacity` 此时为 10。此时，`minCapacity - elementData.length > 0`成立，所以会进入 `grow(minCapacity)` 方法。
* 当 `add` 第 2 个元素时，`minCapacity` 为 2，此时 `elementData.length`(容量) 在添加第一个元素后扩容成 `10` 了。此时，`minCapacity - elementData.length > 0` 不成立，所以不会进入 （执行）`grow(minCapacity)` 方法。
* 添加第 3、4···到第 10 个元素时，依然不会执行 grow 方法，数组容量都为 10。

直到添加第 11 个元素，`minCapacity`(为 11) 比 `elementData.length`（为 10）要大，进入 `grow` 方法进行扩容。

现在继续来看 `grow(int minCapacity)` 方法源码：

```java
/**
 * 要分配的数组的最大大小
 */
private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

/**
 * ArrayList 扩容的核心方法
 */
private void grow(int minCapacity) {
    // 旧容量：此时的数组大小
    int oldCapacity = elementData.length;
    // 新容量：将 oldCapacity 右移一位，相当于 oldCapacity / 2（位运算的速度远快于除运算）
    // 最终的结果就是 oldCapacity + oldCapacity / 2 = 1.5 oldCapacity（即扩容为原来的 1.5 倍）
    int newCapacity = oldCapacity + (oldCapacity >> 1);
  
    // 检查新容量是否大于最小需要容量
    if (newCapacity - minCapacity < 0)
        // 如果还是小于最小需要容量，就把最小需要容量当作数组的新容量
        newCapacity = minCapacity;
  
    // 如果新容量大于 MAX_ARRAY_SIZE
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        // 比较 minCapacity 和 MAX_ARRAY_SIZE
        // 如果 minCapacity 大于最大容量，则新容量则为 Integer.MAX_VALUE。
        // 否则，新容量大小则为 MAX_ARRAY_SIZE 即为 Integer.MAX_VALUE - 8
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    elementData = Arrays.copyOf(elementData, newCapacity);
}
```

> 1. `newCapacity = oldCapacity + (oldCapacity >> 1)`  所以 ArrayList **每次扩容之后容量都会变为原来的 1.5 倍左右**（oldCapacity 为偶数就是 1.5 倍，否则是 1.5 倍左右）。这是因为**奇偶不同**，比如：10 + 10/2  = 15，但是 33 + 33/2 = 49。可见，如果是奇数的话会丢掉小数。
> 2. **">>"（移位运算符）**：>>1 右移一位相当于除 2，右移 n 位相当于除以 2 的 n 次方。这里 oldCapacity 明显右移了 1 位所以相当于 oldCapacity /2。对于大数据的 2 进制运算，位移运算符比那些普通运算符的运算要快很多，因为程序仅仅移动一下而已，不去计算，这样提高了效率，节省了资源。

我们再来通过例子探究一下 `grow()` 方法：

* 当 `add` 第 1 个元素时，`oldCapacity` 为 0，经比较后第一个 if 判断成立，`newCapacity = minCapacity`(为 10)。但是第二个 if 判断不会成立，即 `newCapacity` 不比 `MAX_ARRAY_SIZE` 大，则不会进入 `hugeCapacity` 方法。数组容量为 10，`add` 方法中 return true，size 增为 1。
* 当 `add` 第 11 个元素进入 `grow` 方法时，`newCapacity` 为 15，比 `minCapacity`（为 11）大，第一个 if 判断不成立。新容量没有大于数组最大 size，不会进入 `hugeCapacity` 方法。数组容量扩为 15，add 方法中 return true，size 增为 11。
* 以此类推······

> 这里补充一点比较重要，但是容易被忽视掉的知识点：
>
> 1. Java 中的 `length` 属性是针对数组说的，比如说你声明了一个数组，想知道这个数组的长度则用到了 `length` 这个属性。
> 2. Java 中的 `length()` 方法是针对字符串说的，如果想看这个字符串的长度则用到 `length()` 这个方法。
> 3. Java 中的 `size()` 方法是针对泛型集合说的，如果想看这个泛型有多少个元素，就调用此方法来查看。

从上面 `grow()` 方法源码我们知道：如果新容量大于 `MAX_ARRAY_SIZE`，进入(执行) `hugeCapacity()` 方法来比较 `minCapacity` 和 `MAX_ARRAY_SIZE`。

* 如果 `minCapacity` 大于最大容量，则新容量则为`Integer.MAX_VALUE`；
* 否则，新容量大小则为 `MAX_ARRAY_SIZE` 即为 `Integer.MAX_VALUE - 8`。

最后，再来看看 `hugeCapacity()` 方法：

```java
private static int hugeCapacity(int minCapacity) {
    // minCapacity 小于 0 抛出内存溢出异常
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
  
    // 对 minCapacity 和 MAX_ARRAY_SIZE 进行比较
    // 若 minCapacity 大，将 Integer.MAX_VALUE 作为新数组的大小
    // 若 MAX_ARRAY_SIZE 大，将 MAX_ARRAY_SIZE 作为新数组的大小（MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8）
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
        MAX_ARRAY_SIZE;
}
```

### 3.3 System.arraycopy() 和 Arrays.copeof()

在源码中不难发现，`ArrayList` 中大量调用了 `System.arraycopy()` 和 `Arrays.copeof()` 这两个方法。比如，我们上面讲的扩容操作以及 `add(int index, E element)`、`toArray()` 等方法中都用到了该方法。

`System.arraycopy()` 是一个 native 方法，源码如下：

```java
/**
 * 复制数组
 * @param src 源数组
 * @param srcPos 源数组中的起始位置
 * @param dest 目标数组
 * @param destPos 目标数组中的起始位置
 * @param length 要复制的数组元素的数量
 */
public static native void arraycopy(Object src,  int  srcPos, Object dest, int destPos, int length);
```

ArrayList 中的应用场景：

```java
/**
 * 在此列表中的指定位置插入指定的元素
 */
public void add(int index, E element) {
    // 对 index 进行数组下标界限检查
    rangeCheckForAdd(index);

    // 保证 capacity 足够大
    ensureCapacityInternal(size + 1);  // Increments modCount!!
  
    // 从 index 开始之后的所有成员后移一个位置
    System.arraycopy(elementData, index, elementData, index + 1, size - index);
  
    // 将 element 插入 index 位置
    elementData[index] = element;
  
    // size 加 1
    size++;
}
```

再来看看 `Arrays.copyOf()` 方法：

```java
public static byte[] copyOf(byte[] original, int newLength) {
    // 申请一个新的字节数组
    byte[] copy = new byte[newLength];
    // 调用 System.arraycopy() 将源数组中的数据进行拷贝，并返回新的数组
    System.arraycopy(original, 0, copy, 0,
                     Math.min(original.length, newLength));
    return copy;
}
```

ArrayList 中的应用场景：

```java
/**
 * 以正确的顺序返回一个包含此列表中所有元素的数组（从第一个到最后一个元素），返回的数组的运行时类型是指定数组的运行时类型。
 */
public Object[] toArray() {
    return Arrays.copyOf(elementData, size);
}
```

> System.arraycopy() 和 Arrays.copeof() 的联系与区别：
>
> * **联系**：copyOf()内部实际调用了 System.arraycopy() 方法。
> * **区别**：arraycopy() 需要目标数组，将原数组拷贝到你自己定义的数组里或者原数组，而且可以选择拷贝的起点和长度以及放入新数组中的位置。copyOf() 是系统自动在内部新建一个数组，并返回该数组。

### 3.4 ensureCapacity()

ArrayList 源码中有一个 ensureCapacity(int minCapacity) 方法不知道大家注意到没有，这个方法 ArrayList 内部没有被调用过，所以很显然是提供给用户调用的。那么这个方法有什么作用呢？

源码如下：

```java
/**
 * 如有必要，增加此 ArrayList 实例的容量，以确保它至少可以容纳由 minCapacity参数指定的元素数
 * @param   minCapacity   所需的最小容量
 */
public void ensureCapacity(int minCapacity) {
    int minExpand = (elementData != DEFAULTCAPACITY_EMPTY_ELEMENTDATA)
        // any size if not default element table
        ? 0
        // larger than default for default empty table. It's already
        // supposed to be at default size.
        : DEFAULT_CAPACITY;

    if (minCapacity > minExpand) {
        ensureExplicitCapacity(minCapacity);
    }
}
```

理论上来说，最好在向 `ArrayList` 添加大量元素之前用 `ensureCapacity` 方法，以减少增量重新分配的次数。

我们通过下面的代码实际测试以下这个方法的效果：

```java
public class EnsureCapacityTest {
	public static void main(String[] args) {
		ArrayList<Object> list = new ArrayList<Object>();
		final int N = 10000000;
    
		long startTime = System.currentTimeMillis();
		for (int i = 0; i < N; i++) {
			list.add(i);
		}
		long endTime = System.currentTimeMillis();
    
		System.out.println("使用 ensureCapacity 方法前："+(endTime - startTime)); // 使用 ensureCapacity 方法前：2158
	}
}
```

手动调用 ensureCapacity 提前扩容：

```java
public class EnsureCapacityTest {
    public static void main(String[] args) {
        ArrayList<Object> list = new ArrayList<Object>();
        final int N = 10000000;
      
        long startTime1 = System.currentTimeMillis();
        list.ensureCapacity(N);
        for (int i = 0; i < N; i++) {
            list.add(i);
        }
        long endTime1 = System.currentTimeMillis();
      
        System.out.println("使用 ensureCapacity 方法后："+(endTime1 - startTime1));  // 使用 ensureCapacity方法后：1773
    }
}
```

通过运行结果，我们可以看出向 `ArrayList` 添加大量元素之前使用`ensureCapacity` 方法可以提升性能。不过，这个性能差距几乎可以忽略不计。而且，实际项目根本也不可能往 `ArrayList` 里面添加这么多元素。


---
title: 分布式算法-Snowflake_ID
---
## 1.概述
雪花 ID，也称为雪花（Snowflakes），是分布式计算中使用的一种唯一标识符（唯一 ID）。Twitter 创建了这种格式，主要是为了满足其对快速生成大量唯一 ID 的需求，这些 ID 用于其数亿用户发布的推文。由于其高效、可扩展的特性，其他大型技术公司和平台，如 Discord 和 Instagram，也采纳了这种方法。Mastodon，一个开源的社交网络平台，虽然采用了类似的思路，但对原始的雪花算法进行了一些修改以满足其特定的需求。
## 2.Snowflake ID 格式
雪花算法生成的 ID 是一个 64 位的二进制数字，但为了适应有符号整数，实际上只使用了 63 位，第一位作为符号位，如 0（表示正数）。这 64 位二进制数中：

- **第一部分（1 bit）：符号位，值为 0 表示正数。**
- **第二部分（41 bit）：随后的 41 位是一个时间戳，表示自选定的纪元（epoch）以来的毫秒数。**

我们知道一个位（1 bit）可以表示的数目是 0 或 1 两个二进制数，所以 41 位可以表示的数目是 241 = 2,199,023,255,552（两万亿）这就是可以表示的总毫秒数。如果将其转换为年 2,199,023,255,552 毫秒 ÷ 1,000（转换为秒）÷ 60（转换为分钟）÷ 60（转换为小时）÷ 24（转换为天）÷ 365（转换为年）≈ 69.7年。所以，41 位时间戳可以表示大约 69.7 年。

- **第三部分（10 bit）：接下来的 10 位代表机器 ID，这样可以防止 ID 冲突。**

10 位机器 ID 可以表示的数目是 210 = 1,024，这意味着可以有 1,024 台不同的机器或服务器。也就是说，我们可以为每台机器或每个服务分配一个唯一的 ID。这样，即使两台机器在同一毫秒内生成 ID（时间戳相同），由于它们的机器 ID 不同，所以整个雪花 ID 仍然是唯一的，从而防止 ID 冲突。

在某些实现中，我们可能不熟不了如此多的服务器，我们可以将 10 位机器 ID 可以进一步细分为 5 位数据中心 ID（IDC）和 5 位机器 ID。这样做的目的是为了支持跨数据中心的部署。5 位可以表示的数目是 25 = 32，所以可以有 32 个不同的 IDC，每个 IDC 下可以有 25 = 32 台不同的机器。

- **第四部分（12 bit）：再后面的 12 位代表每台机器在同一毫秒内的序列号，这允许在同一毫秒内创建多个雪花 ID。（自增序列）**

这是指在同一毫秒内，如果一台机器需要生成多个 ID，那么这些 ID 的时间戳部分是相同的。为了确保这些 ID 仍然是唯一的，我们需要一个序列号来区分它们。例如，如果在同一毫秒内，一台机器需要生成 3 个 ID，那么这 3 个 ID 的时间戳部分是相同的，但它们的序列号分别是 0、1 和 2。这样，即使在高并发的情况下，我们也可以确保在同一毫秒内生成的所有 ID 都是唯一的。

212 = 4,096 这意味着在一毫秒内一个数据中心（IDC）的一台机器上一共可产生 4096 个有序且不重复的 ID。但是实际情况下，我们的数据中心（IDC）和机器数肯定不止一个（一半是集群部署），所以一毫秒内能生成的有序 ID 数是翻倍的。

最终的雪花数字通常以十进制形式序列化，例如：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-08-31-040015.png)

> [!TIP]
>
> 由于雪花 ID 是基于它们的创建时间来生成的，所以它们是按时间可排序的。此外，还可以从雪花 ID 中计算出它的创建时间。这可以用来获取在特定日期之前或之后创建的雪花 ID（及其关联的对象）。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-08-31-040031.png)

上面这个图可能比较抽象，可以结合下图进行理解：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-08-31-040051.png)

举个例子加深理解：

2022 年 6 月，@Wikipedia 发出的一条推文具有雪花 ID 1541815603606036480。这个数字可以转换为二进制形式如下，其中管道符号（`｜`)表示 ID 的三个部分：

```java
00 0001 0101 0110 0101 1010 0001 0001 1110 0110 0010 00|01 0111 1010|0000 0000 0000
```

- 前 41 位（加上最高位的一个零位就是 42 位）转换为十进制为 367597485448。将这个值加上 Twitter 的纪元值 1288834974657（以 Unix 时间毫秒为单位），得到的 Unix 时间为 1656432460.105，即 2022 年 6 月 28 日 16:07:40.105 UTC。
- 中间的 10 位 01 0111 1010 是机器 ID。
- 最后的 12 位解码为全零，这意味着这条推文是该机器在给定的毫秒内处理的第一条推文。

## 3.算法实现
下面是 Twitter Snowflake 的官方仓库：

[GitHub - twitter-archive/snowflake at b3f6a3c6ca8e1b6847baa6ff42bf72201e2c2231](https://github.com/twitter-archive/snowflake/tree/b3f6a3c6ca8e1b6847baa6ff42bf72201e2c2231)

Twitter 官方用 Scala 实现了 Snowflake ID，感兴趣的可以自行下载源码琢磨：

[Release snowflake-2010 · twitter-archive/snowflake](https://github.com/twitter-archive/snowflake/releases/tag/snowflake-2010)

下面是基于 Java 语言的实现，这个实现是线程安全的，并且可以在分布式系统中使用，只要确保每个节点有一个唯一的 `workerId` 和 `dataCenterId` 组合：

```java
/**
 * Twitter 的分布式自增 ID 雪花算法 snowflake (Java 版)
 */
public class SnowflakeIdGenerator {

    // 开始时间截 (2015-01-01)
    private final long START_TIMESTAMP = 1420041600000L;

    // 机器 ID 所占位数
    private final long WORKER_ID_BITS = 5L;

    // 支持的最大机器 ID，结果是 31
    // -1L ^ (-1L << WORKER_ID_BITS) 和 ~(-1L << WORKER_ID_BITS) 都可以得到 31
    private final long MAX_WORKER_ID = ~(-1L << WORKER_ID_BITS);

    // 数据标识id（IDC）所占的位数
    private final long DATA_CENTER_ID_BITS = 5L;

    // 支持的最大数据标识id（IDC）, 结果是 31
    // -1L ^ (-1L << DATA_CENTER_ID_BITS) 和 ~(-1L << DATA_CENTER_ID_BITS) 都可以得到 31
    private final long MAX_DATA_CENTER_ID = ~(-1L << DATA_CENTER_ID_BITS);

    // 自增序列所占位数
    private final long SEQUENCE_BITS = 12L;

    // 自增序列的最大值（4095）
    // ~(-1L << SEQUENCE_BITS) 和 -1L ^ (-1L << SEQUENCE_BITS) 都可以得到 4095
    private final long SEQUENCE_MASK = ~(-1L << SEQUENCE_BITS);

    // 机器 ID 向左移 12 位
    private final long WORKER_ID_SHIFT = SEQUENCE_BITS;

    // 数据标识id（IDC）向左移 17 位(12+5)
    private final long DATA_CENTER_ID_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS;

    // 时间截向左移 22 位(5+5+12)
    private final long TIMESTAMP_LEFT_SHIFT = SEQUENCE_BITS + WORKER_ID_BITS + DATA_CENTER_ID_BITS;

    // 分布式系统中的机器 ID
    private long workerId;

    // 分布式系统中的数据标识id（IDC）
    private long dataCenterId;

    // 当前自增序列值
    private long sequence = 0L;

    // 上次生成 ID 的时间截
    private long lastTimestamp = -1L;

    /**
     * 构造函数
     * @param workerId 分布式系统中的机器 ID
     * @param dataCenterId 分布式系统中的数据标识id（IDC）
     */
    public SnowflakeIdGenerator(long workerId, long dataCenterId) {
        // 检查机器 ID 和数据标识id（IDC）是否超出范围
        if (workerId > MAX_WORKER_ID || workerId < 0){
            throw new IllegalArgumentException(String.format("workerId 不能大于 %d 或小于 0", MAX_WORKER_ID));
        }
        if (dataCenterId > MAX_DATA_CENTER_ID || dataCenterId < 0){
            throw new IllegalArgumentException(String.format("dataCenterId 不能大于 %d 或小于 0", MAX_DATA_CENTER_ID));
        }
        // 检查通过，赋值
        this.workerId = workerId;
        this.dataCenterId = dataCenterId;
    }

    /**
     * 获取下一个 ID (线程安全）
     * @return Snowflake Id
     */
    public synchronized long nextId(){
        // 获取当前时间戳
        long timestamp = timeGen();

        // 如果当前时间戳小于上次时间戳，说明系统时钟回退过，抛出异常
        if (timestamp < lastTimestamp){
            throw new RuntimeException(String.format("时钟回退过，拒绝生成 id，上次时间戳 %d，当前时间戳 %d", lastTimestamp, timestamp));
        }

        // 如果当前时间戳与上次时间戳相同，说明在同一毫秒内
        if (timestamp == lastTimestamp){
            // sequence 自增，与 SEQUENCE_MASK 进行与运算，去掉高位，只保留低位保证序列号不会超出范围
            sequence = (sequence + 1) & SEQUENCE_MASK;
            // 自增后的 sequence 为 0，说明当前毫秒内的序列号用完了，等待下一毫秒
            if (sequence == 0){
                // 获取下一毫秒时间戳
                timestamp = tilNextMillis(lastTimestamp);
            }
        }else{
            // 如果当前时间戳与上次时间戳不同，说明已经是下一毫秒了
            // sequence 重置为 0
            sequence = 0L;
        }

        // 将上次时间戳更新为当前时间戳
        lastTimestamp = timestamp;

        // 最后按照规则拼出 ID
        // 1. 时间戳部分
        // 2. 数据标识id（IDC）部分
        // 3. 机器 ID 部分
        // 4. 自增序列部分
        return ((timestamp - START_TIMESTAMP) << TIMESTAMP_LEFT_SHIFT) |
                (dataCenterId << DATA_CENTER_ID_SHIFT) |
                (workerId << WORKER_ID_SHIFT) |
                sequence;
    }

    /**
     * 阻塞到下一毫秒，直到获得新的时间戳
     * @param lastTimestamp 上次生成 ID 的时间截
     * @return 当前时间戳
     */
    protected long tilNextMillis(long lastTimestamp){
        // 获取当前时间戳
        long timestamp = timeGen();
        // 如果当前时间戳小于等于上次时间戳，说明还在当前毫秒内，继续获取
        while (timestamp <= lastTimestamp){
            timestamp = timeGen();
        }
        return timestamp;
    }

    /**
     * 获取当前时间戳
     * @return 当前时间戳
     */
    protected long timeGen(){
        return System.currentTimeMillis();
    }
}
```
下面进行生成测试：
```java
public static void main(String[] args) {
    // 确保 workerId 和 datacenterId 在 0-31 之间且在每个节点上都是唯一的
    SnowflakeIdGenerator idGenerator = new SnowflakeIdGenerator(1, 1);
    // 生成 1000 个分布式 ID
    for (int i = 0; i < 1000; i++) {
        long id = idGenerator.nextId();
        System.out.println(id);
    }
}
```
执行结果如下：
```java
1144657122886291456
1144657122886291457
1144657122886291458
1144657122886291459
1144657122886291460
1144657122886291461
1144657122886291462
... ...
```
## 4.使用注意
雪花算法是一种在分布式系统中生成唯一 ID 的算法，它结合了时间戳、机器 ID、数据中心 ID 和序列号等多个部分来确保每次生成的 ID 都是唯一的。但是，这种算法也有其使用中的一些注意事项和潜在的问题。

1. **机器时钟的依赖性：**

雪花算法高度依赖于机器的系统时钟。ID 的生成部分来自于当前的时间戳，这意味着如果机器的时钟出现问题，那么 ID 的生成也可能会受到影响。

2. **时钟回拨的问题：**

如果机器的时钟被回拨，那么算法可能会生成重复的 ID 或者完全无法生成 ID。这是因为算法使用的时间戳是基于机器的当前时间，如果这个时间突然变小（例如，由于时钟同步或其他原因），那么算法可能会尝试使用一个已经使用过的时间戳来生成 ID。

一旦发生时钟回拨，算法可能会在一段时间内无法正常工作，直到时钟 “追上” 回拨前的时间。这可能会导致服务在这段时间内不可用。

3. **官方的处理方式：**

Twitter 官方实现并没有为时钟回拨问题提供一个完整的解决方案。相反，当检测到时钟回拨时，它只是简单地抛出一个错误。这意味着在实际使用中，开发者需要自己处理这种情况，或者确保机器的时钟不会被回拨。

4. **其他的改进方案：**

由于雪花算法的这些问题，很多公司和开发者都提出了基于雪花算法的改进方案。例如，百度的 UidGenerator 和美团的 Leaf 系统都是基于雪花算法的，但它们在原始算法的基础上进行了一些修改和优化，以规避上述的问题。

---

TIP：参考资料

- [https://en.wikipedia.org/wiki/Snowflake_ID](https://en.wikipedia.org/wiki/Snowflake_ID)
- [https://www.pdai.tech/md/algorithm/alg-domain-id-snowflake.html](https://www.pdai.tech/md/algorithm/alg-domain-id-snowflake.html)
- [https://github.com/twitter-archive/snowflake/releases/tag/snowflake-2010](https://github.com/twitter-archive/snowflake/releases/tag/snowflake-2010)

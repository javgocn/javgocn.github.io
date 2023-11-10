---
title: 02-读Excel
---
## 1.最简单的读

### 1.1 最简单的读的 excel 示例

准备一张用于测试的 Excel 表如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png)

### 1.2 最简单的读的对象

创建一个 Java 实体对数据表进行抽象，读取到的每一行数据我们都应该有一个对应的 Java 实体对象与之对应：

```java
package cn.javgo.springboot.easyexcel.read.repository.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * @author javgo.cn
 * @date 2023/10/26
 */
@Getter
@Setter
@EqualsAndHashCode
public class DemoData {

  /**
   * 字符串标题
   */
  private String string;

  /**
   * 日期标题
   */
  private Date date;

  /**
   * 数字标题
   */
  private Double doubleData;
}
```

### 1.3 最简单的读的监听器

EasyExcel 是通过监听器回调来进行读操作，因此我们只需要实现 `com.alibaba.excel.read.listener.ReadListener` 并重写提供的方法即可：

```java
package cn.javgo.springboot.easyexcel.read.listener;

import cn.javgo.springboot.easyexcel.read.dao.DemoDAO;
import cn.javgo.springboot.easyexcel.read.repository.entity.DemoData;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.util.ListUtils;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 * <p>
 * 注意：DemoDataListener 不能被 Spring 管理，每次读取 Excel 都需要 new 一个新的对象，如果有需要被 Spring 管理的对象，可以通过构造
 * 方法传进来
 *
 * @author javgo.cn
 * @date 2023/10/26
 */
@Slf4j
public class DemoDataListener implements ReadListener<DemoData> {

  /**
   * 批量处理的数据量大小：每隔 5 条存储数据库，实际使用中可以 100 条，然后清理 list ，方便内存回收
   */
  private static final int BATCH_COUNT = 100;

  /**
   * 用于缓存数据的 list
   */
  private List<DemoData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

  /**
   * 如果需要进行数据库操作，可以在构造方法中初始化 DemoDAO，如果不用存储数据库，可以去掉这个属性（也可以是一个 Service）
   */
  private DemoDAO demoDAO;

  public DemoDataListener(){
    // 这里只是 Demo，所以随便 new 一个 DAO 出来，实际使用中请使用下面的有参构造方法
    this.demoDAO = new DemoDAO();
  }

  /**
   * 如果使用了 Spring 管理 bean，可以通过构造方法传进来(即每次创建 Listener 都需要把 Spring 管理的 bean 传进来)
   * @param demoDAO 用于数据库操作的 DAO
   */
  public DemoDataListener(DemoDAO demoDAO){
    this.demoDAO = demoDAO;
  }

  /**
   * 每一条数据解析都会来调用该方法
   * @param demoData 每一条数据的对象，也就是 Excel 中的一行值。（类似 {@link AnalysisContext#readRowHolder()}
   * @param analysisContext 解析上下文
   */
  @Override
  public void invoke(DemoData demoData, AnalysisContext analysisContext) {
    log.info("解析到一条数据:{}", JSON.toJSONString(demoData));

    // 将解析的数据存储到 list，方便批量处理，或者后续自己业务逻辑的处理
    cachedDataList.add(demoData);

    // 如果 list 达到了 BATCH_COUNT，就进行一次数据库插入操作，防止数据几万条数据在内存，容易 OOM
    if (cachedDataList.size() >= BATCH_COUNT){
      saveData();
      // 存储完成清理 list
      cachedDataList.clear();
    }
  }

  /**
   * Excel 的所有数据解析完成后会调用该方法
   * @param analysisContext 解析上下文
   */
  @Override
  public void doAfterAllAnalysed(AnalysisContext analysisContext) {
    // 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）
    saveData();
    log.info("所有数据解析完成！");
  }

  /**
   * 这里会一次性把缓存的数据全部拿出来，进行后续的数据库插入操作
   */
  private void saveData(){
    log.info("{} 条数据，开始存储数据库！", cachedDataList.size());
    demoDAO.save(cachedDataList);
    log.info("存储数据库成功！");
  }
}
```

### 1.4 持久层

上面涉及到的持久层示例代码如下：

```java
package cn.javgo.springboot.easyexcel.read.dao;

import cn.javgo.springboot.easyexcel.read.repository.entity.DemoData;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 假设这是一个 DAO，用于操作数据库，该类需要被 Spring 管理。为了简便这里直接使用 class 了，原则上应该使用接口，然后在实现类上加上
 * {@link Repository} 注解。（如果不需要存储数据库，可以去掉这个类）
 *
 * @author javgo.cn
 * @date 2023/10/26
 */
public class DemoDAO {

    /**
     * 保存数据到数据库
     *
     * @param cachedDataList 缓存的数据
     */
    public void save(List<DemoData> cachedDataList) {
        // 如果是 MyBatis 请尽量不要直接调用多次 insert，而应该自己写一个 mapper 里面新增一个方法 batchInsert 负责批量插入
    }
}
```

### 1.5 代码

```java
/**
 * 最简单的读取 Excel 的示例
 * <p>
 * 1. 创建 Excel 对应的实体对象 参照 {@link DemoData}
 * <p>
 * 2. 由于默认一行行的读取 Excel，所以每一行都需要创建回调监听器，参照 {@link DemoDataListener}
 * <p>
 * 3. 直接读即可
 */
@Test
void simpleRead() {
    //==================  (写法1：不用额外写一个 DemoDataListener 类，JDK8+、easyexcel 3.0.0-beta1)  =======================
    // 获取文件路径
    String fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    // 默认每次读取 100 条数据，然后反回给用户处理，直接调用 doRead 方法即可（具体执行 doRead 返回多少条数据，可以在 PageReadListener 的构造方法中指定）
    EasyExcel.read(fileName, DemoData.class, new PageReadListener<DemoData>(dataList -> {
        for (DemoData demoData : dataList) {
            log.info("读取到一条数据:{}", JSON.toJSONString(demoData));
        }
    })).sheet().doRead();

    //==============================  (写法2：匿名内部类 不用额外写一个DemoDataListener)  ==================================
    fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    EasyExcel.read(fileName, DemoData.class, new ReadListener<DemoData>() {

        /**
         * 单次批量缓存的数据量大小
         */
        public static final int BATCH_COUNT = 100;

        /**
         * 用于缓存数据的 list
         */
        private List<DemoData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

        /**
         * 每一条数据解析都会来调用该方法
         * @param data 每一条数据的对象，也就是 Excel 中的一行值。（类似 {@link AnalysisContext#readRowHolder()}
         * @param analysisContext 解析上下文
         */
        @Override
        public void invoke(DemoData data, AnalysisContext analysisContext) {
            cachedDataList.add(data);
            if (cachedDataList.size() >= BATCH_COUNT) {
                saveData();
                // 存储完成清理 list
                cachedDataList.clear();
            }
        }

        /**
         * 所有数据解析完成了都会来调用该方法执行一些后续操作
         * @param analysisContext 解析上下文
         */
        @Override
        public void doAfterAllAnalysed(AnalysisContext analysisContext) {
            // 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）
            saveData();
            log.info("所有数据解析完成！");
        }

        /**
         * 存储数据到数据库
         */
        private void saveData() {
            log.info("{}条数据，开始存储数据库！", cachedDataList.size());
            log.info("存储数据库成功！");
        }
    }).sheet().doRead();

    //===================================  (写法3：使用 DemoDataListener)  ==============================================
    fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    // 这里需要执行读用哪个 class 去读，然后读取第一个 sheet，读取第一个 sheet 的 demoDataListener，读取完成之后自动关闭流
    // 说明：这里的 sheet 是指 Excel 中的 sheet，即 Excel 中的 sheet1、sheet2、sheet3...（通俗来讲就是 Excel 中的表格）
    EasyExcel.read(fileName, DemoData.class, new DemoDataListener()).sheet().doRead();

    //===================================  (写法4：使用 DemoDataListener)  ==============================================
    fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    // 一个文件一个 reader
    try (ExcelReader excelReader = EasyExcel.read(fileName, DemoData.class, new DemoDataListener()).build()) {
        // 构建一个 sheet，这里可以指定名字或者下标（下标从 0 开始）
        ReadSheet readSheet = EasyExcel.readSheet(0).build();
        // 读取指定 sheet
        excelReader.read(readSheet);
    }
}
```

测试结果如下：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-090825.png" style="zoom:50%;" />

## 2.指定列的下标或者列名

### 2.1 Excel 示例

准备一张用于测试的 Excel 表如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png)

### 2.2 对象

同样需要使用一个实体来进行承载，但是这次可以结合 `@ExcelProperty` 注解来指定映射到哪个字段索引或者名称。该注解源码如下：

```java
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface ExcelProperty {
    // 指定列的名称匹配
    String[] value() default {""};

    // 指定列的下标匹配
    int index() default -1;

    int order() default Integer.MAX_VALUE;

    Class<? extends Converter<?>> converter() default AutoConverter.class;

    /** @deprecated */
    @Deprecated
    String format() default "";
}
```

示例代码如下：

```java
package cn.javgo.springboot.easyexcel.read.repository.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）（如果不需要存储数据库，可以去掉这个类）
 * @author javgo.cn
 * @date 2023/10/26
 */
@Getter
@Setter
@EqualsAndHashCode
public class IndexOrNameData {

  /**
   * 通过 Excel 的列名进行匹配。（注意：如果列名重复，会导致只有第一个列名生效读取到数据）
   */
  @ExcelProperty(value = "字符串标题")
  private String string;

  @ExcelProperty(value = "日期标题")
  private Date date;

  /**
   * 通过索引（下标从 0 开始）进行匹配，这里会强制读取第 3 列的数据。（注意：不建议 index 和 name 同时使用，统一使用一种即可）
   */
  @ExcelProperty(index = 2)
  private Double doubleData;
}
```

### 2.3 监听器

监听器保持不变，仅仅是泛型变了而已：

```java
/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 * <p>
 * 注意：DemoDataListener 不能被 Spring 管理，每次读取 Excel 都需要 new 一个新的对象，里面有需要被 Spring 管理的对象，可以通过构造
 * 方法传进来
 *
 * @author javgo.cn
 * @date 2023/10/26
 */
@Slf4j
public class IndexOrNameDataListener implements ReadListener<IndexOrNameData> {

  /**
   * 批量处理的数据量大小：每隔 5 条存储数据库，实际使用中可以 100 条，然后清理 list ，方便内存回收
   */
  private static final int BATCH_COUNT = 100;

  /**
   * 用于缓存数据的 list
   */
  private List<IndexOrNameData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    /**
     * 如果需要进行数据库操作，可以在构造方法中初始化 DemoDAO，如果不用存储数据库，可以去掉这个属性（也可以是一个 Service）
   */
  private IndexOrNameDAO indexOrNameDAO;

  public IndexOrNameDataListener(){
    // 这里只是 Demo，所以随便 new 一个 DAO 出来，实际使用中请使用下面的有参构造方法
    this.indexOrNameDAO = new IndexOrNameDAO();
  }

  /**
   * 如果使用了 Spring 管理 bean，可以通过构造方法传进来(即每次创建 Listener 都需要把 Spring 管理的 bean 传进来)
   * @param indexOrNameDAO 用于数据库操作的 DAO
   */
  public IndexOrNameDataListener(IndexOrNameDAO indexOrNameDAO){
    this.indexOrNameDAO = indexOrNameDAO;
  }

  /**
   * 每一条数据解析都会来调用该方法
   * @param indexOrNameData 每一条数据的对象，也就是 Excel 中的一行值。（类似 {@link AnalysisContext#readRowHolder()}
   * @param analysisContext 解析上下文
   */
  @Override
  public void invoke(IndexOrNameData indexOrNameData, AnalysisContext analysisContext) {
    log.info("解析到一条数据:{}", JSON.toJSONString(indexOrNameData));

    // 将解析的数据存储到 list，方便批量处理，或者后续自己业务逻辑的处理
    cachedDataList.add(indexOrNameData);

    // 如果 list 达到了 BATCH_COUNT，就进行一次数据库插入操作，防止数据几万条数据在内存，容易 OOM
    if (cachedDataList.size() >= BATCH_COUNT){
      saveData();
      // 存储完成清理 list
      cachedDataList.clear();
    }
  }

    /**
     * 所有数据解析完成了，都会来调用该方法
   * @param analysisContext 解析上下文
   */
  @Override
  public void doAfterAllAnalysed(AnalysisContext analysisContext) {
    // 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）
    saveData();
    log.info("所有数据解析完成！");
  }

  /**
   * 这里会一次性把缓存的数据全部拿出来，进行后续的数据库插入操作
   */
  private void saveData(){
    log.info("{} 条数据，开始存储数据库！", cachedDataList.size());
    indexOrNameDAO.save(cachedDataList);
    log.info("存储数据库成功！");
  }
}
```

### 2.4 代码

```java
/**
 * 测试指定下标或名称读取 Excel
 * <p>
 * 1. 创建 Excel 对应的实体对象，并在对象属性上加上 {@link ExcelProperty} 注解，参照 {@link IndexOrNameData}
 * <p>
 * 2. 由于默认一行行的读取 Excel，所以每一行都需要创建回调监听器，参照 {@link IndexOrNameDataListener}
 * <p>
 * 3. 直接读即可
 */
@Test
void indexOrNameRead() {
    String fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    // 默认读取第一个 sheet（sheet 就是 Excel 中的表格，通俗来讲就是 Excel 中的 sheet1、sheet2、sheet3...）
    EasyExcel.read(fileName, IndexOrNameData.class, new IndexOrNameDataListener()).sheet().doRead();
}
```

测试结果：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-091636.png" style="zoom:50%;" />

## 3.读多个 sheet

### 3.1 Excel 示例

准备一张用于测试的 Excel 表如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png)

### 3.2 对象

```java
package cn.javgo.springboot.easyexcel.read.repository.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * @author javgo.cn
 * @date 2023/10/26
 */
@Getter
@Setter
@EqualsAndHashCode
public class DemoData {

  /**
   * 字符串标题
   */
  private String string;

  /**
   * 日期标题
   */
  private Date date;

  /**
   * 数字标题
   */
  private Double doubleData;
}
```

### 3.3 监听器

```java
package cn.javgo.springboot.easyexcel.read.listener;

import cn.javgo.springboot.easyexcel.read.dao.DemoDAO;
import cn.javgo.springboot.easyexcel.read.repository.entity.DemoData;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.util.ListUtils;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 * <p>
 * 注意：DemoDataListener 不能被 Spring 管理，每次读取 Excel 都需要 new 一个新的对象，如果有需要被 Spring 管理的对象，可以通过构造
 * 方法传进来
 *
 * @author javgo.cn
 * @date 2023/10/26
 */
@Slf4j
public class DemoDataListener implements ReadListener<DemoData> {

  /**
   * 批量处理的数据量大小：每隔 5 条存储数据库，实际使用中可以 100 条，然后清理 list ，方便内存回收
   */
  private static final int BATCH_COUNT = 100;

  /**
   * 用于缓存数据的 list
   */
  private List<DemoData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

  /**
   * 如果需要进行数据库操作，可以在构造方法中初始化 DemoDAO，如果不用存储数据库，可以去掉这个属性（也可以是一个 Service）
   */
  private DemoDAO demoDAO;

  public DemoDataListener(){
    // 这里只是 Demo，所以随便 new 一个 DAO 出来，实际使用中请使用下面的有参构造方法
    this.demoDAO = new DemoDAO();
  }

  /**
   * 如果使用了 Spring 管理 bean，可以通过构造方法传进来(即每次创建 Listener 都需要把 Spring 管理的 bean 传进来)
   * @param demoDAO 用于数据库操作的 DAO
   */
  public DemoDataListener(DemoDAO demoDAO){
    this.demoDAO = demoDAO;
  }

  /**
   * 每一条数据解析都会来调用该方法
   * @param demoData 每一条数据的对象，也就是 Excel 中的一行值。（类似 {@link AnalysisContext#readRowHolder()}
   * @param analysisContext 解析上下文
   */
  @Override
  public void invoke(DemoData demoData, AnalysisContext analysisContext) {
    log.info("解析到一条数据:{}", JSON.toJSONString(demoData));

    // 将解析的数据存储到 list，方便批量处理，或者后续自己业务逻辑的处理
    cachedDataList.add(demoData);

    // 如果 list 达到了 BATCH_COUNT，就进行一次数据库插入操作，防止数据几万条数据在内存，容易 OOM
    if (cachedDataList.size() >= BATCH_COUNT){
      saveData();
      // 存储完成清理 list
      cachedDataList.clear();
    }
  }

  /**
   * Excel 的所有数据解析完成后会调用该方法
   * @param analysisContext 解析上下文
   */
  @Override
  public void doAfterAllAnalysed(AnalysisContext analysisContext) {
    // 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）
    saveData();
    log.info("所有数据解析完成！");
  }

  /**
   * 这里会一次性把缓存的数据全部拿出来，进行后续的数据库插入操作
   */
  private void saveData(){
    log.info("{} 条数据，开始存储数据库！", cachedDataList.size());
    demoDAO.save(cachedDataList);
    log.info("存储数据库成功！");
  }
}
```

### 3.4 代码

```java
/**
 * 测试读取多个 sheet。（注意：一个 sheet 不能读取多次，如果需要读取多次，需要重新读取 Excel）
 * <p>
 * 1. 创建 Excel 对应的实体对象，参照 {@link DemoData}
 * <p>
 * 2. 由于默认一行行的读取 Excel，所以每一行都需要创建回调监听器，参照 {@link DemoDataListener}
 * <p>
 * 3. 直接读即可
 */
@Test
void repeatedRead() {
    // 读取全部 sheet（注意：DemoDataListener#doAfterAllAnalysed 会在每个 sheet 读取完成之后都会调用一次
    // 然后所有 sheet 读都会往同一个 DemoDataListener#invoke 方法中回调数据）
    String fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    EasyExcel.read(fileName, DemoData.class,new DemoDataListener()).doReadAll();

    // 读取部分 sheet
    fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    try(ExcelReader excelReader = EasyExcel.read(fileName).build()){
        // 这里为了简单，所以注册了同样的 read 和 Listener，自己使用功能的时候必须用不同的 read 和 Listener
        ReadSheet readSheet1 = EasyExcel.readSheet(0).head(DemoData.class).registerReadListener(new DemoDataListener()).build();
        ReadSheet readSheet2 = EasyExcel.readSheet(1).head(DemoData.class).registerReadListener(new DemoDataListener()).build();

        // 注意：一定要把 sheet1、sheet2 一起传进去，否则 03 版本的 Excel 就会读取多次，从而浪费性能
        excelReader.read(readSheet1, readSheet2);
    }
}
```

## 4.日期、数字或自定义格式转换

### 4.1 Excel 示例

准备一张用于测试的 Excel 表如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png)

### 4.2 对象

```java
package cn.javgo.springboot.easyexcel.read.repository.entity;

import cn.javgo.springboot.easyexcel.read.converter.CustomStringStringConverter;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.format.DateTimeFormat;
import com.alibaba.excel.annotation.format.NumberFormat;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx），如果需要转换数据，可以在这里进行转换
 *
 * @author javgo.cn
 * @date 2023/10/26
 */
@Getter
@Setter
@EqualsAndHashCode
public class ConverterData {

    /**
     * 自定义的转换器：不管数据传入什么，都会给它加上 “自定义：”
     */
    @ExcelProperty(converter = CustomStringStringConverter.class)
    private String string;

    /**
     * 日期格式化：将 Excel 中的日期字符串格式化成指定的格式（这里需要用 String 接收日期才能格式化）
     */
    @DateTimeFormat("yyyy年MM月dd日HH时mm分ss秒")
    private String data;

    /**
     * 数字格式化：将 Excel 中的数字格式化成百分比（这里需要用 String 接收数字才能格式化）
     */
    @NumberFormat("#.##%")
    private String doubleData;
}
```

### 4.3 监听器

```java
package cn.javgo.springboot.easyexcel.read.listener;

import cn.javgo.springboot.easyexcel.read.dao.ConverterDataDAO;
import cn.javgo.springboot.easyexcel.read.repository.entity.ConverterData;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.util.ListUtils;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 *
 * @author javgo.cn
 * @date 2023/10/29
 */
@Slf4j
public class ConverterDataListener implements ReadListener<ConverterData> {

    private static final int BATCH_COUNT = 100;

    private List<ConverterData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    private ConverterDataDAO converterDataDAO;

    public ConverterDataListener(ConverterDataDAO converterDataDAO) {
        this.converterDataDAO = converterDataDAO;
    }

    @Override
    public void invoke(ConverterData converterData, AnalysisContext analysisContext) {
        log.info("解析到一条数据:{}", JSON.toJSONString(converterData));
        cachedDataList.add(converterData);
        if (cachedDataList.size() >= BATCH_COUNT) {
            saveData();
            cachedDataList.clear();
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext analysisContext) {
        saveData();
        cachedDataList.clear();
        log.info("所有数据解析完成！");
    }

    private void saveData() {
        log.info("{}条数据，开始存储数据库！", cachedDataList.size());
        converterDataDAO.save(cachedDataList);
        log.info("存储数据库成功！");
    }
}
```

### 4.4 自定义转换器

```java
package cn.javgo.springboot.easyexcel.read.converter;

import com.alibaba.excel.converters.Converter;
import com.alibaba.excel.converters.ReadConverterContext;
import com.alibaba.excel.converters.WriteConverterContext;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.data.WriteCellData;

/**
 * 用于转换数据的类，需要实现 com.alibaba.excel.convert.Converter 接口
 *
 * @author javgo.cn
 * @date 2023/10/26
 */
public class CustomStringStringConverter implements Converter<String> {

  /**
   * 支持的 java 类型
   * @return java 类型
   */
  @Override
    public Class<?> supportJavaTypeKey() {
        return String.class;
    }

  /**
   * 支持的 excel 类型
   * @return excel 类型
   */
  @Override
    public CellDataTypeEnum supportExcelTypeKey() {
        return CellDataTypeEnum.STRING;
    }

  /**
   * 读取 excel 时会调用该方法
   * @param context 读取 excel 上下文
   * @return java 数据
   * @throws Exception 异常
   */
  @Override
    public String convertToJavaData(ReadConverterContext<?> context) throws Exception {
        return "自定义：" + context.getReadCellData().getStringValue();
    }

    /**
     * 写入 excel 时会调用该方法（不用管）
     * @param context 写入 excel 上下文
     * @return excel 数据
     * @throws Exception 异常
     */
    @Override
    public WriteCellData<?> convertToExcelData(WriteConverterContext<String> context) throws Exception {
        return new WriteCellData<>(context.getValue());
    }
}
```

### 4.5 代码

```java
/**
 * 日期、数字或者自定义格式转换
 * <p>
 * 默认读的转换器 {@link DefaultConverterLoader#loadDefaultReadConverter()}
 * <p>1. 创建 Excel 对应的实体对象 参照 {@link ConverterData} ,里面可以使用注解 {@link DateTimeFormat}、{@link NumberFormat} 或者自定义注解
 * <p>2. 由于默认一行行的读取 Excel，所以需要创建 Excel 一行一行的回调监听器，参照 {@link ConverterDataListener}
 * <p>3. 直接读即可
 */
@Test
void converterRead(){
    String fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    EasyExcel.read(fileName, ConverterData.class,new ConverterDataListener())
            // 注意：也可以通过 registerConverter 来指定自定义的转换器，但是这将作用于全局，所以不建议这么做（所有 java 为 string,
            // excel 为 string 的都会用这个转换器）如果就想单个字段使用请使用 @ExcelProperty 指定 converter。
            // .registerConverter(new CustomStringStringConverter())
            .sheet().doRead();
}
```

测试结果：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-094620.png" style="zoom:50%;" />

## 5.多行头

### 5.1 Excel 示例

准备一张用于测试的 Excel 表如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png)

### 5.2 对象

```java
package cn.javgo.springboot.easyexcel.read.repository.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * @author javgo.cn
 * @date 2023/10/26
 */
@Getter
@Setter
@EqualsAndHashCode
public class DemoData {

  /**
   * 字符串标题
   */
  private String string;

  /**
   * 日期标题
   */
  private Date date;

  /**
   * 数字标题
   */
  private Double doubleData;
}
```

### 5.3 监听器

```java
package cn.javgo.springboot.easyexcel.read.listener;

import cn.javgo.springboot.easyexcel.read.dao.DemoDAO;
import cn.javgo.springboot.easyexcel.read.repository.entity.DemoData;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.util.ListUtils;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;

import java.util.List;

/**
 * 用于读取 Excel 的监听器（test-file/demo.xlsx）
 * <p>
 * 注意：DemoDataListener 不能被 Spring 管理，每次读取 Excel 都需要 new 一个新的对象，如果有需要被 Spring 管理的对象，可以通过构造
 * 方法传进来
 *
 * @author javgo.cn
 * @date 2023/10/26
 */
@Slf4j
public class DemoDataListener implements ReadListener<DemoData> {

  /**
   * 批量处理的数据量大小：每隔 5 条存储数据库，实际使用中可以 100 条，然后清理 list ，方便内存回收
   */
  private static final int BATCH_COUNT = 100;

  /**
   * 用于缓存数据的 list
   */
  private List<DemoData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

  /**
   * 如果需要进行数据库操作，可以在构造方法中初始化 DemoDAO，如果不用存储数据库，可以去掉这个属性（也可以是一个 Service）
   */
  private DemoDAO demoDAO;

  public DemoDataListener(){
    // 这里只是 Demo，所以随便 new 一个 DAO 出来，实际使用中请使用下面的有参构造方法
    this.demoDAO = new DemoDAO();
  }

  /**
   * 如果使用了 Spring 管理 bean，可以通过构造方法传进来(即每次创建 Listener 都需要把 Spring 管理的 bean 传进来)
   * @param demoDAO 用于数据库操作的 DAO
   */
  public DemoDataListener(DemoDAO demoDAO){
    this.demoDAO = demoDAO;
  }

  /**
   * 每一条数据解析都会来调用该方法
   * @param demoData 每一条数据的对象，也就是 Excel 中的一行值。（类似 {@link AnalysisContext#readRowHolder()}
   * @param analysisContext 解析上下文
   */
  @Override
  public void invoke(DemoData demoData, AnalysisContext analysisContext) {
    log.info("解析到一条数据:{}", JSON.toJSONString(demoData));

    // 将解析的数据存储到 list，方便批量处理，或者后续自己业务逻辑的处理
    cachedDataList.add(demoData);

    // 如果 list 达到了 BATCH_COUNT，就进行一次数据库插入操作，防止数据几万条数据在内存，容易 OOM
    if (cachedDataList.size() >= BATCH_COUNT){
      saveData();
      // 存储完成清理 list
      cachedDataList.clear();
    }
  }

  /**
   * Excel 的所有数据解析完成后会调用该方法
   * @param analysisContext 解析上下文
   */
  @Override
  public void doAfterAllAnalysed(AnalysisContext analysisContext) {
    // 这里也要保存数据，确保最后遗留的数据也存储到数据库（也就是说最后一批数据不一定是 BATCH_COUNT 条，可能小于 BATCH_COUNT 条）
    saveData();
    log.info("所有数据解析完成！");
  }

  /**
   * 这里会一次性把缓存的数据全部拿出来，进行后续的数据库插入操作
   */
  private void saveData(){
    log.info("{} 条数据，开始存储数据库！", cachedDataList.size());
    demoDAO.save(cachedDataList);
    log.info("存储数据库成功！");
  }
}
```

### 5.4 代码

```java
/**
 * 多行头
 * <p>1. 创建 excel 对应的实体对象 参照 {@link DemoData}
 * <p>2. 由于默认一行行的读取 excel，所以需要创建 excel 一行一行的回调监听器，参照 {@link DemoDataListener}
 * <p>3. 设置 headRowNumber 参数，然后读。 这里要注意 headRowNumber 如果不指定， 会根据你传入的 class 的 {@link ExcelProperty#value()}
 * 里面的表头的数量来决定行数，如果不传入 class 则默认为 1.当然你指定了 headRowNumber 不管是否传入 class 都是以你传入的为准。
 */
@Test
void complexHeaderRead(){
    String fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    EasyExcel.read(fileName, DemoData.class,new DemoDataListener())
            // 这里需要指定读取的 sheet，否则默认读取第一个 sheet
            .sheet()
            // 这里需要指定读取的行数，否则默认读取第二行开始读取
            // 不传入也可以，因为默认会根据 DemoData 来解析，他没有指定头，也就是默认 1 行，所以这里会从第二行开始读取
           // 这里为了方便效果演示我们设置为 2，也就是从第三行开始读取
            .headRowNumber(2)
            .doRead();
}
```

测试结果：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-095417.png" style="zoom:50%;" />

## 6.同步返回

### 6.1 Excel 示例

准备一张用于测试的 Excel 表如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png)

### 6.2 对象

```java
package cn.javgo.springboot.easyexcel.read.repository.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * @author javgo.cn
 * @date 2023/10/26
 */
@Getter
@Setter
@EqualsAndHashCode
public class DemoData {

  /**
   * 字符串标题
   */
  private String string;

  /**
   * 日期标题
   */
  private Date date;

  /**
   * 数字标题
   */
  private Double doubleData;
}
```

### 6.3 代码

```java
/**
 * 解释：所谓同步读取，就是一行一行的读取，读取完一行就返回给用户，用户可以自己处理这一行数据，然后再读取下一行，以此类推。
 * 同步读取 Excel，不推荐使用，如果数据量大会导致 OOM，并且读取速度慢。
 */
@Test
void synchronousRead(){
    String fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    // 这里需要指定用哪一个 class 去读，然后读取第一个 sheet，同步读取会自动 finish
    List<DemoData> list = EasyExcel.read(fileName).head(DemoData.class).sheet().doReadSync();
    for (DemoData data : list) {
        log.info("读取到一条数据:{}", JSON.toJSONString(data));
    }

    // 这里也可以不指定 class 返回一个 list，然后读取第一个 sheet，同步读取会自动 finish
    List<Map<Integer,String>> listMap = EasyExcel.read(fileName).sheet().doReadSync();
    for (Map<Integer, String> data : listMap) {
        // 返回每条数据的键值对: key 是第几列，value 是所在列的值
        log.info("读取到一条数据:{}", JSON.toJSONString(data));
    }
}
```

## 7.读取表头数据

### 7.1 Excel 示例

准备一张用于测试的 Excel 表如下：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-26-074218.png)

### 7.2 对象

```java
package cn.javgo.springboot.easyexcel.read.repository.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import java.util.Date;

/**
 * 用于映射 Excel 的实体类（test-file/demo.xlsx）
 * @author javgo.cn
 * @date 2023/10/26
 */
@Getter
@Setter
@EqualsAndHashCode
public class DemoData {

  /**
   * 字符串标题
   */
  private String string;

  /**
   * 日期标题
   */
  private Date date;

  /**
   * 数字标题
   */
  private Double doubleData;
}
```

### 7.3 监听器

最简单的读的监听器里面多了一个方法，只要重写 `invokeHead(Map<Integer, ReadCellData<?>> headMap, AnalysisContext context)` 方法即可：

```java
package cn.javgo.springboot.easyexcel.read.listener;

import cn.javgo.springboot.easyexcel.read.dao.DemoDAO;
import cn.javgo.springboot.easyexcel.read.repository.entity.DemoData;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.metadata.data.ReadCellData;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.util.ListUtils;
import com.alibaba.fastjson.JSON;
import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;

/**
 * @author javgo.cn
 * @date 2023/10/29
 */
@Slf4j
public class DemoHeadDataListener implements ReadListener<DemoData> {

    private static final int BATCH_COUNT = 100;

    private List<DemoData> cachedDataList = ListUtils.newArrayListWithExpectedSize(BATCH_COUNT);

    private DemoDAO demoDAO;

    public DemoHeadDataListener() {
        this.demoDAO = new DemoDAO();
    }

    public DemoHeadDataListener(DemoDAO demoDAO) {
        this.demoDAO = demoDAO;
    }

    @Override
    public void invoke(DemoData demoData, AnalysisContext analysisContext) {
        log.info("解析到一条数据:{}", JSON.toJSONString(demoData));
        cachedDataList.add(demoData);
        if (cachedDataList.size() >= BATCH_COUNT) {
            saveData();
            cachedDataList.clear();
        }
    }

    @Override
    public void doAfterAllAnalysed(AnalysisContext analysisContext) {
        saveData();
        log.info("所有数据解析完成！");
    }

    private void saveData() {
        log.info("{} 条数据，开始存储数据库！", cachedDataList.size());
        demoDAO.save(cachedDataList);
        log.info("存储数据库成功！");
    }

    /**
     * 这里会一行行的返回头，如果需要获取头的值可以重写该方法
     *
     * @param headMap 头的数据 key 是头的行号，value 是具体的值
     * @param context 解析上下文
     */
    @Override
    public void invokeHead(Map<Integer, ReadCellData<?>> headMap, AnalysisContext context) {
        log.info("解析到一条头数据:{}", JSON.toJSONString(headMap));

        // 如果想转成成 Map<Integer,String>：
        // 方案一：不要 implements ReadListener 而是 extends AnalysisEventListener
        // 方案二：调用 ConverterUtils.convertToStringMap(headMap, context) 自动会转换
        // Map<Integer, String> map = ConverterUtils.convertToStringMap(headMap, context);
    }
}
```

### 7.4 代码

```java
/**
 * 读取表头数据
 * <p>1. 创建 excel 对应的实体对象 参照 {@link DemoData}
 * <p>2. 由于默认一行行的读取 excel，所以需要创建 excel 一行一行的回调监听器，参照 {@link DemoHeadDataListener}
 * <p>3. 直接读即可
 */
@Test
void headerRead() {
    String fileName = TestFileUtil.getPath() + "test-file" + File.separator + "demo.xlsx";
    EasyExcel.read(fileName, DemoData.class, new DemoHeadDataListener()).sheet().doRead();
}
```

测试结果：

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-10-29-101719.png)

## 8.额外信息（批注、超链接、合并单元格信息读取）

> since：2.0.0-beta1

### 8.1 Excel 示例



### 8.2 对象



### 8.3 监听器



### 8.4 代码
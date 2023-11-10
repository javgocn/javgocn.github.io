const e=JSON.parse('{"key":"v-5b52b194","path":"/md/%E5%B8%B8%E7%94%A8%E6%A1%86%E6%9E%B6/Drools/01-KIE%E5%85%A5%E9%97%A8.html","title":"01-KIE入门","lang":"zh-CN","frontmatter":{"title":"01-KIE入门","description":"1.KIE (Knowledge Is Everything) KIE (Knowledge Is Everything) 是一个综合性的项目，它的主要目的是将我们的多种相关技术整合在同一个平台下。你可以将它想象成一个大房子，而这个房子里住着多个技术项目，它们都共享这个 “房子” 的核心资源。 在 KIE 的 “房子” 里，有以下几个主要的 “居民” ...","head":[["meta",{"property":"og:url","content":"https://www.javgo.cn/md/%E5%B8%B8%E7%94%A8%E6%A1%86%E6%9E%B6/Drools/01-KIE%E5%85%A5%E9%97%A8.html"}],["meta",{"property":"og:site_name","content":"JavGo"}],["meta",{"property":"og:title","content":"01-KIE入门"}],["meta",{"property":"og:description","content":"1.KIE (Knowledge Is Everything) KIE (Knowledge Is Everything) 是一个综合性的项目，它的主要目的是将我们的多种相关技术整合在同一个平台下。你可以将它想象成一个大房子，而这个房子里住着多个技术项目，它们都共享这个 “房子” 的核心资源。 在 KIE 的 “房子” 里，有以下几个主要的 “居民” ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-10T16:14:41.000Z"}],["meta",{"property":"article:author","content":"Mr.JavGo"}],["meta",{"property":"article:modified_time","content":"2023-11-10T16:14:41.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"01-KIE入门\\",\\"image\\":[\\"\\"],\\"dateModified\\":\\"2023-11-10T16:14:41.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.JavGo\\",\\"url\\":\\"https://www.javgo.cn\\",\\"email\\":\\"javgocn@gmail.com\\"}]}"]]},"headers":[{"level":2,"title":"1.KIE (Knowledge Is Everything)","slug":"_1-kie-knowledge-is-everything","link":"#_1-kie-knowledge-is-everything","children":[]},{"level":2,"title":"2.构建（Building）","slug":"_2-构建-building","link":"#_2-构建-building","children":[{"level":3,"title":"2.1 创建并构建 Kie 项目","slug":"_2-1-创建并构建-kie-项目","link":"#_2-1-创建并构建-kie-项目","children":[]},{"level":3,"title":"2.2 kmodule.xml 文件","slug":"_2-2-kmodule-xml-文件","link":"#_2-2-kmodule-xml-文件","children":[]},{"level":3,"title":"2.3 使用 Maven 构建","slug":"_2-3-使用-maven-构建","link":"#_2-3-使用-maven-构建","children":[]},{"level":3,"title":"2.4 编程方式定义 KieModule","slug":"_2-4-编程方式定义-kiemodule","link":"#_2-4-编程方式定义-kiemodule","children":[]},{"level":3,"title":"2.5 调整默认构建结果的严重性","slug":"_2-5-调整默认构建结果的严重性","link":"#_2-5-调整默认构建结果的严重性","children":[]}]},{"level":2,"title":"3.部署（Deploying）","slug":"_3-部署-deploying","link":"#_3-部署-deploying","children":[{"level":3,"title":"3.1 KieBase","slug":"_3-1-kiebase","link":"#_3-1-kiebase","children":[]},{"level":3,"title":"3.2 修改 KieSessions 和 KieBase","slug":"_3-2-修改-kiesessions-和-kiebase","link":"#_3-2-修改-kiesessions-和-kiebase","children":[]},{"level":3,"title":"3.3 KieScanner","slug":"_3-3-kiescanner","link":"#_3-3-kiescanner","children":[]},{"level":3,"title":"3.4 Maven 版本和依赖项","slug":"_3-4-maven-版本和依赖项","link":"#_3-4-maven-版本和依赖项","children":[]},{"level":3,"title":"3.5 Settings.xml 和远程存储库设置","slug":"_3-5-settings-xml-和远程存储库设置","link":"#_3-5-settings-xml-和远程存储库设置","children":[]}]},{"level":2,"title":"4.运行（Running）","slug":"_4-运行-running","link":"#_4-运行-running","children":[{"level":3,"title":"4.1 KieBase","slug":"_4-1-kiebase","link":"#_4-1-kiebase","children":[]},{"level":3,"title":"4.2 KieSession","slug":"_4-2-kiesession","link":"#_4-2-kiesession","children":[]},{"level":3,"title":"4.3 KieRuntime","slug":"_4-3-kieruntime","link":"#_4-3-kieruntime","children":[]},{"level":3,"title":"4.4 事件模型","slug":"_4-4-事件模型","link":"#_4-4-事件模型","children":[]},{"level":3,"title":"4.5 KieRuntimeLogger","slug":"_4-5-kieruntimelogger","link":"#_4-5-kieruntimelogger","children":[]},{"level":3,"title":"4.6 命令和 CommandExecutor","slug":"_4-6-命令和-commandexecutor","link":"#_4-6-命令和-commandexecutor","children":[]},{"level":3,"title":"4.7 无状态 KieSession","slug":"_4-7-无状态-kiesession","link":"#_4-7-无状态-kiesession","children":[]},{"level":3,"title":"4.8 Marshalling","slug":"_4-8-marshalling","link":"#_4-8-marshalling","children":[]},{"level":3,"title":"4.9 持久化和事务","slug":"_4-9-持久化和事务","link":"#_4-9-持久化和事务","children":[]}]},{"level":2,"title":"5.安装和部署备忘单","slug":"_5-安装和部署备忘单","link":"#_5-安装和部署备忘单","children":[]},{"level":2,"title":"6.使用示例","slug":"_6-使用示例","link":"#_6-使用示例","children":[]},{"level":2,"title":"7.可执行的规则模型","slug":"_7-可执行的规则模型","link":"#_7-可执行的规则模型","children":[]},{"level":2,"title":"8.使用 KieScanner 监控和更新 KieContainers","slug":"_8-使用-kiescanner-监控和更新-kiecontainers","link":"#_8-使用-kiescanner-监控和更新-kiecontainers","children":[]}],"git":{"createdTime":1699632881000,"updatedTime":1699632881000,"contributors":[{"name":"liyao","email":"liyao@jikugroup.com","commits":1}]},"readingTime":{"minutes":17.89,"words":5367},"filePathRelative":"md/常用框架/Drools/01-KIE入门.md","localizedDate":"2023年11月10日","copyright":{"author":"Mr.JavGo"},"autoDesc":true}');export{e as data};

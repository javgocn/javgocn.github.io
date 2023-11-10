import { hopeTheme } from "vuepress-theme-hope";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import navbar from "./navbar.js";
import sidebar from "./sidebar.js";

export default hopeTheme({
  //========================================================= 基本信息 ==================================================
  // 当前网站部署到的域名
  hostname: "https://www.javgo.cn",

  // 站点图标
  favicon: "https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-03-091254.gif",

  // 作者信息
  author: {
    // 作者姓名
    name: "Mr.JavGo",
    // 作者网站
    url: "https://www.javgo.cn",
    // 作者 Email
    email: "javgocn@gmail.com",
  },

  // 主体图标
  iconAssets: "fontawesome-with-brands",

  //========================================================== 导航栏 ===================================================

  // 主页左上角 logo
  logo: "https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-03-091254.gif",
  logoDark: "https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-03-091254.gif",

  // 引用 ./navbar.js
  navbar,

  // 导航栏标题
  navTitle: "JavGo",

  // 是否在导航栏显示仓库链接(默认值: true)
  repoDisplay: true,

  // 仓库配置，用于在导航栏右上角显示仓库链接
  repo: "https://github.com/javgocn/javgocn",

  // 是否在向下滚动时自动隐藏导航栏(类型: "always" | "mobile" | "none" 默认值: "mobile")
  navbarAutoHide: "mobile",

  // 是否在移动视图下隐藏站点名称(默认值: true)
  hideSiteNameOnMobile: true,

  // 导航栏布局
  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Language", "Repo", "Outlook", "Search"],
  },

  //======================================================== 侧边栏 =====================================================

  // 引用 ./sidebar.js
  sidebar,

  // 是否在侧边栏显示图标(默认值: true)
  sidebarIcon: true,

  // 侧边栏嵌套的标题深度(默认值: 2)
  headerDepth: 2,

  //======================================================= 路径导航配置 =================================================

  // 是否全局启用路径导航(默认值: true)
  breadcrumb: true,

  // 是否在路径导航显示图标(默认值: true)
  breadcrumbIcon: true,

  // 是否在页面底部显示上一篇链接(默认值: true)
  prevLink: true,

  // 是否在页面底部显示下一篇链接(默认值: true)
  nextLink: true,

  //========================================================== 标题 =====================================================

  // 是否在页面标题旁显示图标(默认值: true)
  titleIcon: true,

  // 文章信息，可以填入数组，数组的顺序是各条目显示的顺序。填入 false 使其被禁用。
  // "Author" 作者、"Date" 写作日期、"Original" 是否原创、"Category" 分类、"Tag" 标签、"ReadingTime" 预计阅读时间、"Word" 字数、"PageView" 页面浏览量
  pageInfo: ["Author", "Date", "ReadingTime","PageView"],

  //========================================================== 元信息 ===================================================

  // 是否显示页面最后更新时间（默认值：true）
  lastUpdated: true,

  // 是否显示页面贡献者（默认值：true）
  contributors: true,

  // 是否展示编辑此页链接（默认值：true）
  editLink: true,

  // 编辑链接的匹配(其中 :repo :branch :path 会被自动替换为 docsRepo docsBranch 和 docsDir + filePath)
  editLinkPattern: ":repo/edit/:branch/:path",

  // 文档仓库(默认值: repo)
  docsRepo: "https://github.com/javgocn/javgocn",

  // 文档所在分支(默认值: "main")
  docsBranch: "main",

  // 文档在仓库中的目录(默认值: "")
  docsDir: "src",

  //======================================================== 页脚 ======================================================

  // 页脚的默认内容，可输入 HTMLString
  footer: "",

  // 是否默认显示页脚(默认值: false)
  displayFooter: false,

  // 默认的版权信息，设置为 false 来默认禁用它
  copyright: "Copyright © JavGo",

  //======================================================== 杂项 ======================================================

  // 是否在桌面模式下右侧展示标题列表(默认值: true)
  toc: true,

  //======================================================== 主题外观选项 ================================================

  // 深色模式支持选项:
  // "switch": 在深色模式，浅色模式和自动之间切换(默认)
  // "toggle": 在深色模式和浅色模式之间切换
  // "auto": 自动根据用户设备主题或当前时间决定是否应用深色模式
  // "enable": 强制深色模式
  // "disable": 禁用深色模式
  darkmode: "switch",

  // 是否显示全屏按钮(默认值: false)
  fullscreen: false,

  //======================================================== 其他 =======================================================

  encrypt: {
    config: {
      "/demo/encrypt.html": ["1234"],
    },
  },

  // page meta
  metaLocales: {
    editLink: "在 GitHub 上编辑此页",
  },

  //======================================================== 插件 =======================================================

  plugins: {

    // 代码复制
    copyCode: {
      // 移动端是否显示复制按钮
      showInMobile: true,
    },

    // 复制版权信息
    copyright: {

    },

    // You should generate and use your own comment service
    // comment: {
    //   provider: "Giscus",
    //   repo: "vuepress-theme-hope/giscus-discussions",
    //   repoId: "R_kgDOG_Pt2A",
    //   category: "Announcements",
    //   categoryId: "DIC_kwDOG_Pt2M4COD69",
    // },

    // All features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      card: true,

      // install chart.js before enabling it
      // chart: true,

      codetabs: true,
      demo: true,

      // install echarts before enabling it
      // echarts: true,

      figure: true,

      // install flowchart.ts before enabling it
      // flowchart: true,

      // gfm requires mathjax-full to provide tex support
      // gfm: true,

      imgLazyload: true,
      imgSize: true,
      include: true,

      // install katex before enabling it
      // katex: true,

      // install mathjax-full before enabling it
      // mathjax: true,

      mark: true,

      // install mermaid before enabling it
      // mermaid: true,

      playground: {
        presets: ["ts", "vue"],
      },

      // install reveal.js before enabling it
      // revealJs: {
      //   plugins: ["highlight", "math", "search", "notes", "zoom"],
      // },

      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,

      // install @vue/repl before enabling it
      // vuePlayground: true,
    },

    // uncomment these if you want a pwa
    // pwa: {
    //   favicon: "/favicon.ico",
    //   cacheHTML: true,
    //   cachePic: true,
    //   appendBase: true,
    //   apple: {
    //     icon: "/assets/icon/apple-icon-152.png",
    //     statusBarColor: "black",
    //   },
    //   msTile: {
    //     image: "/assets/icon/ms-icon-144.png",
    //     color: "#ffffff",
    //   },
    //   manifest: {
    //     icons: [
    //       {
    //         src: "/assets/icon/chrome-mask-512.png",
    //         sizes: "512x512",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-mask-192.png",
    //         sizes: "192x192",
    //         purpose: "maskable",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-512.png",
    //         sizes: "512x512",
    //         type: "image/png",
    //       },
    //       {
    //         src: "/assets/icon/chrome-192.png",
    //         sizes: "192x192",
    //         type: "image/png",
    //       },
    //     ],
    //     shortcuts: [
    //       {
    //         name: "Demo",
    //         short_name: "Demo",
    //         url: "/demo/",
    //         icons: [
    //           {
    //             src: "/assets/icon/guide-maskable.png",
    //             sizes: "192x192",
    //             purpose: "maskable",
    //             type: "image/png",
    //           },
    //         ],
    //       },
    //     ],
    //   },
    // },
  },
});

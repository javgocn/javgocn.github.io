import {sidebar} from "vuepress-theme-hope";

export default sidebar({
    "/": [
        "",
        {
            text: "Java",
            icon: "laptop-code",
            prefix: "md/Java/",
            children: "structure",
        },
        {
            text: "Spring",
            icon: "book",
            prefix: "md/Spring/",
            children: "structure",
        },
        {
            text: "命令手册",
            icon: "book",
            prefix: "md/命令手册/",
            children: "structure",
        },
        {
            text: "常用框架",
            icon: "book",
            prefix: "md/常用框架/",
            children: "structure",
        },
        {
            text: "常用类库",
            icon: "book",
            prefix: "md/常用类库/",
            children: "structure",
        },
        {
            text: "开发工具",
            icon: "book",
            prefix: "md/开发工具/",
            children: "structure",
        },
        {
            text: "数据库",
            icon: "book",
            prefix: "md/数据库/",
            children: "structure",
        },
        {
            text: "方法论",
            icon: "book",
            prefix: "md/方法论/",
            children: "structure",
        },
        {
            text: "核心基础",
            icon: "book",
            prefix: "md/核心基础/",
            children: "structure",
        },
        {
            text: "消息引擎",
            icon: "book",
            prefix: "md/消息引擎/",
            children: "structure",
        },
        {
            text: "部署相关",
            icon: "book",
            prefix: "md/部署相关/",
            children: "structure",
        },
        {
            text: "八股文",
            icon: "book",
            prefix: "md/八股文/",
            children: "structure",
        },
    ],
});

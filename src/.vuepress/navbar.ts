import {navbar} from "vuepress-theme-hope";

export default navbar([
    "/",
    {
        text: "API｜文档",
        icon: "book",
        link: "https://theme-hope.vuejs.press/zh/",
    },
    {
        text: "在线工具",
        icon: "lightbulb",
        prefix: "/guide/",
        children: [
            {
                text: "Bar",
                icon: "lightbulb",
                prefix: "bar/",
                children: [
                    "baz",
                    {
                        text: "...",
                        icon: "ellipsis",
                        link: ""
                    }
                ],
            },
            {
                text: "Foo",
                icon: "lightbulb",
                prefix: "foo/",
                children: [
                    "ray",
                    {
                        text: "...",
                        icon: "ellipsis",
                        link: ""
                    }],
            },
        ],
    },
]);

import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "JavGo",
  description: "Java Knowledge Planet",

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});

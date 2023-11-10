---
title: 01-Linux概述
---
Linux 是一种自由且开放源码的操作系统，其设计受到了 Unix 的极大影响，因而常被归类为类 Unix 系统。若严格定义，“Linux” 一词专指 Linux 内核。但内核本身不足以构成完整的操作系统，它必须搭配应用程序和用户界面。因此，市场上出现了多种基于 Linux 内核的操作系统发行版。

Linux 之父[林纳斯·托瓦兹](https://zh.wikipedia.org/wiki/%E6%9E%97%E7%BA%B3%E6%96%AF%C2%B7%E6%89%98%E7%93%A6%E5%85%B9)是计算机编程领域的重量级人物。他不仅是 Linux 内核的创始人，还是 Git 版本控制系统的开发者。他的工作对开源运动产生了深远影响。

![](https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-134027.png)

1989 年，托瓦兹加入了芬兰陆军，担任少尉，主要负责计算机相关工作。在此期间，他购买了[安德鲁·塔能鲍姆](https://zh.wikipedia.org/zh/%E5%AE%89%E5%BE%B7%E9%B2%81%C2%B7%E6%96%AF%E5%9B%BE%E5%B0%94%E7%89%B9%C2%B7%E5%A1%94%E8%83%BD%E9%B2%8D%E5%A7%86)的教科书和 [Minix](https://zh.wikipedia.org/wiki/MINIX) 源代码，这些经历奠定了他后来创建 Linux 内核的基础。1991年，他公布了 Linux 内核的首个版本。

Linux 选择了一只可爱的企鹅 Tux 作为其标志，这象征着 Linux 社区的友好、开放和冒险精神。

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-134200.png" style="zoom:50%;" />

Linux 内核被多个组织和公司用作构建完整操作系统的基石。这些发行版通常包括了内核、应用软件和管理工具。商业公司如 [Red Hat](https://zh.wikipedia.org/wiki/%E7%B4%85%E5%B8%BD%E5%85%AC%E5%8F%B8) 提供的 RHEL（[Red Hat Enterprise Linux](https://zh.wikipedia.org/wiki/Red_Hat_Enterprise_Linux)），以及社区组织维护的如基于 RHEL 的 [CentOS](https://zh.wikipedia.org/wiki/CentOS)，或基于 [Debian](https://zh.wikipedia.org/wiki/Debian) 的 [Ubuntu](https://zh.wikipedia.org/wiki/Ubuntu)，这些发行版各有特色。针对初学者，CentOS 因其安全稳定、性能优秀且与 RHEL 高度一致的特点，通常被推荐。

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-134759.png" style="zoom:50%;" />

我用一张表格整理了常见 Linux 发行版的对比，如下：

根据你的要求，我用一张表格整理了常见 Linux 发行版的对比，如下：

| 发行版     | 基于       | 包管理器 | 适合用户 | 特点                   |
| :--------- | :--------- | :------- | :------- | :--------------------- |
| Debian     | N/A        | DPKG     | 中高级   | 稳定，免费，社区维护   |
| Ubuntu     | Debian     | DPKG     | 初级     | 简单，华丽，大众化     |
| RedHat     | N/A        | RPM      | 高级     | 商业，支持，性能       |
| **CentOS** | **RedHat** | RPM      | 中高级   | **免费**，稳定，服务器 |
| Fedora     | RedHat     | DNF      | 中高级   | 免费，先进，实验       |
| SUSE       | N/A        | Zypper   | 中高级   | 商业，支持，企业       |
| Arch       | N/A        | Pacman   | 高级     | 前瞻，专业，折腾       |
| Manjaro    | Arch       | Pacman   | 中级     | 简单，友好，体验       |
| Gentoo     | N/A        | Portage  | 高级     | 极客，定制，小众       |


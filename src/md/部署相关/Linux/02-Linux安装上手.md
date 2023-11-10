---
title: 02-Linux安装上手
---
## 1.VMware安装

下载 VMware16：

> 下载链接：[https://pan.baidu.com/s/1Fgnzw2EEDMV9HtKWhWDDnA?pwd=6666](https://pan.baidu.com/s/1Fgnzw2EEDMV9HtKWhWDDnA?pwd=6666) 
> 提取码：6666 

下载完成后点击安装即可，VMware 虚拟机安装比较简单，下面仅给出关键步骤。

自定义安装路径，推荐安装在 C 盘以外的磁盘：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135859.png" style="zoom:67%;" />

不要勾选 VMware Workstation 增强型键盘功能：

<img src="https://img-blog.csdnimg.cn/img_convert/16960e8c58a57b1b79bceb2c7d046b24.png" style="zoom:67%;" />

不要勾选 VMware Workstation 软件检查更新和帮助完善：

<img src="https://img-blog.csdnimg.cn/img_convert/8a7e8c2d45c105af04675fd731b0ba9a.png" style="zoom:67%;" />

安装完成后不要点击完成，点击许可证：

<img src="https://img-blog.csdnimg.cn/img_convert/1b38309bb19de8bf657fd6e3d1ce4dc3.png" style="zoom: 50%;" />

> 激活 VMware 许可证密匙：ZF3R0-FHED2-M80TY-8QYGC-NPKYF 或 ZF71R-DMX85-08DQY-8YMNC-PPHV8

安装成功后的虚拟机页面如下：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135926.png" style="zoom: 33%;" />

激活信息如下:

<img src="https://img-blog.csdnimg.cn/img_convert/7d8cef62f00fe2eead5ff30487f59317.png" style="zoom:50%;" />

## 2.CentOS 7 安装

下载 CentOS7 ，下面给出 CentOS7 桌面版链接：

下载链接：https://pan.baidu.com/s/1vFtWh8iecHCwHf-e0_QV2w?pwd=8080 
提取码：8080 

> 友友也可以自行下载不同的镜像，下面给出一些地址：
>
> * 网易镜像：[http://mirrors.163.com/centos/7/isos/x86_64/](http://mirrors.163.com/centos/7/isos/x86_64/)
> * 搜狐镜像：[http://mirrors.sohu.com/centos/7/isos/x86_64/](http://mirrors.sohu.com/centos/7/isos/x86_64/)
>

在正式开始之前，先检查检查 BIOS 虚拟化支持是否开启：【任务管理器 ctrl + shift + esc】-【性能】

<img src="https://img-blog.csdnimg.cn/img_convert/64747a755e1205bc1c4ce9aa1ed8276a.png" style="zoom:50%;" />

打开 VMware 新建虚拟机：

<img src="https://img-blog.csdnimg.cn/img_convert/8784e4051309fa6f6820306e5d3ca478.png" style="zoom: 33%;" />

虚拟机向导页面选择自定义：

<img src="https://img-blog.csdnimg.cn/img_convert/ffc20026a6b2469bd7e1505ae126e18a.png" style="zoom: 33%;" />

虚拟机硬件兼容性保持默认即可：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135921.png" style="zoom:33%;" />

安装客户机操作系统页面，选择稍后安装操作系统：

<img src="https://img-blog.csdnimg.cn/img_convert/09683267da117b98a229436babebd118.png" style="zoom:33%;" />

选择客户机操作系统页面，选择 Linux：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135861.png" style="zoom:33%;" />

设置虚拟机名称和存储位置（建议放在 C 盘以外的磁盘）：

<img src="https://img-blog.csdnimg.cn/img_convert/a81f197add654dcda22ee6b52bd03812.png" style="zoom:33%;" />

处理器配置页面需要根据自己电脑的实际情况来进行分配，可以打开【任务管理器 ctrl + shift + esc】，查看自己的电脑处理器数量与核数进行合理分配：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135913.png" style="zoom: 50%;" />

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135858.png" style="zoom: 33%;" />

设置虚拟机内存（选择 2 GB即可，后期可修改）：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135912.png" style="zoom:33%;" />

选择网络类型，推荐使用网络地址转换（NAT）：

> * 使用桥接网络：虚拟机相当于一台独立的与主机同级别的电脑，拥有自己独立的 IP 地址，外网能够单独访问到虚拟机。
> * 使用网络地址转换：外网不能直接访问虚拟机。

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135910.png" style="zoom:33%;" />

I/O 控制器类型保持默认：

<img src="https://img-blog.csdnimg.cn/img_convert/8a95953cb932c83764aca5e485a63cc5.png" style="zoom:33%;" />

磁盘类型保持默认：

<img src="https://img-blog.csdnimg.cn/img_convert/0653546b060bb128e8132e6d9c00163c.png" style="zoom:33%;" />

创建新的虚拟机磁盘：

<img src="https://img-blog.csdnimg.cn/img_convert/af6f28b911ec7e56aae933e6b323c9e9.png" style="zoom:33%;" />

指定磁盘容量（后期不可更改，可按需设置）：

<img src="https://img-blog.csdnimg.cn/img_convert/179b8426521fe380418c4f42d3562c70.png" style="zoom:33%;" />

指定磁盘文件保持默认即可：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135904.png" style="zoom:33%;" />

虚拟机信息页面直接点击完成：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135900.png" style="zoom:33%;" />

至此我们就搭建好了一台空的虚拟机：

<img src="https://img-blog.csdnimg.cn/img_convert/73fe1cbf373602305199717477994593.png" style="zoom:33%;" />

点击【编辑虚拟机设置】加载 Linux 的 ISO 镜像文件：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135925.png" style="zoom:33%;" />

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135917.png" style="zoom: 50%;" />

开启虚拟机：

<img src="https://img-blog.csdnimg.cn/img_convert/2ca39d7355080815aee619897402da6f.png" style="zoom: 33%;" />

加电后进入倒计时页面，点进虚拟机直接回车即可（此时要通过键盘操作，如果需要显示鼠标需要按 ctrl + alt 键）：

<img src="https://img-blog.csdnimg.cn/img_convert/de1f90d6ab53d7e289ab66956560a568.png" style="zoom:33%;" />

选择简体中文进行安装：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135908.png" style="zoom: 50%;" />

选择日期和时间，进入后点击完成即可：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135909.png" style="zoom:50%;" />

选择安装源，进入后点击完成：

<img src="https://img-blog.csdnimg.cn/img_convert/c65b58affe68dfe5d0290fc4d977efcb.png" style="zoom:50%;" />

选择软件选择，进入后选择 GNOME 桌面：

> 默认最小安装是纯命令行的界面，ifconfig 查询 ip 地址的命令没有，vim 编辑器也没用。需要执行命令安装。

<img src="https://img-blog.csdnimg.cn/img_convert/7078b730f810bc4d409eb9d02009cb6b.png" style="zoom:50%;" />

选择自动分区、不启用 Kdump、打开以太网，安全方针默认不动：

<img src="https://img-blog.csdnimg.cn/img_convert/4ee58d8438c57bcb2408fb004e95dd8c.png" style="zoom:50%;" />

点击开始安装，设置 root 密码（妥善保管）：

<img src="https://img-blog.csdnimg.cn/img_convert/e8afd3dbc5535f5ed056ca3c945a1c22.png" style="zoom:50%;" />

等待安装成功：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135929.png" style="zoom:50%;" />

安装成功后，重启虚拟机：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135930.png" style="zoom:50%;" />

同意许可协议：

<img src="https://img-blog.csdnimg.cn/img_convert/ef6732df1955d52fa64a40b61b1a7329.png" style="zoom:50%;" />

<img src="https://img-blog.csdnimg.cn/img_convert/44b9b8abb5e68da7545e560b74991205.png" style="zoom:50%;" />

点击完成配置：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135911.png" style="zoom:50%;" />

选择汉语点击前进：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135916.png" style="zoom:50%;" />

键盘布局选择汉语，点击前进：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135901.png" style="zoom:50%;" />

隐私设置，根据自己喜好选择即可：

<img src="https://img-blog.csdnimg.cn/img_convert/9380038ac464833a6b2ac4d4c8cead25.png" style="zoom:50%;" />

确定时区：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135907.png" style="zoom:50%;" />

跳过关联账号：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135902.png" style="zoom:50%;" />

CentOS7 要求必须设置一个账户，按照提示进行设置即可：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135919.png" style="zoom:50%;" />

开始使用：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135906.png" style="zoom:50%;" />

直接关闭下面的界面：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135920.png" style="zoom:50%;" />

注销当前账户：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135903.png" style="zoom:50%;" />

使用 root 账户登录：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135915.png" style="zoom:50%;" />

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135914.png" style="zoom:50%;" />

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135905.png" style="zoom:50%;" />

登录成功页面：

<img src="https://javgo-images.oss-cn-beijing.aliyuncs.com/2023-11-08-135924.png" style="zoom:50%;" />

OK，至此就完成了所有安装操作了！！！🎉🎉🎉🎉🎉🎉
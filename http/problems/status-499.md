# status-499

client has closed request

由nginx引入的非标准状态码。用于在nginx处理请求时，客户端关闭连接的情况。

服务端处理的时间过长，客户端等待时间过长，主动关闭连接。

## 问题场景描述

扫码请求后端接口，返回302，重定向到前端的一个H5页面。

手机浏览器、微信访问均正常。

快手、快手极速版访问，charles抓包表现为sent request, waiting for response. Nginx 返回499状态码。

## 尝试解决

排查过程

客户端容器同学排查，chrome加载过程卡在了stalled阶段。

stalled阶段是TCP连接的检查过程。检测成功，则使用该TCP连接发送数据，失败的话会重新建立TCP连接。
stalled阶段过长，往往是丢包所致。
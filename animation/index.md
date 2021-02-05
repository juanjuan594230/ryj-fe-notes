# 基于2021快手春节活动主界面动画实现的方案调研

## 动画的一些实现方案

- webGL（2D、3D） 或 canvas（2D） (动画复杂性较高，性能要求高) webGL不支持，考虑降级canvas
- 透明视频动画
- Lottie (基于webGL的JS库)
- pixijs ?
- gif
- 序列帧 & animation
- CSS animation

canvas  画布
webGL API 可以在canvas元素中使用（渲染高性能的交互式3D和2D图形）
canvas API 可以在canvas元素上进行2D图形处理

所以：大致猜想 webGL API + canvas画布


### 基于webGL的一些JS库调研

three.js


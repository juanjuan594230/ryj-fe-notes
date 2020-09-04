# 1px border

## devicePixelRatio 设备像素比

`window.devicePixelRatio`返回当前显示设备的物理像素与Css像素的比值。

```javascript
// iphone7
window.devicePixelRatio = 2 // 1px的Css像素需要由2px的物理像素来绘制
// 7p 8p
window.devicePixelRatio = 3 // 1px的Css像素需要由3px的物理像素来绘制
```

通常设计稿是按照物理像素的分辨率来做的图。比如实际的iphone7屏幕宽度为375，设计稿的宽度为750；

因此就会存在，设计稿上的1px border（物理像素的1px）。

1px的物理像素，如果要还原成CSS像素的话，在2倍屏幕上，应该是0.5px；在三倍屏幕上，应该是0.3333px；

如何去写style，才能适配不同设备像素比的设备，让其均显示1px的border。

## 1px 解决方式

### 小数 + 媒体查询

1px的物理像素，要还原成对应设备的Css像素。需要用到媒体查询，根据不同的设备像素比，设置不同的CSS像素值

```css
.border { border: 1px solid #000 };
@meida screen and (-webkit-min-device-pixel-ratio: 2) {
    .border { border: 0.5px solid #000 };
}
@meida screen and (-webkit-min-device-pixel-ratio: 3) {
    .border { border: 0.333px solid #000 };
}
```

### transform + before

```css
.border {
    position: relative;
}
.border::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #000;
    border-radius: 20px;
    transform-origin: left top;
    box-sizing: border-box;
    pointer-events: none;
}
@media screem and (-webkit-min-device-pixel-ratio: 2) {
    .border:before {
        width: 100%;
        height: 100%;
        transform: scale(0.5);
    }
}
@media screem and (-webkit-min-device-pixel-ratio: 3) {
    .border:before {
        width: 300%;
        height: 300%;
        transform: scale(0.333);
    }
}
```


#Zoom
图片放大镜插件
> 0.1.0

##快速开始
```html
<div data-plugin="zoom" data-size="300">
  <img src="" >
</div>
```

##构造函数
Zoom(Selector|Element)

##html属性
```html
<any data-plugin="zoom" data-size="300">
  <img src="" data-src="" >
</any>
```
###data-plugin
初始化插件，使用DOM初始化可以不用js初始化

###data-size
预览框的边长

###data-src
如果需要改变图片路径，则改变该属性，不要直接改src

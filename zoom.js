class Zoom {
  constructor(el) {
    if (typeof el === 'string') el = document.querySelector(el)
    el.style.position = 'relative'
    el.style.cursor = 'move'
    const size = parseInt(el.dataset.size, 10)
    const showImg = el.querySelector('img')
    let src = showImg.src
    const img = new Image()

    // 放大部分
    // 预览框
    const preview = document.createElement('div')
    const style = preview.style
    style.display = 'none'
    style.position = 'absolute'
    style.width = style.height = `${size}px`
    style.top = 0
    style.left = `${size + 10}px`
    style.backgroundColor = '#fff'
    style.backgroundRepeat = 'no-repeat'
    style.zIndex = 1
    el.appendChild(preview)

    // 放大遮罩
    const mask = document.createElement('div')
    let scale

    // 给遮罩添加样式
    const sty = mask.style
    sty.display = 'none'
    sty.position = 'absolute'
    sty.left = sty.top = 0
    sty.backgroundColor = 'rgba(254,222,79,.5)'
    sty.pointerEvents = 'none'
    el.appendChild(mask)

    // 初始化偏移值，避免使用时为undefined
    const loadimg = () => {
      mask.offsetX = mask.offsetY = 0
      img.src = src
      img.onload = () => {
        // 图片加载完成后才显示
        showImg.src = img.src
        /**
         * 鼠标在图片内移动
         * 实时放大局部
         * @param {any} e
         * @returns
         */
        const move = e => {
          if (e.target === preview) return false

          // 修正最小最大值边界，防止超出
          let mouseX = e.pageX
          let mouseY = e.pageY
          if (mouseX < el.offsetLeft + mask.size / 2) mouseX = el.offsetLeft + mask.size / 2
          if (mouseY < el.offsetTop + mask.size / 2) mouseY = el.offsetTop + mask.size / 2
          if (mouseX > el.offsetLeft + size - mask.size / 2) mouseX = el.offsetLeft + size - mask.size / 2
          if (mouseY > el.offsetTop + size - mask.size / 2) mouseY = el.offsetTop + size - mask.size / 2

          // 使用修正后的鼠标位置计算以图片左上角为圆点的坐标
          const x = mouseX - el.offsetLeft - img.offsetLeft
          const y = mouseY - el.offsetTop - img.offsetTop

          // 移动预览框
          sty.transform = `translate(${x + img.offsetLeft - mask.size / 2}px, ${y + img.offsetTop - mask.size / 2}px)`

          // 移动放大图片的位置
          style.backgroundPositionX = `${-x * scale + mask.offsetX * scale + mask.size / 2 * scale}px`
          style.backgroundPositionY = `${-y * scale + mask.offsetY * scale + mask.size / 2 * scale}px`
        }
        /**
         * 鼠标移入图片内
         * 显示放大预览和局部框
         * @returns
         */
        const enter = () => {
          // 如果图片尺寸太小，则不显示放大图
          if (img.width <= size && img.height <= size) return false
          // 大图url
          style.backgroundImage = `url(${showImg.src})`
          style.display = 'block'
          sty.display = 'block'
          el.addEventListener('mousemove', move)
        }

        el.addEventListener('mouseenter', enter)

        // 加载后判断长和宽
        if (img.width > img.height) {
          scale = img.width / size
          mask.size = size / scale
          mask.offsetY = (size - img.height / scale) / 2
        } else {
          scale = img.height / size
          mask.size = size / scale
          mask.offsetX = (size - img.width / scale) / 2
        }

        sty.width = sty.height = `${mask.size}px`

        el.addEventListener('mouseleave', () => {
          style.display = 'none'
          sty.display = 'none'
          el.removeEventListener('mousemove', move)
        })
      }
    }
    loadimg()

    // 监视showImg的data-src变化，在变化时重新设置放大镜里的图片
    const mo = new MutationObserver(record => {
      const rd = record[0]
      if (rd.attributeName === 'data-src') {
        src = showImg.dataset.src
        // 先显示加载图片
        showImg.src = 'http://lib.bzys.cn/img/loading.gif'
        loadimg()
      }
    })
    mo.observe(showImg, { attributes: true, attributeOldValue: true })
  }
}
if (document.querySelector('[data-plugin=zoom]')) new Zoom('[data-plugin=zoom]')

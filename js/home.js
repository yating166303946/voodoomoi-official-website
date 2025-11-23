function startCarousel (carouselId) {
    const root = document.getElementById(carouselId);
    const container = root.querySelector('.carousel-container');
    const prevBtn = root.querySelector('.prev');
    const nextBtn = root.querySelector('.next');

    const itemWidth = 200 * 4 / 3 + 48; // 圖片寬度 + gap

    // 更新按鈕狀態
    function updateButtons() {
      prevBtn.disabled = container.scrollLeft <= 0;
      nextBtn.disabled = container.scrollLeft + container.offsetWidth >= container.scrollWidth;
    }

    // 按鈕事件
    prevBtn.addEventListener('click', () => {
      container.scrollLeft -= itemWidth;
    });

    nextBtn.addEventListener('click', () => {
      container.scrollLeft += itemWidth;
    });

    // 滾動事件
    container.addEventListener('scroll', updateButtons);

    // 初始化
    updateButtons();
}

// 電商平台
startCarousel("brand-carousel")

// 合作夥伴
startCarousel("cooperate-carousel")


async function initCarousel (carouselRootSelector) {
  const root = document.querySelector(carouselRootSelector)
  if (!root) return null

  const track = root.querySelector('.track')

  // 標記已初始化，避免重複複製前後項目
  if (track.dataset.initialized) return
  track.dataset.initialized = true

  const group = root.querySelector('.img-container')
  const items = [...group.children]
  const nextBtn = root.querySelector('.next')
  const prevBtn = root.querySelector('.prev')
  
  const cloneCount = 1 // 前後各一組
  const totalGroups = cloneCount * 2 + 1 // 總組數
  const initTranslateX = (100 / totalGroups) * (totalGroups - 1 - cloneCount) // 中間那組
  const maxTranslateX = (100 / totalGroups) * (totalGroups - 1) // 最後一組
  const minTranslateX = 0
  const offsetPercent = (100 / totalGroups) / items.length // 每次位移 % 數
  
  // 前後各複製一組（頭尾銜接）
  track.prepend(group.cloneNode(true))
  track.append(group.cloneNode(true))

  let translateX = initTranslateX // 當前位移

  // 設定初始位移在中間那組
  track.style.transform = `translateX(-${initTranslateX}%)`

  // 移動邏輯
  function updatePosition(enableTransform = true) {
    track.style.transition = enableTransform ? 'transform 0.6s ease' : ''
    track.style.transform = `translateX(${-translateX}%)`
  }

  // 重設回初始位置
  function resetPosition() {
    requestAnimationFrame(() => {
      translateX = initTranslateX
      updatePosition(false)
    })
  }

  // 綁定事件
  const onNext = () => {
    translateX = Number((translateX + offsetPercent).toFixed(2))
    updatePosition()

    if (translateX > maxTranslateX) {
      track.addEventListener('transitionend', resetPosition, { once: true })
    }
  }

  const onPrev = () => {
    translateX = Number((translateX - offsetPercent).toFixed(2))
    updatePosition()

    if (translateX < minTranslateX) {
      track.addEventListener('transitionend', resetPosition, { once: true })
    }
  }

  nextBtn.addEventListener('click', onNext)
  prevBtn.addEventListener('click', onPrev)

  return {
    destroy() {
      nextBtn.removeEventListener('click', onNext)
      prevBtn.removeEventListener('click', onPrev)
    }
  }
}


function initImgCarousel (carouselId) {
    const carousel = document.getElementById(carouselId)
    let index = 0
    let slideCount = carousel.children.length
    let slideInterval = null
    const scrollbarWidth = 5

    function updateTransform() {
      const width = window.innerWidth - scrollbarWidth
      carousel.style.transform = `translateX(${-width * index}px)`
    }

    function nextSlide() {
      const width = window.innerWidth - scrollbarWidth
      index = index + 1

      carousel.style.transition = 'transform 1s ease-in-out'
      carousel.style.transform = `translateX(${-width * index}px)`

      if (index === slideCount - 1) {
        window.addEventListener('transitionend', reset, { once: true })
      }
    }

    function reset() {
      index = 0
      carousel.style.transition = 'none'
      updateTransform()
    }

    // 啟動自動播放
    function startCarousel() {
      if (slideInterval) clearInterval(slideInterval)
      slideInterval = setInterval(nextSlide, 6000)
    }

    // 視窗大小變更時重新計算距離
    window.addEventListener('resize', () => {
      carousel.style.transition = 'none'
      updateTransform()
    })

    // 啟動
    startCarousel()
}

// 首頁 hero 輪播
initImgCarousel("hero-carousel")

// 首頁 Grllery
const galleryBtns = document.querySelectorAll('#gallery .card-btn')
const galleryCards = document.querySelectorAll('#gallery .card')

galleryBtns.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    galleryCards.forEach(c => c.classList.remove('open'))

    const card = galleryCards[index]
    card.classList.add('open')
  })
})
function startLogoCarousel (carouselId) {
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
// startLogoCarousel("brand-carousel")

// 合作夥伴
startLogoCarousel("cooperate-carousel")
        

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


function initImgCarousel(carouselId) {
  const carousel = document.getElementById(carouselId)
  const slides = carousel.querySelectorAll('a')
  const scrollbarWidth = 5
  let slideCount = slides.length
  let slideInterval = null
  let index = 0

  function updateTransform() {
    const width = window.innerWidth
    carousel.style.transform = `translateX(${-width * index - scrollbarWidth}px)`
  }

  function nextSlide() {
    const width = window.innerWidth
    index = index + 1

    carousel.style.transition = 'transform 1s ease-in-out'
    carousel.style.transform = `translateX(${-width * index - scrollbarWidth}px)`

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

  // 輪播項點擊事件產生器
  function createClickHandler(link) {
    return function handleSlideClick(event) {
      // 如果點擊目標是按鈕，阻止冒泡
      if (event.currentTarget.tagName === 'BUTTON') {
        event.stopPropagation()
      } else {
        event.preventDefault()
      }

      window.location.href = link
    }
  }

  // 將點擊監聽器添加到每個輪播項
  slides.forEach(slide => {
    const link = slide.getAttribute('data-link').trim()

    if (link) {
      const clickHandler = createClickHandler(link)
      slide.addEventListener('click', clickHandler)

      // 如果輪播項包含自訂按鈕
      const customBtn = slide.querySelector('button')
      if (customBtn) {
        customBtn.addEventListener('click', clickHandler)
      }
    }
  })

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
// const galleryCards = document.querySelectorAll('#gallery .card')
// const galleryBtns = document.querySelectorAll('#gallery .card-btn')

// 處理按鈕點擊（展開卡片）
/*
galleryBtns.forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation()
    galleryCards.forEach(c => c.classList.remove('open'))
    galleryCards[index].classList.add('open')
  })
})

// 處理卡片點擊（判斷是否跳轉）
galleryCards.forEach(card => {
  card.addEventListener('click', (e) => {
    // 如果點擊的是按鈕，不處理
    if (e.target.closest('.card-btn')) {
      return
    }

    // 如果卡片是 open 狀態，才跳轉
    if (card.classList.contains('open')) {
      const url = card.getAttribute('data-url')
      window.location.href = url
    }
  })
})
*/

// 首頁 Brand Story
const brandStoryBtn = document.getElementById('brand_story_btn')
brandStoryBtn.addEventListener('click', function() {
  // 跳轉到『關於好魔』頁
  window.location.href = 'https://www.voodoomoi.com/pages/philosophy';
})
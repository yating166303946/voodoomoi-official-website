const { Liquid } = require('liquidjs')
const express = require('express')
const fs = require('fs')

// const engine = new Liquid({
//   root: process.cwd(), // 讓 parseFile 可以找到檔案
//   extname: '.liquid'
// })

// 自訂 asset_source filter
// engine.registerFilter('asset_source', (filename) => {
//   // 這裡可以模擬 Shopline 的資源 URL
//   return `/assets/${filename}`
// })

// ;(async () => {
//   const tpl = await engine.parseFile('index.liquid')
//   // const mockData = JSON.parse(fs.readFileSync('mock-data.json', 'utf8'))
//   const html = await engine.render(tpl, mockData)
//   console.log(html)
// })()


const app = express()
const engine = new Liquid({
  root: 'views', // 模板目錄
  extname: '.liquid'
})

app.engine('liquid', engine.express()) // 套 liquidjs
app.set('views', './views')
app.set('view engine', 'liquid')

app.get('/', (req, res) => {
  res.render('index', {
    shop: {
      name: '我的商店',
      currency: 'TWD',
      products: [
        { name: '商品A', price: 100 },
        { name: '商品B', price: 200 }
      ]
    }
  })
})

app.listen(3000, () => {
  console.log('伺服器啟動：http://localhost:3000')
})

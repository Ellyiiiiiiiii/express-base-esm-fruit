import express from 'express'
const router = express.Router()

// 資料庫使用
// import { Op } from 'sequelize'
import sequelize from '#configs/db.js'
const { My_Product } = sequelize.models

// GET - 得到所有資料
router.get('/', async function (req, res) {
  const products = await My_Product.findAll({ logging: console.log })
  // 處理如果沒找到資料

  // 標準回傳JSON
  return res.json({ status: 'success', data: { products } })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const product = await My_Product.findByPk(id, {
    raw: true,
  })

  return res.json({ status: 'success', data: { product } })
})

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'my-products' })
// })

export default router

// 從會員路由 users.js 更改
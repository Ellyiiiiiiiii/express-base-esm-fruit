import express from 'express'
const router = express.Router()

// 資料庫使用
// import { Op } from 'sequelize'
// import sequelize from '#configs/db.js'
// const { My_Product } = sequelize.models

// 引入自己的 mysql
import db from '#configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {

  //  分頁(查詢字串 QS: page=2 & per page=5)
  // 預設值 page = 1, perpage = 10
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 10
  const offset = (page-1) * perpage
  const limit = perpage

  const [rows] = await db.query(`SELECT * FROM my_product LIMIT ${limit} OFFSET ${offset}`)
  const products = rows

  // 
  const [rows2] = await db.query(`SELECT COUNT(*) AS count FROM my_product`)
  const { count } = rows2[0]

  // 標準回傳JSON
  return res.json({ status: 'success', data: { products } })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const [rows] = await db.query('SELECT * FROM my_product WHERE id = ?', [id])
  const product = rows[0]

  return res.json({ status: 'success', data: { products } })
})

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'my-products' })
// })

export default router

// 從會員路由 users.js 更改
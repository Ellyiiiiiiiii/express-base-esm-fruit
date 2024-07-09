import express from 'express'
const router = express.Router()

// 資料庫使用
// import { Op } from 'sequelize'
// import sequelize from '#configs/db.js'
// const { My_Product } = sequelize.models

// router.get('/', async function (req, res) {})

// 引入自己的 mysql
import db from '#configs/mysql.js'

// GET - 得到所有資料
router.get('/', async function (req, res) {
  // where條件 ----- START 分每個條件加入到conditions陣列
  const conditions = []

  // keyword(查詢字串 QS: name_like=sa)
  const name_like = req.query.name_like || ''
  conditions[0] = name_like ? `name LIKE '%${name_like}%'` : ''

  // 品牌 複選(查詢字串 QS: brands=Apple,Google)
  const brands = req.query.brands ? req.query.brands.split(',') : []
  conditions[1] =
    brands.length > 0 ? brands.map((v) => `brand = '${v}'`).join(` OR `) : ''

  // 價格區間>=5000, <=15000查詢(查詢字串 QS: price_gte=5000&price_lte=15000)
  const price_gte = Number(req.query.price_gte) || 0 // 最小價格
  const price_lte = Number(req.query.price_lte) || 20000 // 最大價格
  conditions[2] = `price BETWEEN ${price_gte} AND ${price_lte}`

  const cvs = conditions.filter((v) => v)
  const where =
    cvs.length > 0 ? 'WHERE ' + cvs.map((v) => `( ${v} )`).join(` AND `) : ''

    console.log(where)
  // 排序(查詢字串 QS: sort=price&order=asc)(順向asc, 逆向desc)
  const sort = req.query.sort || 'id' // 預設排序資料庫欄位
  const order = req.query.order || 'asc'
  // 允許的order字串
  const sortList = ['id', 'price']
  const orderList = ['asc', 'desc']
  let orderby = ''
  // 要符合可用的order字串
  if (orderList.includes(order) && sortList.includes(sort)) {
    orderby = `ORDER BY ${sort} ${order}`
  }

  //  分頁(查詢字串 QS: page=2 & per page=5)
  // 預設值 page = 1, perpage = 10
  const page = Number(req.query.page) || 1
  const perpage = Number(req.query.perpage) || 10
  const offset = (page - 1) * perpage
  const limit = perpage

  // sql where order limit+offset
  const [rows] = await db.query(
    `SELECT * FROM my_product ${where} ${orderby} LIMIT ${limit} OFFSET ${offset}`
  )
  const products = rows

  // 計算在此條件下總共多少筆(WHERE)
  const [rows2] = await db.query(
    `SELECT COUNT(*) AS count FROM my_product ${where}`
  )
  const { count } = rows2[0]

  // 計算總頁數
  const pageCount = Math.ceil(count / perpage)

  // 標準回傳JSON
  return res.json({
    status: 'success',
    data: {
      total: count, // 總筆數
      pageCount, // 總頁數
      page, // 目前頁
      perpage, // 每頁筆數
      products,
    },
  })
})

// GET - 得到單筆資料(注意，有動態參數時要寫在GET區段最後面)
router.get('/:id', async function (req, res) {
  // 轉為數字
  const id = Number(req.params.id)

  const [rows] = await db.query('SELECT * FROM my_product WHERE id = ?', [id])
  const product = rows[0]

  return res.json({ status: 'success', data: { product } })
})

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'my-products' })
// })

export default router

// 從會員路由 users.js 更改
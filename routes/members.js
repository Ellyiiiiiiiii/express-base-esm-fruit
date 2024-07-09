import express from 'express'
const router = express.Router()

// 資料庫使用
import { Op } from 'sequelize'
import sequelize from '#configs/db.js'
const { Member } = sequelize.models


// router.get('/:id', async function (req, res) {
//   const id = Number(req.params.id)

//   const [rows] = await db.query(``)
// })

router.post('/', async function (req, res) {
  // req.body資料範例
  // {
  //     "name":"金妮",
  //     "email":"ginny@test.com",
  //     "username":"ginny",
  //     "password":"12345"
  // }

  // 要新增的會員資料
  const newMember = req.body

  // 檢查從前端來的資料哪些為必要(name, username...)
  if (
    !newMember.username ||
    !newMember.email ||
    !newMember.name ||
    !newMember.password
  ) {
    return res.json({ status: 'error', message: '缺少必要資料' })
  }

  // 執行後user是建立的會員資料，created為布林值
  // where指的是不可以有相同的資料，如username或是email不能有相同的
  // defaults用於建立新資料用需要的資料
  const [member, created] = await Member.findOrCreate({
    where: {
      [Op.or]: [{ username: newMember.username }, { email: newMember.email }],
    },
    defaults: {
      name: newMember.name,
      password: newMember.password,
      username: newMember.username,
      email: newMember.email,
    },
  })

  // 新增失敗 created=false 代表沒新增
  if (!created) {
    return res.json({ status: 'error', message: '建立會員失敗' })
  }

  // 成功建立會員的回應
  // 狀態`201`是建立資料的標準回應，
  // 如有必要可以加上`Location`會員建立的uri在回應標頭中，或是回應剛建立的資料
  // res.location(`/users/${user.id}`)
  return res.status(201).json({
    status: 'success',
    data: null,
  })
})

/* GET home page. */
// router.get('/', function (req, res, next) {
//   res.render('index', { title: 'members' })
// })

export default router
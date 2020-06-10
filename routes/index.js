const router = require('koa-router')()
const upload = require('../utils/upload')
const controller = require('../controller')

const JZ_HEADER = '/jzsir/';

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})


router.get(JZ_HEADER + 'code/checkcode', controller.code.getCode)//获取验证码
router.post(JZ_HEADER + 'user/register', controller.user.register)
router.post(JZ_HEADER + 'user/login', controller.user.login)
router.post(JZ_HEADER + 'record/add', upload.array('img', 5), controller.record.addRecord)
router.post(JZ_HEADER + 'record/getRecord', controller.record.getRecord)
router.delete(JZ_HEADER + 'record/deleteRecord/:id', controller.record.deleteRecord)
router.get(JZ_HEADER + 'record/getRecordById/:id', controller.record.getRecordById)
router.post(JZ_HEADER + 'record/updateRecordById', upload.array('img', 5), controller.record.updateRecordById)
router.post(JZ_HEADER + 'record/deleteImg', controller.record.deleteImg)


module.exports = router

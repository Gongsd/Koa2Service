const router = require('koa-router')()
const upload = require('../utils/upload')
const controller = require('../controller')

const JZ_HEADER = '/jzsir';

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


router.get(JZ_HEADER + '/code/checkcode', controller.code.getCode)//获取验证码


module.exports = router

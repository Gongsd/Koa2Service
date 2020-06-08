const { TOKEN_ENCODE_STR, URL_YES_PASS } = require('./config')
const CheckCode = require('../db').CheckCode
const User = require('../db').User
const jwt = require('jsonwebtoken')

module.exports = {
    createToken (str) {
        return jwt.sign({str}, TOKEN_ENCODE_STR, { expiresIn : '1h'})
    },
    async checkToken (ctx, next){
        let url = ctx.url
        if(ctx.method !== 'GET' && !URL_YES_PASS.includes(url)){
            let token = ctx.get('Authoriztion')
            if(token === ''){
                ctx.status = 401
                ctx.body = '您还没有登陆，快去登录吧'
                return
            }
            try {
                let {str = ''} = await jwt.verify(token, TOKEN_ENCODE_STR)
                let res = await User.find({user_id : str, token})
                if(res.length === 0){
                    ctx.status = 401
                    ctx.body = '登陆过期，请重新登录！'
                    return
                }
                ctx._id = res[0]._id
                ctx.name = res[0].user_name
                ctx.avatar = res[0].avatar
            }catch (e){
                ctx.status = 401
                ctx.body = '登陆已过期，请重新登录！'
                return
            }
        }
        await next()
    },
    async checkTokenCode ( {token, code }){
        try {
            code = code.toUpperCase()
            await jwt.verify(token, TOKEN_ENCODE_STR)
            //读数据库 删除验证码
            let res = await CheckCode.findOneAndDelete({token, code})
            if(res == null){
                return false
            }
        }catch (e){
            return false
        }
        return true
    }
}
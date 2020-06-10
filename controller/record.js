const Record = require('../db').Record
const xss = require('xss')

module.exports = {
    async addRecord(ctx, next){
        let {title, type, detail} = ctx.request.body
        let files = ctx.request.files
        let img = []

        files.forEach( (elem, index) => {
            img.push({
                name : elem.orignalname,
                // serviceip + /server/public/images/' + elem.originalname
                url : 'http://localhost:3000/images' + elem.orignalname
            })
        });

        title = xss(title)
        detail = xss(detail)
        try {
            let record = new Record({
                user_id : ctx._id,
                creater : ctx.name,
                avatar : ctx.avatar,
                detail,
                title,
                type,
                img,
                view : 0
            })
            let res = await record.save()
            if(res._id != null){
                ctx.body = {
                    code : 200,
                    msg : '创建成功!',
                    data : res
                }
            }else{
                ctx.body = {
                    code : 500,
                    msg : '创建失败，服务器异常，请稍后再试！'
                }
            }
        } catch (e){
            console.log(e)
            ctx.body = {
                code : 500,
                msg : '留言失败，服务器异常，请稍后再试！'
            }
        }
    },
    async getRecord(ctx, next){
        let {pageSize, pageNum, type, creater, view} = ctx.request.body
        let options = {
            skip : Number((pageNum - 1) * pageSize),
            limit : Number(pageSize),
            sort : {'create_time' : '-1'}
        }
        let queryParam = {}
        if(type){
            queryParam.type = type
        }
        if(creater){
            queryParam.creater = new RegExp(creater)
        }
        if(view){
            if(view !== 5){
                queryParam.view = {
                    $gte : 10 * (view - 1),
                    $lt : 10 * view
                }
            }
        }else{
            queryParam.view = {
                $gte : 10 * (view - 1)
            }
        }
        let res = await Record.find(queryParam, null, options)
        let total = await Record.countDocuments(queryParam, null, options)
        ctx.body = {
            code : 200,
            data : {
                list : res,
                total
            },
            msg : '获取数据成功'
        }
    },
    async deleteRecord (ctx, next){
        let _id = ctx.params.id
        try {
            let res = await Record.findOneAndDelete({_id})
            if(res == null){
                ctx.body = {
                    code : 500,
                    msg : '删除留言失败，服务器异常'
                }
            }else{
                ctx.body = {
                    code : 200,
                    msg : '删除留言成功！'
                }
            }
        } catch (e) {
            console.log(e)
            ctx.body = {
                code : 500,
                msg : '删除留言失败，服务器异常!'
            }
        }
    },
    async getRecordById (ctx, next){
        let _id = ctx.params.id
        try {
            let res = await Record.findOneAndUpdate({_id}, {$inc : {'view' : 1}}, {returnNewDocument : true})
            ctx.body = {
                code : 200,
                msg : '获取详情成功',
                data : res
            }
        } catch (e){
            ctx.body = {
                code: 500,
                msg: '获取详情失败，服务器异常!'
            }
        }
    },
    async updateRecordById(ctx, next){
        let {id, detail, type, title} = ctx.request.body
        let files = ctx.request.files
        let img = []

        files.forEach((elem, index) => {
            img.push({
                name : elem.originalname,
                url : 'http://localhost:3000/images' + elem.orignalname
            })
        })
        try {
            let res = await Record.findOneAndUpdate({_id : id}, {
                $set : {
                    detail,
                    type,
                    title
                },
                $addToSet : {img}
            }, {new : true})
            if (res !== null) {
                ctx.body = {
                  code: 200,
                  msg: '更新数据成功'
                }
              }
        }catch(e){
            ctx.body = {
                code: 500,
                msg: '更新数据失败，服务器异常'
              }
        }
    },
    async deleteImg(ctx, img){
        let { name, id } = ctx.request.body
        try {
            let res = await Record.update({ _id: id }, {
                $pull: { img: { name } }
              })
              if (res !== null) {
                ctx.body = {
                  code: 200,
                  msg: '删除图片成功'
                }
              }
        }catch(e){
            ctx.body = {
                code: 500,
                msg: '删除图片失败，服务器异常'
              } 
        }
    }

}

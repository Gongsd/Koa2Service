const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

mongoose.connect('mongodb://localhost:27017/jzsir', {useNewUrlParser : true}, function(err){
    if(err){
        console.log('connect mongodb fail...')
        console.log(err)
    }else{
        console.log('connect mongodb success...')
    }
})

const Schema = mongoose.Schema

let checkcodeSchema = new Schema({
    token : String,
    code : String
})

let userSchema = new Schema({
    user_name : String,
    user_id : String,
    user_pwd : String,
    avatar : {
        type : String,
        default : ''
    },
    token : {
        type : String,
        default : ''
    }
})

let recordSchema = new Schema({
    title : String,
    type : String,
    detail : String,
    create_time : {
        type: String,
        default : Date.now
    },
    img : Array,
    view : 0,
    creater : String,
    avatar : String,
    user_id : {
        type : mongoose.Schema.ObjectId,
        ref : 'User'
    }
})

exports.CheckCode = mongoose.model('CheckCode', checkcodeSchema)
exports.User = mongoose.model('User', userSchema)
exports.Record = mongoose.model('Record', recordSchema)
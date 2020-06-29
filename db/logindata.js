const mongoose=require('mongoose')
const userschema= new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    playername:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    tag:{
        type:String,
        required:true
    },
    phonenumber:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    }

})
const User=mongoose.model('user',userschema)
module.exports=User
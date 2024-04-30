import mongoose from "mongoose";

const rec=new mongoose.Schema({
    companyname:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    companyemail:{
        type:String,
        required:true
    },
    jobs:{
        type:Array,
        required:false
    }
})

export default mongoose.model('rec',rec);
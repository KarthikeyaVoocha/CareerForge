import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    }
})

export default mongoose.model('User',dataSchema)
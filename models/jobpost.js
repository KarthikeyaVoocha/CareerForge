import mongoose from "mongoose";

const job= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    companyname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    Lastapplicationdate:{
        type:Date,
        required:false
    },
    candidatesApplied:{
        type:Array,
        required:false
    }
})

export default mongoose.model("job",job);
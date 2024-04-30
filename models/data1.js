import mongoose from 'mongoose';

const user=new mongoose.Schema({
    name: {type : String,
        required: true,
        unique: true
    },
    email: {type : String,
        required: true,
        unique:true
    },
    password: {type : String,
        required: true
    },
    applied:{type: Array,
        required:false
    }
})

export default mongoose.model('user',user)
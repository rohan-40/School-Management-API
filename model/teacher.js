const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const teacherSchema = mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    DOB:{
        type: String,
        required: true
    },
    teacherID:{
        type: Number,
        required: true,
        unique: true
    },
    email:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    subject:{
        type: String,
        enum: ['math','english','science'],
        required: true
    },
    password:{
        type: String,
        required: true
    }

});

teacherSchema.pre('save', async function (next){
    const teacher = this;
    if(!teacher.isModified('password'))
    {
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(teacher.password,salt)

        teacher.password = hashedPassword;
        next();
    }
    catch(err){
        return next(err);
    }
})

teacherSchema.methods.comparePassword = async function(teacherPassword){
    try{
        const isMatch = await bcrypt.compare(teacherPassword,this.password);
        return isMatch
    }
    catch(err){
        return next(err);
    }
}

const Teacher = mongoose.model('Teacher',teacherSchema);

module.exports = Teacher;
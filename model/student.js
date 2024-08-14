const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = mongoose.Schema({
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
    fatherName:{
        type: String,
        required: true
    },
    class:{
        type: Number,
        enum: [8,9,10,11,12],
        required: true
    },
    rollno:{
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
    password:{
        type: String,
        required: true
    },
    attendance:{
        type: Number,
        required: true,
        default: 0
    }
});


studentSchema.pre('save',async function(next){
    const student = this;
    if(!student.isModified('password'))
    {
        return next();
    }
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(student.password,salt);
    
        student.password = hashedPassword;
        return next();
    }
    catch(err){
        return next(err);
    }
})

studentSchema.methods.comparePassword = async function(studentPassword){
    try{
        const isMatch = await bcrypt.compare(studentPassword,this.password)
        return isMatch;
    }
    catch(err)
    {
        throw err;
    }
}


const Student = mongoose.model('Student',studentSchema);
module.exports = Student;
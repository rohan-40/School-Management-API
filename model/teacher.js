const mongoose = require('mongoose');
const { type } = require('os');

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
        type: Date,
        required: true
    },

    fatherName:{
        type: String,
        required: true
    },
    teacherId:{
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
    }

});

const Teacher = mongoose.model('Teacher',teacherSchema);

module.exports = Teacher;
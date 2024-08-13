const express = require('express');
const router = express.Router();
const Student = require('../model/student');

router.post('/signup', async (req,res)=>{

    try{
        const data = req.body;

        const studentData = new Student(data);
        const response = await studentData.save();

        console.log("Student Created");
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }

})

router.post('/login', async(req,res)=>{
    try{
        const {rollno,password} = req.body;
        if(!rollno || !password)
        {
            return res.status(401).json({message: "Please give Both rollno and password"})
        }
        const student = await Student.findOne({rollno:rollno})

        if(!student || !(await student.comparePassword(password))){
            return res.status(401).json({message: "Student Not found or Password Incorrect"});
        }

        console.log("Login Successfully");
        res.status(200).json(student);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
})

module.exports = router;
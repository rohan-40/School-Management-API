const express = require('express');
const router = express.Router();
const Student = require('../model/student');
const {jwtMiddleWare,generateToken} = require('../jwt');
const Curricular = require('../model/curricular');

// To Register Students
router.post('/signup', async (req,res)=>{

    try{
        const data = req.body;

        const studentData = new Student(data);
        const response = await studentData.save();

        const payload = {
            id: response.id
        }

        const token = generateToken(payload);
        console.log("Student Created");
        res.status(200).json({response:response,token:token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }

})

// To Login and Generate Token By Students
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

        const payload = {
            id: student.id
        }
        const token = generateToken(payload);

        console.log("Login Successfully");
        res.status(200).json({token:token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
})

// To check Profile (By Student)
router.get('/profile', jwtMiddleWare, async(req,res)=>{
    try{
        const data = req.user.id;
        const student = await Student.findById(data);

        res.status(200).json(student);
    }
    catch(err)
    {    
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})
    }
})

// To Change the password of Profile (By Teacher)
router.put('/profile/password',jwtMiddleWare,async(req,res)=>{
    try{
        const data = req.user.id;
        const {currentPassword,newPassword} = req.body;
        const student = await Student.findById(data);
        if(!currentPassword || !newPassword)
        {
            return res.status(401).json({message: "Please give Both Current and New Password"});
        }
        if(!student || !(await student.comparePassword(currentPassword)))
        {
            return res.status(401).json({message: "Student not found or Password Incorrect"});
        }

        student.password = newPassword;
        await student.save();

        res.status(200).json({message: "Password Change Successfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})  
    }
})

// To check the Attendance (By Student)
router.get('/attendance',jwtMiddleWare,async (req,res)=>{
    try{
        const data = req.user.id;
        const student = await Student.findById(data);

        const response = {
            name: student.name,
            rollno: student.rollno,
            attendance: student.attendance,
        }

        console.log("Attendance fetched Successfully")
        res.status(200).json(response);

    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To check Curricular (By Student)
router.get('/curricular',jwtMiddleWare, async(req,res)=>{
    try{
        const response = await Curricular.find();
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})
module.exports = router;
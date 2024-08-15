const express = require('express');
const router = express.Router();
const Teacher = require('../model/teacher');
const {jwtMiddleWare,generateToken} = require('../jwt');
const Student = require('../model/student');
const Curricular = require('../model/curricular');

// To Register Teacher
router.post('/signup',async (req,res) =>{
    try{
        const data = req.body;
        const teacher = new Teacher(data);
        const response = await teacher.save();

        const payload = {
            id: response.id
        }

        const token = await generateToken(payload);
        console.log("Teacher Created");
        res.status(200).json({response,token});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To login and Generate Token
router.post('/login',async (req,res)=>{
    try{
        const {teacherId,password} = req.body;
        if(!teacherId || !password)
        {
            return res.status(401).json({message: "Please Give Both Id and Password"})
        }
        const teacher = await Teacher.findOne({teacherId:teacherId});
        if(!teacher || !(await teacher.comparePassword(password)))
        {
            return res.status(401).json({message: "Teacher not Found or Password Incorrect"});
        }

        const payload = {
            id: teacher.id
        }

        const token = await generateToken(payload);
        console.log("Login Successfully");
        res.status(200).json({token})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To Check Teacher Profile
router.get('/profile',jwtMiddleWare, async (req,res)=>{
    try{
        const data = req.user.id;
        const teacher = await Teacher.findById(data);

        if(!teacher)
        {
            return res.status(401).json({message: "Teacher not Found"});
        }

        console.log("Profile Fetched");
        res.status(200).json(teacher);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To change Teacher Profile Password
router.put('/profile/password',jwtMiddleWare, async (req,res)=>{
    try{
        const {currentPassword,newPassword} = req.body;
        if(!currentPassword || !newPassword)
        {
            return res.status(401).json({message: "Please give both current and new Password"})
        }
        const teacher = await Teacher.findById(req.user.id);
        if(!teacher || !(await teacher.comparePassword(currentPassword)))
        {
            return res.status(401).json({message: "Teacher not found or Password Incorrect"});
        }

        teacher.password = newPassword;
        await teacher.save();
        console.log("Password Changed")
        res.status(200).json({message: "Password Changed Successfully"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To see the list of all Student in School (By Teacher)
router.get('/student',jwtMiddleWare, async (req,res)=>{
    try{
        const data = req.user.id;
        const teacher = await Teacher.findById(data);
        if(!teacher)
        {
            return res.status(401).json({message: "You are not Teacher"});
        }

        const response = await Student.find().sort({class: 1});
        console.log("Data Fetched Successfully");
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To check student details by theri rollno (By Teacher)
router.get('/student/:rollno',jwtMiddleWare,async(req,res)=>{
    try{
        const data = req.user.id;
        const teacher = await Teacher.findById(data);
        if(!teacher)
        {
            return res.status(401).json({message: "You are not Teacher"});
        }

        const studentId = req.params.rollno;

        const response = await Student.findOne({rollno:studentId});
        console.log("Data Fetched Successfully");
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To Delete student by their rollno (By Teacher)
router.delete('/student/:rollno',jwtMiddleWare,async(req,res)=>{
    try{
        const data = req.user.id;
        const teacher = await Teacher.findById(data);
        if(!teacher)
        {
            return res.status(401).json({message: "You are not Teacher"});
        }

        const studentId = req.params.rollno;

        const response = await Student.deleteOne({rollno:studentId});

        console.log("Student delete Successfully");
        res.status(200).json({message: "Student deleteSuccessfully"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To check Student in Particular Class (By Teacher)
router.get('/student/class/:classNo',jwtMiddleWare, async(req,res)=>{
    try{
        const data = req.user.id;
        const teacher = await Teacher.findById(data);
        if(!teacher)
        {
            return res.status(401).json({message: "You are not Teacher"});
        }

        const classNo = req.params.classNo;
        const response = await Student.find({class:classNo}).sort({rollno: 1});
        console.log("Data Fetched Successfully");
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To Update Attendance of Students (By Teacher)
router.get('/student/attendance',jwtMiddleWare, async(req,res)=>{
    try{
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To Create new Curricular (By Teacher)
router.post('/curricular',jwtMiddleWare, async(req,res)=>{
    try{
        const data = req.user.id;
        const teacher = await Teacher.findById(data);
        if(!teacher)
        {
            return res.status(401).json({message: "You are not Teacher"});
        }

        const newData = req.body;
        const newCurricular = await new Curricular(newData);
        await newCurricular.save();

        console.log("New Curricular Created");
        res.status(200).json(newCurricular);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To view the Curricular 
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

// To Update notice Board (By Teacher)
router.put('/curricular',jwtMiddleWare, async(req,res)=>{
    try{
        const data = req.user.id;
        const teacher = await Teacher.findById(data);
        if(!teacher)
        {
            return res.status(401).json({message: "You are not Teacher"});
        }

        const curricular = await Curricular.findOne();
        const {notice} = req.body;
        curricular.notice = notice;
        await curricular.save();

        console.log("Curricular updated");
        res.status(200).json(curricular);
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})

// To Delete Curricular (By Teacher)
router.delete('/curricular',jwtMiddleWare, async(req,res)=>{
    try{
        const data = req.user.id;
        const teacher = await Teacher.findById(data);
        if(!teacher)
        {
            return res.status(401).json({message: "You are not Teacher"});
        }

        const curricular = await Curricular.deleteOne();

        console.log("Curricular Deleted");
        res.status(200).json({message: "Curricular Deleted Successfully"})
    }
    catch(err){
        console.log(err);
        res.status(500).json({message: "Internal Server Error"})       
    }
})


module.exports = router;
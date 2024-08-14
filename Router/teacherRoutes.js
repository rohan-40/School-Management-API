const express = require('express');
const router = express.Router();
const Teacher = require('../model/teacher')
const {jwtMiddleWare,generateToken} = require('../jwt');

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

router.post('/login',async (req,res)=>{
    try{
        const {teacherID,password} = req.body;
        if(!teacherID || !password)
        {
            return res.status(401).json({message: "Please Give Both Id and Password"})
        }
        const teacher = await Teacher.findOne({teacherID:teacherID});
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

module.exports = router;
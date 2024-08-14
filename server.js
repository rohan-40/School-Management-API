const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const StudentRoutes = require('./Router/studentRoutes');
const TeacherRoutes = require('./Router/teacherRoutes');

app.use('/student',StudentRoutes);
app.use('/teacher',TeacherRoutes);

app.listen(3000,()=>{
    console.log("Server is Listing on Port 3000");
})
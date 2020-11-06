const router = require("express").Router();
const mustAuthnticated= require('../auth/index')
const baseUsers = require("../models/baseUsers.js");
router.get("/",mustAuthnticated,(req,res)=>
{   
    baseUsers.find({}).then(data=>res.status(200).json(data))
    
    console.log("User want users rating")
})

module.exports = router;
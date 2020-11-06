const passport = require("passport");

const router = require("express").Router();
const path= require('path');

const auth=passport.authenticate('locals',{session:true})
router.get("/",(req,res)=>res.sendFile(path.resolve(__dirname,'../client','login.html')))
router.post("/auth",auth,async(req,res)=> res.redirect('/login'))

module.exports = router;
const router = require("express").Router();
const mustAuthnticated= require('../auth/index')
const questions = require("../models/questions.js");
router.get("/",mustAuthnticated,(req,res)=>
{   
    questions.find({}).limit(10).then(data=>res.status(200).json(data))
})

router.get('/:pageNumber',mustAuthnticated,async function (req, res) {
  console.log("User want list words")
  let number = parseInt(req.params.pageNumber)
  let findobj ={}
  console.log(number)
  if(number==1){
    findobj = {['$gte']:((number-1)*10),['$lte']:number*10+9}
  }
  else{
    findobj = {['$gte']:(number*10),['$lte']:number*10+19}
  }
  let counter= await questions.count( {  } )
  counter=Math.ceil(counter/10)-2
  questions.find( { id: findobj } ).then(data=>res.status(200).json({questions:data,totalPages:counter}))
})

module.exports = router;
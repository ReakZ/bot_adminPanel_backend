const express = require("express");
const path= require('path');
const db = require("mongoose");
const User = require("./models/administrators")
const passport= require("passport")
const session = require("express-session")
const questions = require("./models/questions.js");
const MongoStore = require("connect-mongo")(session)
const LocalStrategy = require('passport-local').Strategy
const app = express();
const config = require("./botconfig.json");
const dburl = config.mongo;

//routes
const wordsRoute = require('./routes/words')
const usersRoute = require('./routes/Users')
const loginRoute = require('./routes/login')
//midle
app.use(express.static(path.resolve(__dirname,'client')) )
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
try {
  db.connect(dburl, { useNewUrlParser: true, useFindAndModify: false });
  console.log("Data base connect .... OK");
} catch (e) {
  console.log("Data base connect .... Error!", e);
}

//passport
app.use(session({
  store: new MongoStore({mongooseConnection:db.connection}),secret: "MyCats",resave:false,saveUninitialized:false,cookie:{
    maxAge:24*60*60*1000
  }
}))

app.use(passport.initialize())
app.use(passport.session())

const localS = new LocalStrategy({usernameField:'email',passwordField:'password'},
  function(username,password,done){
    User.findOne({email: username }).then(user=>{
      if(!user){
        return done(null,false,{message:'err user'})
        
      }
      if(password!==user.password)  done(null,false,{message:'err pass'})
    done(null,user)
  }
      )
      .catch((error)=>{
        console.log(error)
        done(error,null)
      })
  }
)
passport.use('locals',localS)

passport.serializeUser(function(user,done){
  done(null,user.id)
})

passport.deserializeUser(function(id,done){
  User.findOne({_id:id},function (err,user){
    done(err,user)
  })
})

 function mustAuthnticated(req,res,next){
      if(req.isAuthenticated()){
          return next()
      }
      res.redirect('/login')
  }

//routes
app.use("/words", wordsRoute);
app.use("/rating", usersRoute);
app.use("/login", loginRoute);

app.get("/logout",mustAuthnticated,(req,res)=>{

  req.session.destroy(function(){
    res.clearCookie("connect.sid")
    res.redirect("/login")
  })
  
  
})
app.post("/posts/addPost",mustAuthnticated,async (req,res)=>{
  
  const wordExist = await User.findOne({ question: req.body.word });
  if (wordExist) return res.status(400).send("wordExist already exists");
  const id =await questions.countDocuments( {  } )+1
  const newWord = new questions({
    id: id,
    question: req.body.word,
   
  });
  try {
    const saveWord = await newWord.save();
    res.send({ status:'done'});
  } catch (e) {
    res.status(400).send(e);
  }
 
  
  
  
}
  )
app.get("/",mustAuthnticated,(req,res)=>res.sendFile(path.resolve(__dirname,'client','index.html')))

//start
app.listen(3000, () => console.log("hello serv"));

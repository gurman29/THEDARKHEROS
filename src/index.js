const express=require('express')
const app=express()
require('../db/mongoconnect')
const transporter= require('../db/email')
const Clan=require('../db/clan')
const Player=require('../db/clandata')
const War=require('../db/wardata')
const User=require('../db/logindata')
const bodyparser=require('body-parser')
const bcrypt=require('bcrypt')
const passport=require('passport') 
const session=require('express-session')
const cookieparser=require('cookie-parser')
const flash=require('connect-flash')
const fast2sms = require('fast-two-sms')
var otpGenerator = require('otp-generator')

const port=process.env.PORT || 3000
///////////////////////////////////////////////////
app.use(bodyparser.urlencoded({extended:true}))
app.use(cookieparser(process.env.SECRET))
app.use(session({
    secret:process.env.SECRET,
    resave:true,
    maxAge:3600000,
    saveUninitialized:true
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
/////////////////////// global variable
app.use(function(req, res, next){
    res.locals.success_message=req.flash('success_message')
    res.locals.error_message=req.flash('error_message')
    res.locals.error=req.flash('error')
    next()
})

const checkauthenticated =function(req, res, next){
    if(req.isAuthenticated()){
        res.set('Cache-Control','no-cache, private, no-store, must-revalidate,post-check=0,pre-check=0')
        return next()
    }else{
        //res.redirect('/login')
        return next()
    }
}

const check =function(req, res, next){
  if(req.isAuthenticated()){
      res.set('Cache-Control','no-cache, private, no-store, must-revalidate,post-check=0,pre-check=0')
      return res.redirect('/')
  }else{
      //res.redirect('/login')
      return next()
  }
}
/////////////////////////////////////////
app.set('view engine','ejs')
app.use(express.static('./public'))
/////////////////////////////////////////



app.get('',checkauthenticated,(req,res)=>{
  Clan.find()
  .then(doc => {
    res.render('index',{doc,'user':req.user}) 
  })
  .catch(err => {
    console.log(err)
    return res.status(500).send("something went wrong");
  })
})
app.get('/',checkauthenticated,(req,res)=>{
  res.render('success',{'user':req.user})
})

app.get('/clan', function(req,res){
    Player.find({})
    .then(doc => {
      res.render('clan',{doc}) 
      
    })
    .catch(err => {
      console.log(err)
      return res.status(500).send("something went wrong");
    })
})

app.get('/layouts', function(req,res){
  res.render('layout',{})
})
app.get('/video', function(req,res){
  res.render('video',{})
})
app.get('/warlog', function(req,res){
  War.find({})
  .then(doc => {
    res.render('warlog',{doc}) 
    
  })
  .catch(err => {
    console.log(err)
    return res.status(500).send("something went wrong");
  })
})
/////////////////////////////////////////////////////////////////////////
app.get('/register',check,(req,res)=>{
  res.render('register')
})

//////

app.post('/register',(req,res)=>{
  var{ email,playername,password,phonenumber,tag,name} = req.body
  email=email.toLowerCase()
   var err
   
   if(!email || !playername || !password || !phonenumber || !tag || !name){
       err="Please fill all the fields"
       res.render('register',{err})
   }
if( typeof err=='undefined'){
    User.findOne({email},function(err,data){
        if(err)throw err
        if(data){
            err="Email already taken"
            res.render('register',{err})
    }else{
        bcrypt.genSalt(10, (err,salt)=>{
            if(err)throw err
            bcrypt.hash(password,salt,(err,hashed)=>{
                if(err)throw err
                password=hashed 
                User({email,
                  playername,
                  password,
                  phonenumber,
                  tag,
                  name
                }).save((err,data)=>{
                    if(err)throw err
                    req.flash('success_message','Successfully Registered... Please Login')
                    transporter.sendMail( {
                      from: process.env.MAIL,
                      to: email,
                      subject: 'Welcome to THE DARK HEROS',
                      text: '  Having you in the DARK HEROS means a lot for us. We hope you’ll make the best use of your skills and knowledge and make sure something great is achieved!                                                           WELCOME TO THE DARK HEROS FAMILY'
                    }
                    , function(error, info){
                      if (error) {
                        console.log(error);
                      } else {
                        console.log('Email sent: ');
                      }
                    })
                    
                    var options = {authorization : process.env.KEY , message : 'DARK HEROS ................. Having you in the DARK HEROS means a lot for us. We hope you will make the best use of your skills and knowledge and make sure something great is achieved!     WELCOME TO THE DARK HEROS FAMILY' ,  numbers : [phonenumber]} 
                    fast2sms.sendMessage(options).then(response=>{
                      console.log(response)
                    })
                    res.redirect('/login')
                })
            })
        })
    }
    })
}
})

// autentication strategy

var localStrategy = require('passport-local')
const { request } = require('express')
passport.use(new localStrategy({ usernameField:'email'},(email,password,done)=>{
    User.findOne({email},(err,data)=>{
        if(err)throw err
        if(!data){
            return done(null,false,{message:"User Doesn't Exists"})
        }
        bcrypt.compare(password,data.password,(err,match)=>{
            if(err){
                return done(null,false)
            }
            if(!match){
                return done(null,false,{message:"Password is incorrect"})
            }
            if(match){
                return done(null,data)
            }
        })
    })
}))

passport.serializeUser(function(user,cb){
    cb(null,user.id)
})
passport.deserializeUser(function(id,cb){
    User.findById(id,function(err,user){
        cb(err,user)
    })
})
/////////////////////////
app.get('/login',check,(req,res)=>{
  res.render('login')
})
app.post('/login',(req, res, next) => {
  passport.authenticate('local',{
      failureRedirect:'/login',
      successRedirect:'/',
      failureFlash:true,
  })(req, res, next)
})

app.get('/logout',(req,res)=>{
  req.logout()
  res.redirect('/')
})
//////////////////////////////////////////
var otp,open,msg,emails
app.get('/forget',check,(req,res)=>{
  res.render('forget',{otp,open,msg})
})
app.post('/forget',(req,res)=>{
  emails = req.body.email
  otp=otpGenerator.generate(6, { upperCase: false, specialChars: false })

  transporter.sendMail( {
    from: process.env.MAIL,
    to: emails,
    subject: 'DARK HEROS reset password',
    //text: 'Your one time OTP for changing password is '+otp
    html:'Your OTP for changing password is '+'<strong>'+otp+'</strong>'
  }
  , function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  })
  res.redirect('/forget')
})
app.post('/check', (req,res)=>{
  var{ otps } = req.body
  if(open==true){
    var {password}=req.body
    bcrypt.genSalt(10, (err,salt)=>{
      if(err)throw err
      bcrypt.hash(password,salt,async(err,hashed)=>{
          if(err)throw err
          password=hashed 
          await User.updateOne({email:emails},  
            {password})
            .then((data)=>{
          }).catch((error)=>{
            console.log(error)
          })
      })
  })
  otp=undefined
  open=undefined
  res.redirect('/login')
  
  }else{
  if(otps==otp){
    open=true
  }else{
    msg='OTP does not match'
  }}
  res.redirect('/forget')
})
app.listen(port,()=>{
}) 
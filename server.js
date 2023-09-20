const express = require ('express');
const app = express();
const dotenv = require("dotenv");
const bcrypt = require ("bcrypt")
const saltround = 10;
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');



dotenv.config({path:'./config/config.env'});
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const users =[
    {username:'tom',password:"$2b$10$ZoYmHuSonxUvE.NUXpacp.LVeCYmIewQ4OSm3LudyZjOOXpqFfhLS"},
    {username:'joy',password:"$2b$10$pVErjH30hkGdK/weZIr56uBkxukmU2fea/GQhwrHuNISXMJ4Nxs5e"}
]

app.get('/signup',(req,res)=>{
        res.sendFile(__dirname + "/signup.html")
})

app.post('/signup',(req,res)=>{
     const {username,password} = req.body;
    
     bcrypt.hash(password,saltround,function(err,hash){
        if(err){
            res.send(err.message)
        }else{
            console.log(hash);
            res.sendFile(__dirname + "/profile.html")
        }
     }
    )
})

app.get('/',(req,res)=>{
    const {token} = req.cookies

    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,function(err,result){
            if(err){
                res.redirect('/')
            }else{
                res.sendFile(__dirname+'/profile.html')
            }
        })
    }else{
        res.sendFile(__dirname + "/login.html")
    }
})

app.post('/',(req,res)=>{
    const {username,password} = req.body;
   
    const user = users.find((user)=>user.username === username && user.password === password);
    
    bcrypt.compare(password,user.password,function(err,result){
            
                // console.log(result);
                if(err){
                    res.send("Invalid Password")
                }else{

                    const data ={
                                username,
                                date :Date()
                            }
                            const token = jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn:"10min"})
                            
                            console.log(token);
                            res.cookie("token",token).redirect('/profile')
                        }
                })
        

    //  if(!password){
    //     res.redirect("/")
    // }else{
    //     const data ={
    //         username,
    //         date :Date()
    //     }
    //     const token = jwt.sign(data,process.env.JWT_SECRET_KEY,{expiresIn:"10min"})
        
    //     console.log(token);
    // }

})

app.get('/profile',(req,res)=>{

    const {token} = req.cookies

    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,function(err,result){
            if(err){
                res.redirect('/')
            }else{
                res.sendFile(__dirname + "/profile.html")
            }
           })
    }else{
        res.redirect('/')
    }
})

app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`);
})
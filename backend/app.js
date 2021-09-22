const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Post = require('./models/post');
const keys = require('./keys');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/users');

const app = express();
mongoose.set('useCreateIndex', true);

// mongoose.connect('mongodb+srv://'+keys.mongoCreds.username+':'+keys.mongoCreds.password+'@cluster0.p0rpp.mongodb.net/'+keys.mongoCreds.database+'?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
mongoose.connect( 'mongodb+srv://'+ keys.mongoCreds.username+':'+ keys.mongoCreds.password+'@cluster0.az4yf.mongodb.net/'+keys.mongoCreds.database+'?retryWrites=true&w=majority' , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>
    {
        console.log("DB connected");
    })
    .catch((err)=>
    {
        console.log(err);
    });


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use("/images",express.static(path.join("images")) );


//CORS
app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
  });


app.use("/posts",postsRoutes);

app.use("/user",userRoutes);

app.use('/',(req,res)=>{
    res.send('Hi there, something is coming up soon');
});

app.listen(3000, ()=> console.log('Server is listening..'));



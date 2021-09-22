const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


//signup route
exports.createUser = (req,res,next)=>{

    // console.log(req);
    bcrypt.hash(req.body.password, 10) // 10 is the no.of rounds
    .then(hash =>{
        const user = new User({
            // username : req.body.username,
            email : req.body.email,
            password : hash
        });
        user.save()
         .then(result=>{
            res.status(201).json({message : 'user created', result : result });
            console.log('user details logged');
         })
         .catch(err=>{
             res.status(500).json( {error : err, message: 'Email ID already used'} );
         } );
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json( {error : err, message: 'Some error occured'} );
    });
};


//login route
exports.userLogin = (req,res,next)=>{
    let fetchedUser ;
    // console.log(req.body);
    User.findOne({email: req.body.email})
        .then(user=>{
            // if(!user)
            // {   return res.status(401).json({message : "Invalid Email ID"}); }
            //else
            fetchedUser = user;
            return bcrypt.compare(req.body.password , user.password );
        })
        .then(result=>  //this is a chained then and result will the returned value from the above then
        {
            if(!result)
            {
                console.log("Incorrect password");
                return res.status(401).json({message : "Password mismatch"});
            }

            //else
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id},
                 'a_secret_string_which_subam_razz_is_using_for_security',
                  { expiresIn: "1h" }
            );
            return res.status(200).json({
                 token : token ,
                 expiresIn : 3600,
                 userId : fetchedUser._id
            });
        })
        .catch(err=>{
            console.log("Authentication failed");
            return res.status(401).json({message : "Invalid Email ID", error : err});
        });
};


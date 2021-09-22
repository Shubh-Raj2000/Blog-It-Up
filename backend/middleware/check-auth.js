const jwt = require('jsonwebtoken');


module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "a_secret_string_which_subam_razz_is_using_for_security");
        req.userData = {email: decodedToken.email, userId: decodedToken.userId };
        //we are adding a new field named 'userData' to the req body
        next();
    } catch (error){
        res.status(401).json({message : "Auth failed!"});
    }

};


//we can also get the token as a query.parameter or as a header
//Generally a token comes as a string with a word Bearer. Ex: "Bearer kjhxoapsowlwjsopsmnw"
//so first split that over " " and take the string at index 1 as our token(since "Bearer" will be at index[0])
//



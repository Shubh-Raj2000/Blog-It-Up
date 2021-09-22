const Post = require('../models/post');


exports.createPost =  (req,res)=>{
    const url = req.protocol + '://' + req.get("host");
    const post = new Post(
        {
            title : req.body.title,
            content : req.body.content,
            imagePath : url + "/images/" + req.file.filename,
            creator : req.userData.userId 
            //userData field in the req body is added in checkAuth
        });

    post.save()
        .then(createdPost=>{
            res.status(201).json({ message : "post added successfully!", post : { ...createdPost } });
            console.log("Post added in the DB");
        })
        .catch(err=>{
            res.status(500).json({error : err, message: "Creating a post failed!"});
        });
};



exports.updatePost =  (req,res)=>{
    // if a new image is given it should be handled else the req.file will turn out to be undefined\
    let imagePath = req.body.imagePath;

    if(req.file)
    {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename ;
    }
    const post = new Post({
        _id : req.params.id,
        title : req.body.title ,
        content : req.body.content,
        imagePath : imagePath,
        creator : req.userData.userId 
    });
    Post.updateOne( { _id : req.params.id, creator: req.userData.userId }, post)
        .then(result=>
        {
            if(result.n > 0){
                res.status(200).json({message : "Update successful"});
                console.log('post updated');
            } else{
                res.status(401).json({message : "Not authorized to edit this post"});
            }
            
        })
        .catch(err=>{
            console.log('There is an error');
            res.status(500).json({error : err, message: "Couldn't update post!"});
        });
};


//according to pagination
exports.getPosts = (req,res)=>{
    const pageSize =  +req.query.pagesize ;
    const currentPage = +req.query.page; // + makes it a number type data
    const postQuery = Post.find(); // this only gets executed on then()
    let fetchedPosts;

    //we need to avoid this if they are undefined or zeros so include an if condition
    if(pageSize && currentPage)
    {
        postQuery.skip(pageSize * (currentPage-1)).limit(pageSize);
    }
    postQuery
    .then(data=>{
        fetchedPosts = data;
        return Post.countDocuments();
    })
    .then(count =>{
        res.status(200).json({ message : "Posts fetched successfully", posts : fetchedPosts, postCount : count });
    })
    .catch((err)=>{
        // console.log(err);
        res.status(500).json({message: "Fetching posts failed!"});
    });
};



exports.getPost = (req,res,next)=>{
    Post.findById(req.params.id)
    .then(post=>{
        if(post)
        {
            res.status(200).json(post);
            console.log(post);
            console.log('Post with id sent');
        }
        else
         res.status(404).json({message : "Post not found"});
    })
    .catch(err=> res.status(500).json({error : err,message: "Fetching post failed!"}) );
};



exports.deletePost =   (req,res)=>{
    Post.deleteOne({_id :req.params.id, creator: req.userData.userId })
    .then((result)=>{ 
        if(result.n > 0){
            res.status(200).json({message : "Post deleted"});
            console.log('post with _id "'+ req.params.id  +'" is deleted');
        } else{
            res.status(401).json({message : "Not authorized to delete this post"});
        }
        
    })
    .catch((err)=>{
        res.status(500).json({message: "Couldn't delete the post!"});
    });
};


//without pagination feature
exports.getAllPosts = (req,res)=>{

    Post.find()
    .then((data)=>{
        res.status(200).json({message : "Posts fetched successfully", posts : data});
    })
    .catch((err)=>{
        console.log(err);
    });
};


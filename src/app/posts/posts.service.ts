import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { url } from 'inspector';
import * as url from 'url';

import { Subject } from 'rxjs';
import { Post } from './post.model';


@Injectable({ providedIn: 'root' })

export class PostsService {

  private posts : Post[] = [];
  private postsUpdated = new Subject< {posts:Post[], postCount:number} >();
  private postCount : number ;
  endURL : string = "http://localhost:3000/posts" ;

  constructor(private http : HttpClient, private router : Router) { }

  
  getPosts(postsPerPage: number , currentPage : number)
  {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}` ; //dynamic value injection
    this.http.get<{ message : string, posts : any[], postCount : number}>(this.endURL + queryParams)
     .subscribe( postData =>{
      //  console.log(postData.posts);
       this.postCount = postData.postCount ;
       this.posts = postData.posts;
       this.postsUpdated.next( { posts:[...this.posts], postCount : postData.postCount } );
     });
  }

  getPostUpadateListener()
  {
    return this.postsUpdated.asObservable();
  }

  getPost(id : string)
  {
    return this.http.get<{ _id : string; title : string; content : string; imagePath : string; creator: string }>(this.endURL +'/'+ id);
  }


  addPost(title : string, content : string, image : File)
  {
    // const post : Post = { _id : null, title : title , content : content };
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content",content);
    postData.append("image", image, title);

    this.http.post<{message : string ; post : Post }>(this.endURL, postData)
      .subscribe(responseData=>{
        // const post : Post = { _id : responseData.post._id, title : title, content : content , imagePath : responseData.post.imagePath } 
        // this.posts.push(post);
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });
  }


  updatePost(id : string, title : string, content : string, image : File | string )
  { 
    // const post : Post = { _id : id, title : title , content : content, imagePath: null };
    let postData : Post | FormData ;
    if(typeof(image)=='object')
    {
      postData = new FormData();
      postData.append("_id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append("image", image, title);
    }
    else
    {
      postData =  { _id : id, title : title, content : content, imagePath : image, creator:  null  }
      //creator is changed on the server since this can be a vulnerable point in terms of security
    }

    // console.log(postData);
    this.http.put(this.endURL+ '/' +id , postData)
      .subscribe(response=>{
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p=> p._id === id);
        // const post : Post = { _id : id, title : title , content : content, imagePath: null };
        // updatedPosts[oldPostIndex] = post ;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
        this.router.navigate(["/"]);
      });

  }



  deletePost(postId : string)
  {
    return this.http.delete(this.endURL +'/' +postId);
      // .subscribe(()=>{
      //   const updatedPosts = this.posts.filter(post=> post._id !== postId)
      //   this.posts = updatedPosts;
      //   this.postsUpdated.next([...this.posts]);
      // });
  }



}

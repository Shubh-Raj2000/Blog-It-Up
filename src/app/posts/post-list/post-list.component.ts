import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Router } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit 
{
  private authStatusSub : Subscription ;
  userIsAuthenticated : boolean = false;
  userId : string ;

  posts : Post[];
  private postsSub : Subscription;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  constructor(public postsService : PostsService, private authService : AuthService,private router: Router) { }


  ngOnInit()
  {
    this.userId = this.authService.getUserId();
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
    this.postsSub = this.postsService.getPostUpadateListener()
          .subscribe((postData : {posts:Post[], postCount:number})=>{
            this.posts= postData.posts;
            this.totalPosts = postData.postCount;
          });

    this.userIsAuthenticated = this.authService.getIsAuth();
    
    this.authStatusSub= this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated=>{
        this.userIsAuthenticated= isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onEdit(postid : any)
  {
    // console.log(postid);
    this.router.navigate(['edit-post/'+postid]);
  }

  onChangedPage(pageData : PageEvent )
  {
    // console.log(pageData);
    this.currentPage = pageData.pageIndex +1 ;
    this.postsPerPage = pageData.pageSize ;
    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDelete(postid : string)
  {
    this.postsService.deletePost(postid)
     .subscribe(()=>{
        this.postsService.getPosts(this.postsPerPage, this.currentPage);
     });
  }

  ngOnDestroy()
  {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }


}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  enteredTitle = "";
  enteredContent = "" ;
  post : Post ={
    _id : null,
    title : 'dummy',
    content : 'dummy',
    imagePath : 'dummy',
    creator : 'dummy'
  };

  private mode = "create";
  private postId : string;
  showError : boolean = false;

  form : FormGroup;
  imagePreview : string ;

  constructor(public postsService : PostsService, public route : ActivatedRoute , private router: Router) { }
  // ActivatedRoute gives the info abt the route we r currently on
  // paramMap is an inbuilt observable which we subscribe to know whenever the postId changes

  ngOnInit()
  {
    this.form = new FormGroup({
      title : new FormControl(null, {validators : [Validators.required, Validators.minLength(3)]} ),
      content : new FormControl(null, {validators: [ Validators.minLength(3)]}),
      image : new FormControl(null, {validators: [Validators.required], asyncValidators : [mimeType] } )
    });


    this.route.paramMap.subscribe((paramMap : ParamMap)=>{
      if(paramMap.has("postId"))
      {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.postsService.getPost(this.postId).subscribe( postData=>
        {
          this.post = { 
            _id : postData._id ,
            title : postData.title ,
            content : postData.content,
            imagePath: postData.imagePath,
            creator: postData.creator }

          this.form.setValue({ title: this.post.title , content: this.post.content, image : this.post.imagePath });
        })
        
      }
      else
      {
        this.mode="create";
        this.postId = null;
      }
    });
  }

  onImagePicked(event : Event)
  {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image : file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () =>{
      this.imagePreview = reader.result as string ;
    };
    reader.readAsDataURL(file);
    // console.log(this.imagePreview);
  }

  onSavePost()
  {
    // console.log(this.form.value);
    if(this.form.invalid)
    {
      this.showError= true;
      return;
    }
     
    if(this.mode === "create")
    {
      this.postsService.addPost(this.form.value.title , this.form.value.content, this.form.value.image );
    }
    else
    {
      this.postsService.updatePost(this.postId, this.form.value.title , this.form.value.content, this.form.value.image );
    }
    this.showError= false;
    this.form.reset();
    this.router.navigate(['create-post']);
  }

  

}

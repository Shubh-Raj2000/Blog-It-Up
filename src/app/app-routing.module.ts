import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostListComponent } from './posts/post-list/post-list.component';

const routes: Route[] = [
  { path: '',  redirectTo : 'home', pathMatch : 'full' },
  { path: 'home', component : PostListComponent},
  { path: 'view-posts', component : PostListComponent },
  { path: 'create-post', component : PostCreateComponent, canActivate:[AuthGuard] },
  { path: 'edit-post/:postId', component : PostCreateComponent, canActivate:[AuthGuard]  },
  { path: 'login', component : LoginComponent },
  { path: 'signup', component : SignupComponent }
  // { path: '', component : }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root' })
export class AuthService 
{
  private isAuthenticated : boolean = false;
  private token : string ;
  private tokenTimer : any ;
  private userId : string ;
  private authStatusListener = new Subject<boolean>();

  userURL : string = "http://localhost:3000/user";

  constructor(private http : HttpClient, private router : Router) {}

  getToken()
  {
    return this.token;
  }

  getIsAuth()
  {
    return this.isAuthenticated;
  }

  getUserId()
  {
    return this.userId;
  }

  getAuthStatusListener()
  {
    return this.authStatusListener.asObservable();
  }
  

  createUser(email:string, password:string)
  {
    const authData : AuthData = { email : email , password: password };
    this.http.post(this.userURL + "/signup",authData)
      .subscribe(response=>{
        console.log(response );
        this.router.navigate(['/']);
      },
      error =>{
        console.log(error);
      }
    );
  }


  login(email : string, password : string)
  {
    const authData : AuthData = { email : email , password: password };
    this.http.post<{token: string,expiresIn : number, userId: string }>(this.userURL + "/login", authData)
      .subscribe(response=>{
        // console.log(response);
        const fetchedtoken = response.token ;
        this.token = fetchedtoken;
          if(fetchedtoken)
          {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId ;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expiresInDuration *1000);
            this.saveAuthData(fetchedtoken,expirationDate,this.userId);
            this.router.navigate(['/']);
          }
      },
      error=>{
        console.log(error);
      });

  }

  autoAuthUser()
  {
    const authInformation = this.getAuthData();
    if(!authInformation)
    { return; }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime() ;
    if(expiresIn>0 ){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn/1000);
      //since we need to pass in seconds
      this.authStatusListener.next(true);
    }
  }

  logout()
  {
    this.token= null;
    this.isAuthenticated = false;
    this.userId = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration : number)
  {
    //duration comes in secs
    this.tokenTimer=setTimeout(() => {
      this.logout();
    }, duration*1000 );
    //logs out after the expiry period
    //we need to convert in into millisecs
  }

  private saveAuthData(token: string, expirationDate : Date, userId : string)
  {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration",expirationDate.toISOString() );
    localStorage.setItem("userId", userId);
  }


  private clearAuthData()
  {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId;")
  }

  private getAuthData()
  {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate)
    { return null; }
    
    return {
      token:token, 
      expirationDate : new Date(expirationDate),
      userId : userId
    };
  }


}


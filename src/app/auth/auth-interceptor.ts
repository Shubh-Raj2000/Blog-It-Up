import { HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor
{
    constructor(private authService : AuthService ) {}

    intercept(req: HttpRequest<any>, next : HttpHandler)
    {
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers : req.headers.set('Authorization', "Bearer " + authToken )
        });

        return next.handle(authRequest);
    }

}


//In this interceptor we are cloning the req and in that cloned req,
//we are setting the Authorization header to the given value and sending it 
//We should also inculde it in the CORS headers section 
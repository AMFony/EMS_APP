import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { AuthenticationService } from "../services/authentication/authentication.service";
import { UserService } from "../services/authentication/user.service";
import { NotifyService } from "../services/common/notify.service";

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private notifyService: NotifyService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status == 403) {
            this.notifyService.fail("Forbidden!, your credentials does not allow to access the resource", "DISMISS");
          }
          const error = err.error || err;
          return throwError(error.message);
        })
      )
  }
}

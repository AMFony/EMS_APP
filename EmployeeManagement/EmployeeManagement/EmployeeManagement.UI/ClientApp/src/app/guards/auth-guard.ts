import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";

import { UserService } from "../services/authentication/user.service";

import { Observable } from "rxjs";
import { NotifyService } from "../services/common/notify.service";
@Injectable()
export class AuthGuard implements CanActivate{
  constructor(
    private router: Router,
    private userService: UserService,
    private notifyService:NotifyService
  ) {
   }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      this.userService.load();
      if (this.userService.isLogged) {
        if (route.data['AllowedRoles'] && !this.userService.roleMatch(route.data['AllowedRoles'])) {
          this.notifyService.fail("insufficient priviledge", "DISMISS")
          return false;
        }
        return true;
      }
      else {
        this.notifyService.fail("Not authenticated", "DISMISS")
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
  }
}

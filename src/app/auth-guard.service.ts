import { Injectable } from '@angular/core';
import {CanActivate,CanActivateChild} from "@angular/router";
import { Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router:Router) { }
  canActivate() {
     let auth = localStorage.getItem('isAuthenticated') ? (localStorage.getItem('isAuthenticated') == '1' ? true : false) : false;
     if(!auth){
      this.router.navigateByUrl('/login');
      return auth;
     }
    return auth;
  }
  
}

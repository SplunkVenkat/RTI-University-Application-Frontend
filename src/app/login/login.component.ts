import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import {ApplicationService} from './../application.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username:string='';
  password:string='';

  constructor(private router:Router,private applicationService:ApplicationService) { }

  ngOnInit(): void {
    localStorage.setItem('user','')
  }
  login() {
    this.applicationService.login({ 'username': this.username, 'password': this.password }).subscribe((res: any) => {
      if (res && res.token) {
        localStorage.setItem('user', res.token);
        this.router.navigate(['home']);
      }
    })
  }

}

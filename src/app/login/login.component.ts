import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  userId:string='';
  password:string='';

  constructor(private router:Router) { }

  ngOnInit(): void {
    localStorage.setItem('isAuthenticated','0')
  }
  login(){
    this.router.navigate(['home']);
    localStorage.setItem('isAuthenticated','1');
  }

}

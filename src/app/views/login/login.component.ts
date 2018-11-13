import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  creationResult: string;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {}

  login() {
    this.userService.login(this.email, this.password).then((loggedIn: boolean) => {
      if(loggedIn) {
        localStorage.setItem('loggedIn', 'true');
        this.router.navigate(['home']);
      } else {
        this.creationResult = 'You are not logged In';
        setTimeout(() => {
          this.creationResult = '';
        }, 5000);
      }
    });
  }

}

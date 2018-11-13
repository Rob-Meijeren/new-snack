import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  name: string;
  email: string;
  password: string;
  success: string;
  error: string;

  constructor(private userService: UserService) { }

  ngOnInit() {}

  registerUser() {
    this.userService.createUser(this.email, this.password).then(result => {
      if (result) {
        this.success = 'De gebruiker is aangemaakt.';
      } else {
        this.error = 'Er is iets fout gegaan.';
      }
    });
  }

}

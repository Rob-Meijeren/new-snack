import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/classes/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  account: User;
  oldPassword: string;
  password: string;
  confirmPassword: string;
  passwordMismatch: boolean;

  constructor(private userService: UserService) {
    this.passwordMismatch = false;
  }

  ngOnInit() {

  }

  updateAccount() {

  }

  changePassword() {
    if (this.password === this.confirmPassword) {
      this.passwordMismatch = false;
    } else {
      this.passwordMismatch = true;
    }
  }

}

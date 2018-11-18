import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private userService: UserService, private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  ngOnInit() {}

  registerUser() {
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(this.loginForm.get('password').value, salt);

    this.userService.createUser(this.loginForm.get('name').value, this.loginForm.get('email').value, encryptedPassword).then(result => {
      console.log('created');
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective, NgForm, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { PasswordValidation } from 'src/app/validators/passwordMatcher';

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  public passwordGroup: FormGroup;
  public matcher = new MyErrorStateMatcher();

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.passwordGroup = this.fb.group({
      new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirm_password: new FormControl('', [Validators.required, Validators.minLength(8)])
    }, { validator: PasswordValidation.MatchPassword });
  }

  ngOnInit() {}

  changePassword() {
    const loggedInUser = this.userService.getUser().value;

    this.userService.changePassword(loggedInUser, this.passwordGroup.controls.new_password.value).then(() => {
      alert('password has changed');
    });
  }

}

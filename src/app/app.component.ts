import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './classes/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  userIsLoggedIn: boolean;
  user: User;
  private stop$ = new Subject<void>();

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userIsLoggedIn = this.userService.isLoggedIn();
    if (this.userIsLoggedIn) {
      this.userService.getUser().pipe(takeUntil(this.stop$)).subscribe((user: User) => {
        this.user = user;
        if (this.user) {
          this.userIsLoggedIn = true;
        } else {
          this.userIsLoggedIn = false;
        }
      });
    }
  }

  ngOnDestroy() {
    this.stop$.next();
  }

  logout() {
    this.userService.logout();
    this.userIsLoggedIn = false;
  }
}

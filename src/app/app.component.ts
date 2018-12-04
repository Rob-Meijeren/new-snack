import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './classes/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OrderService } from './services/order.service';
import * as moment from 'moment';
import { Order } from './classes/order';
import { ExcelService } from './services/excel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  userIsLoggedIn: boolean;
  user: User;
  private stop$ = new Subject<void>();

  constructor(private userService: UserService, private orderService: OrderService, private excelService: ExcelService) {}

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

  downloadOrders() {
    this.orderService.getOrdersWithCompanyNameByDate(moment().format('YYYY-MM-DD')).then((todaysOrders: any[]) => {
      if (todaysOrders.length > 0) {
        this.excelService.downloadOrdersAsExcel(todaysOrders);
      } else {
        alert('There are no orders for today');
      }
    });
  }
}

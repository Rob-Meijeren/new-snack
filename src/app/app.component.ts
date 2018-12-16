import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { User } from './classes/user';
import { OrderService } from './services/order.service';
import * as moment from 'moment';
import { ExcelService } from './services/excel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  userIsLoggedIn: boolean;
  user: User;

  constructor(private userService: UserService, private orderService: OrderService, private excelService: ExcelService) {}

  ngOnInit() {
    this.userIsLoggedIn = this.userService.isLoggedIn();
    this.userService.getUser().subscribe((user: User) => {
      console.log('subscription');
      this.user = user;
      if (this.user) {
        this.userIsLoggedIn = true;
      } else {
        this.userIsLoggedIn = false;
      }
    });
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

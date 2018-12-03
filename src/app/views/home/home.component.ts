import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { DishService } from 'src/app/services/dish.service';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { Company } from 'src/app/classes/company';
import { DishOption } from 'src/app/classes/dish-option';
import { OptionLevel } from 'src/app/classes/option-level';
import { FormGroup, FormControl } from '@angular/forms';
import { isEqual } from 'lodash';
import { OrderService } from 'src/app/services/order.service';
import * as moment from 'moment';
import { Order } from 'src/app/classes/order';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { NameDialogComponent } from 'src/app/components/name-dialog/name-dialog.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('tabs') tabs: TabsetComponent;

  public companies: Company[];
  public optionLevels: OptionLevel[];
  public dishOptions: DishOption[];

  public order: DishOption[];
  public orderForm: FormGroup;
  public todaysOrders: Order[];
  public storedOrders: Order[];

  constructor(
    private dialog: MatDialog,
    private companyService: CompanyService,
    private dishService: DishService,
    private orderService: OrderService,
    private userService: UserService) {
    this.todaysOrders = [];
    this.storedOrders = [];
    this.orderService.getTodaysOrders(moment().format('YYYY-MM-DD')).then(todaysOrders => {
      this.todaysOrders = todaysOrders;
    });
    this.companyService.getCompanies().then((companies) => {
      this.companies = companies;
    }).then(() => {
      this.getCompanyOptions(this.companies[0].name);
      this.getDishOptions(this.companies[0].name);
      this.getStoredOrders();
    });
    this.orderForm = new FormGroup({});
    this.order = [];
    if (this.userService.isLoggedIn()) {
      console.log('Hey You are logged in :)');
    }
  }

  ngOnInit() {}

  selectTab(data: TabDirective) {
    const company = data.heading;
    this.getCompanyOptions(company);
    this.getDishOptions(company);
  }

  getCompanyOptions(company: string) {
    this.companyService.getCompanyOptions(company).then((options) => {
      this.optionLevels = options;
      this.optionLevels.forEach((option) => {
        this.orderForm.addControl(option.name, new FormControl());
      });
    });
  }

  getDishOptions(companyName: string) {
    this.dishService.getDishOptionsByCompanyName(companyName).then((options) => {
      this.dishOptions = options;
    });
  }

  addOption(optionName: string) {
    const optionValue = this.orderForm.controls[optionName].value;

    const chosenOption = this.findDishOptionByName(optionValue);

    this.order.push(chosenOption);
  }

  removeOption(option: DishOption) {
    this.order.splice(this.order.findIndex(selectedOption => isEqual(selectedOption, option)), 1);
  }

  findDishOptionByName(name: string) {
    const options = this.dishOptions.filter((dishOption) => {
      return dishOption.name === name;
    });

    return options[0];
  }

  getAmountOfSelectedOptionsByLevel(level: number) {
    const optionsByLevel = this.order.filter((selectedOption) => {
      return selectedOption.level === level;
    });

    return optionsByLevel.length;
  }

  createOrder() {
    const fullDate = moment();
    const midday = moment('12:00', 'HH:mm');

    let passingDate = null;

   /*  if (fullDate.isAfter(midday, 'hour')) {
      passingDate = moment().add(1, 'days').format('YYYY-MM-DD');
    } else { */
      passingDate = moment().format('YYYY-MM-DD');
    // }

    if (this.userService.isLoggedIn()) {
      this.placeOrder(this.userService.getUser().value.name, passingDate, this.userService.getUser().value.id);
    } else {
      const dialogRef = this.dialog.open(NameDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.placeOrder(result, passingDate);
        }
      });
    }
  }

  placeOrder(userName: string, passingDate: string, userId?: string) {
    this.orderService.placeOrder(userName, passingDate, this.order, userId).then(() => {
      const todaysOrder = new Order(passingDate, userName, this.order);
      this.todaysOrders.push(todaysOrder);
      this.storedOrders.push(todaysOrder);
      this.order = [];
    });
  }

  replaceOrder(order: Order) {
    this.order = order.options;
    this.createOrder();
  }

  getStoredOrders() {
    if (this.userService.isLoggedIn()) {
      this.orderService.getOrdersOfUser(this.userService.getUser().value).then((orders: Order[]) => {
        this.storedOrders = orders;
      });
    } else {
      this.storedOrders = JSON.parse(localStorage.getItem('storedOrders'));
    }
  }

}

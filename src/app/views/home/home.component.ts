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
  public todaysOrders: any[];

  constructor(private companyService: CompanyService, private dishService: DishService, private orderService: OrderService) {
    this.companyService.getCompanies().then((companies) => {
      this.companies = companies;
    }).then(() => {
      this.getCompanyOptions(this.companies[0].name);
    }).then(() => {
      this.getDishOptions(this.companies[0].name);
    });
    this.orderForm = new FormGroup({});
    this.order = [];
    this.todaysOrders = [];
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

  placeOrder() {
    const fullDate = moment();
    const midday = moment('12:00', 'HH:mm');

    let passingDate = null;

    if (fullDate.isAfter(midday, 'hour')) {
      passingDate = moment().add(1, 'days').format('YYYY-MM-DD');
    } else {
      passingDate = moment().format('YYYY-MM-DD');
    }

    this.orderService.placeOrder('Rob', passingDate, this.order).then(() => {
      this.todaysOrders.push(this.order);
      this.order = [];
    });
  }

}

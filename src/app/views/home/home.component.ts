import { Component, OnInit, ViewChild } from '@angular/core';
import { CompanyService } from 'src/app/services/company.service';
import { DishService } from 'src/app/services/dish.service';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs';
import { Company } from 'src/app/classes/company';
import { DishOption } from 'src/app/classes/dish-option';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('tabs') tabs: TabsetComponent;

  public companies: Company[];
  public dishOptions: DishOption[];

  constructor(private companyService: CompanyService, private dishService: DishService) {
    this.companyService.getCompanies().then((companies) => {
      this.companies = companies;
    }).then(() => {
      this.getDishOptions(this.companies[0].name);
    });
  }

  ngOnInit() {
  }

  selectTab(data: TabDirective) {
    const company = data.heading;
    this.getDishOptions(company);
  }

  getDishOptions(companyName: string) {
    this.dishService.getDishOptionsByCompanyName(companyName).then((options) => {
      this.dishOptions = options;
    });
  }

}

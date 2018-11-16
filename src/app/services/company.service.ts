import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import gql from 'graphql-tag';
import { Company } from '../classes/company';
import { OptionLevel } from '../classes/option-level';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private graphqlService: GraphqlService) {}

  getCompanies() {
    return this.graphqlService.readData(gql`
      query {
        companies {
          name
        }
      }
    `).then((response: any) => {
      const companyArray: Company[] = [];
      response.data.companies.forEach(element => {
        companyArray.push(new Company(element.name));
      });

      return companyArray;
    })
    .catch(this.handleError);
  }

  getCompanyOptions(company: string) {
    return this.graphqlService.readData(gql`
      query {
        optionLevels (where: {
          company: {
            name: "${company}"
          }
        }) {
          name,
          level,
          required,
          maxAmount
        }
      }
    `).then((response: any) => {
      const levels: OptionLevel[] = [];
      response.data.optionLevels.forEach(element => {
        levels.push(new OptionLevel(element.name, element.level, element.required, element.maxAmount));
      });

      return levels;
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

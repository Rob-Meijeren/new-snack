import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import gql from 'graphql-tag';
import { Company } from '../classes/company';

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

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

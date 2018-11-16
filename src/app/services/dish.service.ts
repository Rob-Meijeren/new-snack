import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import gql from 'graphql-tag';
import { DishOption } from '../classes/dish-option';

@Injectable({
  providedIn: 'root'
})
export class DishService {

  constructor(private graphqlService: GraphqlService) {}

  getDishOptionsByCompanyName(companyName: string) {
    return this.graphqlService.readData(gql`
      query {
        company (where: { name: "${companyName}"}) {
          dishoptions {
            id,
            option,
            optionLevel {
              level
              name
            }
          }
        }
      }
    `).then((response: any) => {
      const dishoptionsArray: DishOption[] = [];
      response.data.company.dishoptions.forEach(option => {
        dishoptionsArray.push(new DishOption(option.id, option.option, option.optionLevel.level));
      });
      return dishoptionsArray;
    })
    .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

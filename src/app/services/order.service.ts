import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import gql from 'graphql-tag';
import { DishOption } from '../classes/dish-option';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private graphqlService: GraphqlService) {}

  placeOrder(name: string, date: string, orderOptions: DishOption[]) {
    return this.graphqlService.writeData(gql`
      mutation {
        createOrder(data: {
          orderDate: "${date}",
          name: "${name}",
          dishoptions: {
            connect: [${
              orderOptions.map((option) => {
                return `{ id: "${option.id}" }`;
              })
            }]
          }
          status: PUBLISHED
        }) {
          id
        }
      }
    `).then((response: any) => {
      return;
    }).catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

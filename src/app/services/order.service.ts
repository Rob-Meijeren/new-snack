import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import gql from 'graphql-tag';
import { DishOption } from '../classes/dish-option';
import { Order } from '../classes/order';
import { User } from '../classes/user';

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

  getTodaysOrders(date: string) {
    return this.graphqlService.readData(gql`
      query {
        orders(where: {
          orderDate: "${date}"
        }) {
          name,
          dishoptions {
            id,
            option,
            optionLevel {
              level
            }
          }
        }
      }
    `).then((response: any) => {
      const rawOrders = response.data.orders;
      const parsedOrders: Order[] = [];
      rawOrders.forEach(element => {
        const orderOptions: DishOption[] = [];
        element.dishoptions.forEach(dishoption => {
          orderOptions.push(new DishOption(dishoption.id, dishoption.option, dishoption.optionLevel.level));
        });
        parsedOrders.push(new Order(date, element.name, orderOptions));
      });
      return parsedOrders;
    }).catch(this.handleError);
  }

  getOrdersOfUser(user: User) {
    // still needs to implemented in the data structure
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

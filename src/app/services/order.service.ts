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

  placeOrder(name: string, date: string, orderOptions: DishOption[], userId?: string) {
    let request = '';
    if (!userId) {
      request = gql`
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
            },
            status: PUBLISHED
          }) {
            name,
            orderDate,
            dishoptions {
              id,
              option,
              optionLevel {
                level
              }
            }
          }
        }`;
    } else {
      request = gql`
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
            },
            user: {
              connect: {
                id: "${userId}"
              }
            },
            status: PUBLISHED
          }) {
            name,
            orderDate,
            dishoptions {
              id,
              option,
              optionLevel {
                level
              }
            }
          }
        }`;
    }

    return this.graphqlService.writeData(request).then((response: any) => {
      let storedOrders: Order[] = JSON.parse(localStorage.getItem('storedOrders'));
      const order = this.createOrder(response.data.createOrder);
      if (!storedOrders) {
        storedOrders = [];
      }
      storedOrders.push(order);
      localStorage.setItem('storedOrders', JSON.stringify(storedOrders));
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
          orderDate,
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
        const order = this.createOrder(element);
        parsedOrders.push(order);
      });
      return parsedOrders;
    }).catch(this.handleError);
  }

  getOrdersOfUser(user: User) {
    // still needs to implemented in the data structure
    return this.graphqlService.readData(gql`
      query {
        users(where: {
          email: "${user.email}"
        }) {
          id,
          orders {
            orderDate,
            dishoptions {
              id,
              option,
              optionLevel {
                level
              }
            },
            name
          }
        }
      }
    `).then((response: any) => {
      const rawOrders = response.data.users.orders;
      const parsedOrders: Order[] = [];
      rawOrders.forEach(element => {
        const order = this.createOrder(element);
        parsedOrders.push(order);
      });
      return parsedOrders;
    }).catch(this.handleError);
  }

  public getOrdersWithCompanyNameByDate(date: string) {
    return this.graphqlService.readData(gql`
      query {
        orders(where: {
          orderDate: "${date}"
        }) {
          name,
          orderDate,
          dishoptions {
            option,
            company {
              name
            }
          }
        }
      }
    `).then((response: any) => {
      const rawOrders = response.data.orders;
      const parsedOrders: any[] = [];
      rawOrders.forEach(element => {
        const options: any[] = element.dishoptions.map((option) => {
          return { name: option.option, company: option.company.name };
        });
        const order = { name: element.name, options };
        parsedOrders.push(order);
      });
      return parsedOrders;
    }).catch(this.handleError);
  }

  private createOrder(element) {
    const orderOptions: DishOption[] = [];
    element.dishoptions.forEach(dishoption => {
      orderOptions.push(new DishOption(dishoption.id, dishoption.option, dishoption.optionLevel.level));
    });
    return new Order(element.orderDate, element.name, orderOptions);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

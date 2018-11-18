import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import gql from 'graphql-tag';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private graphqlService: GraphqlService) {}

  login(email: string, password: string) {
    return this.graphqlService.readData(gql`
        query {
          users(where: {
            email: "${email}"
          }) {
            password
          }
        }
      `).then((response: any) => {
          return btoa(password) === response.data.users.password;
      })
      .catch(this.handleError);
  }

  createUser(name: string, email: string, password: string) {
    return this.graphqlService.writeData(gql`
        mutation {
          createUsers(data: {
            name: "${name}",
            email: "${email}",
            password: "${password}",
            role: {
              connect: {
                id: "cjomyxo0p4e6u093225q1y3dv"
              }
            }
            status: PUBLISHED
          }) {
            id
          }
        }
      `).then((response: any) => {
          return response.data.createUsers.id;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

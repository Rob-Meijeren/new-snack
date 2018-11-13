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

  createUser(email: string, password: string) {
    return this.graphqlService.writeData(gql`
        mutation {
          createUsers(data: {
            email: "${email}",
            password: "${password}",
            status: PUBLISHED
          }) {
            id
          }
        }
      `).then((response: any) => {
          return response.data.createUser.id;
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}

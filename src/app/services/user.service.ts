import { Injectable } from '@angular/core';
import { GraphqlService } from './graphql.service';
import gql from 'graphql-tag';
import * as bcrypt from 'bcryptjs';
import { CookieService } from 'ngx-cookie-service';
import * as moment from 'moment';
import { User } from '../classes/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

  constructor(private graphqlService: GraphqlService, private cookieService: CookieService) {}

  login(email: string, password: string) {
    return this.graphqlService.readData(gql`
        query {
          users(where: {
            email: "${email}"
          }) {
            name,
            password,
            role {
              name
            }
          }
        }
      `).then((response: any) => {
        if (bcrypt.compareSync(password, response.data.users.password)) {
          const user = new User(response.data.users.name, email, response.data.users.role.name);
          this.user.next(user);
          this.cookieService.set('user', JSON.stringify(user),  moment().add(1, 'days').toDate(), '/');
          return true;
        } else {
          throw Error('not a valid user');
        }
      })
      .catch(this.handleError);
  }

  isLoggedIn() {
    if (this.cookieService.check('user')) {
      return true;
    } else {
      return false;
    }
  }

  getUser() {
    if (this.isLoggedIn() && !this.user.value) {
      const cookieUser: User = JSON.parse(this.cookieService.get('user'));
      this.user.next(cookieUser);
    }
    return this.user;
  }

  logout() {
    this.user.next(null);
    this.cookieService.delete('user', '/');
  }

  createUser(name: string, email: string, password: string) {
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    return this.graphqlService.writeData(gql`
        mutation {
          createUsers(data: {
            name: "${name}",
            email: "${email}",
            password: "${encryptedPassword}",
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

import { Injectable, NgZone } from '@angular/core';
import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular-link-http';
import {environment} from '../../environments/environment';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {HttpHeaders} from '@angular/common/http';
import { ApolloLink, concat } from 'apollo-link';

@Injectable({
  providedIn: 'root'
})
export class GraphqlService {

  constructor(private apollo?: Apollo, private httpLink?: HttpLink) {
    const readMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.readToken)
      });

      return forward(operation);
    });

    const writeMiddleware = new ApolloLink((operation, forward) => {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', 'Bearer ' + environment.writeToken)
      });

      return forward(operation);
    });

    this.apollo.create({
      link: concat(readMiddleware, this.httpLink.create({uri: environment.apiUrl})),
      cache: new InMemoryCache(),
    }, 'read');

    this.apollo.create({
      link: concat(writeMiddleware, this.httpLink.create({uri: environment.apiUrl})),
      cache: new InMemoryCache(),
    }, 'write');
  }

  readData(query) {
    return this.apollo.use('read').query({
      query: query
    }).toPromise();
  }

  writeData(mutation) {
    return this.apollo.use('write').mutate({
      mutation: mutation
    }).toPromise();
  }
}

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApolloModule } from 'apollo-angular';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AppRoutingModule } from './app-routing.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { MatDialogModule } from '@angular/material/dialog';

import { AppComponent } from './app.component';
import { HomeComponent } from './views/home/home.component';
import { SignUpComponent } from './views/sign-up/sign-up.component';
import { AccountComponent } from './views/account/account.component';
import { LoginComponent } from './views/login/login.component';

import { CookieService } from 'ngx-cookie-service';
import { NameDialogComponent } from './components/name-dialog/name-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AccountComponent,
    SignUpComponent,
    NameDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatFormFieldModule,
    ApolloModule,
    HttpLinkModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    TabsModule.forRoot(),
    MatDialogModule,
  ],
  providers: [
    CookieService
  ],
  entryComponents: [
    NameDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

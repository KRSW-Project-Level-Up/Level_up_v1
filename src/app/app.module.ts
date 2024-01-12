import { SignupComponent } from './components/signup/signup.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgToastModule } from 'ng-angular-popup';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { HomeComponent } from './components/home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { GameComponent } from './components/game/game.component';
import { MatIconModule } from '@angular/material/icon';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SidomenuComponent } from './components/sidomenu/sidomenu.component';
import { NewRelaseComponent } from './components/new-relase/new-relase.component';
import { TopInComponent } from './components/top-in/top-in.component';
import { RecommendationComponent } from './components/recommendation/recommendation.component';
import { UserComponent } from './components/user/user.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    HomeComponent,
    GameComponent,
    PlaylistComponent,
    WishlistComponent,
    SidomenuComponent,
    NewRelaseComponent,
    TopInComponent,
    RecommendationComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgToastModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatIconModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

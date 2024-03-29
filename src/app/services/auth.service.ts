import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';
import { tap } from 'rxjs';

export class UserModel {
  constructor(
    public user_id: number = 0,
    public firstName: string = '',
    public lastName: string = '',
    public email: string = '',
    public username: string = '',
    public age: number = 0,
    public nationality: string = ''
  ) {}

  updateFromTokenPayload(payload: any): void {
    this.user_id = payload?.user_id;
    this.firstName = payload?.firstName;
    this.lastName = payload?.lastName;
    this.email = payload?.email;
    this.username = payload?.userName;
    this.age = payload?.age;
    this.nationality = payload?.nationality;
  }
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //    API Key : 5e0777bd6c2d4224b067677abeda0113

  private baseUrl: string = 'http://127.0.0.1:5000/';
  public user: UserModel = new UserModel();

  private userPayload: any;
  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}signup`, userObj);
  }

  signIn(loginObj: any) {
    return this.http.post<any>(`${this.baseUrl}signin`, loginObj).pipe(
      tap((response) => {
        if (response.token) {
          this.storeToken(response.token);
        }
      })
    );
  }
  getUserFromToken(): UserModel {
    const payload = this.decodedToken();
    console.log('this is payload', payload);
    if (payload) {
      return new UserModel(
        payload.user_id,
        payload.firstName,
        payload.lastName,
        payload.email,
        payload.userName,
        payload.age,
        payload.nationality
      );
    } else {
      return new UserModel();
    }
  }

  updateUserInfo(userObj: any) {
    return this.http.put<any>(`${this.baseUrl}updateuserinfo`, userObj).pipe(
      tap((response) => {
        if (response && response.token) {
          this.storeToken(response.token);
        }
      })
    );
  }

  signOut() {
    localStorage.clear();
    this.router.navigate(['login']);
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }
  storeRefreshToken(tokenValue: string) {
    localStorage.setItem('refreshToken', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }
  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  decodedToken() {
    const jwtHelper = new JwtHelperService();
    const token = this.getToken();
    if (token) {
      return jwtHelper.decodeToken(token);
    }
    return null;
  }

  renewToken(tokenApi: TokenApiModel) {
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi);
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TokenApiModel } from '../models/token-api.model';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  //  5e0777bd6c2d4224b067677abeda0113  API Key : 5e0777bd6c2d4224b067677abeda0113

  private baseUrl: string = 'http://127.0.0.1:5000/';
  private userPayload: any;
  constructor(private http: HttpClient, private router: Router) {
    this.userPayload = this.decodedToken();
  }
  updateUserPayload() {
    this.userPayload = this.decodedToken();
  }

  signUp(userObj: any) {
    return this.http.post<any>(`${this.baseUrl}register`, userObj);
  }

  signIn(loginObj: any) {
    console.log(loginObj);
    return this.http.post<any>(`${this.baseUrl}signin`, loginObj).pipe(
      tap((response) => {
        if (response.token) {
          this.storeToken(response.token); // Store the token
          this.updateUserPayload(); // Update the user payload
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

  getfullNameFromToken() {
    return this.userPayload?.firstName + this.userPayload?.lastName;
  }

  getRoleFromToken() {
    return this.userPayload?.role;
  }
  getUserIdFromToken() {
    const payload = this.decodedToken();
    return payload ? payload.id : null;
  }

  renewToken(tokenApi: TokenApiModel) {
    return this.http.post<any>(`${this.baseUrl}refresh`, tokenApi);
  }
}

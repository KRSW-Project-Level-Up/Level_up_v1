import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private role$ = new BehaviorSubject<string>('');
  private userId$ = new BehaviorSubject<string>('');
  private firstname$ = new BehaviorSubject<string>('');
  private lastName$ = new BehaviorSubject<string>('');
  private age$ = new BehaviorSubject<number>(0);
  private nationality$ = new BehaviorSubject<string>('');
  private user$ = new BehaviorSubject<UserModel>(new UserModel());

  constructor() {}
  public getUserIdFromStore() {
    console.log('getUserIdFromStore', this.userId$);
    return this.userId$.asObservable();
  }
  public getUserFromStore() {
    return this.user$.asObservable();
  }
  public setUserForStore(user: UserModel) {
    this.user$.next(user);
  }

  public setUSerIdForStore(userId: string) {
    this.userId$.next(userId);
  }

  public getRoleFromStore() {
    return this.role$.asObservable();
  }

  public setRoleForStore(role: string) {
    this.role$.next(role);
  }

  public getFirstNameFromStore() {
    return this.firstname$.asObservable();
  }

  public setFirstNameForStore(firstname: string) {
    this.firstname$.next(firstname);
  }
  public getLastNameFromStore() {
    console.log('getLastNameFromStore', this.lastName$);
    return this.lastName$.asObservable();
  }

  public setLastNameForStore(lastName: string) {
    this.lastName$.next(lastName);
  }
  public getAgeFromStore() {
    return this.age$.asObservable();
  }

  public setAgeForStore(age: number) {
    this.age$.next(age);
  }
  public getNationalityFromStore() {
    return this.nationality$.asObservable();
  }
  public setNationalityForStore(nationality: string) {
    this.nationality$.next(nationality);
  }
}

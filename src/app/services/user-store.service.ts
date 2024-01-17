import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserStoreService {
  private userId$ = new BehaviorSubject<string>('');
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
}

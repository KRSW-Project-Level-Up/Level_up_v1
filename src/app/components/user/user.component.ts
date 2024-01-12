import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}
  currentUser: any;

  ngOnInit(): void {
    const currentUsername = localStorage.getItem('currentUsername');
    const usersData = JSON.parse(localStorage.getItem('users') || '{}');

    if (currentUsername && usersData.hasOwnProperty(currentUsername)) {
      this.currentUser = usersData[currentUsername].userInfo;
      console.log(this.currentUser);
    }
  }

  logout() {
    this.auth.signOut();
  }
}

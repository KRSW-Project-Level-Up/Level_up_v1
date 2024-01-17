import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GameModel } from 'src/app/models/game-model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-sidomenu',
  templateUrl: './sidomenu.component.html',
  styleUrls: ['./sidomenu.component.scss'],
})
export class SidomenuComponent implements OnInit {
  constructor(private api: ApiService, private auth: AuthService) {}

  public users: any = [];
  public games: any[] = [];
  public originalGames: any[] = [];
  public lastGames: any[] = [];
  public allGames: any[] = [];

  public role!: string;
  likeCount = 0;
  dislikeCount = 0;
  public gameMine!: GameModel;
  public searchTerm: string = '';

  public fullName: string = '';

  ngOnInit() {
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });

    const storedGames = sessionStorage.getItem('allGames');
    if (storedGames) {
      this.games = JSON.parse(storedGames);
      console.log(this.allGames);
    } else {
    }
  }

  filterGames() {
    if (this.searchTerm) {
      this.games = this.allGames.filter((game) =>
        game.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.games = [...this.allGames];
    }
  }

  logout() {
    this.auth.signOut();
  }
}

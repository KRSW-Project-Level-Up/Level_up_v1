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
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

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
      //  this.fetchAllGames();
    }

    /* this.api.getGamesForPeriod().subscribe((data: any) => {
    this.originalGames = data.results.map((game: any) => ({
      ...game, 
      likeCount: 0, 
      dislikeCount: 0 
    }));
    this.allGames.push(...this.originalGames);
    console.log(this.originalGames)
  });*/

    /*this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });*/
  }
  /*
fetchAllGames() {
  forkJoin({
    gamesbyPeriod: this.api.getGamesForPeriod(),
    lastGames: this.api.getLastGames(),
    topGames: this.api.getLastGames(),
  }).subscribe((results: {gamesbyPeriod:any, lastGames: any, topGames: any }) => {
    this.games =this.allGames = [
      ...results.gamesbyPeriod.results.map((game: any) => ({...game, likeCount: 0, dislikeCount: 0})),
      ...results.lastGames.results.map((game: any) => ({...game, likeCount: 0, dislikeCount: 0})),
      ...results.topGames.results.map((game: any) => ({...game, likeCount: 0, dislikeCount: 0})),
    ];
    sessionStorage.setItem('allGames', JSON.stringify(this.allGames));

  });
}*/

  /*getLastGames() {
  this.api.getLastGames().subscribe((data: any) => {
    const sortedGames = data.results.sort((a: any, b: any) => {
      const dateA = new Date(a.released);
      const dateB = new Date(b.released);
      return dateB.getTime() - dateA.getTime();
    });

    this.allGames = sortedGames.map((game: any) => ({
      ...game,
      likeCount: 0,
      dislikeCount: 0
    }));

    // Update 'games' for display
    this.games = [...this.allGames];
  });
}

getTopGames() {
  this.api.getLastGames().subscribe((data: any) => {  // Assuming getTopGames() is the correct method
    const sortedGames = data.results.sort((a: any, b: any) => {
      return b.rating_top - a.rating_top;
    });

    this.allGames = sortedGames.map((game: any) => ({
      ...game,
      likeCount: 0,
      dislikeCount: 0
    }));

    // Update 'games' for display
    this.games = [...this.allGames];
  });
}*/

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

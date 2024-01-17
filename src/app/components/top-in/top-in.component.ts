import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GameModel } from 'src/app/models/game-model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-top-in',
  templateUrl: './top-in.component.html',
  styleUrls: ['./top-in.component.scss'],
})
export class TopInComponent implements OnInit {
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
  isLoading: boolean = false;

  public fullName: string = '';
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

  ngOnInit() {
    this.getTopGames();
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  getTopGames() {
    // Try to retrieve the game list from session storage
    const storedGames = sessionStorage.getItem('allGames');
    if (storedGames) {
      this.allGames = JSON.parse(storedGames);
      this.sortAndMapGames();
    } else {
      this.api.getLastGames().subscribe((data: any) => {
        this.allGames = data.results;
        this.sortAndMapGames();
      });
    }
  }

  sortAndMapGames() {
    // Sort games by rating_top in ascending order and map them
    const sortedGames = this.allGames.sort(
      (a: any, b: any) => b.rating_top - a.rating_top
    );
    this.games = sortedGames.map((game: any) => ({
      ...game,
      likeCount: game.likeCount || 0,
      dislikeCount: game.dislikeCount || 0,
    }));
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

  incrementLike(gameId: number) {
    const gameIndex = this.games.findIndex((g) => g.id === gameId);
    if (gameIndex !== -1) {
      this.games[gameIndex].likeCount++;
      // Update the allGames array in the session storage
      this.updateSessionStorage();
    }
  }

  incrementDislike(gameId: number) {
    const gameIndex = this.games.findIndex((g) => g.id === gameId);
    if (gameIndex !== -1) {
      this.games[gameIndex].dislikeCount++;
      // Update the allGames array in the session storage
      this.updateSessionStorage();
    }
  }

  updateSessionStorage() {
    sessionStorage.setItem('allGames', JSON.stringify(this.games));
  }
  getPlatformIcon(slug: string): string {
    const iconsMap: { [key: string]: string } = {
      pc: 'windows-svgrepo-com.svg',
      xbox: 'xbox-fill-svgrepo-com.svg',
      playstation: 'playstation-svgrepo-com.svg',
      nintendo: 'nintendo-switch-svgrepo-com.svg',
      mac: 'mac-fill-svgrepo-com.svg',
      linux: 'linux-svgrepo-com.svg',
      android: 'android-smartphone-svgrepo-com.svg',
      ios: 'ios-smartphone-svgrepo-com.svg',
      web: 'web-svgrepo-com',
    };
    return '/assets/icons/' + (iconsMap[slug] || 'help.svg'); // Default to 'help.svg' if no match is found
  }

  logout() {
    this.auth.signOut();
  }
}

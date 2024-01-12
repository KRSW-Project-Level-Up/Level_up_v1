import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { GameModel } from 'src/app/models/game-model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
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
    this.api.getUsers().subscribe((res) => {
      this.users = res;
    });

    this.fetchAllGames();

    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  fetchAllGames() {
    this.isLoading = true;

    const storedGames = sessionStorage.getItem('allGames');
    if (storedGames) {
      this.allGames = JSON.parse(storedGames);
      this.games = [...this.allGames];
      this.isLoading = false;
    } else {
      this.getGamesForPeriodPages().subscribe(
        (pages: any[]) => {
          // Process and save new data
          this.allGames = pages.flatMap((page) =>
            page.results.map((game: any) => ({
              ...game,
              likeCount: 0,
              dislikeCount: 0,
            }))
          );

          sessionStorage.setItem('allGames', JSON.stringify(this.allGames));
          this.games = [...this.allGames];
          this.isLoading = false;
        },
        (error) => {
          console.error('Error fetching games', error);
          this.isLoading = false;
        }
      );
    }
  }

  getGamesForPeriodPages() {
    const requests = [];
    for (let page = 2; page <= 4; page++) {
      requests.push(this.api.getGamesForPeriodPage(page));
    }

    return forkJoin(requests);
  }

  /*fetchAllGames() {
    this.isLoading = true;

    const storedGames = sessionStorage.getItem('allGames');
    if (storedGames) {
      this.allGames = JSON.parse(storedGames);
      this.games = [...this.allGames]; // Update 'games' for display
    } else {
      forkJoin({
        gamesbyPeriod: this.api.getGamesForPeriod(),
        lastGames: this.api.getLastGames(),
        topGames: this.api.getLastGames(),
      }).subscribe(
        (results: { gamesbyPeriod: any; lastGames: any; topGames: any }) => {
          this.allGames = [
            ...results.gamesbyPeriod.results.map((game: any) => ({
              ...game,
              likeCount: 0,
              dislikeCount: 0,
            })),
            ...results.lastGames.results.map((game: any) => ({
              ...game,
              likeCount: 0,
              dislikeCount: 0,
            })),
            ...results.topGames.results.map((game: any) => ({
              ...game,
              likeCount: 0,
              dislikeCount: 0,
            })),
          ];
          sessionStorage.setItem('allGames', JSON.stringify(this.allGames));
          this.games = [...this.allGames];
          this.isLoading = false;
        }
      );
    }
  }*/

  getLastGames() {
    this.api.getLastGames().subscribe((data: any) => {
      const sortedGames = data.results.sort((a: any, b: any) => {
        const dateA = new Date(a.released);
        const dateB = new Date(b.released);
        return dateB.getTime() - dateA.getTime();
      });

      this.allGames = sortedGames.map((game: any) => ({
        ...game,
        likeCount: 0,
        dislikeCount: 0,
      }));

      // Update 'games' for display
      this.games = [...this.allGames];
    });
  }

  getTopGames() {
    this.api.getLastGames().subscribe((data: any) => {
      // Sort games by rating_top in ascending order
      const sortedGames = data.results.sort((a: any, b: any) => {
        return b.rating_top - a.rating_top;
      });

      this.allGames = sortedGames.map((game: any) => ({
        ...game,
        likeCount: 0,
        dislikeCount: 0,
      }));

      this.games = [...this.originalGames];
      this.api.changeGameList(this.originalGames);
      this.allGames.push(...this.originalGames);
      console.log(this.originalGames);
    });
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

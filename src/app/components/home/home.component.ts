import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../services/auth.service';
import { ApiService } from './../../services/api.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { GameModel } from 'src/app/models/game-model';
import { forkJoin, map } from 'rxjs';

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
  userId: any;

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
    this.userStore.getUserIdFromStore().subscribe((val) => {
      const userId = this.auth.getUserIdFromToken();
      this.userId = userId;
      console.log('user id', this.userId);
    });
  }

  /*fetchAllGames() {
    this.isLoading = true;

    // Remove sessionStorage logic if you always want fresh data
    this.getGamesForPeriodPages().subscribe(
      (pages: any[]) => {
        const gameDetails = pages.flatMap((page) => page.results);
        const ratingRequests = gameDetails.map((game) =>
          this.api
            .getGameRating(this.userId, game.id)
            .pipe(map((rating: any) => ({ ...game, ...rating })))
        );

        forkJoin(ratingRequests).subscribe(
          (gamesWithRatings) => {
            this.allGames = gamesWithRatings;
            this.games = [...this.allGames];
            this.isLoading = false;
          },
          (error) => {
            console.error('Error fetching game ratings', error);
            this.isLoading = false;
          }
        );
      },
      (error) => {
        console.error('Error fetching games', error);
        this.isLoading = false;
      }
    );
  }*/

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
    console.log('this.is requests', requests);
    return forkJoin(requests);
  }

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
      console.log('Sending like update for gameId:', gameId);

      this.api.addGameRating(this.userId, gameId, 'like').subscribe(
        (response: any) => {
          console.log('Like count updated:', response);
          // Update the game's like count in the frontend state
          this.games[gameIndex].likeCount = response.total_likes;
          this.games[gameIndex].dislikeCount = response.total_dislikes;
          this.games = [...this.games]; // Create a new array to trigger change detection

          console.log('this.games[gameIndex]', this.games[gameIndex]);
        },
        (error) => {
          console.error('Error updating like count:', error);
          // Optionally handle error (e.g., revert optimistic UI update)
        }
      );
    }
  }

  incrementDislike(gameId: number) {
    const gameIndex = this.games.findIndex((g) => g.id === gameId);
    if (gameIndex !== -1) {
      console.log('Sending dislike update for gameId:', gameId);

      this.api.addGameRating(this.userId, gameId, 'dislike').subscribe(
        (response: any) => {
          console.log('Dislike count updated:', response);
          // Update the game's dislike count in the frontend state
          this.games[gameIndex].likeCount = response.total_likes;
          this.games[gameIndex].dislikeCount = response.total_dislikes;
        },
        (error) => {
          console.error('Error updating dislike count:', error);
          // Optionally handle error (e.g., revert optimistic UI update)
        }
      );
    }
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

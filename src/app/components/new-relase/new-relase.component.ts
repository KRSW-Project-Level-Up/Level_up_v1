import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { GameModel } from 'src/app/models/game-model';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-new-relase',
  templateUrl: './new-relase.component.html',
  styleUrls: ['./new-relase.component.scss'],
})
export class NewRelaseComponent implements OnInit {
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

    const storedLastGames = sessionStorage.getItem('lastGames');
    if (storedLastGames) {
      this.lastGames = JSON.parse(storedLastGames);
      this.games = [...this.lastGames];
    } else {
      this.getLastGames();
    }

    this.userStore.getFullNameFromStore().subscribe((val) => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe((val) => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });
  }

  getLastGames() {
    this.isLoading = true;
    this.api.getLastGames().subscribe(
      (data: any) => {
        const sortedGames = data.results
          .sort((a: any, b: any) => {
            const dateA = new Date(a.released);
            const dateB = new Date(b.released);
            return dateB.getTime() - dateA.getTime();
          })
          .map((game: any) => ({
            ...game,
            likeCount: 0,
            dislikeCount: 0,
          }));

        sessionStorage.setItem('lastGames', JSON.stringify(sortedGames));

        this.updateAllGamesList(sortedGames);

        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching games', error);
        this.isLoading = false;
      }
    );
  }

  updateAllGamesList(newGames: any[]) {
    const storedAllGames = sessionStorage.getItem('allGames');
    const allGames = storedAllGames ? JSON.parse(storedAllGames) : [];

    newGames.forEach((game) => {
      if (!allGames.some((g: { id: any }) => g.id === game.id)) {
        allGames.push(game);
      }
    });

    // Save the updated allGames list back to session storage
    sessionStorage.setItem('allGames', JSON.stringify(allGames));

    // Update the component's allGames property
    this.allGames = allGames;
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

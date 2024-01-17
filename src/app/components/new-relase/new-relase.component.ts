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
  userId: number = 0;

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

    // Fetch the last games directly
    this.getLastGames();
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
        this.games = sortedGames;
        this.originalGames = sortedGames;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error fetching games', error);
        this.isLoading = false;
      }
    );
  }

  filterGames() {
    if (this.searchTerm) {
      this.games = this.originalGames.filter((game) =>
        game.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    } else {
      this.games = [...this.originalGames];
    }
  }

  incrementLike(gameId: number) {
    const gameIndex = this.games.findIndex((g) => g.id === gameId);
    if (gameIndex !== -1) {
      console.log('Sending like update for gameId:', gameId);
      this.updateLikedGameIds(gameId);

      this.api.addGameRating(this.userId, gameId, 'like').subscribe(
        (response: any) => {
          console.log('Like count updated:', response);
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
      this.updateDislikedGameIds(gameId);

      this.api.addGameRating(this.userId, gameId, 'dislike').subscribe(
        (response: any) => {
          console.log('Dislike count updated:', response);
          // Update the game's dislike count in the frontend state
          this.games[gameIndex].likeCount = response.total_likes;
          this.games[gameIndex].dislikeCount = response.total_dislikes;
        },
        (error) => {
          console.error('Error updating dislike count:', error);
        }
      );
    }
  }
  private updateLikedGameIds(gameId: number) {
    let likedGameIds = this.getLikedGameIds();
    if (!likedGameIds.includes(gameId)) {
      likedGameIds.push(gameId);
      localStorage.setItem('likedGameIds', JSON.stringify(likedGameIds));
    }
  }

  private updateDislikedGameIds(gameId: number) {
    let dislikedGameIds = this.getDislikedGameIds();
    if (!dislikedGameIds.includes(gameId)) {
      dislikedGameIds.push(gameId);
      localStorage.setItem('dislikedGameIds', JSON.stringify(dislikedGameIds));
    }
  }
  private getLikedGameIds(): number[] {
    const storedIds = localStorage.getItem('likedGameIds');
    return storedIds ? JSON.parse(storedIds) : [];
  }

  private getDislikedGameIds(): number[] {
    const storedIds = localStorage.getItem('dislikedGameIds');
    return storedIds ? JSON.parse(storedIds) : [];
  }
  getGameIdLists() {
    return {
      likedGameIds: this.getLikedGameIds(),
      dislikedGameIds: this.getDislikedGameIds(),
    };
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

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  public playlist: any[] = [];
  public playlistArray: any[] = [];

  public games: any[] = [];
  userId: number = 0;
  currentUser: any;
  likeCount = 0;
  dislikeCount = 0;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.userStore.getUserFromStore().subscribe((val) => {
      const user = this.auth.getUserFromToken();
      this.currentUser = user;
      this.userId = this.currentUser.user_id;
      console.log('userNew wishlist', this.currentUser);
    });
    this.loadPlaylist(this.userId);
  }

  loadPlaylist(userId: number) {
    this.api.getAllPlaylist(userId).subscribe(
      (response) => {
        this.playlistArray = (response as any).playlist;
        this.likeCount; // = playlistArray.filter((item) => item.like === true).length;
        console.log('playlistArray', this.playlistArray);
        if (Array.isArray(this.playlistArray)) {
          const uniqueGameIds = new Set(
            this.playlistArray.map((item) => item.game_id)
          );
          const playlistIds = Array.from(uniqueGameIds);

          this.fetchGamesDetails(playlistIds);
          console.log('Unique Playlist IDs:', playlistIds);
        } else {
          console.error('Invalid response structure:', response);
        }
      },
      (error) => {
        console.error('Error fetching playlist', error);
      }
    );
  }

  fetchGamesDetails(gameIds: number[]) {
    const gamesDetailsPromises = gameIds.map((gameId) =>
      firstValueFrom(this.api.getGameById(gameId.toString()))
    );

    Promise.all(gamesDetailsPromises)
      .then((gamesDetails) => {
        // Filter out any undefined or null results
        this.games = gamesDetails
          .filter((game) => game != null)
          .map((game: any) => {
            // Specify the type of 'game' as 'any'
            const playlistItem = this.playlistArray.find(
              (item) => item.game_id === game.id
            );
            return {
              ...game,
              like_count: playlistItem ? playlistItem.like_count : 0,
              dislike_count: playlistItem ? playlistItem.dislike_count : 0,
            };
          });
        this.playlist = this.games; // Update your playlist
        console.log('Playlist with game details:', this.playlist);
      })
      .catch((error) => {
        console.error('Error fetching games details', error);
      });
  }

  // add button to delete from playlist in playlist.component.html
  deleteFromPlaylist(gameId: number) {
    this.api.deleteFromPlaylist(this.userId, gameId).subscribe(
      (response) => {
        console.log('Deleted from playlist', response);
        this.loadPlaylist(this.userId);
      },
      (error) => {
        console.error('Error deleting from playlist', error);
      }
    );
  }

  logout() {
    this.auth.signOut();
  }
}

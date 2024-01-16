import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent implements OnInit {
  public playlist: any[] = [];
  public games: any[] = [];
  userId: number = 0;
  currentUser: any;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.userStore.getUserFromStore().subscribe((val) => {
      const user = this.auth.getUserFromToken();
      this.currentUser = user;
      this.userId = this.currentUser.id;
      console.log('userNew', this.userId);
    });
  }

  loadPlaylist(userId: number) {
    this.api.getAllPlaylist(userId).subscribe(
      (response) => {
        // Access the playlist array from the response object
        const playlistArray = (response as any).playlist;

        // Ensure that playlistArray is defined and is an array
        if (Array.isArray(playlistArray)) {
          const uniqueGameIds = new Set(
            playlistArray.map((item) => item.game_id)
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
      this.api.getGameById(gameId.toString()).toPromise()
    );

    Promise.all(gamesDetailsPromises)
      .then((gamesDetails) => {
        this.playlist = gamesDetails;
        this.games = gamesDetails;
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

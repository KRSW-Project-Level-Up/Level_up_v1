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

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.loadGames();
    this.loadPlaylist();
  }

  loadPlaylist() {
    const storedPlaylist = sessionStorage.getItem('playlist');
    if (storedPlaylist) {
      const playlistIds: number[] = JSON.parse(storedPlaylist);
      const uniquePlaylistIds = new Set<number>(playlistIds); // Specify the type

      this.playlist = Array.from(uniquePlaylistIds)
        .map((id) => this.games.find((game: any) => game.id === id))
        .filter((game: any) => game !== undefined);

      console.log('Unique playlist with game details:', this.playlist);
    }
  }

  loadGames() {
    const storedGames = sessionStorage.getItem('allGames');
    if (storedGames) {
      this.games = JSON.parse(storedGames);
    }
  }

  logout() {
    this.auth.signOut();
  }
}

import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
})
export class WishlistComponent implements OnInit {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService
  ) {}

  public wishlist: any[] = [];
  public games: any[] = [];

  ngOnInit(): void {
    this.loadGames();
    this.loadWishlist();
  }

  loadWishlist() {
    const storedPlaylist = sessionStorage.getItem('wishlist');
    if (storedPlaylist) {
      const playlistIds: number[] = JSON.parse(storedPlaylist);
      const uniquePlaylistIds = new Set<number>(playlistIds); // Specify the type

      this.wishlist = Array.from(uniquePlaylistIds)
        .map((id) => this.games.find((game: any) => game.id === id))
        .filter((game: any) => game !== undefined);

      console.log('Unique wishlist with game details:', this.wishlist);
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

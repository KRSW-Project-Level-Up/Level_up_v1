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
  userId: number = 0;
  currentUser: any;

  ngOnInit(): void {
    this.userStore.getUserFromStore().subscribe((val) => {
      const user = this.auth.getUserFromToken();
      this.currentUser = user;
      this.userId = this.currentUser.id;
      console.log('userNew', this.userId);
    });
    this.loadWishlist(this.userId);
  }

  loadWishlist(userId: number) {
    this.api.getAllWishlist(userId).subscribe(
      (response) => {
        const wishlistArray = (response as any).wishlist;
        if (Array.isArray(wishlistArray)) {
          const uniqueGameIds = new Set(
            wishlistArray.map((item) => item.game_id)
          );
          const wishlistIds = Array.from(uniqueGameIds);

          this.fetchGamesDetails(wishlistIds);
          console.log('Unique Playlist IDs:', wishlistIds);
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
        this.wishlist = gamesDetails;
        this.games = gamesDetails;
        console.log('Playlist with game details:', this.wishlist);
      })
      .catch((error) => {
        console.error('Error fetching games details', error);
      });
  }
  deleteFromWishlist(gameId: number) {
    this.api.deleteFromWishlist(this.userId, gameId).subscribe(
      (response) => {
        console.log('Deleted from wishlist', response);
        this.loadWishlist(this.userId);
      },
      (error) => {
        console.error('Error deleting from wishlist', error);
      }
    );
  }
  logout() {
    this.auth.signOut();
  }
}

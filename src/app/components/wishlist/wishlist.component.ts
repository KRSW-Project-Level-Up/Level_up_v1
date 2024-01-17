import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { firstValueFrom } from 'rxjs';

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
  public wishlistArray: any[] = [];

  public games: any[] = [];
  userId: number = 0;
  currentUser: any;

  ngOnInit(): void {
    this.userStore.getUserFromStore().subscribe((val) => {
      const user = this.auth.getUserFromToken();
      this.currentUser = user;
      this.userId = this.currentUser.user_id;
      console.log('userNew wishlist', this.currentUser);
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
      firstValueFrom(this.api.getGameById(gameId.toString()))
    );

    Promise.all(gamesDetailsPromises)
      .then((gamesDetails) => {
        // Filter out any undefined or null results
        this.games = gamesDetails
          .filter((game) => game != null)
          .map((game: any) => {
            // Specify the type of 'game' as 'any'
            const wishlistItem = this.wishlistArray.find(
              (item) => item.game_id === game.id
            );
            return {
              ...game,
              like_count: wishlistItem ? wishlistItem.like_count : 0,
              dislike_count: wishlistItem ? wishlistItem.dislike_count : 0,
            };
          });
        this.wishlist = this.games;
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

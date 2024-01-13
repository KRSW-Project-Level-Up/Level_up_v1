import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  public game: any;
  showReviewInput = false;
  public playlist: any[] = [];
  public wishlist: any[] = [];
  public reviewText: string = '';
  userId: number = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private auth: AuthService,
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const gameIdParam = params.get('id');
      if (gameIdParam) {
        const gameId = parseInt(gameIdParam, 10);
        const storedGames = sessionStorage.getItem('allGames');
        if (storedGames) {
          const games: any[] = JSON.parse(storedGames);
          this.game = games.find((game: any) => game.id === gameId);
        }
        if (!this.game) {
          // Fetch from API as fallback
          this.api.getGamesForPeriod().subscribe((data: any) => {
            this.api.changeGameList(data.results);
            this.game = data.results.find(
              (game: { id: number }) => game.id === gameId
            );
          });
        }
      }
    });
    if (this.game) {
      // Load the review from session storage, if it exists
      const storedReview = sessionStorage.getItem(`review_${this.game.id}`);
      if (storedReview) {
        this.reviewText = storedReview;
      }
    }
  }
  navigateToHome() {
    this.router.navigate(['/home'], {
      queryParams: { action: 'getLastGames' },
    });
  }
  navigateToPlaylist() {
    this.router.navigate(['/playlist'], {
      queryParams: { action: 'addToPlaylist' },
    });
  }
  navigateToWatchlist() {
    this.router.navigate(['/wishlist'], {
      queryParams: { action: 'addToWishlist' },
    });
  }

  addToPlaylist(gameId: number, userId: number) {
    const dataToSend = {
      gameId: gameId,
      userId: userId,
      addedDate: new Date().toISOString(),
    };

    console.log('Sending to playlist:', dataToSend);

    this.api.addToPlaylistAPI(gameId, userId).subscribe(
      (response) => {
        console.log('Updated playlist:', response);
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Game added to playlist!',
          duration: 3000,
        });
      },
      (error) => {
        this.toast.error({
          detail: 'ERROR',
          summary: 'Failed to add game to playlist.',
          duration: 3000,
        });
        console.error('Error:', error);
      }
    );
  }

  addToWishlist(gameId: number, userId: number) {
    const dataToSend = {
      gameId: gameId,
      userId: userId,
      addedDate: new Date().toISOString(),
    };

    // Log the data being sent
    console.log('Sending to wishlist:', dataToSend);

    this.api.addToWishlistAPI(gameId, userId).subscribe(
      (response) => {
        console.log('Updated wishlist:', response);
        this.toast.success({
          detail: 'SUCCESS',
          summary: 'Game added to wishlist!',
          duration: 3000,
        });
      },
      (error) => {
        this.toast.error({
          detail: 'ERROR',
          summary: 'Failed to add game to wishlist.',
          duration: 3000,
        });
        console.error('Error:', error);
      }
    );
  }

  logout() {
    this.auth.signOut();
  }

  addReview() {
    this.showReviewInput = true;
  }

  saveReview() {
    this.showReviewInput = false;
    if (this.game && this.reviewText.trim()) {
      sessionStorage.setItem(`review_${this.game.id}`, this.reviewText);
    }
  }

  cancelReview() {
    this.showReviewInput = false;
  }
}

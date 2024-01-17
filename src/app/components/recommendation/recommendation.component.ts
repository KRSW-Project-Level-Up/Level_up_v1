import { Component, OnInit } from '@angular/core';
import { Neo4jModel } from 'src/app/models/neo4j-models';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { Neo4jServiceService } from 'src/app/services/neo4j.service.service';
import { UserStoreService } from 'src/app/services/user-store.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-recommendation',
  templateUrl: './recommendation.component.html',
  styleUrls: ['./recommendation.component.scss'],
})
export class RecommendationComponent implements OnInit {
  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    private neo4jService: Neo4jServiceService
  ) {}

  recommendedGames: Neo4jModel[] = [];
  detailedGames: any[] = [];
  isLoading: boolean = false;
  likedGameIds: any[] = [];
  dislikedGameIds: any[] = [];

  ngOnInit(): void {
    this.likedGameIds = this.getLikedGameIds();
    this.dislikedGameIds = this.getDislikedGameIds();
    this.processStoredGames();
  }
  private getLikedGameIds(): number[] {
    const storedIds = localStorage.getItem('likedGameIds');
    return storedIds ? JSON.parse(storedIds) : [];
  }

  private getDislikedGameIds(): number[] {
    const storedIds = localStorage.getItem('dislikedGameIds');
    return storedIds ? JSON.parse(storedIds) : [];
  }
  processStoredGames() {
    this.neo4jService
      .getCommonNodes(this.likedGameIds, this.dislikedGameIds)
      .then((recommendedGames) => {
        this.recommendedGames = recommendedGames;
        console.log('Recommended Games:', this.recommendedGames);
        this.fetchGamesDetails(recommendedGames);
      })
      .catch((error) => {
        console.error('Error fetching recommended games:', error);
      });
  }
  fetchGamesDetails(recommendedGames: Neo4jModel[]) {
    this.isLoading = true;
    const uniqueGameIds = new Set(recommendedGames.map((game) => game.id));
    let requestsRemaining = uniqueGameIds.size;

    if (requestsRemaining === 0) {
      this.isLoading = false;
    } else {
      uniqueGameIds.forEach((gameId) => {
        this.api.getGameById(gameId).subscribe((res) => {
          this.detailedGames.push(res);
          requestsRemaining--;
          if (requestsRemaining === 0) {
            this.isLoading = false;
          }
        });
      });
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

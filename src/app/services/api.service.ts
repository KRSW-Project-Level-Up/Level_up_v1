import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameModel } from '../models/game-model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'https://localhost:7058/api/User/';
  private API_KEY = '5e0777bd6c2d4224b067677abeda0113';
  private gamesSource = new BehaviorSubject<any[]>([]);
  currentGames = this.gamesSource.asObservable();

  constructor(private http: HttpClient) {}
  changeGameList(games: any[]) {
    this.gamesSource.next(games);
  }

  getUsers() {
    return this.http.get<any>(this.baseUrl);
  }
  /* getPlatforms() {
    const url = `https://api.rawg.io/api/platforms?key=${this.API_KEY}`;
    return this.http.get(url);
  }*/

  getGamesForPeriod() {
    const url = `https://api.rawg.io/api/games?key=${this.API_KEY}&page=2&page_size=100&ordering=-rating`;
    return this.http.get(url);
  }
  getGamesForPeriodPage(page: number) {
    const url = `https://api.rawg.io/api/games?key=${this.API_KEY}&page=${page}&page_size=100&ordering=-rating`;
    return this.http.get(url);
  }
  getLastGames() {
    const url = `https://api.rawg.io/api/games?key=${this.API_KEY}&page=1&page_size=80&dates=2020-01-01,2023-12-31&ordering=-added`;
    return this.http.get(url);
  }
  geGameById(id: string) {
    const url = `https://api.rawg.io/api/games/${id}?key=${this.API_KEY}`;
    return this.http.get(url);
  }
  updateLikes(game: GameModel) {
    const url = `${this.baseUrl}/games/${game.id}/likes`;
    return this.http.post(url, game);
  }

  updateDislikes(game: GameModel) {
    const url = `${this.baseUrl}/games/${game.id}/dislikes`;
    return this.http.post(url, game);
  }
}

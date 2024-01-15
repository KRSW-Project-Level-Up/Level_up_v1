import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameModel } from '../models/game-model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl: string = 'http://127.0.0.1:5000/';
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
  getGameById(id: string) {
    const url = `https://api.rawg.io/api/games/${id}?key=${this.API_KEY}`;
    return this.http.get(url);
  }

  addToPlaylistAPI(gameId: number, userId: number) {
    const url = `${this.baseUrl}addtoplaylist`;
    const data = {
      gameId: gameId,
      addedDate: new Date().toISOString(),
      userId: userId,
    };
    return this.http.post(url, data);
  }

  addToWishlistAPI(gameId: number, userId: number) {
    const url = `${this.baseUrl}addtowishlist`;
    const data = {
      gameId: gameId,
      addedDate: new Date().toISOString(),
      userId: userId,
    };
    return this.http.post(url, data);
  }

  addGameRating(userId: number, gameId: number, action: string) {
    const url = `${this.baseUrl}updategamerating`;
    const data = {
      user_id: userId,
      game_id: gameId,
      action: action, // 'like' or 'dislike'
    };

    return this.http.post(url, data);
  }
  getAllGamesRating() {
    const url = `${this.baseUrl}gamesrating`;
    return this.http.get(url);
  }

  getPlaylist(userId: number): Observable<{ playlistIds: number[] }> {
    const url = `${this.baseUrl}users/${userId}/playlist`;
    return this.http.get<{ playlistIds: number[] }>(url);
  }
  getWishlist(userId: number): Observable<{ wishlistIds: number[] }> {
    const url = `${this.baseUrl}users/${userId}/playlist`;
    return this.http.get<{ wishlistIds: number[] }>(url);
  }

  getGameRating(userId: number, gameId: number) {
    const url = `${this.baseUrl}games/${gameId}/rating?userId=${userId}`;
    return this.http.get<{ likeCount: number; dislikeCount: number }>(url);
  }
  deleteFromWishlist(gameId: number, userId: number) {
    const url = `${this.baseUrl}deletefromwishlist`;
    const data = {
      gameId: gameId,
      userId: userId,
    };
    return this.http.request('delete', url, { body: data });
  }
  deleteFromPlaylist(gameId: number, userId: number) {
    const url = `${this.baseUrl}deletefromplaylis`;
    const data = {
      gameId: gameId,
      userId: userId,
    };
    return this.http.request('delete', url, { body: data });
  }
}

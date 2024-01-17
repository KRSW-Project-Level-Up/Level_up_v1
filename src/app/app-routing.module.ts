import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { PlaylistComponent } from './components/playlist/playlist.component';
import { WishlistComponent } from './components/wishlist/wishlist.component';
import { SidomenuComponent } from './components/sidomenu/sidomenu.component';
import { NewRelaseComponent } from './components/new-relase/new-relase.component';
import { TopInComponent } from './components/top-in/top-in.component';
import { RecommendationComponent } from './components/recommendation/recommendation.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: SidomenuComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'game/:id', component: GameComponent },
      { path: 'playlist', component: PlaylistComponent },
      { path: 'wishlist', component: WishlistComponent },
      { path: 'newRelease', component: NewRelaseComponent },
      { path: 'topIn', component: TopInComponent },
      { path: 'recommendation', component: RecommendationComponent },
      { path: 'userProfile', component: UserComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

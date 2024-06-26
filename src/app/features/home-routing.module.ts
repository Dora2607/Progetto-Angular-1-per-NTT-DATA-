import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from '../auth/auth.guard';

import { AddUserComponent } from './home/userManagement/add-user/add-user.component';
import { UsersListComponent } from './home/userManagement/users-list/users-list.component';
import { NotFoundComponent } from '../shared/not-found/not-found.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',

        children: [
          {
            path: 'usersList',
            component: UsersListComponent,
            canActivate: [AuthGuard],
          },

          {
            path: 'addUser',
            component: AddUserComponent,
            canActivate: [AuthGuard],
          },
          
          { path: '', redirectTo: 'usersList', pathMatch: 'full' },
        ],
      },
    ],
  },
  {
    path: 'usersList/:id',
    loadChildren: () =>
      import('./userDetails/user-details.module').then(
        (m) => m.UserDetailsModule,
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'postOverview',
    loadChildren: () =>
      import('./postOverview/post-overview.module').then(
        (m) => m.PostOverviewModule,
      ),
    canActivate: [AuthGuard],
  },
  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

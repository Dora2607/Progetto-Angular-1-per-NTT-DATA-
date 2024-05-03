import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../../shared/material/material.module';

import { PostListComponent } from './post-list/post-list.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { CommentsComponent } from './comments/comments.component';


@NgModule({
  declarations: [PostListComponent,UserProfileComponent, CommentsComponent],
  imports: [
    CommonModule, 
    MaterialModule
  ],
  exports: [PostListComponent,UserProfileComponent, CommentsComponent]
})
export class DetailsModule { }

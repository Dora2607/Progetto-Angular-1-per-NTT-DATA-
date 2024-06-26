import { Injectable } from '@angular/core';
import { Comments } from '../models/comments.model';
import { Subject} from 'rxjs';
import { UsersService } from './users.service';


@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  comments: { [postId: number]: Comments[] } = {};
  commentsChanged = new Subject<{ [postId: number]: Comments[] }>();
  
  constructor(private usersService: UsersService) {}

  fetchComments(postId: number) {
    
    this.usersService.getComments(postId).subscribe(
      (comments) => {
        this.setComments(postId, comments);
      }
    );
    
    
  }

  setComments(postId: number, comments: Comments[]) {
    this.comments[postId] = comments;
    this.commentsChanged.next(this.comments);
  }

  getComments(postId: number): Comments[] {
    return this.comments[postId] || [];
  }

}


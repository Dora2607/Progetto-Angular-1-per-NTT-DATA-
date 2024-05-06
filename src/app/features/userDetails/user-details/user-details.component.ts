import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { Posts } from '../../../models/posts.model';
import { UserIdentityService } from '../../../services/user-identity.service';
import { Users } from '../../../models/users.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {
  userId!: string;
  userProfile!: Users;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private userIdentity: UserIdentityService,
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.params['id'];
    this.getUserById(+this.userId);
    this.updatedPosts(+this.userId);
  }

  getUserById(id: number) {
    this.userIdentity.getUser(id).subscribe((data) => {
      this.userIdentity.emitUpdateUser(data);
    });
  }

  updatedPosts(id: number) {
    this.usersService.getPosts(id).subscribe((posts: Array<Posts>) => {
      this.userIdentity.emitUpdatePosts(posts);
    });
  }

  // go to back
  goToList() {
    window.history.back();
  }
}

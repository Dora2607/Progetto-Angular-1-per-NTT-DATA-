import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, of } from 'rxjs';
import { Users } from '../models/users.model';
import { UserDataService } from './user-data.service';
import { Posts } from '../models/posts.model';
import { Todos } from '../models/todos.model';
import { UsersService } from './users.service';


@Injectable({
  providedIn: 'root',
})
export class UserIdentityService {
  userDescriptions: string[] = [];


  constructor(
    private usersService: UsersService,
    private userDataService: UserDataService) {}
  

  private identityUserSource = new BehaviorSubject<Users>({
    id: 0,
    name: '',
    email: '',
    gender: '',
    status: '',
  });
  currentUser = this.identityUserSource.asObservable();

  private postsSource = new BehaviorSubject<Array<Posts>>([]);
  currentPosts = this.postsSource.asObservable();

  private todosSource = new BehaviorSubject<Array<Todos>>([]);
  currentTodos = this.todosSource.asObservable();

  getUsers(): Observable<Users[]> {
    return of(this.userDataService.allUsers);
  }

  getUser(id: number | string) {
    return this.getUsers().pipe(
      map((users: Array<Users>) => users.find((user) => user.id === +id)!),
    );
  }

  getUserDescription() {
    this.userDescriptions = [
      "Let's make our city a hub for new ideas, commerce, culture, science, productivity, and social development.",
      'This app is free and allows us to share our ideas and suggestions to improve urban life.',
      'We can protect and preserve the cultural heritage of our city together.',
      "Let's safeguard the natural heritage of our city for future generations.",
      'Supporting positive social and environmental ties between urban areas is crucial for our community.',
      'Join us in making our city a better place to live, work, and play.',
      'Your ideas can help shape the future of our city. Share them with us!',
      'Together, we can make our city a beacon of culture, science, and social development.',
    ];

    return this.userDescriptions[
      Math.floor(Math.random() * this.userDescriptions.length)
    ];
  }

  getIds(users:Users[]):number[]{
    return users.map((user) => user.id);
  }

  getAllPosts(userIds:number[]):Observable<Posts[]>{
    return forkJoin(userIds.map(id => 
      this.usersService.getPosts(id)
    )).pipe(
      map(arrays => arrays.flat())
    );
  }

  emitUpdateUser(user: Users) {
    this.identityUserSource.next(user);
  }
  emitUpdatePosts(posts: Array<Posts>) {
    this.postsSource.next(posts);
  }
  emitUpdateTodos(todos: Array<Todos>) {
    this.todosSource.next(todos);
  }




}

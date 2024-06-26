import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, forkJoin, map } from 'rxjs';
import { Posts } from '../models/posts.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  firstVisit: boolean = true;
  getPosts: boolean = true;
  allPosts: Array<Posts> = [];
  displayedPosts: Array<Posts> = [];
  filteredPostsArr: Array<Posts> = [];

  constructor(private usersService: UsersService) {}

  postsSource = new BehaviorSubject<Array<Posts>>([]);
  singlePostsSource = new BehaviorSubject<Array<Posts>>([]);
  allPostsChanged = new BehaviorSubject<Array<Posts>>([]);
  displayedPostsChanged = new BehaviorSubject<Array<Posts>>([]);
  filteredPosts = new BehaviorSubject<Array<Posts>>([]);

  private addPostBtnClicked = new BehaviorSubject<{ [id: number]: boolean }>(
    {},
  );
  private allPostsSet = new Subject<void>();

  getAllPosts(userIds: number[]): Observable<Posts[]> {
    return forkJoin(userIds.map((id) => this.usersService.getPosts(id))).pipe(
      map((arrays) => arrays.flat()),
    );
  }

  setAllPosts(posts: Array<Posts>) {
    this.allPosts = posts;
    this.allPostsChanged.next(this.allPosts.slice());
    this.setDisplayedPosts(this.allPosts);
    this.allPostsSet.next();
  }

  getAllPostsSet(): Observable<void> {
    return this.allPostsSet.asObservable();
  }

  resetAllPosts() {
    return this.firstVisit = true;
  }

  setDisplayedPosts(displayedPosts: Array<Posts>) {
    this.displayedPosts = displayedPosts;
    this.displayedPostsChanged.next(this.displayedPosts.slice());
  }

  setFilteredPosts(posts: Array<Posts>) {
    this.filteredPostsArr = posts;
    this.filteredPosts.next(this.filteredPostsArr.slice());
  }

  addPersonalPost(post: Posts) {
    this.allPosts.unshift(post);
    this.displayedPostsChanged.next(this.allPosts.slice());
  }

  getDispayedPosts() {
    return this.allPosts.slice();
  }

  resetDisplayedPosts() {
    return (this.getPosts = true);
  }

  resetPosts() {
    this.postsSource.next(this.allPosts);
  }

  getAddedPosts() {
    return this.addPostBtnClicked.asObservable();
  }

  addPost(id: number) {
    const currentPost = this.addPostBtnClicked.getValue();
    currentPost[id] = true;
    this.addPostBtnClicked.next(currentPost);
  }

  getPersonalPosts(id: number) {
    if (!this.displayedPosts || !id) {
      return [];
    }
    return this.displayedPosts.filter((post) => post.user_id === id);
  }

  removePosts(id: number) {
    this.allPosts = this.allPosts.filter((post) => post.user_id !== id);
    this.displayedPosts = this.displayedPosts.filter(
      (post) => post.user_id !== id,
    );
    this.allPostsChanged.next(this.allPosts.slice());
    this.displayedPostsChanged.next(this.displayedPosts.slice());
  }

  removeLoggedInUserPosts(userId: number) {
    // Filtra i post per rimuovere quelli dell'utente loggato
    this.allPosts = this.allPosts.filter(post => post.user_id !== userId);
    this.displayedPosts = this.displayedPosts.filter(post => post.user_id !== userId);
  
    // Aggiorna i BehaviorSubjects
    this.postsSource.next(this.allPosts);
    this.displayedPostsChanged.next(this.displayedPosts);
  }
  


  searchPosts(searchTerm: string): Array<Posts> {
    searchTerm = searchTerm.toLowerCase();
    if (searchTerm.length <= 2) {
      return this.allPosts.filter((post) =>
        post.title.toLowerCase().startsWith(searchTerm),
      );
    } else {
      return this.allPosts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm),
      );
    }
  }
}

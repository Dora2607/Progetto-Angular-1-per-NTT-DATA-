import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, forkJoin, map } from 'rxjs';
import { Posts } from '../models/posts.model';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  firstVisit: boolean = true;
  allPosts: Array<Posts> = [];
  displayedPosts: Array<Posts> = [];
 

  constructor(
    private usersService:UsersService
  ) { }

  postsSource = new BehaviorSubject<Array<Posts>>([]);
  singlePostsSource = new BehaviorSubject<Array<Posts>>([]);


  allPostsChanged =  new BehaviorSubject<Array<Posts>>([]);
  displayedPostsChanged = new BehaviorSubject<Array<Posts>>([]);

  private addPostBtnClicked = new BehaviorSubject<{ [id: number]: boolean }>({});

  private allPostsSet = new Subject<void>();


  getAllPosts(userIds:number[]):Observable<Posts[]>{
    return forkJoin(userIds.map(id => 
      this.usersService.getPosts(id)
    )).pipe(
      map(arrays => arrays.flat())
    );
  }

  setAllPosts(posts:Array<Posts>){
    this.allPosts = posts;
    this.allPostsChanged.next(this.allPosts.slice());
    this.setDisplayedPosts(this.allPosts);
    this.allPostsSet.next();
    
  }

  getAllPostsSet(): Observable<void> {
    return this.allPostsSet.asObservable();
  }

  setDisplayedPosts(displayedPosts:Array<Posts>){
    this.displayedPosts = displayedPosts;
    this.displayedPostsChanged.next(this.displayedPosts.slice());
  }

  addPersonalPost(post:Posts){
    this.allPosts.unshift(post);
    this.displayedPostsChanged.next(this.allPosts.slice());
    console.log(this.allPosts)
    console.log(this.displayedPosts)
    

  }

  getDispayedPosts(){
    return this.allPosts.slice();
  }

  getAddedPosts() {
    return this.addPostBtnClicked.asObservable();
  }

  addPost(id: number) {
    const currentPost = this.addPostBtnClicked.getValue();
    currentPost[id] = true;
    this.addPostBtnClicked.next(currentPost);
  }

  getPersonalPosts(id:number){
    return this.displayedPosts.filter(post => post.user_id === id);
  }


}

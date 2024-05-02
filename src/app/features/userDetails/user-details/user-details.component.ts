import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent implements OnInit {

  @Input()userId!: string;
  

  constructor(
    private route: ActivatedRoute,

  ) {}

  ngOnInit() {
    this.userId =  this.route.snapshot.params['id'];
    console.log(this.userId)
  }

}

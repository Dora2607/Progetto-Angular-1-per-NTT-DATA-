import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Users, newUser } from '../../../../models/users.model';
import { UsersService } from '../../../../services/users.service';
import { UserDataService } from '../../../../services/user-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  public addUserForm!: FormGroup;
  toggleComponent!: boolean;  

  addNewUser: newUser = {
    name: '',
    email: '',
    gender: '',
    status: '',
  };

  constructor(
    private usersService: UsersService,
    private userDataService: UserDataService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.addUserForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    });

    this.userDataService.currentToggleComponent.subscribe(
      (toggleComponent) => (this.toggleComponent = toggleComponent)
    )
  }

  fullName() {
    const name =
      this.addUserForm.value.firstName + ' ' + this.addUserForm.value.lastName;
    return name;
  }

  randomStatus() {
    const status = ['active', 'inactive'];
    const random = Math.floor(Math.random() * status.length);
    return status[random];
  }

  newUser() {
    this.addNewUser = {
      name: this.fullName(),
      email: this.addUserForm.value.email,
      gender: this.addUserForm.value.gender,
      status: this.randomStatus(),
    };
  
    this.usersService.addUser(this.addNewUser).subscribe(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (response: any) => {
        alert('User added successfully');
        const newUser = response as Users;
        this.userDataService.addUser(newUser);
        this.userDataService.setToggleComponent(this.toggleComponent);
        this.router.navigate(['/home/usersList']);
      },
    );
  }
  

  goBack(event: Event) {
    event.preventDefault();
    this.userDataService.setToggleComponent(this.toggleComponent);
    this.router.navigate(['/home/usersList']);
  }
}

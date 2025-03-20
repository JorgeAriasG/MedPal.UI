import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from './../services/user.service';
import { IUser } from '../../../entities/IUser';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  errorMessage: string | null = null;

  constructor(private userService: UserService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      const { name, email, password } = form.value;
      const newUser: IUser = { name, email, password };
      this.userService.register(newUser).subscribe(
        response => {
          console.log('User registered successfully:', response);
          // Optionally navigate to login or home page
        },
        error => {
          console.error('Error registering user:', error);
          this.errorMessage = 'Error registering user';
        }
      );
    }
  }
}

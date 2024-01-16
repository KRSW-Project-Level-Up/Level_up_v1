import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import ValidateForm from 'src/app/helpers/validationform';
import { AuthService } from 'src/app/services/auth.service';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public signUpForm!: FormGroup;
  userId: number = 0;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService
  ) {}

  ngOnInit(): void {
    this.initializeForm();

    this.userStore.getUserFromStore().subscribe((val) => {
      const user = this.auth.getUserFromToken();
      this.currentUser = user;
      console.log('userNew', this.currentUser);

      if (this.currentUser) {
        this.signUpForm.patchValue({
          firstName: this.currentUser.firstName,
          lastName: this.currentUser.lastName,
          userName: this.currentUser.username,
          email: this.currentUser.email,
          age: this.currentUser.age,
          nationality: this.currentUser.nationality,
        });

        this.signUpForm.get('email')?.disable();
      }
    });
  }

  private initializeForm(): void {
    this.signUpForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.required],
      age: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      nationality: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.signUpForm.valid) {
      console.log(this.signUpForm.value);
      let signUpObj = {
        userInfo: {
          ...this.signUpForm.value,
          role: this.currentUser.role, // Assuming role is part of the user information
          token: this.currentUser.token, // Assuming token is part of the user information
        },
        sessionData: {}, // Additional session data if needed
      };
      // Make an API call for updating user information
      this.auth.updateUserInfo(signUpObj.userInfo).subscribe({
        next: (response) => {
          console.log(response);
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'User information updated successfully!',
            duration: 5000,
          });

          // Consider what should happen after successful update
          // For instance, you might want to navigate to a profile page
        },
        error: (error) => {
          console.log(error);
          this.toast.error({
            detail: 'ERROR',
            summary: 'Update failed, please try again.',
            duration: 5000,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.signUpForm);
    }
  }

  logout() {
    this.auth.signOut();
  }
}

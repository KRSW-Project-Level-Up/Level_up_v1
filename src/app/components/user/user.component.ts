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
          user_id: this.currentUser.user_id,
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
      user_id: [this.userId],
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

      // Prepare the object to be sent to the backend
      let signUpObj = {
        userInfo: {
          ...this.signUpForm.value,
          // Assuming the token is not required to be sent for updating user info
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

          // If the server responds with a new token, store it
          if (response.token) {
            this.auth.storeToken(response.token);
          }

          // Refresh user information
          this.currentUser = this.auth.getUserFromToken();
          this.updateFormWithCurrentUser();

          // Navigate to the home page or any other page as required
          this.router.navigate(['/home']);
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

  private updateFormWithCurrentUser() {
    this.signUpForm.patchValue({
      user_id: this.currentUser.user_id,
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      userName: this.currentUser.username,
      email: this.currentUser.email,
      age: this.currentUser.age,
      nationality: this.currentUser.nationality,
    });

    // If the email should remain disabled after update
    this.signUpForm.get('email')?.disable();
  }

  cancel(): void {
    this.router.navigate(['/home']);
  }
  logout() {
    this.auth.signOut();
  }
}

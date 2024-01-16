import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import ValidateForm from '../../helpers/validationform';
import { NgToastService } from 'ng-angular-popup';
import { UserStoreService } from 'src/app/services/user-store.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public loginForm!: FormGroup;
  type: string = 'password';
  isText: boolean = false;
  eyeIcon: string = 'fa-eye-slash';
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: NgToastService,
    private userStore: UserStoreService
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? (this.eyeIcon = 'fa-eye') : (this.eyeIcon = 'fa-eye-slash');
    this.isText ? (this.type = 'text') : (this.type = 'password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginObj = this.loginForm.value;

      // Make an API call for authentication
      this.auth.signIn(loginObj).subscribe({
        next: (response) => {
          //this.auth.storeToken(response.token);
          console.log(response);
          this.toast.success({
            detail: 'SUCCESS',
            summary: 'Login Successful',
            duration: 5000,
          });

          this.userStore.setRoleForStore(response.role);
          this.userStore.setUSerIdForStore(response.user_id);

          this.router.navigate(['home']);
        },
        error: (error) => {
          console.log(error);
          this.toast.error({
            detail: 'ERROR',
            summary: 'Invalid username or password',
            duration: 5000,
          });
        },
      });
    } else {
      ValidateForm.validateAllFormFields(this.loginForm);
    }
  }
}

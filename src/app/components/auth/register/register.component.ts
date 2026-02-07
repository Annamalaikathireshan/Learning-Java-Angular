import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1>Join Us</h1>
          <p>Create an account to manage employees</p>
        </div>
        
        <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="username">Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              [(ngModel)]="username" 
              required 
              placeholder="Choose a username"
              #usernameInput="ngModel"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="password" 
              required 
              placeholder="Create a password"
              #passwordInput="ngModel"
            >
          </div>

          @if (errorMessage) {
            <div class="error-message">
              {{ errorMessage }}
            </div>
          }

          <button type="submit" [disabled]="!registerForm.valid" class="btn-primary">
            Sign Up
          </button>
        </form>

        <div class="auth-footer">
          <p>Already have an account? <a routerLink="/login">Login</a></p>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
      font-family: 'Inter', sans-serif;
    }

    .auth-card {
      background: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(10px);
      padding: 3rem;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .auth-header h1 {
      margin: 0;
      color: #2d3748;
      font-size: 1.8rem;
    }

    .auth-header p {
      color: #718096;
      margin-top: 0.5rem;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.9rem;
      font-weight: 500;
      color: #4a5568;
    }

    .form-group input {
      padding: 0.8rem;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      outline: none;
      transition: border-color 0.2s;
    }

    .form-group input:focus {
      border-color: #667eea;
    }

    .btn-primary {
      background: #764ba2;
      color: white;
      padding: 1rem;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }

    .btn-primary:hover {
      background: #5a4293;
    }

    .btn-primary:disabled {
      background: #a0aec0;
      cursor: not-allowed;
    }

    .error-message {
      color: #e53e3e;
      font-size: 0.85rem;
      text-align: center;
    }

    .auth-footer {
      margin-top: 2rem;
      text-align: center;
      color: #718096;
    }

    .auth-footer a {
      color: #764ba2;
      text-decoration: none;
      font-weight: 600;
    }
  `]
})
export class RegisterComponent {
    username = '';
    password = '';
    errorMessage = '';

    private authService = inject(AuthService);
    private router = inject(Router);

    onRegister() {
        const payload = { username: this.username, password: this.password };
        this.authService.register(payload).subscribe({
            next: (response) => {
                console.log('Registration successful', response);
                this.router.navigate(['/login']);
            },
            error: (error) => {
                console.error('Registration failed', error);
                this.errorMessage = 'Registration failed. Try again.';
            }
        });
    }
}

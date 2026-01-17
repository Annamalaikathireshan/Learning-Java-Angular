import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiTutorComponent } from '../ai-tutor/ai-tutor.component';
import { QuizComponent } from '../quiz/quiz.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { RealtimeDataService } from '../../services/realtime-data.service';

@Component({
    selector: 'app-learning-hub',
    standalone: true,
    imports: [CommonModule, AiTutorComponent, QuizComponent, DashboardComponent],
    template: `
    <nav class="main-nav glass">
      <div class="nav-logo">
        <span class="logo-icon">🅰️</span>
        <span class="logo-text gradient-text">Angular Mastery</span>
      </div>
      <div class="nav-links">
        <button 
          [class.active]="view() === 'home'" 
          (click)="view.set('home')"
        >
          <span class="icon">🏠</span> Hub
        </button>
        <button 
          [class.active]="view() === 'learn'" 
          (click)="view.set('learn')"
        >
          <span class="icon">📖</span> Learn
        </button>
        <button 
          [class.active]="view() === 'quiz'" 
          (click)="view.set('quiz')"
        >
          <span class="icon">🎯</span> Quiz
        </button>
      </div>
      <div class="nav-user">
        <div class="user-badge glass">
          <span class="xp-text">{{ (userProfile().xp | number) }} XP</span>
        </div>
      </div>
    </nav>

    <main class="content-area">
      <app-dashboard *ngIf="view() === 'home'"></app-dashboard>
      <app-ai-tutor *ngIf="view() === 'learn'"></app-ai-tutor>
      <app-quiz *ngIf="view() === 'quiz'"></app-quiz>
    </main>
  `,
    styles: [`
    :host {
      display: flex;
      flex-direction: column;
      height: 100vh;
      width: 100vw;
      overflow: hidden;
      background: var(--bg-primary);
    }

    .main-nav {
      height: 72px;
      margin: 1rem 1rem 0 1rem;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 100;
      flex-shrink: 0;
    }

    .nav-logo {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 1.25rem;
      font-weight: 800;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.03);
      padding: 0.4rem;
      border-radius: 12px;
      border: 1px solid var(--glass-border);

      button {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        padding: 0.6rem 1.2rem;
        border-radius: 8px;
        font-family: inherit;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s;

        &:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }

        &.active {
          background: var(--accent-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
      }
    }

    .user-badge {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-tertiary);
      border-color: rgba(236, 72, 153, 0.2);
    }

    .content-area {
      flex: 1;
      position: relative;
      overflow-y: auto;
    }
  `]
})
export class LearningHubComponent {
    view = signal<'home' | 'learn' | 'quiz'>('home');
    private realtime = inject(RealtimeDataService);
    userProfile = this.realtime.getProfile();
}

import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeDataService } from '../../services/realtime-data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard-container animate-fade-in">
      <header class="dashboard-header">
        <h1>Welcome back, <span class="gradient-text">{{ profile().name }}</span>!</h1>
        <p>You're Level {{ profile().level }}. Here's your current standing.</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card glass">
          <div class="stat-icon pink">🔥</div>
          <div class="stat-info">
            <span class="stat-value">{{ profile().streak }}</span>
            <span class="stat-label">Day Streak</span>
          </div>
        </div>
        <div class="stat-card glass">
          <div class="stat-icon purple">🏆</div>
          <div class="stat-info">
            <span class="stat-value">{{ profile().completedChallenges.length }}</span>
            <span class="stat-label">Challenges Done</span>
          </div>
        </div>
        <div class="stat-card glass">
          <div class="stat-icon blue">⚡</div>
          <div class="stat-info">
            <span class="stat-value">{{ (profile().xp | number) }}</span>
            <span class="stat-label">Total XP</span>
          </div>
        </div>
        <div class="stat-card glass">
          <div class="stat-icon green">🎯</div>
          <div class="stat-info">
            <span class="stat-value">85%</span>
            <span class="stat-label">Quiz Accuracy</span>
          </div>
        </div>
      </div>

      <div class="dashboard-content">
        <div class="progress-section glass">
          <h2>Learning Path Progress</h2>
          <div class="path-overview">
            <div class="path-item" *ngFor="let p of progressItems()">
              <div class="path-info">
                <span>{{ p.label }}</span>
                <span>{{ p.value }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="p.value" [style.background]="p.color"></div>
              </div>
            </div>
          </div>
        </div>

        <div class="recent-achievements glass">
          <h2>Recent Achievements</h2>
          <div class="achievement-list">
            <div class="achievement-item">
              <div class="achievement-badge">🌱</div>
              <div class="achievement-info">
                <h4>Signal Beginner</h4>
                <p>Completed first 3 signal modules</p>
              </div>
            </div>
            <div class="achievement-item">
              <div class="achievement-badge">🚀</div>
              <div class="achievement-info">
                <h4>First Quiz</h4>
                <p>Scored 100% on Fundamentals</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 3rem;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }

    .dashboard-header {
      h1 {
        font-size: 3rem;
        margin-bottom: 0.5rem;
      }
      p {
        color: var(--text-secondary);
        font-size: 1.1rem;
      }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      
      .stat-icon {
        width: 56px;
        height: 56px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        background: rgba(255, 255, 255, 0.05);
        
        &.pink { box-shadow: 0 0 20px rgba(236, 72, 153, 0.2); }
        &.purple { box-shadow: 0 0 20px rgba(168, 85, 247, 0.2); }
        &.blue { box-shadow: 0 0 20px rgba(99, 102, 241, 0.2); }
        &.green { box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
      }

      .stat-info {
        display: flex;
        flex-direction: column;
        .stat-value {
          font-size: 1.5rem;
          font-weight: 800;
        }
        .stat-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      }
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      gap: 2rem;
    }

    .progress-section, .recent-achievements {
      padding: 2rem;
      
      h2 {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
      }
    }

    .path-overview {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .path-item {
        .path-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
        }
        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          overflow: hidden;
          
          .progress-fill {
            height: 100%;
            transition: width 1s ease-out;
          }
        }
      }
    }

    .achievement-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;

      .achievement-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.02);
        
        .achievement-badge {
          font-size: 1.5rem;
        }
        
        .achievement-info {
          h4 { font-size: 0.95rem; margin-bottom: 0.1rem; }
          p { font-size: 0.8rem; color: var(--text-muted); }
        }
      }
    }

    @media (max-width: 968px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent {
  private realtime = inject(RealtimeDataService);
  profile = this.realtime.getProfile();

  progressItems = computed(() => {
    const completed = this.profile().completedModules;

    const categories = [
      {
        label: 'Fundamentals',
        modules: ['getting-started', 'interpolation', 'events'],
        color: 'var(--accent-primary)'
      },
      {
        label: 'Signals',
        modules: ['signals-set', 'signals-update', 'computed'],
        color: 'var(--accent-secondary)'
      },
      {
        label: 'Architecture',
        modules: ['template-binding', 'nesting', 'for-loop'],
        color: 'var(--accent-tertiary)'
      },
      {
        label: 'RxJS',
        modules: ['observables', 'operators', 'async-pipe'],
        color: '#10b981'
      }
    ];

    return categories.map(cat => {
      const doneInCat = cat.modules.filter(m => completed.includes(m)).length;
      const progress = Math.round((doneInCat / cat.modules.length) * 100);
      return { label: cat.label, value: progress, color: cat.color };
    });
  });
}

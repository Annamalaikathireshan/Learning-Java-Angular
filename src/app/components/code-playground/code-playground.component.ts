import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Challenge } from '../../services/challenge.service';

@Component({
    selector: 'app-code-playground',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
    <div class="playground-card glass animate-fade-in">
      <div class="playground-header">
        <div class="challenge-meta">
          <span class="difficulty-tag" [class]="challenge.difficulty.toLowerCase()">
            {{ challenge.difficulty }}
          </span>
          <h3>{{ challenge.title }}</h3>
        </div>
        <div class="points-badge">+{{ challenge.points }} XP</div>
      </div>

      <div class="challenge-description">
        <p>{{ challenge.description }}</p>
      </div>

      <div class="editor-container">
        <div class="editor-header">
          <span>index.ts</span>
          <button class="hint-btn" (click)="showHint.set(!showHint())">
            {{ showHint() ? 'Hide Hint' : 'Show Hint 💡' }}
          </button>
        </div>
        <div class="code-editor">
          <textarea 
            [(ngModel)]="userCode"
            spellcheck="false"
            placeholder="Write your code here..."
            class="editor-textarea"
          ></textarea>
          <div class="hint-overlay" *ngIf="showHint()">
            <p>{{ challenge.hint }}</p>
          </div>
        </div>
      </div>

      <div class="playground-footer">
        <div class="status-msg" [class.error]="status() === 'error'" [class.success]="status() === 'success'">
          {{ statusMessage() }}
        </div>
        <button class="run-btn" (click)="validate()">
          Run & Verify 🚀
        </button>
      </div>
    </div>
  `,
    styles: [`
    .playground-card {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      height: 100%;
      border-color: var(--accent-primary);
    }

    .playground-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .challenge-meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        h3 { font-size: 1.1rem; margin: 0; }
        
        .difficulty-tag {
          padding: 0.25rem 0.6rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          
          &.simple { background: rgba(16, 185, 129, 0.1); color: #10b981; }
          &.medium { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
          &.hard { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
        }
      }

      .points-badge {
        font-size: 0.85rem;
        font-weight: 700;
        color: var(--accent-secondary);
      }
    }

    .challenge-description {
      font-size: 0.9rem;
      color: var(--text-secondary);
      line-height: 1.5;
    }

    .editor-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      background: #0d0d0f;
      border-radius: 12px;
      border: 1px solid var(--glass-border);
      overflow: hidden;

      .editor-header {
        padding: 0.5rem 1rem;
        background: rgba(255, 255, 255, 0.05);
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-mono);
        font-size: 0.75rem;
        color: var(--text-muted);

        .hint-btn {
          background: transparent;
          border: none;
          color: var(--accent-primary);
          cursor: pointer;
          font-weight: 600;
          &:hover { text-decoration: underline; }
        }
      }

      .code-editor {
        position: relative;
        flex: 1;
        
        .editor-textarea {
          width: 100%;
          height: 100%;
          background: transparent;
          border: none;
          color: #e2e8f0;
          font-family: var(--font-mono);
          font-size: 0.9rem;
          padding: 1rem;
          resize: none;
          outline: none;
          line-height: 1.6;
        }

        .hint-overlay {
          position: absolute;
          bottom: 1rem;
          right: 1rem;
          left: 1rem;
          padding: 1rem;
          background: rgba(99, 102, 241, 0.15);
          backdrop-filter: blur(8px);
          border: 1px solid var(--accent-primary);
          border-radius: 8px;
          font-size: 0.85rem;
          color: white;
          animation: slideUp 0.3s ease-out;
        }
      }
    }

    .playground-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .status-msg {
        font-size: 0.85rem;
        font-weight: 600;
        &.error { color: #ef4444; }
        &.success { color: #10b981; }
      }

      .run-btn {
        background: var(--gradient-vibrant);
        border: none;
        color: white;
        padding: 0.6rem 1.25rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: transform 0.2s;
        &:hover { transform: scale(1.05); }
      }
    }

    @keyframes slideUp {
      from { transform: translateY(10px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `]
})
export class CodePlaygroundComponent {
    @Input() challenge!: Challenge;
    @Output() completed = new EventEmitter<number>();

    userCode = '';
    showHint = signal(false);
    status = signal<'none' | 'success' | 'error'>('none');
    statusMessage = signal('');

    ngOnInit() {
        this.userCode = this.challenge.starterCode;
    }

    validate() {
        const isCorrect = this.challenge.validationRegex.test(this.userCode);

        if (isCorrect) {
            this.status.set('success');
            this.statusMessage.set('Correct! Solution verified. 🎉');
            this.completed.emit(this.challenge.points);
        } else {
            this.status.set('error');
            this.statusMessage.set('Hmm, that doesn\'t look right. Try again!');
        }
    }
}

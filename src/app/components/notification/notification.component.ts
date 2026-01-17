import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealtimeDataService } from '../../services/realtime-data.service';

@Component({
    selector: 'app-notification',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="notification-container">
      <div *ngFor="let n of items()" class="toast glass animate-slide-in" [class]="n.type">
        <span class="icon">{{ n.type === 'success' ? '✅' : '⚡' }}</span>
        <span class="message">{{ n.message }}</span>
      </div>
    </div>
  `,
    styles: [`
    .notification-container {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      z-index: 1000;
      pointer-events: none;
    }

    .toast {
      padding: 1rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      min-width: 300px;
      border-radius: 12px;
      pointer-events: auto;
      
      &.success { border-left: 4px solid #10b981; }
      &.info { border-left: 4px solid var(--accent-primary); }

      .icon { font-size: 1.25rem; }
      .message { font-size: 0.9rem; font-weight: 500; }
    }

    .animate-slide-in {
      animation: slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent implements OnInit {
    items = signal<any[]>([]);

    constructor(private realtime: RealtimeDataService) { }

    ngOnInit() {
        this.realtime.notifications$.subscribe(n => {
            const id = Date.now();
            this.items.update(prev => [...prev, { ...n, id }]);
            setTimeout(() => {
                this.items.update(prev => prev.filter(x => x.id !== id));
            }, 5000);
        });
    }
}

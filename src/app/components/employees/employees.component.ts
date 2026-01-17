import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="employees-container">
      <header class="page-header">
        <h1 class="gradient-text">Employee Directory</h1>
        <p class="subtitle">Manage your team efficiently</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card glass">
          <span class="stat-icon">👥</span>
          <div class="stat-info">
            <span class="stat-label">Total Employees</span>
            <span class="stat-value">{{ employees().length }}</span>
          </div>
        </div>
        <div class="stat-card glass">
          <span class="stat-icon">🏢</span>
          <div class="stat-info">
            <span class="stat-label">Departments</span>
            <span class="stat-value">{{ uniqueDepartments() }}</span>
          </div>
        </div>
      </div>

      <div class="actions-bar glass">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="number" 
            [(ngModel)]="searchId" 
            placeholder="Search by ID..."
            (keyup.enter)="searchEmployee()"
          >
          <button *ngIf="searchId" class="btn-clear" (click)="clearSearch()">✕</button>
          <button class="btn-search" (click)="searchEmployee()">Search</button>
        </div>
        <button class="btn-create" (click)="showForm.set(true)">
          <span class="icon">➕</span> Add Employee
        </button>
      </div>

      <!-- Error / Loading States -->
      <div *ngIf="error()" class="error-msg glass">
        {{ error() }}
        <button (click)="error.set(null)">✕</button>
      </div>

      <!-- Employee Form Modal -->
      <div class="modal-overlay" *ngIf="showForm()">
        <div class="modal-content glass">
          <h2>{{ editingEmployee() ? 'Edit' : 'Add' }} Employee</h2>
          <form (submit)="saveEmployee($event)" class="employee-form">
            <div class="form-grid">
              <div class="form-group">
                <label>First Name</label>
                <input [(ngModel)]="currentEmployee.firstName" name="firstName" required>
              </div>
              <div class="form-group">
                <label>Last Name</label>
                <input [(ngModel)]="currentEmployee.lastName" name="lastName" required>
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" [(ngModel)]="currentEmployee.email" name="email" required>
              </div>
              <div class="form-group">
                <label>Salary</label>
                <input [(ngModel)]="currentEmployee.salary" name="salary">
              </div>
              <div class="form-group full-width">
                <label>Department</label>
                <input [(ngModel)]="currentEmployee.department" name="department">
              </div>
            </div>
            <div class="form-actions">
              <button type="button" class="btn-ghost" (click)="closeForm()">Cancel</button>
              <button type="submit" class="btn-primary">Save Employee</button>
            </div>
          </form>
        </div>
      </div>

      <div class="table-container glass">
        <table class="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let emp of employees()">
              <td><span class="id-badge">#{{ emp.id }}</span></td>
              <td>
                <div class="name-cell">
                  <div class="avatar">{{ emp.firstName[0] }}{{ emp.lastName[0] }}</div>
                  <span>{{ emp.firstName }} {{ emp.lastName }}</span>
                </div>
              </td>
              <td class="email-cell">{{ emp.email }}</td>
              <td>{{ emp.salary }}</td>
              <td><span class="dept-badge">{{ emp.department }}</span></td>
              <td class="actions-cell">
                <button class="btn-icon delete" (click)="deleteEmployee(emp.id!)" title="Delete">
                  🗑️
                </button>
              </td>
            </tr>
            <tr *ngIf="employees().length === 0 && !loading()">
              <td colspan="6" class="empty-state">No employees found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .employees-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      animation: fadeIn 0.5s ease-out;
    }

    .page-header {
      margin-bottom: 2rem;
      h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
      .subtitle { color: var(--text-secondary); font-size: 1.1rem; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .stat-card {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      .stat-icon { font-size: 2.5rem; }
      .stat-label { display: block; color: var(--text-secondary); font-size: 0.9rem; }
      .stat-value { font-size: 1.8rem; font-weight: 800; color: var(--text-primary); }
    }

    .actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      margin-bottom: 2rem;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .search-box {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      padding: 0.2rem 0.4rem;
      flex: 1;
      max-width: 400px;
      transition: border-color 0.2s;

      &:focus-within {
        border-color: var(--accent-primary);
      }
      
      input {
        background: transparent;
        border: none;
        color: white;
        padding: 0.6rem;
        flex: 1;
        outline: none;
        &::placeholder { color: rgba(255,255,255,0.3); }
      }

      .btn-search {
        background: rgba(255, 255, 255, 0.08);
        color: white;
        border: 1px solid var(--glass-border);
        padding: 0.4rem 1rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        
        &:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255,255,255,0.3);
        }
      }

      .btn-clear {
        background: transparent;
        border: none;
        color: var(--text-secondary);
        font-size: 1.1rem;
        cursor: pointer;
        padding: 0 0.5rem;
        display: flex;
        align-items: center;
        transition: color 0.2s;
        
        &:hover {
          color: var(--text-primary);
        }
      }
    }

    .btn-create, .btn-primary {
      background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
        filter: brightness(1.1);
      }

      &:active {
        transform: translateY(0);
      }
    }

    .btn-ghost {
      background: transparent;
      color: var(--text-secondary);
      border: 1px solid var(--glass-border);
      padding: 0.8rem 1.5rem;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
        color: var(--text-primary);
        border-color: rgba(255, 255, 255, 0.2);
      }
    }

    .table-container {
      overflow-x: auto;
      border-radius: 16px;
    }

    .employee-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      
      th {
        padding: 1.2rem 1.5rem;
        color: var(--text-secondary);
        font-weight: 600;
        font-size: 0.9rem;
        border-bottom: 1px solid var(--glass-border);
      }
      
      td {
        padding: 1.2rem 1.5rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      }
      
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: rgba(255, 255, 255, 0.02); }
    }

    .id-badge {
      background: rgba(255, 255, 255, 0.05);
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      font-family: monospace;
      color: var(--accent-tertiary);
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      
      .avatar {
        width: 32px;
        height: 32px;
        background: var(--accent-primary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.8rem;
        font-weight: 700;
        color: white;
      }
    }

    .dept-badge {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      padding: 0.2rem 0.8rem;
      border-radius: 20px;
      font-size: 0.85rem;
    }

    .btn-icon {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.5rem;
      border-radius: 8px;
      transition: all 0.2s;
      
      &:hover { background: rgba(255, 255, 255, 0.05); }
      &.delete:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      width: 100%;
      max-width: 600px;
      padding: 2rem;
      border-radius: 24px;
      animation: slideUp 0.3s ease-out;
      
      h2 { margin-bottom: 2rem; }
    }

    .employee-form {
      .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.5rem;
        margin-bottom: 2rem;
      }
      
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        
        &.full-width { grid-column: span 2; }
        
        label { font-size: 0.9rem; color: var(--text-secondary); }
        input {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--glass-border);
          padding: 0.8rem;
          border-radius: 12px;
          color: white;
          &:focus { border-color: var(--accent-primary); outline: none; }
        }
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }

    .error-msg {
      background: rgba(239, 68, 68, 0.1);
      border-color: rgba(239, 68, 68, 0.2);
      color: #fca5a5;
      padding: 1rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class EmployeesComponent implements OnInit {
  private employeeService = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  showForm = signal(false);
  editingEmployee = signal<Employee | null>(null);
  searchId: number | null = null;

  currentEmployee: Employee = this.getEmptyEmployee();

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading.set(true);
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load employees. Check if backend is running.');
        this.loading.set(false);
      }
    });
  }

  getEmptyEmployee(): Employee {
    return { firstName: '', lastName: '', email: '', salary: '', department: '' };
  }

  searchEmployee() {
    if (!this.searchId) {
      this.loadEmployees();
      return;
    }
    this.loading.set(true);
    this.employeeService.getEmployeeById(this.searchId).subscribe({
      next: (emp) => {
        this.employees.set(emp ? [emp] : []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(`Employee with ID ${this.searchId} not found.`);
        this.loading.set(false);
        this.employees.set([]);
      }
    });
  }

  clearSearch() {
    this.searchId = null;
    this.loadEmployees();
  }

  saveEmployee(event: Event) {
    event.preventDefault();
    this.employeeService.createEmployee(this.currentEmployee).subscribe({
      next: () => {
        this.loadEmployees();
        this.closeForm();
      },
      error: (err) => {
        this.error.set('Failed to save employee. Email must be unique.');
      }
    });
  }

  deleteEmployee(id: number) {
    if (confirm('Are you sure you want to delete this employee?')) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: () => this.loadEmployees(),
        error: (err) => this.error.set('Failed to delete employee.')
      });
    }
  }

  closeForm() {
    this.showForm.set(false);
    this.editingEmployee.set(null);
    this.currentEmployee = this.getEmptyEmployee();
  }

  uniqueDepartments() {
    return new Set(this.employees().map(e => e.department)).size;
  }
}

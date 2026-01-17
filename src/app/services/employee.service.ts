import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee.model';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class EmployeeService {
    private apiUrl = 'http://localhost:8080/api/employees';
    private http = inject(HttpClient);

    getEmployees(): Observable<Employee[]> {
        return this.http.get<Employee[]>(this.apiUrl);
    }

    getEmployeeById(id: number): Observable<Employee> {
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }

    createEmployee(employee: Employee): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl, employee);
    }

    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}

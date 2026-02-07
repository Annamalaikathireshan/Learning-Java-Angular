import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://localhost:8080/auth';
    private http = inject(HttpClient);

    login(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, payload);
    }

    register(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/register`, payload);
    }
}

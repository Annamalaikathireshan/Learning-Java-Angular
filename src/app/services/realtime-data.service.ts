import { Injectable, signal, effect } from '@angular/core';
import { Subject } from 'rxjs';

export interface UserProfile {
    id: string;
    name: string;
    xp: number;
    streak: number;
    level: number;
    completedChallenges: string[];
    completedModules: string[];
    lastActive: Date;
}

@Injectable({
    providedIn: 'root'
})
export class RealtimeDataService {
    private userProfile = signal<UserProfile>(this.loadProfile());

    // Real-time notification stream
    notifications$ = new Subject<{ message: string, type: 'success' | 'info' }>();

    constructor() {
        // Persist changes to local storage
        effect(() => {
            localStorage.setItem('angular_mastery_user', JSON.stringify(this.userProfile()));
        });

        // Simulate real-time streak updates or rewards from "server"
        setInterval(() => {
            if (Math.random() > 0.95) {
                this.notifications$.next({
                    message: "Another developer just finished the 'Hard' challenge! 🔥",
                    type: 'info'
                });
            }
        }, 10000);
    }

    private loadProfile(): UserProfile {
        const saved = localStorage.getItem('angular_mastery_user');
        if (saved) return JSON.parse(saved);

        return {
            id: 'user-123',
            name: 'Angular Ninja',
            xp: 1250,
            streak: 12,
            level: 5,
            completedChallenges: [],
            completedModules: [],
            lastActive: new Date()
        };
    }

    getProfile() {
        return this.userProfile.asReadonly();
    }

    addXp(amount: number) {
        this.userProfile.update(p => ({
            ...p,
            xp: p.xp + amount,
            level: Math.floor((p.xp + amount) / 500) + 1
        }));
        this.notifications$.next({ message: `+${amount} XP Earned! 🚀`, type: 'success' });
    }

    completeChallenge(challengeId: string, points: number) {
        if (this.userProfile().completedChallenges.includes(challengeId)) return;

        this.userProfile.update(p => ({
            ...p,
            completedChallenges: [...p.completedChallenges, challengeId],
            xp: p.xp + points
        }));
        this.notifications$.next({ message: `Challenge Mastered! +${points} XP`, type: 'success' });
    }

    completeModule(moduleId: string, points: number = 50) {
        if (this.userProfile().completedModules.includes(moduleId)) return;

        this.userProfile.update(p => ({
            ...p,
            completedModules: [...p.completedModules, moduleId],
            xp: p.xp + points
        }));
        this.notifications$.next({ message: `Module Completed! +${points} XP 📚`, type: 'success' });
    }
}

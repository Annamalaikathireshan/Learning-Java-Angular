import { Injectable, signal } from '@angular/core';

export interface Challenge {
    id: string;
    title: string;
    difficulty: 'Simple' | 'Medium' | 'Hard';
    description: string;
    starterCode: string;
    solution: string;
    validationRegex: RegExp;
    hint: string;
    points: number;
}

@Injectable({
    providedIn: 'root'
})
export class ChallengeService {
    challenges = signal<Challenge[]>([
        {
            id: 'simple-1',
            title: 'Initialize a Signal',
            difficulty: 'Simple',
            description: 'Create a signal named `count` with an initial value of 0.',
            starterCode: 'import { signal } from "@angular/core";\n\n// Create your signal here\n',
            solution: 'const count = signal(0);',
            validationRegex: /signal\(\s*0\s*\)/,
            hint: 'Use the signal() function from @angular/core.',
            points: 10
        },
        {
            id: 'medium-1',
            title: 'Dynamic Computed Signal',
            difficulty: 'Medium',
            description: 'Create a signal `price` (100) and a computed signal `total` that adds a 15% tax to the price.',
            starterCode: 'import { signal, computed } from "@angular/core";\n\nconst price = signal(100);\n// Create computed "total" here\n',
            solution: 'const total = computed(() => price() * 1.15);',
            validationRegex: /computed\(\s*\(\s*\)\s*=>\s*price\(\s*\)\s*\*\s*1\.15\s*\)/,
            hint: 'Use computed() and multiply price() by 1.15.',
            points: 25
        },
        {
            id: 'hard-1',
            title: 'Effect with Logic',
            difficulty: 'Hard',
            description: 'Create an effect that logs "Locked" if the signal `status` is false, and "Active" if it is true.',
            starterCode: 'import { effect, signal } from "@angular/core";\n\nconst status = signal(false);\n// Create effect here\n',
            solution: 'effect(() => { console.log(status() ? "Active" : "Locked"); });',
            validationRegex: /effect\(\s*\(\s*\)\s*=>\s*\{.*console\.log\(.*status\(\).*\?.*"Active".*:.*"Locked".*\).*\}/,
            hint: 'Use effect() and a ternary operator inside console.log.',
            points: 50
        }
    ]);
}

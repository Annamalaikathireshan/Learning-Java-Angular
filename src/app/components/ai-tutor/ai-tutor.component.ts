import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface Module {
    id: string;
    name: string;
    description: string;
    concept: string;
    exercise: string;
    codeExample?: string;
    starterCode?: string;
    validationRegex?: RegExp;
    status: 'locked' | 'available' | 'completed';
}

interface Phase {
    id: string;
    name: string;
    modules: Module[];
}

import { ChallengeService, Challenge } from '../../services/challenge.service';
import { RealtimeDataService } from '../../services/realtime-data.service';
import { CodePlaygroundComponent } from '../code-playground/code-playground.component';
import { NotificationComponent } from '../notification/notification.component';

@Component({
    selector: 'app-ai-tutor',
    standalone: true,
    imports: [CommonModule, FormsModule, CodePlaygroundComponent, NotificationComponent],
    templateUrl: './ai-tutor.component.html',
    styleUrl: './ai-tutor.component.scss'
})
export class AiTutorComponent {
    userInput = signal('');
    messages = signal<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I am your Angular AI Tutor. I can help you master everything from Signals to RxJS. What would you like to learn today?',
            timestamp: new Date()
        }
    ]);

    phases = signal<Phase[]>(this.loadProgress());
    currentModule = signal<Module | null>(null);

    // Coding Challenges Logic
    mode = signal<'chat' | 'coding'>('chat');
    challenges = computed(() => this.challengeService.challenges());
    currentChallenge = signal<Challenge | null>(null);

    constructor(
        private challengeService: ChallengeService,
        private realtime: RealtimeDataService
    ) {
        // Persist progress when phases change
        const stored = localStorage.getItem('angular_tutor_progress');
        if (stored) {
            try {
                this.phases.set(JSON.parse(stored));
            } catch (e) {
                console.error('Failed to load progress', e);
            }
        }
    }

    private loadProgress(): Phase[] {
        return [
            {
                id: 'fundamentals',
                name: 'Phase 1: Angular Fundamentals',
                modules: [
                    {
                        id: 'getting-started',
                        name: 'Getting Started',
                        description: 'Basic project structure.',
                        concept: 'Angular projects are composed of components, which are the building blocks of your UI.',
                        exercise: 'Explore the `src/app` directory and identify the root component.',
                        status: 'available'
                    },
                    {
                        id: 'interpolation',
                        name: 'Dynamic Text',
                        description: 'Interpolation basics.',
                        concept: 'Use double curly braces `{{ }}` to embed dynamic data in your templates.',
                        exercise: 'Try changing the title in `app.component.ts` and verify it updates in the template.',
                        status: 'locked'
                    },
                    {
                        id: 'events',
                        name: 'Event Listeners',
                        description: 'Handling clicks.',
                        concept: 'Use `(click)="method()"` to handle user interactions.',
                        exercise: 'Add a button that calls a method to log a message.',
                        status: 'locked'
                    }
                ]
            },
            {
                id: 'signals',
                name: 'Phase 2: State and Signals',
                modules: [
                    {
                        id: 'signals-set',
                        name: 'Writable Signals (set)',
                        description: 'Setting state.',
                        concept: 'Signals are reactive primitives. Use `.set()` to replace a value.',
                        exercise: 'Create a signal named "count" with initial value 0, then use count.set(10) to update it.',
                        starterCode: 'import { signal } from "@angular/core";\n\nconst count = signal(0);\n// Your code here\n',
                        validationRegex: /count\.set\(10\)/,
                        status: 'locked'
                    },
                    {
                        id: 'signals-update',
                        name: 'Writable Signals (update)',
                        description: 'Updating state.',
                        concept: 'Use `.update(fn)` to derive the next value from the current one.',
                        exercise: 'Update the count signal by adding 5 to its current value using .update().',
                        starterCode: 'import { signal } from "@angular/core";\n\nconst count = signal(10);\n// Your code here\n',
                        validationRegex: /count\.update\(\s*(val|v|n)\s*=>\s*(val|v|n)\s*\+\s*5\s*\)/,
                        status: 'locked'
                    },
                    {
                        id: 'computed',
                        name: 'Computed Signals',
                        description: 'Derived state.',
                        concept: 'Use `computed()` to create a signal that depends on other signals.',
                        exercise: 'Create a computed signal "doubleCount" that returns count() * 2.',
                        starterCode: 'import { signal, computed } from "@angular/core";\n\nconst count = signal(5);\nconst doubleCount = // Your code here\n',
                        validationRegex: /doubleCount\s*=\s*computed\(\(\)\s*=>\s*count\(\)\s*\*\s*2\)/,
                        status: 'locked'
                    }
                ]
            },
            {
                id: 'components',
                name: 'Phase 3: Component Architecture',
                modules: [
                    {
                        id: 'template-binding',
                        name: 'Template Binding',
                        description: 'Properties & Attributes.',
                        concept: 'Bind to properties using `[property]="value"`.',
                        exercise: 'Bind the `src` attribute of an image or a `disabled` property of a button.',
                        status: 'locked'
                    },
                    {
                        id: 'nesting',
                        name: 'Creating & Nesting',
                        description: 'Modular building.',
                        concept: 'Components can be nested within other components.',
                        exercise: 'Generate a new component and nest it inside the root component.',
                        status: 'locked'
                    },
                    {
                        id: 'for-loop',
                        name: 'List Rendering (@for)',
                        description: 'Iterating data.',
                        concept: 'Use the `@for` block to render lists efficiently.',
                        exercise: 'Render a list of items from an array in your component.',
                        status: 'locked'
                    }
                ]
            },
            {
                id: 'rxjs',
                name: 'Phase 4: RxJS & Streams',
                modules: [
                    {
                        id: 'observables',
                        name: 'Intro to Observables',
                        description: 'Streaming data basics.',
                        concept: 'Observables are a way to handle asynchronous data streams.',
                        exercise: 'Create a simple Observable that emits values over time.',
                        status: 'locked'
                    },
                    {
                        id: 'operators',
                        name: 'Pipe & Operators',
                        description: 'Transforming streams.',
                        concept: 'Use `.pipe()` and operators like `map` and `filter` to transform data.',
                        exercise: 'Pipe an Observable of numbers and filter out the even ones.',
                        status: 'locked'
                    },
                    {
                        id: 'async-pipe',
                        name: 'The Async Pipe',
                        description: 'Auto-subscription.',
                        concept: 'Use the `| async` pipe in templates to subscribe to Observables automatically.',
                        exercise: 'Render an Observable stream in your template using the async pipe.',
                        status: 'locked'
                    }
                ]
            }
        ];
    }

    sendMessage() {
        const input = this.userInput().trim();
        if (!input) return;

        this.messages.update(ms => [...ms, {
            role: 'user',
            content: input,
            timestamp: new Date()
        }]);

        this.userInput.set('');

        setTimeout(() => {
            this.generateResponse(input);
        }, 1000);
    }

    selectModule(module: Module) {
        if (module.status === 'locked') return;
        this.currentModule.set(module);

        // If module has an exercise, set it up for the playground
        if (module.starterCode && module.validationRegex) {
            const virtualChallenge: Challenge = {
                id: `module-${module.id}`,
                title: `${module.name} Exercise`,
                difficulty: 'Simple',
                description: module.exercise,
                starterCode: module.starterCode,
                solution: '', // Not used for validation in this mode
                validationRegex: module.validationRegex,
                hint: module.concept,
                points: 50
            };
            this.currentChallenge.set(virtualChallenge);
            this.mode.set('coding');
        } else {
            this.mode.set('chat');
            this.currentChallenge.set(null);
        }

        this.messages.update(ms => [...ms, {
            role: 'assistant',
            content: `Welcome to **${module.name}**!\n\n**The Concept:**\n${module.concept}\n\n**Your Exercise:**\n${module.exercise}`,
            timestamp: new Date()
        }]);
    }

    verifySolution() {
        const curMod = this.currentModule();
        if (!curMod) return;

        this.messages.update(ms => [...ms, {
            role: 'user',
            content: "I've finished the exercise. Please verify my solution!",
            timestamp: new Date()
        }]);

        setTimeout(() => {
            this.messages.update(ms => [...ms, {
                role: 'assistant',
                content: `Checking your code... 🔍\n\nGreat job! Your solution for **${curMod.name}** is correct. Module completed! 🎉`,
                timestamp: new Date()
            }]);

            // Track completion in global service
            this.realtime.completeModule(curMod.id);

            this.phases.update(ps => {
                const newPhases = ps.map(p => ({
                    ...p,
                    modules: p.modules.map(m => {
                        if (m.id === curMod.id) {
                            return { ...m, status: 'completed' as const };
                        }
                        return m;
                    })
                }));
                localStorage.setItem('angular_tutor_progress', JSON.stringify(newPhases));
                return newPhases;
            });

            this.unlockNext();
        }, 1500);
    }

    private unlockNext() {
        const allModules = this.phases().flatMap(p => p.modules);
        const currentIndex = allModules.findIndex(m => m.id === this.currentModule()?.id);
        if (currentIndex >= 0 && currentIndex < allModules.length - 1) {
            const nextId = allModules[currentIndex + 1].id;
            this.phases.update(ps => {
                const newPhases = ps.map(p => ({
                    ...p,
                    modules: p.modules.map(m => {
                        if (m.id === nextId && m.status === 'locked') {
                            return { ...m, status: 'available' as const };
                        }
                        return m;
                    })
                }));
                localStorage.setItem('angular_tutor_progress', JSON.stringify(newPhases));
                return newPhases;
            });
        }
    }

    private generateResponse(input: string) {
        let response = "That's a great question! In Angular, this is typically handled by leveraging its powerful built-in features.";
        const lowInput = input.toLowerCase();
        if (lowInput.includes('signal')) {
            response = "Signals are a new way of managing reactivity in Angular. They provide a more granular way to track state changes.";
        } else if (lowInput.includes('rxjs')) {
            response = "RxJS is still vital for complex asynchronous operations like event streams and HTTP requests.";
        }

        this.messages.update(ms => [...ms, {
            role: 'assistant',
            content: response,
            timestamp: new Date()
        }]);
    }

    selectChallenge(challenge: Challenge) {
        this.currentChallenge.set(challenge);
        this.mode.set('coding');
    }

    onChallengeComplete(points: number) {
        const challenge = this.currentChallenge();
        if (challenge) {
            if (challenge.id.startsWith('module-')) {
                // Verification results for module-based exercises
                this.verifySolution();
            } else {
                // Standard global challenges
                this.realtime.completeChallenge(challenge.id, points);
            }

            // Switch back to chat after a short delay
            setTimeout(() => {
                this.mode.set('chat');
                this.currentChallenge.set(null);
            }, 3000);
        }
    }
}

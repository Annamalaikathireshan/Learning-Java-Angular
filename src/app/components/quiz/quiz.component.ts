import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
    category: 'Fundamentals' | 'Signals' | 'RxJS' | 'Components';
}

@Component({
    selector: 'app-quiz',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quiz.component.html',
    styleUrl: './quiz.component.scss'
})
export class QuizComponent {
    questions = signal<Question[]>([
        {
            id: 1,
            category: 'Signals',
            text: 'What is the primary benefit of Angular Signals?',
            options: [
                'They replace RxJS entirely',
                'Fine-grained reactivity and optimized change detection',
                'They are only for template interpolation',
                'They make applications run slower'
            ],
            correctAnswer: 1,
            explanation: 'Signals provide fine-grained reactivity, allowing Angular to update only the specific parts of the DOM that changed, without checking the entire tree.'
        },
        {
            id: 2,
            category: 'Fundamentals',
            text: 'Which decorator is used to define a standalone component in Angular?',
            options: [
                '@Module',
                '@Standalone',
                '@Component({ standalone: true })',
                '@Injectable'
            ],
            correctAnswer: 2,
            explanation: 'In modern Angular, components are made standalone by setting the `standalone: true` property in the `@Component` decorator.'
        },
        {
            id: 3,
            category: 'RxJS',
            text: 'Which operator is used to transform the data emitted by an Observable?',
            options: [
                'filter',
                'map',
                'tap',
                'switchMap'
            ],
            correctAnswer: 1,
            explanation: 'The `map` operator is used to apply a projection to each value emitted by the source Observable.'
        },
        {
            id: 4,
            category: 'Components',
            text: 'How do you pass data from a parent component to a child component?',
            options: [
                'Using @Output()',
                'Using @Input()',
                'Using LocalStorage',
                'Using URL parameters'
            ],
            correctAnswer: 1,
            explanation: 'The `@Input()` decorator is used to define properties that can be set by a parent component.'
        },
        {
            id: 5,
            category: 'Signals',
            text: 'How do you read the value of a signal in a template?',
            options: [
                '{{ mySignal }}',
                '{{ mySignal() }}',
                '{{ mySignal.value }}',
                '{{ get(mySignal) }}'
            ],
            correctAnswer: 1,
            explanation: 'Signals are getter functions, so you must call them as functions `()` to access their current value.'
        }
    ]);

    currentIndex = signal(0);
    selectedAnswer = signal<number | null>(null);
    showFeedback = signal(false);
    score = signal(0);
    quizCompleted = signal(false);

    currentQuestion = computed(() => this.questions()[this.currentIndex()]);
    progress = computed(() => ((this.currentIndex() + 1) / this.questions().length) * 100);

    selectOption(index: number) {
        if (this.showFeedback()) return;
        this.selectedAnswer.set(index);
    }

    submitAnswer() {
        if (this.selectedAnswer() === null) return;

        if (this.selectedAnswer() === this.currentQuestion().correctAnswer) {
            this.score.update(s => s + 1);
        }

        this.showFeedback.set(true);
    }

    nextQuestion() {
        this.showFeedback.set(false);
        this.selectedAnswer.set(null);

        if (this.currentIndex() < this.questions().length - 1) {
            this.currentIndex.update(i => i + 1);
        } else {
            this.quizCompleted.set(true);
        }
    }

    restartQuiz() {
        this.currentIndex.set(0);
        this.selectedAnswer.set(null);
        this.showFeedback.set(false);
        this.score.set(0);
        this.quizCompleted.set(false);
    }
}

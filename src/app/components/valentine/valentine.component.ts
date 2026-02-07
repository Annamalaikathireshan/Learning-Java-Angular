import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
    selector: 'app-valentine',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './valentine.component.html',
    styleUrls: ['./valentine.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(20px)' }),
                animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ]),
            transition(':leave', [
                animate('400ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
            ])
        ]),
        trigger('staggerList', [
            transition('* => *', [
                query(':enter', [
                    style({ opacity: 0, transform: 'translateX(-20px)' }),
                    stagger(200, [
                        animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
                    ])
                ], { optional: true })
            ])
        ])
    ]
})
export class ValentineComponent implements OnInit {
    currentStep = 0; // 0: Intro, 1: The Choice, 2: Journey, 3: Proposal, 4: Success
    noButtonPosition = { x: 0, y: 0 };
    isNoButtonMoving = false;
    yesButtonScale = 1;

    reasons = [
        "Your smile lights up my darkest days.",
        "The way you care for everyone around you.",
        "Your laugh is my favorite soundtrack.",
        "How you always know exactly what I'm thinking.",
        "Every moment with you feels like home."
    ];

    ngOnInit(): void {
        // Initial setup if needed
    }

    nextStep() {
        this.currentStep++;
        if (this.currentStep === 4) {
            this.triggerSuccess();
        }
    }

    moveNoButton() {
        console.log('Moving NO button');
        this.isNoButtonMoving = true;
        const padding = 50;
        const buttonWidth = 100; // Approximate button width
        const buttonHeight = 50; // Approximate button height

        const maxX = window.innerWidth - buttonWidth - padding;
        const maxY = window.innerHeight - buttonHeight - padding;

        this.noButtonPosition = {
            x: Math.max(padding, Math.random() * maxX),
            y: Math.max(padding, Math.random() * maxY)
        };

        // Make YES button grow bigger as reward for persistence
        this.yesButtonScale += 0.15;
    }

    triggerSuccess() {
        // Could add extra logic for confetti library here if desired
        console.log("SHE SAID YES!");
    }
}

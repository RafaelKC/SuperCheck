import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MatCardModule],
    template: `
        <mat-card>
            <mat-card-header>
                <mat-card-title>Welcome to SuperCheck</mat-card-title>
            </mat-card-header>
            <mat-card-content>
                <p>You are successfully logged in!</p>
            </mat-card-content>
        </mat-card>
    `,
    styles: [`
        mat-card {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
        }
    `]
})
export class HomeComponent {}

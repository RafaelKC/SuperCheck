import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChecklistTemplate } from '../../../interfaces/checklist-template.interface';
import { ChecklistTemplateService } from '../../../services/checklist-template.service';
import { CategoriaSelectorComponent } from '../../shared/categoria-selector/categoria-selector.component';

@Component({
  selector: 'app-template-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    RouterModule,
    CategoriaSelectorComponent
  ],
  templateUrl: './template-form.component.html',
  styleUrl: './template-form.component.scss'
})
export class TemplateFormComponent implements OnInit {
  public form: FormGroup;
  public isLoading = false;
  public isEdit = false;
  private templateId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private templateService: ChecklistTemplateService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      categoriaId: ['', [Validators.required]]
    });
  }

  public ngOnInit() {
    this.templateId = this.route.snapshot.paramMap.get('id');
    if (this.templateId) {
      this.isEdit = true;
      this.loadTemplate();
    }
  }

  public onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      const template: ChecklistTemplate = {
        ...this.form.value,
        id: this.templateId || undefined
      };

      if (this.isEdit) {
        this.templateService.update(this.templateId!, template).subscribe({
          next: () => {
            this.isLoading = false;
            this.router.navigate(['/templates']);
          },
          error: (err: unknown) => {
            console.error('Error saving template:', err);
            this.isLoading = false;
          }
        });
      } else {
        this.templateService.create(template).subscribe({
          next: (result) => {
            this.isLoading = false;
            this.router.navigate(['/templates']);
          },
          error: (err: unknown) => {
            console.error('Error saving template:', err);
            this.isLoading = false;
          }
        });
      }
    }
  }

  private loadTemplate() {
    if (!this.templateId) return;

    this.isLoading = true;
    this.templateService.getById(this.templateId).subscribe({
      next: (template) => {
        this.form.patchValue({
          nome: template.nome,
          categoriaId: template.categoriaId
        });
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading template:', error);
        this.isLoading = false;
      }
    });
  }
}

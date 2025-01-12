import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CategoriaSelectorComponent } from '../../shared/categoria-selector/categoria-selector.component';
import { ChecklistService } from '../../../services/checklist.service';
import { ChecklistTemplateService } from '../../../services/checklist-template.service';
import { Observable, map } from 'rxjs';
import { ChecklistTemplate, GetChecklistTemplateListInput } from '../../../interfaces/checklist-template.interface';
import { MotoristaService, Motorista } from '../../../services/motorista.service';
import { CaminhaoService, Caminhao } from '../../../services/caminhao.service';

@Component({
  selector: 'app-checklist-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    RouterModule,
    CategoriaSelectorComponent
  ],
  templateUrl: './checklist-form.component.html',
  styleUrl: './checklist-form.component.scss'
})
export class ChecklistFormComponent implements OnInit {
  public form: FormGroup;
  public isLoading = false;
  public templates$: Observable<ChecklistTemplate[]>;
  public motoristas$: Observable<Motorista[]>;
  public caminhoes$: Observable<Caminhao[]>;

  constructor(
    private fb: FormBuilder,
    private checklistService: ChecklistService,
    private templateService: ChecklistTemplateService,
    private router: Router,
    private route: ActivatedRoute,
    private motoristaService: MotoristaService,
    private caminhaoService: CaminhaoService
  ) {
    this.form = this.fb.group({
      templateId: [null],
      categoriaId: [null, [Validators.required]],
      caminhaoId: [null, [Validators.required]],
      motoristaId: [null, [Validators.required]],
      data: [new Date(), [Validators.required]],
      observacao: ['']
    });

    const input: GetChecklistTemplateListInput = {
      filter: '',
      pageSize: 100,
      skipCount: 0
    };

    this.templates$ = this.templateService.getList(input).pipe(
      map(result => result.items)
    );

    this.motoristas$ = this.motoristaService.getList();
    this.caminhoes$ = this.caminhaoService.getList();
  }

  ngOnInit() {}

  public onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      this.checklistService.create(this.form.value).subscribe({
        next: (result) => {
          this.router.navigate(['../', result.id, 'edit'], { relativeTo: this.route });
        },
        error: (err: unknown) => {
          console.error('Error creating checklist:', err);
          this.isLoading = false;
        }
      });
    }
  }
}

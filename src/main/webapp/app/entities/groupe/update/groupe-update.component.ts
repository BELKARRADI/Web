import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IProfessor } from 'app/entities/professor/professor.model';
import { ProfessorService } from 'app/entities/professor/service/professor.service';
import { IGroupe } from '../groupe.model';
import { GroupeService } from '../service/groupe.service';
import { GroupeFormService, GroupeFormGroup } from './groupe-form.service';

@Component({
  standalone: true,
  selector: 'jhi-groupe-update',
  templateUrl: './groupe-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class GroupeUpdateComponent implements OnInit {
  isSaving = false;
  groupe: IGroupe | null = null;

  professorsSharedCollection: IProfessor[] = [];

  editForm: GroupeFormGroup = this.groupeFormService.createGroupeFormGroup();

  constructor(
    protected groupeService: GroupeService,
    protected groupeFormService: GroupeFormService,
    protected professorService: ProfessorService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareProfessor = (o1: IProfessor | null, o2: IProfessor | null): boolean => this.professorService.compareProfessor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ groupe }) => {
      this.groupe = groupe;
      if (groupe) {
        this.updateForm(groupe);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const groupe = this.groupeFormService.getGroupe(this.editForm);
    if (groupe.id !== null) {
      this.subscribeToSaveResponse(this.groupeService.update(groupe));
    } else {
      this.subscribeToSaveResponse(this.groupeService.create(groupe));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGroupe>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(groupe: IGroupe): void {
    this.groupe = groupe;
    this.groupeFormService.resetForm(this.editForm, groupe);

    this.professorsSharedCollection = this.professorService.addProfessorToCollectionIfMissing<IProfessor>(
      this.professorsSharedCollection,
      groupe.professor,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.professorService
      .query()
      .pipe(map((res: HttpResponse<IProfessor[]>) => res.body ?? []))
      .pipe(
        map((professors: IProfessor[]) =>
          this.professorService.addProfessorToCollectionIfMissing<IProfessor>(professors, this.groupe?.professor),
        ),
      )
      .subscribe((professors: IProfessor[]) => (this.professorsSharedCollection = professors));
  }
}

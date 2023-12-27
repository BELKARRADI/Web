import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IProfessor } from '../professor.model';
import { ProfessorService } from '../service/professor.service';
import { ProfessorFormService, ProfessorFormGroup } from './professor-form.service';

@Component({
  standalone: true,
  selector: 'jhi-professor-update',
  templateUrl: './professor-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ProfessorUpdateComponent implements OnInit {
  isSaving = false;
  professor: IProfessor | null = null;

  usersSharedCollection: IUser[] = [];

  editForm: ProfessorFormGroup = this.professorFormService.createProfessorFormGroup();

  constructor(
    protected professorService: ProfessorService,
    protected professorFormService: ProfessorFormService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareUser = (o1: IUser | null, o2: IUser | null): boolean => this.userService.compareUser(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ professor }) => {
      this.professor = professor;
      if (professor) {
        this.updateForm(professor);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const professor = this.professorFormService.getProfessor(this.editForm);
    if (professor.id !== null) {
      this.subscribeToSaveResponse(this.professorService.update(professor));
    } else {
      this.subscribeToSaveResponse(this.professorService.create(professor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IProfessor>>): void {
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

  protected updateForm(professor: IProfessor): void {
    this.professor = professor;
    this.professorFormService.resetForm(this.editForm, professor);

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing<IUser>(this.usersSharedCollection, professor.user);
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(map((users: IUser[]) => this.userService.addUserToCollectionIfMissing<IUser>(users, this.professor?.user)))
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }
}

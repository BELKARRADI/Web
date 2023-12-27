import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IPW } from 'app/entities/pw/pw.model';
import { PWService } from 'app/entities/pw/service/pw.service';
import { StudentPWService } from '../service/student-pw.service';
import { IStudentPW } from '../student-pw.model';
import { StudentPWFormService, StudentPWFormGroup } from './student-pw-form.service';

@Component({
  standalone: true,
  selector: 'jhi-student-pw-update',
  templateUrl: './student-pw-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class StudentPWUpdateComponent implements OnInit {
  isSaving = false;
  studentPW: IStudentPW | null = null;

  studentsSharedCollection: IStudent[] = [];
  pWSSharedCollection: IPW[] = [];

  editForm: StudentPWFormGroup = this.studentPWFormService.createStudentPWFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected studentPWService: StudentPWService,
    protected studentPWFormService: StudentPWFormService,
    protected studentService: StudentService,
    protected pWService: PWService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareStudent = (o1: IStudent | null, o2: IStudent | null): boolean => this.studentService.compareStudent(o1, o2);

  comparePW = (o1: IPW | null, o2: IPW | null): boolean => this.pWService.comparePW(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ studentPW }) => {
      this.studentPW = studentPW;
      if (studentPW) {
        this.updateForm(studentPW);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('profEtudiantApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const studentPW = this.studentPWFormService.getStudentPW(this.editForm);
    if (studentPW.id !== null) {
      this.subscribeToSaveResponse(this.studentPWService.update(studentPW));
    } else {
      this.subscribeToSaveResponse(this.studentPWService.create(studentPW));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStudentPW>>): void {
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

  protected updateForm(studentPW: IStudentPW): void {
    this.studentPW = studentPW;
    this.studentPWFormService.resetForm(this.editForm, studentPW);

    this.studentsSharedCollection = this.studentService.addStudentToCollectionIfMissing<IStudent>(
      this.studentsSharedCollection,
      studentPW.student,
    );
    this.pWSSharedCollection = this.pWService.addPWToCollectionIfMissing<IPW>(this.pWSSharedCollection, studentPW.pw);
  }

  protected loadRelationshipsOptions(): void {
    this.studentService
      .query()
      .pipe(map((res: HttpResponse<IStudent[]>) => res.body ?? []))
      .pipe(map((students: IStudent[]) => this.studentService.addStudentToCollectionIfMissing<IStudent>(students, this.studentPW?.student)))
      .subscribe((students: IStudent[]) => (this.studentsSharedCollection = students));

    this.pWService
      .query()
      .pipe(map((res: HttpResponse<IPW[]>) => res.body ?? []))
      .pipe(map((pWS: IPW[]) => this.pWService.addPWToCollectionIfMissing<IPW>(pWS, this.studentPW?.pw)))
      .subscribe((pWS: IPW[]) => (this.pWSSharedCollection = pWS));
  }
}

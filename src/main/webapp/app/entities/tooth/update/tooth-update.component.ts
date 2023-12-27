import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ITooth } from '../tooth.model';
import { ToothService } from '../service/tooth.service';
import { ToothFormService, ToothFormGroup } from './tooth-form.service';

@Component({
  standalone: true,
  selector: 'jhi-tooth-update',
  templateUrl: './tooth-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ToothUpdateComponent implements OnInit {
  isSaving = false;
  tooth: ITooth | null = null;

  editForm: ToothFormGroup = this.toothFormService.createToothFormGroup();

  constructor(
    protected toothService: ToothService,
    protected toothFormService: ToothFormService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ tooth }) => {
      this.tooth = tooth;
      if (tooth) {
        this.updateForm(tooth);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const tooth = this.toothFormService.getTooth(this.editForm);
    if (tooth.id !== null) {
      this.subscribeToSaveResponse(this.toothService.update(tooth));
    } else {
      this.subscribeToSaveResponse(this.toothService.create(tooth));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITooth>>): void {
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

  protected updateForm(tooth: ITooth): void {
    this.tooth = tooth;
    this.toothFormService.resetForm(this.editForm, tooth);
  }
}

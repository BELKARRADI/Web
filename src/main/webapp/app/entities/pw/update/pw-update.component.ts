import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ITooth } from 'app/entities/tooth/tooth.model';
import { ToothService } from 'app/entities/tooth/service/tooth.service';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';
import { PWService } from '../service/pw.service';
import { IPW } from '../pw.model';
import { PWFormService, PWFormGroup } from './pw-form.service';

@Component({
  standalone: true,
  selector: 'jhi-pw-update',
  templateUrl: './pw-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class PWUpdateComponent implements OnInit {
  isSaving = false;
  pW: IPW | null = null;

  teethSharedCollection: ITooth[] = [];
  groupesSharedCollection: IGroupe[] = [];

  editForm: PWFormGroup = this.pWFormService.createPWFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected pWService: PWService,
    protected pWFormService: PWFormService,
    protected toothService: ToothService,
    protected groupeService: GroupeService,
    protected activatedRoute: ActivatedRoute,
  ) {}

  compareTooth = (o1: ITooth | null, o2: ITooth | null): boolean => this.toothService.compareTooth(o1, o2);

  compareGroupe = (o1: IGroupe | null, o2: IGroupe | null): boolean => this.groupeService.compareGroupe(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ pW }) => {
      this.pW = pW;
      if (pW) {
        this.updateForm(pW);
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

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const pW = this.pWFormService.getPW(this.editForm);
    if (pW.id !== null) {
      this.subscribeToSaveResponse(this.pWService.update(pW));
    } else {
      this.subscribeToSaveResponse(this.pWService.create(pW));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPW>>): void {
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

  protected updateForm(pW: IPW): void {
    this.pW = pW;
    this.pWFormService.resetForm(this.editForm, pW);

    this.teethSharedCollection = this.toothService.addToothToCollectionIfMissing<ITooth>(this.teethSharedCollection, pW.tooth);
    this.groupesSharedCollection = this.groupeService.addGroupeToCollectionIfMissing<IGroupe>(
      this.groupesSharedCollection,
      ...(pW.groupes ?? []),
    );
  }

  protected loadRelationshipsOptions(): void {
    this.toothService
      .query()
      .pipe(map((res: HttpResponse<ITooth[]>) => res.body ?? []))
      .pipe(map((teeth: ITooth[]) => this.toothService.addToothToCollectionIfMissing<ITooth>(teeth, this.pW?.tooth)))
      .subscribe((teeth: ITooth[]) => (this.teethSharedCollection = teeth));

    this.groupeService
      .query()
      .pipe(map((res: HttpResponse<IGroupe[]>) => res.body ?? []))
      .pipe(map((groupes: IGroupe[]) => this.groupeService.addGroupeToCollectionIfMissing<IGroupe>(groupes, ...(this.pW?.groupes ?? []))))
      .subscribe((groupes: IGroupe[]) => (this.groupesSharedCollection = groupes));
  }
}

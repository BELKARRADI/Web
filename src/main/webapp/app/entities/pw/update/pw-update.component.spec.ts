import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ITooth } from 'app/entities/tooth/tooth.model';
import { ToothService } from 'app/entities/tooth/service/tooth.service';
import { IGroupe } from 'app/entities/groupe/groupe.model';
import { GroupeService } from 'app/entities/groupe/service/groupe.service';
import { IPW } from '../pw.model';
import { PWService } from '../service/pw.service';
import { PWFormService } from './pw-form.service';

import { PWUpdateComponent } from './pw-update.component';

describe('PW Management Update Component', () => {
  let comp: PWUpdateComponent;
  let fixture: ComponentFixture<PWUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let pWFormService: PWFormService;
  let pWService: PWService;
  let toothService: ToothService;
  let groupeService: GroupeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), PWUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(PWUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PWUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    pWFormService = TestBed.inject(PWFormService);
    pWService = TestBed.inject(PWService);
    toothService = TestBed.inject(ToothService);
    groupeService = TestBed.inject(GroupeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Tooth query and add missing value', () => {
      const pW: IPW = { id: 456 };
      const tooth: ITooth = { id: 5354 };
      pW.tooth = tooth;

      const toothCollection: ITooth[] = [{ id: 31730 }];
      jest.spyOn(toothService, 'query').mockReturnValue(of(new HttpResponse({ body: toothCollection })));
      const additionalTeeth = [tooth];
      const expectedCollection: ITooth[] = [...additionalTeeth, ...toothCollection];
      jest.spyOn(toothService, 'addToothToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pW });
      comp.ngOnInit();

      expect(toothService.query).toHaveBeenCalled();
      expect(toothService.addToothToCollectionIfMissing).toHaveBeenCalledWith(
        toothCollection,
        ...additionalTeeth.map(expect.objectContaining),
      );
      expect(comp.teethSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Groupe query and add missing value', () => {
      const pW: IPW = { id: 456 };
      const groupes: IGroupe[] = [{ id: 17044 }];
      pW.groupes = groupes;

      const groupeCollection: IGroupe[] = [{ id: 26359 }];
      jest.spyOn(groupeService, 'query').mockReturnValue(of(new HttpResponse({ body: groupeCollection })));
      const additionalGroupes = [...groupes];
      const expectedCollection: IGroupe[] = [...additionalGroupes, ...groupeCollection];
      jest.spyOn(groupeService, 'addGroupeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ pW });
      comp.ngOnInit();

      expect(groupeService.query).toHaveBeenCalled();
      expect(groupeService.addGroupeToCollectionIfMissing).toHaveBeenCalledWith(
        groupeCollection,
        ...additionalGroupes.map(expect.objectContaining),
      );
      expect(comp.groupesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const pW: IPW = { id: 456 };
      const tooth: ITooth = { id: 16098 };
      pW.tooth = tooth;
      const groupe: IGroupe = { id: 10204 };
      pW.groupes = [groupe];

      activatedRoute.data = of({ pW });
      comp.ngOnInit();

      expect(comp.teethSharedCollection).toContain(tooth);
      expect(comp.groupesSharedCollection).toContain(groupe);
      expect(comp.pW).toEqual(pW);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPW>>();
      const pW = { id: 123 };
      jest.spyOn(pWFormService, 'getPW').mockReturnValue(pW);
      jest.spyOn(pWService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pW });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pW }));
      saveSubject.complete();

      // THEN
      expect(pWFormService.getPW).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(pWService.update).toHaveBeenCalledWith(expect.objectContaining(pW));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPW>>();
      const pW = { id: 123 };
      jest.spyOn(pWFormService, 'getPW').mockReturnValue({ id: null });
      jest.spyOn(pWService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pW: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: pW }));
      saveSubject.complete();

      // THEN
      expect(pWFormService.getPW).toHaveBeenCalled();
      expect(pWService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IPW>>();
      const pW = { id: 123 };
      jest.spyOn(pWService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ pW });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(pWService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareTooth', () => {
      it('Should forward to toothService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(toothService, 'compareTooth');
        comp.compareTooth(entity, entity2);
        expect(toothService.compareTooth).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareGroupe', () => {
      it('Should forward to groupeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(groupeService, 'compareGroupe');
        comp.compareGroupe(entity, entity2);
        expect(groupeService.compareGroupe).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

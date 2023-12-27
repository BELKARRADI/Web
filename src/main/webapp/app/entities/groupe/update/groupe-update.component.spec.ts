import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IProfessor } from 'app/entities/professor/professor.model';
import { ProfessorService } from 'app/entities/professor/service/professor.service';
import { GroupeService } from '../service/groupe.service';
import { IGroupe } from '../groupe.model';
import { GroupeFormService } from './groupe-form.service';

import { GroupeUpdateComponent } from './groupe-update.component';

describe('Groupe Management Update Component', () => {
  let comp: GroupeUpdateComponent;
  let fixture: ComponentFixture<GroupeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let groupeFormService: GroupeFormService;
  let groupeService: GroupeService;
  let professorService: ProfessorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), GroupeUpdateComponent],
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
      .overrideTemplate(GroupeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GroupeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    groupeFormService = TestBed.inject(GroupeFormService);
    groupeService = TestBed.inject(GroupeService);
    professorService = TestBed.inject(ProfessorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Professor query and add missing value', () => {
      const groupe: IGroupe = { id: 456 };
      const professor: IProfessor = { id: 23052 };
      groupe.professor = professor;

      const professorCollection: IProfessor[] = [{ id: 18266 }];
      jest.spyOn(professorService, 'query').mockReturnValue(of(new HttpResponse({ body: professorCollection })));
      const additionalProfessors = [professor];
      const expectedCollection: IProfessor[] = [...additionalProfessors, ...professorCollection];
      jest.spyOn(professorService, 'addProfessorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ groupe });
      comp.ngOnInit();

      expect(professorService.query).toHaveBeenCalled();
      expect(professorService.addProfessorToCollectionIfMissing).toHaveBeenCalledWith(
        professorCollection,
        ...additionalProfessors.map(expect.objectContaining),
      );
      expect(comp.professorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const groupe: IGroupe = { id: 456 };
      const professor: IProfessor = { id: 14316 };
      groupe.professor = professor;

      activatedRoute.data = of({ groupe });
      comp.ngOnInit();

      expect(comp.professorsSharedCollection).toContain(professor);
      expect(comp.groupe).toEqual(groupe);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupe>>();
      const groupe = { id: 123 };
      jest.spyOn(groupeFormService, 'getGroupe').mockReturnValue(groupe);
      jest.spyOn(groupeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: groupe }));
      saveSubject.complete();

      // THEN
      expect(groupeFormService.getGroupe).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(groupeService.update).toHaveBeenCalledWith(expect.objectContaining(groupe));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupe>>();
      const groupe = { id: 123 };
      jest.spyOn(groupeFormService, 'getGroupe').mockReturnValue({ id: null });
      jest.spyOn(groupeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupe: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: groupe }));
      saveSubject.complete();

      // THEN
      expect(groupeFormService.getGroupe).toHaveBeenCalled();
      expect(groupeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGroupe>>();
      const groupe = { id: 123 };
      jest.spyOn(groupeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ groupe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(groupeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareProfessor', () => {
      it('Should forward to professorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(professorService, 'compareProfessor');
        comp.compareProfessor(entity, entity2);
        expect(professorService.compareProfessor).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

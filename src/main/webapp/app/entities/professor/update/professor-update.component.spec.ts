import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ProfessorService } from '../service/professor.service';
import { IProfessor } from '../professor.model';

import { ProfessorFormService } from './professor-form.service';

import { ProfessorUpdateComponent } from './professor-update.component';

describe('Professor Management Update Component', () => {
  let comp: ProfessorUpdateComponent;
  let fixture: ComponentFixture<ProfessorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let professorFormService: ProfessorFormService;
  let professorService: ProfessorService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ProfessorUpdateComponent],
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
      .overrideTemplate(ProfessorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ProfessorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    professorFormService = TestBed.inject(ProfessorFormService);
    professorService = TestBed.inject(ProfessorService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const professor: IProfessor = { id: 456 };
      const user: IUser = { id: 19471 };
      professor.user = user;

      const userCollection: IUser[] = [{ id: 30182 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ professor });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining),
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const professor: IProfessor = { id: 456 };
      const user: IUser = { id: 12433 };
      professor.user = user;

      activatedRoute.data = of({ professor });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.professor).toEqual(professor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfessor>>();
      const professor = { id: 123 };
      jest.spyOn(professorFormService, 'getProfessor').mockReturnValue(professor);
      jest.spyOn(professorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: professor }));
      saveSubject.complete();

      // THEN
      expect(professorFormService.getProfessor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(professorService.update).toHaveBeenCalledWith(expect.objectContaining(professor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfessor>>();
      const professor = { id: 123 };
      jest.spyOn(professorFormService, 'getProfessor').mockReturnValue({ id: null });
      jest.spyOn(professorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: professor }));
      saveSubject.complete();

      // THEN
      expect(professorFormService.getProfessor).toHaveBeenCalled();
      expect(professorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IProfessor>>();
      const professor = { id: 123 };
      jest.spyOn(professorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ professor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(professorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

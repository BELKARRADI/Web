import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { IStudent } from 'app/entities/student/student.model';
import { StudentService } from 'app/entities/student/service/student.service';
import { IPW } from 'app/entities/pw/pw.model';
import { PWService } from 'app/entities/pw/service/pw.service';
import { IStudentPW } from '../student-pw.model';
import { StudentPWService } from '../service/student-pw.service';
import { StudentPWFormService } from './student-pw-form.service';

import { StudentPWUpdateComponent } from './student-pw-update.component';

describe('StudentPW Management Update Component', () => {
  let comp: StudentPWUpdateComponent;
  let fixture: ComponentFixture<StudentPWUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let studentPWFormService: StudentPWFormService;
  let studentPWService: StudentPWService;
  let studentService: StudentService;
  let pWService: PWService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), StudentPWUpdateComponent],
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
      .overrideTemplate(StudentPWUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentPWUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    studentPWFormService = TestBed.inject(StudentPWFormService);
    studentPWService = TestBed.inject(StudentPWService);
    studentService = TestBed.inject(StudentService);
    pWService = TestBed.inject(PWService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Student query and add missing value', () => {
      const studentPW: IStudentPW = { id: 456 };
      const student: IStudent = { id: 14554 };
      studentPW.student = student;

      const studentCollection: IStudent[] = [{ id: 31623 }];
      jest.spyOn(studentService, 'query').mockReturnValue(of(new HttpResponse({ body: studentCollection })));
      const additionalStudents = [student];
      const expectedCollection: IStudent[] = [...additionalStudents, ...studentCollection];
      jest.spyOn(studentService, 'addStudentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ studentPW });
      comp.ngOnInit();

      expect(studentService.query).toHaveBeenCalled();
      expect(studentService.addStudentToCollectionIfMissing).toHaveBeenCalledWith(
        studentCollection,
        ...additionalStudents.map(expect.objectContaining),
      );
      expect(comp.studentsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call PW query and add missing value', () => {
      const studentPW: IStudentPW = { id: 456 };
      const pw: IPW = { id: 10023 };
      studentPW.pw = pw;

      const pWCollection: IPW[] = [{ id: 13073 }];
      jest.spyOn(pWService, 'query').mockReturnValue(of(new HttpResponse({ body: pWCollection })));
      const additionalPWS = [pw];
      const expectedCollection: IPW[] = [...additionalPWS, ...pWCollection];
      jest.spyOn(pWService, 'addPWToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ studentPW });
      comp.ngOnInit();

      expect(pWService.query).toHaveBeenCalled();
      expect(pWService.addPWToCollectionIfMissing).toHaveBeenCalledWith(pWCollection, ...additionalPWS.map(expect.objectContaining));
      expect(comp.pWSSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const studentPW: IStudentPW = { id: 456 };
      const student: IStudent = { id: 3206 };
      studentPW.student = student;
      const pw: IPW = { id: 11567 };
      studentPW.pw = pw;

      activatedRoute.data = of({ studentPW });
      comp.ngOnInit();

      expect(comp.studentsSharedCollection).toContain(student);
      expect(comp.pWSSharedCollection).toContain(pw);
      expect(comp.studentPW).toEqual(studentPW);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentPW>>();
      const studentPW = { id: 123 };
      jest.spyOn(studentPWFormService, 'getStudentPW').mockReturnValue(studentPW);
      jest.spyOn(studentPWService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentPW });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studentPW }));
      saveSubject.complete();

      // THEN
      expect(studentPWFormService.getStudentPW).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(studentPWService.update).toHaveBeenCalledWith(expect.objectContaining(studentPW));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentPW>>();
      const studentPW = { id: 123 };
      jest.spyOn(studentPWFormService, 'getStudentPW').mockReturnValue({ id: null });
      jest.spyOn(studentPWService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentPW: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: studentPW }));
      saveSubject.complete();

      // THEN
      expect(studentPWFormService.getStudentPW).toHaveBeenCalled();
      expect(studentPWService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IStudentPW>>();
      const studentPW = { id: 123 };
      jest.spyOn(studentPWService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ studentPW });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(studentPWService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareStudent', () => {
      it('Should forward to studentService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(studentService, 'compareStudent');
        comp.compareStudent(entity, entity2);
        expect(studentService.compareStudent).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('comparePW', () => {
      it('Should forward to pWService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(pWService, 'comparePW');
        comp.comparePW(entity, entity2);
        expect(pWService.comparePW).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});

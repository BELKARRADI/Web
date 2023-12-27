import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../student-pw.test-samples';

import { StudentPWFormService } from './student-pw-form.service';

describe('StudentPW Form Service', () => {
  let service: StudentPWFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentPWFormService);
  });

  describe('Service methods', () => {
    describe('createStudentPWFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createStudentPWFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            time: expect.any(Object),
            imageFront: expect.any(Object),
            imageSide: expect.any(Object),
            date: expect.any(Object),
            mesureAngle1: expect.any(Object),
            mesureAngle2: expect.any(Object),
            intersection: expect.any(Object),
            student: expect.any(Object),
            pw: expect.any(Object),
          }),
        );
      });

      it('passing IStudentPW should create a new form with FormGroup', () => {
        const formGroup = service.createStudentPWFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            time: expect.any(Object),
            imageFront: expect.any(Object),
            imageSide: expect.any(Object),
            date: expect.any(Object),
            mesureAngle1: expect.any(Object),
            mesureAngle2: expect.any(Object),
            intersection: expect.any(Object),
            student: expect.any(Object),
            pw: expect.any(Object),
          }),
        );
      });
    });

    describe('getStudentPW', () => {
      it('should return NewStudentPW for default StudentPW initial value', () => {
        const formGroup = service.createStudentPWFormGroup(sampleWithNewData);

        const studentPW = service.getStudentPW(formGroup) as any;

        expect(studentPW).toMatchObject(sampleWithNewData);
      });

      it('should return NewStudentPW for empty StudentPW initial value', () => {
        const formGroup = service.createStudentPWFormGroup();

        const studentPW = service.getStudentPW(formGroup) as any;

        expect(studentPW).toMatchObject({});
      });

      it('should return IStudentPW', () => {
        const formGroup = service.createStudentPWFormGroup(sampleWithRequiredData);

        const studentPW = service.getStudentPW(formGroup) as any;

        expect(studentPW).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IStudentPW should not enable id FormControl', () => {
        const formGroup = service.createStudentPWFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewStudentPW should disable id FormControl', () => {
        const formGroup = service.createStudentPWFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

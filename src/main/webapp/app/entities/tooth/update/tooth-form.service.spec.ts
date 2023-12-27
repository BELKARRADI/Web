import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../tooth.test-samples';

import { ToothFormService } from './tooth-form.service';

describe('Tooth Form Service', () => {
  let service: ToothFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToothFormService);
  });

  describe('Service methods', () => {
    describe('createToothFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createToothFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });

      it('passing ITooth should create a new form with FormGroup', () => {
        const formGroup = service.createToothFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            name: expect.any(Object),
          }),
        );
      });
    });

    describe('getTooth', () => {
      it('should return NewTooth for default Tooth initial value', () => {
        const formGroup = service.createToothFormGroup(sampleWithNewData);

        const tooth = service.getTooth(formGroup) as any;

        expect(tooth).toMatchObject(sampleWithNewData);
      });

      it('should return NewTooth for empty Tooth initial value', () => {
        const formGroup = service.createToothFormGroup();

        const tooth = service.getTooth(formGroup) as any;

        expect(tooth).toMatchObject({});
      });

      it('should return ITooth', () => {
        const formGroup = service.createToothFormGroup(sampleWithRequiredData);

        const tooth = service.getTooth(formGroup) as any;

        expect(tooth).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ITooth should not enable id FormControl', () => {
        const formGroup = service.createToothFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewTooth should disable id FormControl', () => {
        const formGroup = service.createToothFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

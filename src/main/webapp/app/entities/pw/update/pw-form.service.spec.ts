import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../pw.test-samples';

import { PWFormService } from './pw-form.service';

describe('PW Form Service', () => {
  let service: PWFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PWFormService);
  });

  describe('Service methods', () => {
    describe('createPWFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createPWFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            objectif: expect.any(Object),
            docs: expect.any(Object),
            tooth: expect.any(Object),
            groupes: expect.any(Object),
          }),
        );
      });

      it('passing IPW should create a new form with FormGroup', () => {
        const formGroup = service.createPWFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            title: expect.any(Object),
            objectif: expect.any(Object),
            docs: expect.any(Object),
            tooth: expect.any(Object),
            groupes: expect.any(Object),
          }),
        );
      });
    });

    describe('getPW', () => {
      it('should return NewPW for default PW initial value', () => {
        const formGroup = service.createPWFormGroup(sampleWithNewData);

        const pW = service.getPW(formGroup) as any;

        expect(pW).toMatchObject(sampleWithNewData);
      });

      it('should return NewPW for empty PW initial value', () => {
        const formGroup = service.createPWFormGroup();

        const pW = service.getPW(formGroup) as any;

        expect(pW).toMatchObject({});
      });

      it('should return IPW', () => {
        const formGroup = service.createPWFormGroup(sampleWithRequiredData);

        const pW = service.getPW(formGroup) as any;

        expect(pW).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IPW should not enable id FormControl', () => {
        const formGroup = service.createPWFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewPW should disable id FormControl', () => {
        const formGroup = service.createPWFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});

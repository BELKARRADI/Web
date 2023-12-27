import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ToothService } from '../service/tooth.service';
import { ITooth } from '../tooth.model';
import { ToothFormService } from './tooth-form.service';

import { ToothUpdateComponent } from './tooth-update.component';

describe('Tooth Management Update Component', () => {
  let comp: ToothUpdateComponent;
  let fixture: ComponentFixture<ToothUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let toothFormService: ToothFormService;
  let toothService: ToothService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([]), ToothUpdateComponent],
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
      .overrideTemplate(ToothUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ToothUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    toothFormService = TestBed.inject(ToothFormService);
    toothService = TestBed.inject(ToothService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const tooth: ITooth = { id: 456 };

      activatedRoute.data = of({ tooth });
      comp.ngOnInit();

      expect(comp.tooth).toEqual(tooth);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITooth>>();
      const tooth = { id: 123 };
      jest.spyOn(toothFormService, 'getTooth').mockReturnValue(tooth);
      jest.spyOn(toothService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tooth });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tooth }));
      saveSubject.complete();

      // THEN
      expect(toothFormService.getTooth).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(toothService.update).toHaveBeenCalledWith(expect.objectContaining(tooth));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITooth>>();
      const tooth = { id: 123 };
      jest.spyOn(toothFormService, 'getTooth').mockReturnValue({ id: null });
      jest.spyOn(toothService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tooth: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: tooth }));
      saveSubject.complete();

      // THEN
      expect(toothFormService.getTooth).toHaveBeenCalled();
      expect(toothService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ITooth>>();
      const tooth = { id: 123 };
      jest.spyOn(toothService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ tooth });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(toothService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

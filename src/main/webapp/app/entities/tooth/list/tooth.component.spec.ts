import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ToothService } from '../service/tooth.service';

import { ToothComponent } from './tooth.component';

describe('Tooth Management Component', () => {
  let comp: ToothComponent;
  let fixture: ComponentFixture<ToothComponent>;
  let service: ToothService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'tooth', component: ToothComponent }]), HttpClientTestingModule, ToothComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              }),
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ToothComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ToothComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ToothService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        }),
      ),
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.teeth?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to toothService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getToothIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getToothIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

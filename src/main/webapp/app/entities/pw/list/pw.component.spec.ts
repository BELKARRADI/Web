import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { PWService } from '../service/pw.service';

import { PWComponent } from './pw.component';

describe('PW Management Component', () => {
  let comp: PWComponent;
  let fixture: ComponentFixture<PWComponent>;
  let service: PWService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'pw', component: PWComponent }]), HttpClientTestingModule, PWComponent],
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
      .overrideTemplate(PWComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(PWComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(PWService);

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
    expect(comp.pWS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to pWService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getPWIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getPWIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

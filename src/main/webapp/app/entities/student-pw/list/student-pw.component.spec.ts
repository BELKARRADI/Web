import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StudentPWService } from '../service/student-pw.service';

import { StudentPWComponent } from './student-pw.component';

describe('StudentPW Management Component', () => {
  let comp: StudentPWComponent;
  let fixture: ComponentFixture<StudentPWComponent>;
  let service: StudentPWService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'student-pw', component: StudentPWComponent }]),
        HttpClientTestingModule,
        StudentPWComponent,
      ],
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
      .overrideTemplate(StudentPWComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(StudentPWComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(StudentPWService);

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
    expect(comp.studentPWS?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to studentPWService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getStudentPWIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getStudentPWIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});

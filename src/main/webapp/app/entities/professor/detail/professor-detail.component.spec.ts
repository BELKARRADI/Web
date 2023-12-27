import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ProfessorDetailComponent } from './professor-detail.component';

describe('Professor Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ProfessorDetailComponent,
              resolve: { professor: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ProfessorDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load professor on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ProfessorDetailComponent);

      // THEN
      expect(instance.professor).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

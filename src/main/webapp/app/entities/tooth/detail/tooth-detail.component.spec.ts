import { TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness, RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ToothDetailComponent } from './tooth-detail.component';

describe('Tooth Management Detail Component', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToothDetailComponent, RouterTestingModule.withRoutes([], { bindToComponentInputs: true })],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              component: ToothDetailComponent,
              resolve: { tooth: () => of({ id: 123 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(ToothDetailComponent, '')
      .compileComponents();
  });

  describe('OnInit', () => {
    it('Should load tooth on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', ToothDetailComponent);

      // THEN
      expect(instance.tooth).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

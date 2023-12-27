import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPW, NewPW } from '../pw.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPW for edit and NewPWFormGroupInput for create.
 */
type PWFormGroupInput = IPW | PartialWithRequiredKeyOf<NewPW>;

type PWFormDefaults = Pick<NewPW, 'id' | 'groupes'>;

type PWFormGroupContent = {
  id: FormControl<IPW['id'] | NewPW['id']>;
  title: FormControl<IPW['title']>;
  objectif: FormControl<IPW['objectif']>;
  docs: FormControl<IPW['docs']>;
  docsContentType: FormControl<IPW['docsContentType']>;
  tooth: FormControl<IPW['tooth']>;
  groupes: FormControl<IPW['groupes']>;
};

export type PWFormGroup = FormGroup<PWFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PWFormService {
  createPWFormGroup(pW: PWFormGroupInput = { id: null }): PWFormGroup {
    const pWRawValue = {
      ...this.getFormDefaults(),
      ...pW,
    };
    return new FormGroup<PWFormGroupContent>({
      id: new FormControl(
        { value: pWRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      title: new FormControl(pWRawValue.title),
      objectif: new FormControl(pWRawValue.objectif),
      docs: new FormControl(pWRawValue.docs),
      docsContentType: new FormControl(pWRawValue.docsContentType),
      tooth: new FormControl(pWRawValue.tooth, {
        validators: [Validators.required],
      }),
      groupes: new FormControl(pWRawValue.groupes ?? []),
    });
  }

  getPW(form: PWFormGroup): IPW | NewPW {
    return form.getRawValue() as IPW | NewPW;
  }

  resetForm(form: PWFormGroup, pW: PWFormGroupInput): void {
    const pWRawValue = { ...this.getFormDefaults(), ...pW };
    form.reset(
      {
        ...pWRawValue,
        id: { value: pWRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): PWFormDefaults {
    return {
      id: null,
      groupes: [],
    };
  }
}

import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ITooth, NewTooth } from '../tooth.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ITooth for edit and NewToothFormGroupInput for create.
 */
type ToothFormGroupInput = ITooth | PartialWithRequiredKeyOf<NewTooth>;

type ToothFormDefaults = Pick<NewTooth, 'id'>;

type ToothFormGroupContent = {
  id: FormControl<ITooth['id'] | NewTooth['id']>;
  name: FormControl<ITooth['name']>;
};

export type ToothFormGroup = FormGroup<ToothFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ToothFormService {
  createToothFormGroup(tooth: ToothFormGroupInput = { id: null }): ToothFormGroup {
    const toothRawValue = {
      ...this.getFormDefaults(),
      ...tooth,
    };
    return new FormGroup<ToothFormGroupContent>({
      id: new FormControl(
        { value: toothRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      name: new FormControl(toothRawValue.name),
    });
  }

  getTooth(form: ToothFormGroup): ITooth | NewTooth {
    return form.getRawValue() as ITooth | NewTooth;
  }

  resetForm(form: ToothFormGroup, tooth: ToothFormGroupInput): void {
    const toothRawValue = { ...this.getFormDefaults(), ...tooth };
    form.reset(
      {
        ...toothRawValue,
        id: { value: toothRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ToothFormDefaults {
    return {
      id: null,
    };
  }
}

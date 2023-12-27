import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IStudent, NewStudent } from '../student.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IStudent for edit and NewStudentFormGroupInput for create.
 */
type StudentFormGroupInput = IStudent | PartialWithRequiredKeyOf<NewStudent>;

type StudentFormDefaults = Pick<NewStudent, 'id'>;

type StudentFormGroupContent = {
  id: FormControl<IStudent['id'] | NewStudent['id']>;
  number: FormControl<IStudent['number']>;
  cne: FormControl<IStudent['cne']>;
  cin: FormControl<IStudent['cin']>;
  birthDay: FormControl<IStudent['birthDay']>;
  user: FormControl<IStudent['user']>;
  groupe: FormControl<IStudent['groupe']>;
};

export type StudentFormGroup = FormGroup<StudentFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class StudentFormService {
  createStudentFormGroup(student: StudentFormGroupInput = { id: null }): StudentFormGroup {
    const studentRawValue = {
      ...this.getFormDefaults(),
      ...student,
    };
    return new FormGroup<StudentFormGroupContent>({
      id: new FormControl(
        { value: studentRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      number: new FormControl(studentRawValue.number, {
        validators: [Validators.required],
      }),
      cne: new FormControl(studentRawValue.cne, {
        validators: [Validators.required],
      }),
      cin: new FormControl(studentRawValue.cin, {
        validators: [Validators.required],
      }),
      birthDay: new FormControl(studentRawValue.birthDay, {
        validators: [Validators.required],
      }),
      user: new FormControl(studentRawValue.user, {
        validators: [Validators.required],
      }),
      groupe: new FormControl(studentRawValue.groupe),
    });
  }

  getStudent(form: StudentFormGroup): IStudent | NewStudent {
    return form.getRawValue() as IStudent | NewStudent;
  }

  resetForm(form: StudentFormGroup, student: StudentFormGroupInput): void {
    const studentRawValue = { ...this.getFormDefaults(), ...student };
    form.reset(
      {
        ...studentRawValue,
        id: { value: studentRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): StudentFormDefaults {
    return {
      id: null,
    };
  }
}

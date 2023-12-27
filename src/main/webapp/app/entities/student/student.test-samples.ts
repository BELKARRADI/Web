import dayjs from 'dayjs/esm';

import { IStudent, NewStudent } from './student.model';

export const sampleWithRequiredData: IStudent = {
  id: 21832,
  number: 'candide spécialiste',
  cne: 'hystérique fidèle taper',
  cin: 'si bien que',
  birthDay: dayjs('2023-12-22'),
};

export const sampleWithPartialData: IStudent = {
  id: 14819,
  number: 'ronfler aussitôt que',
  cne: 'tsoin-tsoin apprendre ouf',
  cin: 'réparer glouglou',
  birthDay: dayjs('2023-12-23'),
};

export const sampleWithFullData: IStudent = {
  id: 14500,
  number: 'premièrement de peur que',
  cne: 'rectorat initier',
  cin: 'commissionnaire tellement placide',
  birthDay: dayjs('2023-12-23'),
};

export const sampleWithNewData: NewStudent = {
  number: 'au dépens de à condition que',
  cne: 'toucher clac dring',
  cin: 'aussitôt que entre-temps snob',
  birthDay: dayjs('2023-12-22'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

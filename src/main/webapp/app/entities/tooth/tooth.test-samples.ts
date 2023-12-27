import { ITooth, NewTooth } from './tooth.model';

export const sampleWithRequiredData: ITooth = {
  id: 26028,
};

export const sampleWithPartialData: ITooth = {
  id: 8418,
};

export const sampleWithFullData: ITooth = {
  id: 19122,
  name: 'conseil d’administration considérable',
};

export const sampleWithNewData: NewTooth = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

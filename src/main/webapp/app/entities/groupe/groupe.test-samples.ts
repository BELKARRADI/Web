import { IGroupe, NewGroupe } from './groupe.model';

export const sampleWithRequiredData: IGroupe = {
  id: 12435,
};

export const sampleWithPartialData: IGroupe = {
  id: 3126,
};

export const sampleWithFullData: IGroupe = {
  id: 22204,
  code: 'considérable oups',
  year: "pff rose à l'instar de",
};

export const sampleWithNewData: NewGroupe = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

import { IProfessor, NewProfessor } from './professor.model';

export const sampleWithRequiredData: IProfessor = {
  id: 3286,
};

export const sampleWithPartialData: IProfessor = {
  id: 15965,
};

export const sampleWithFullData: IProfessor = {
  id: 3085,
  grade: 'cocorico lectorat',
};

export const sampleWithNewData: NewProfessor = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

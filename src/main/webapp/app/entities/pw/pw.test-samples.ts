import { IPW, NewPW } from './pw.model';

export const sampleWithRequiredData: IPW = {
  id: 4062,
};

export const sampleWithPartialData: IPW = {
  id: 17967,
  title: 'personnel',
  objectif: 'équipe de recherche du fait que mélancolique',
};

export const sampleWithFullData: IPW = {
  id: 9976,
  title: 'conseil d’administration mélancolique',
  objectif: 'en dépit de prou',
  docs: '../fake-data/blob/hipster.png',
  docsContentType: 'unknown',
};

export const sampleWithNewData: NewPW = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

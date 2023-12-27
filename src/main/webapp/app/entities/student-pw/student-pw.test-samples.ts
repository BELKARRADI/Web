import dayjs from 'dayjs/esm';

import { IStudentPW, NewStudentPW } from './student-pw.model';

export const sampleWithRequiredData: IStudentPW = {
  id: 19704,
};

export const sampleWithPartialData: IStudentPW = {
  id: 16626,
  imageFront: '../fake-data/blob/hipster.png',
  imageFrontContentType: 'unknown',
  imageSide: '../fake-data/blob/hipster.png',
  imageSideContentType: 'unknown',
  date: dayjs('2023-12-23'),
  mesureAngle1: 'de façon que',
  intersection: 'foule',
};

export const sampleWithFullData: IStudentPW = {
  id: 30132,
  time: 'bien que population du Québec délégation',
  imageFront: '../fake-data/blob/hipster.png',
  imageFrontContentType: 'unknown',
  imageSide: '../fake-data/blob/hipster.png',
  imageSideContentType: 'unknown',
  date: dayjs('2023-12-23'),
  mesureAngle1: 'grâce à au-delà',
  mesureAngle2: 'hi croâ outre',
  intersection: 'jadis vraisemblablement',
};

export const sampleWithNewData: NewStudentPW = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

import dayjs from 'dayjs/esm';
import { IStudent } from 'app/entities/student/student.model';
import { IPW } from 'app/entities/pw/pw.model';

export interface IStudentPW {
  id: number;
  time?: string | null;
  imageFront?: string | null;
  imageFrontContentType?: string | null;
  imageSide?: string | null;
  imageSideContentType?: string | null;
  date?: dayjs.Dayjs | null;
  mesureAngle1?: string | null;
  mesureAngle2?: string | null;
  intersection?: string | null;
  student?: Pick<IStudent, 'id'> | null;
  pw?: Pick<IPW, 'id' | 'title'> | null;
}

export type NewStudentPW = Omit<IStudentPW, 'id'> & { id: null };

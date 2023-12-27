import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';
import { IGroupe } from 'app/entities/groupe/groupe.model';

export interface IStudent {
  id: number;
  number?: string | null;
  cne?: string | null;
  cin?: string | null;
  birthDay?: dayjs.Dayjs | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
  groupe?: Pick<IGroupe, 'id' | 'code'> | null;
}

export type NewStudent = Omit<IStudent, 'id'> & { id: null };

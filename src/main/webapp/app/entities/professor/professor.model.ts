import { IUser } from 'app/entities/user/user.model';

export interface IProfessor {
  id: number;
  grade?: string | null;
  user?: Pick<IUser, 'id' | 'login'> | null;
}

export type NewProfessor = Omit<IProfessor, 'id'> & { id: null };

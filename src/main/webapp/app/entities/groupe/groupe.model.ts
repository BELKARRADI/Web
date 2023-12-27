import { IProfessor } from 'app/entities/professor/professor.model';
import { IPW } from 'app/entities/pw/pw.model';

export interface IGroupe {
  id: number;
  code?: string | null;
  year?: string | null;
  professor?: Pick<IProfessor, 'id'> | null;
  pws?: Pick<IPW, 'id' | 'title'>[] | null;
}

export type NewGroupe = Omit<IGroupe, 'id'> & { id: null };

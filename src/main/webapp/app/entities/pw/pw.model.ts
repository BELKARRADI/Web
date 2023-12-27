import { ITooth } from 'app/entities/tooth/tooth.model';
import { IGroupe } from 'app/entities/groupe/groupe.model';

export interface IPW {
  id: number;
  title?: string | null;
  objectif?: string | null;
  docs?: string | null;
  docsContentType?: string | null;
  tooth?: Pick<ITooth, 'id' | 'name'> | null;
  groupes?: Pick<IGroupe, 'id' | 'code'>[] | null;
}

export type NewPW = Omit<IPW, 'id'> & { id: null };

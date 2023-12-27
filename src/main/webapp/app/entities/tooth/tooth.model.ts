export interface ITooth {
  id: number;
  name?: string | null;
}

export type NewTooth = Omit<ITooth, 'id'> & { id: null };

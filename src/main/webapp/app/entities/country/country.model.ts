export interface ICountry {
  id: number;
  abbreviation?: string | null;
  name?: string | null;
}

export type NewCountry = Omit<ICountry, 'id'> & { id: null };

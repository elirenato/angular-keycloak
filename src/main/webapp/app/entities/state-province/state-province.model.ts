import { ICountry } from 'app/entities/country/country.model';

export interface IStateProvince {
  id: number;
  abbreviation?: string | null;
  name?: string | null;
  country?: Pick<ICountry, 'id' | 'name'> | null;
}

export type NewStateProvince = Omit<IStateProvince, 'id'> & { id: null };

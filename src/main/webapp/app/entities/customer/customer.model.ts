import { IStateProvince } from 'app/entities/state-province/state-province.model';
import { ICountry } from '../country/country.model';

export interface ICustomer {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  address?: string | null;
  address2?: string | null;
  postalCode?: string | null;
  country?: Pick<ICountry, 'id' | 'name'> | null;
  stateProvince?: Pick<IStateProvince, 'id' | 'name' | 'country'> | null;
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };

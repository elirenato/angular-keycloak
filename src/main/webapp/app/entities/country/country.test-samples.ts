import { ICountry, NewCountry } from './country.model';

export const sampleWithRequiredData: ICountry = {
  id: 4746,
};

export const sampleWithPartialData: ICountry = {
  id: 87057,
  abbreviation: 'Configuration',
  name: 'Tasty Tuna',
};

export const sampleWithFullData: ICountry = {
  id: 44167,
  abbreviation: 'engineer Computer',
  name: 'knowledge deposit',
};

export const sampleWithNewData: NewCountry = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

import { ICustomer, NewCustomer } from './customer.model';

export const sampleWithRequiredData: ICustomer = {
  id: 24379,
  firstName: 'Erin',
  lastName: 'White',
  email: 'Deontae_Hermiston88@yahoo.com',
  address: 'Gorgeous generate',
  postalCode: 'Global Kentucky',
};

export const sampleWithPartialData: ICustomer = {
  id: 64161,
  firstName: 'Zora',
  lastName: 'Von',
  email: 'Braden_Kerluke71@yahoo.com',
  address: 'dynamic calculate',
  postalCode: 'Montana Maine',
};

export const sampleWithFullData: ICustomer = {
  id: 78864,
  firstName: 'Lenna',
  lastName: 'Gleason',
  email: 'Mazie56@yahoo.com',
  address: 'extranet seize',
  address2: 'Facilitator',
  postalCode: 'Cross-platform revolutionary Games',
};

export const sampleWithNewData: NewCustomer = {
  firstName: 'Virgie',
  lastName: 'Larson',
  email: 'Nona_Nikolaus4@yahoo.com',
  address: 'matrix Investor clicks-and-mortar',
  postalCode: 'back-end Benin capacitor',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

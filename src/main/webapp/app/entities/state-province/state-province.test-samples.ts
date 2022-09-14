import { IStateProvince, NewStateProvince } from './state-province.model';

export const sampleWithRequiredData: IStateProvince = {
  id: 22932,
};

export const sampleWithPartialData: IStateProvince = {
  id: 40470,
  abbreviation: 'hacking',
};

export const sampleWithFullData: IStateProvince = {
  id: 64804,
  abbreviation: 'Berkshire actuating',
  name: 'Tuna Soap',
};

export const sampleWithNewData: NewStateProvince = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);

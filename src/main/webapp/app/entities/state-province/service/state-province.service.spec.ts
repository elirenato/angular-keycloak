import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStateProvince } from '../state-province.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../state-province.test-samples';

import { StateProvinceService } from './state-province.service';

const requireRestSample: IStateProvince = {
  ...sampleWithRequiredData,
};

describe('StateProvince Service', () => {
  let service: StateProvinceService;
  let httpMock: HttpTestingController;
  let expectedResult: IStateProvince | IStateProvince[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StateProvinceService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StateProvince', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    describe('addStateProvinceToCollectionIfMissing', () => {
      it('should add a StateProvince to an empty array', () => {
        const stateProvince: IStateProvince = sampleWithRequiredData;
        expectedResult = service.addStateProvinceToCollectionIfMissing([], stateProvince);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stateProvince);
      });

      it('should not add a StateProvince to an array that contains it', () => {
        const stateProvince: IStateProvince = sampleWithRequiredData;
        const stateProvinceCollection: IStateProvince[] = [
          {
            ...stateProvince,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStateProvinceToCollectionIfMissing(stateProvinceCollection, stateProvince);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StateProvince to an array that doesn't contain it", () => {
        const stateProvince: IStateProvince = sampleWithRequiredData;
        const stateProvinceCollection: IStateProvince[] = [sampleWithPartialData];
        expectedResult = service.addStateProvinceToCollectionIfMissing(stateProvinceCollection, stateProvince);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stateProvince);
      });

      it('should add only unique StateProvince to an array', () => {
        const stateProvinceArray: IStateProvince[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const stateProvinceCollection: IStateProvince[] = [sampleWithRequiredData];
        expectedResult = service.addStateProvinceToCollectionIfMissing(stateProvinceCollection, ...stateProvinceArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stateProvince: IStateProvince = sampleWithRequiredData;
        const stateProvince2: IStateProvince = sampleWithPartialData;
        expectedResult = service.addStateProvinceToCollectionIfMissing([], stateProvince, stateProvince2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stateProvince);
        expect(expectedResult).toContain(stateProvince2);
      });

      it('should accept null and undefined values', () => {
        const stateProvince: IStateProvince = sampleWithRequiredData;
        expectedResult = service.addStateProvinceToCollectionIfMissing([], null, stateProvince, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stateProvince);
      });

      it('should return initial array if no StateProvince is added', () => {
        const stateProvinceCollection: IStateProvince[] = [sampleWithRequiredData];
        expectedResult = service.addStateProvinceToCollectionIfMissing(stateProvinceCollection, undefined, null);
        expect(expectedResult).toEqual(stateProvinceCollection);
      });
    });

    describe('compareStateProvince', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStateProvince(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStateProvince(entity1, entity2);
        const compareResult2 = service.compareStateProvince(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStateProvince(entity1, entity2);
        const compareResult2 = service.compareStateProvince(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStateProvince(entity1, entity2);
        const compareResult2 = service.compareStateProvince(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

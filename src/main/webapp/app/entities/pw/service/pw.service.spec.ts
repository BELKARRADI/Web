import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPW } from '../pw.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../pw.test-samples';

import { PWService } from './pw.service';

const requireRestSample: IPW = {
  ...sampleWithRequiredData,
};

describe('PW Service', () => {
  let service: PWService;
  let httpMock: HttpTestingController;
  let expectedResult: IPW | IPW[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PWService);
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

    it('should create a PW', () => {
      const pW = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(pW).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a PW', () => {
      const pW = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(pW).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a PW', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of PW', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a PW', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPWToCollectionIfMissing', () => {
      it('should add a PW to an empty array', () => {
        const pW: IPW = sampleWithRequiredData;
        expectedResult = service.addPWToCollectionIfMissing([], pW);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pW);
      });

      it('should not add a PW to an array that contains it', () => {
        const pW: IPW = sampleWithRequiredData;
        const pWCollection: IPW[] = [
          {
            ...pW,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPWToCollectionIfMissing(pWCollection, pW);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a PW to an array that doesn't contain it", () => {
        const pW: IPW = sampleWithRequiredData;
        const pWCollection: IPW[] = [sampleWithPartialData];
        expectedResult = service.addPWToCollectionIfMissing(pWCollection, pW);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pW);
      });

      it('should add only unique PW to an array', () => {
        const pWArray: IPW[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const pWCollection: IPW[] = [sampleWithRequiredData];
        expectedResult = service.addPWToCollectionIfMissing(pWCollection, ...pWArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const pW: IPW = sampleWithRequiredData;
        const pW2: IPW = sampleWithPartialData;
        expectedResult = service.addPWToCollectionIfMissing([], pW, pW2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(pW);
        expect(expectedResult).toContain(pW2);
      });

      it('should accept null and undefined values', () => {
        const pW: IPW = sampleWithRequiredData;
        expectedResult = service.addPWToCollectionIfMissing([], null, pW, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(pW);
      });

      it('should return initial array if no PW is added', () => {
        const pWCollection: IPW[] = [sampleWithRequiredData];
        expectedResult = service.addPWToCollectionIfMissing(pWCollection, undefined, null);
        expect(expectedResult).toEqual(pWCollection);
      });
    });

    describe('comparePW', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePW(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePW(entity1, entity2);
        const compareResult2 = service.comparePW(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePW(entity1, entity2);
        const compareResult2 = service.comparePW(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePW(entity1, entity2);
        const compareResult2 = service.comparePW(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITooth } from '../tooth.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../tooth.test-samples';

import { ToothService } from './tooth.service';

const requireRestSample: ITooth = {
  ...sampleWithRequiredData,
};

describe('Tooth Service', () => {
  let service: ToothService;
  let httpMock: HttpTestingController;
  let expectedResult: ITooth | ITooth[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ToothService);
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

    it('should create a Tooth', () => {
      const tooth = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(tooth).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Tooth', () => {
      const tooth = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(tooth).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Tooth', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Tooth', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Tooth', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addToothToCollectionIfMissing', () => {
      it('should add a Tooth to an empty array', () => {
        const tooth: ITooth = sampleWithRequiredData;
        expectedResult = service.addToothToCollectionIfMissing([], tooth);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tooth);
      });

      it('should not add a Tooth to an array that contains it', () => {
        const tooth: ITooth = sampleWithRequiredData;
        const toothCollection: ITooth[] = [
          {
            ...tooth,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addToothToCollectionIfMissing(toothCollection, tooth);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Tooth to an array that doesn't contain it", () => {
        const tooth: ITooth = sampleWithRequiredData;
        const toothCollection: ITooth[] = [sampleWithPartialData];
        expectedResult = service.addToothToCollectionIfMissing(toothCollection, tooth);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tooth);
      });

      it('should add only unique Tooth to an array', () => {
        const toothArray: ITooth[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const toothCollection: ITooth[] = [sampleWithRequiredData];
        expectedResult = service.addToothToCollectionIfMissing(toothCollection, ...toothArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const tooth: ITooth = sampleWithRequiredData;
        const tooth2: ITooth = sampleWithPartialData;
        expectedResult = service.addToothToCollectionIfMissing([], tooth, tooth2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(tooth);
        expect(expectedResult).toContain(tooth2);
      });

      it('should accept null and undefined values', () => {
        const tooth: ITooth = sampleWithRequiredData;
        expectedResult = service.addToothToCollectionIfMissing([], null, tooth, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(tooth);
      });

      it('should return initial array if no Tooth is added', () => {
        const toothCollection: ITooth[] = [sampleWithRequiredData];
        expectedResult = service.addToothToCollectionIfMissing(toothCollection, undefined, null);
        expect(expectedResult).toEqual(toothCollection);
      });
    });

    describe('compareTooth', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTooth(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareTooth(entity1, entity2);
        const compareResult2 = service.compareTooth(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareTooth(entity1, entity2);
        const compareResult2 = service.compareTooth(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareTooth(entity1, entity2);
        const compareResult2 = service.compareTooth(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

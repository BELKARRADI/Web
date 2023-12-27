import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IStudentPW } from '../student-pw.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../student-pw.test-samples';

import { StudentPWService, RestStudentPW } from './student-pw.service';

const requireRestSample: RestStudentPW = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('StudentPW Service', () => {
  let service: StudentPWService;
  let httpMock: HttpTestingController;
  let expectedResult: IStudentPW | IStudentPW[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StudentPWService);
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

    it('should create a StudentPW', () => {
      const studentPW = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(studentPW).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a StudentPW', () => {
      const studentPW = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(studentPW).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a StudentPW', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of StudentPW', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a StudentPW', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStudentPWToCollectionIfMissing', () => {
      it('should add a StudentPW to an empty array', () => {
        const studentPW: IStudentPW = sampleWithRequiredData;
        expectedResult = service.addStudentPWToCollectionIfMissing([], studentPW);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(studentPW);
      });

      it('should not add a StudentPW to an array that contains it', () => {
        const studentPW: IStudentPW = sampleWithRequiredData;
        const studentPWCollection: IStudentPW[] = [
          {
            ...studentPW,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStudentPWToCollectionIfMissing(studentPWCollection, studentPW);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a StudentPW to an array that doesn't contain it", () => {
        const studentPW: IStudentPW = sampleWithRequiredData;
        const studentPWCollection: IStudentPW[] = [sampleWithPartialData];
        expectedResult = service.addStudentPWToCollectionIfMissing(studentPWCollection, studentPW);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(studentPW);
      });

      it('should add only unique StudentPW to an array', () => {
        const studentPWArray: IStudentPW[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const studentPWCollection: IStudentPW[] = [sampleWithRequiredData];
        expectedResult = service.addStudentPWToCollectionIfMissing(studentPWCollection, ...studentPWArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const studentPW: IStudentPW = sampleWithRequiredData;
        const studentPW2: IStudentPW = sampleWithPartialData;
        expectedResult = service.addStudentPWToCollectionIfMissing([], studentPW, studentPW2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(studentPW);
        expect(expectedResult).toContain(studentPW2);
      });

      it('should accept null and undefined values', () => {
        const studentPW: IStudentPW = sampleWithRequiredData;
        expectedResult = service.addStudentPWToCollectionIfMissing([], null, studentPW, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(studentPW);
      });

      it('should return initial array if no StudentPW is added', () => {
        const studentPWCollection: IStudentPW[] = [sampleWithRequiredData];
        expectedResult = service.addStudentPWToCollectionIfMissing(studentPWCollection, undefined, null);
        expect(expectedResult).toEqual(studentPWCollection);
      });
    });

    describe('compareStudentPW', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStudentPW(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStudentPW(entity1, entity2);
        const compareResult2 = service.compareStudentPW(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStudentPW(entity1, entity2);
        const compareResult2 = service.compareStudentPW(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStudentPW(entity1, entity2);
        const compareResult2 = service.compareStudentPW(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

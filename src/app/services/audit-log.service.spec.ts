import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuditLogService } from './audit-log.service';
import { ApiService } from './api.service';
import { AuditLogFilter, IMedicalRecordAccessLog, AuditReport, PagedResult } from '../entities';

describe('AuditLogService', () => {
  let service: AuditLogService;
  let httpMock: HttpTestingController;
  let apiService: ApiService;

  const mockAuditLog: IMedicalRecordAccessLog = {
    id: 1,
    userId: 123,
    medicalHistoryId: 456,
    patientDetailsId: 789,
    accessTime: new Date(),
    purpose: 'Patient consultation',
    accessingClinicId: 1,
    medicalRecordOwnerClinicId: 1,
    hadValidConsent: true,
    ipAddress: '192.168.1.1',
    sessionId: 'session-123',
  };

  const mockPagedResult: PagedResult<IMedicalRecordAccessLog> = {
    data: [mockAuditLog],
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 1,
      totalPages: 1,
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuditLogService, ApiService],
    });
    service = TestBed.inject(AuditLogService);
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAccessLogs', () => {
    it('should retrieve paginated audit logs without filters', (done) => {
      service.getAccessLogs().subscribe((result) => {
        expect(result).toEqual(mockPagedResult);
        expect(result.data.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });

    it('should retrieve audit logs with filters', (done) => {
      const filter: AuditLogFilter = {
        userId: 123,
        clinicId: 1,
        page: 1,
        pageSize: 10,
      };

      service.getAccessLogs(filter).subscribe((result) => {
        expect(result).toEqual(mockPagedResult);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs') &&
        request.url.includes('userId=123') &&
        request.url.includes('clinicId=1')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });

    it('should include date filters in query string', (done) => {
      const dateFrom = new Date('2026-01-01');
      const dateTo = new Date('2026-02-01');
      const filter: AuditLogFilter = { dateFrom, dateTo };

      service.getAccessLogs(filter).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs') &&
        request.url.includes('dateFrom=') &&
        request.url.includes('dateTo=')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });
  });

  describe('getAccessLogById', () => {
    it('should retrieve a single audit log by ID', (done) => {
      service.getAccessLogById(1).subscribe((result) => {
        expect(result).toEqual(mockAuditLog);
        done();
      });

      const req = httpMock.expectOne('http://localhost:5126/api/audit-logs/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockAuditLog);
    });
  });

  describe('getAccessLogDetail', () => {
    it('should be an alias for getAccessLogById', (done) => {
      service.getAccessLogDetail(1).subscribe((result) => {
        expect(result).toEqual(mockAuditLog);
        done();
      });

      const req = httpMock.expectOne('http://localhost:5126/api/audit-logs/1');
      expect(req.request.method).toBe('GET');
      req.flush(mockAuditLog);
    });
  });

  describe('generateReport', () => {
    it('should generate audit report', (done) => {
      const mockReport: AuditReport = {
        totalAccesses: 100,
        accessesByUser: [],
        accessesByClinic: [],
        accessesByDate: [],
        consentViolations: 5,
        generatedAt: new Date(),
      };

      service.generateReport().subscribe((result) => {
        expect(result.totalAccesses).toBe(100);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs/reports/generate')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockReport);
    });

    it('should generate report with filters', (done) => {
      const filter: AuditLogFilter = { clinicId: 1 };
      const mockReport: AuditReport = {
        totalAccesses: 50,
        accessesByUser: [],
        accessesByClinic: [],
        accessesByDate: [],
        consentViolations: 2,
        generatedAt: new Date(),
      };

      service.generateReport(filter).subscribe((result) => {
        expect(result.totalAccesses).toBe(50);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs/reports/generate') &&
        request.url.includes('clinicId=1')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockReport);
    });
  });

  describe('getLogsByUser', () => {
    it('should retrieve logs for specific user', (done) => {
      service.getLogsByUser(123).subscribe((result) => {
        expect(result).toEqual(mockPagedResult);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs') &&
        request.url.includes('userId=123')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });
  });

  describe('getLogsByClinic', () => {
    it('should retrieve logs for specific clinic', (done) => {
      service.getLogsByClinic(1).subscribe((result) => {
        expect(result).toEqual(mockPagedResult);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs') &&
        request.url.includes('clinicId=1')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });
  });

  describe('getConsentViolations', () => {
    it('should retrieve logs without consent', (done) => {
      service.getConsentViolations().subscribe((result) => {
        expect(result).toEqual(mockPagedResult);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs') &&
        request.url.includes('hasConsent=false')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });
  });

  describe('getLogsByPatient', () => {
    it('should retrieve logs for specific patient', (done) => {
      service.getLogsByPatient(789).subscribe((result) => {
        expect(result).toEqual(mockPagedResult);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs') &&
        request.url.includes('patientId=789')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });
  });

  describe('searchLogs', () => {
    it('should search logs by search term', (done) => {
      service.searchLogs('consultation').subscribe((result) => {
        expect(result).toEqual(mockPagedResult);
        done();
      });

      const req = httpMock.expectOne((request) =>
        request.url.includes('audit-logs') &&
        request.url.includes('searchTerm=')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPagedResult);
    });
  });
});

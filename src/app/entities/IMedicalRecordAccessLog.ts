/**
 * Medical Record Access Log Interface
 * Represents an audit log entry for medical record access
 *
 * @interface IMedicalRecordAccessLog
 * @description Tracks when and how medical records are accessed for audit purposes
 */
export interface IMedicalRecordAccessLog {
  /**
   * Unique identifier for the access log entry
   */
  id: number;

  /**
   * ID of the user who accessed the record
   */
  userId: number;

  /**
   * ID of the medical history record that was accessed
   */
  medicalHistoryId: number;

  /**
   * ID of the patient whose record was accessed
   */
  patientDetailsId: number;

  /**
   * Timestamp when the access occurred
   */
  accessTime: Date;

  /**
   * Stated purpose for accessing the record
   */
  purpose: string;

  /**
   * ID of the clinic where the access occurred
   */
  accessingClinicId: number;

  /**
   * ID of the clinic that owns the medical record
   */
  medicalRecordOwnerClinicId: number;

  /**
   * Whether valid patient consent existed at time of access
   */
  hadValidConsent: boolean;

  /**
   * Optional reason code or additional notes (nullable)
   */
  reason?: string;

  /**
   * IP address from which the access was made
   */
  ipAddress: string;

  /**
   * Session identifier for tracking user session
   */
  sessionId: string;
}

/**
 * Filter/Query DTO for audit log searches
 */
export interface AuditLogFilter {
  /**
   * Start date for filtering access logs
   */
  dateFrom?: Date;

  /**
   * End date for filtering access logs
   */
  dateTo?: Date;

  /**
   * Filter by accessing user ID
   */
  userId?: number;

  /**
   * Filter by clinic ID
   */
  clinicId?: number;

  /**
   * Filter by patient ID
   */
  patientId?: number;

  /**
   * Filter by consent status
   */
  hasConsent?: boolean;

  /**
   * Search term for purpose or notes
   */
  searchTerm?: string;

  /**
   * Page number for pagination
   */
  page?: number;

  /**
   * Number of items per page
   */
  pageSize?: number;
}

/**
 * Audit Report DTO
 */
export interface AuditReport {
  /**
   * Total number of access records in report period
   */
  totalAccesses: number;

  /**
   * Summary grouped by user
   */
  accessesByUser: AccessByUserReport[];

  /**
   * Summary grouped by clinic
   */
  accessesByClinic: AccessByClinicReport[];

  /**
   * Summary grouped by date
   */
  accessesByDate: AccessByDateReport[];

  /**
   * Number of accesses without valid consent
   */
  consentViolations: number;

  /**
   * When the report was generated
   */
  generatedAt: Date;
}

/**
 * Audit report grouped by user
 */
export interface AccessByUserReport {
  userId: number;
  userName: string;
  accessCount: number;
  lastAccessTime: Date;
}

/**
 * Audit report grouped by clinic
 */
export interface AccessByClinicReport {
  clinicId: number;
  clinicName: string;
  accessCount: number;
  consentViolationCount: number;
}

/**
 * Audit report grouped by date
 */
export interface AccessByDateReport {
  date: Date;
  accessCount: number;
  consentViolationCount: number;
}

/**
 * Paged result wrapper for API responses
 */
export interface PagedResult<T> {
  /**
   * Array of data items for current page
   */
  data: T[];

  /**
   * Pagination metadata
   */
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

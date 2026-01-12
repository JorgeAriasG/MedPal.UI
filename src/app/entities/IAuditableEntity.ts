/**
 * Base Auditable Entity Interface
 * Provides common audit tracking properties for entities
 *
 * @interface IAuditableEntity
 * @description Optional base interface for entities that need audit tracking
 */
export interface IAuditableEntity {
  /**
   * Unique identifier
   */
  id: number;

  /**
   * When the record was created (optional, may be tracked elsewhere)
   */
  createdAt?: Date;

  /**
   * User ID who created the record (optional)
   */
  createdBy?: number;

  /**
   * When the record was last updated (optional)
   */
  updatedAt?: Date;

  /**
   * User ID who last updated the record (optional)
   */
  updatedBy?: number;

  /**
   * Soft delete flag (optional)
   */
  isDeleted?: boolean;

  /**
   * When the record was deleted (optional)
   */
  deletedAt?: Date;

  /**
   * User ID who deleted the record (optional)
   */
  deletedBy?: number;
}

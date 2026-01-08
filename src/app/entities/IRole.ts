export interface IRole {
  id?: number;
  name: string;
  description: string;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

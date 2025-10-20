export interface User {
  id?: string;
  username: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  permissions: string[];
  createdDate?: Date;
  createdBy?: string;
  lastModifiedDate?: Date;
  lastModifiedBy?: string;
}

export interface UserRegistration {
  username: string;
  password: string;
  email: string;
  name: string;
  lastName: string;
  role: string;
  permissions: string[];
}

export interface UserUpdate {
  email?: string;
  name?: string;
  lastName?: string;
  role?: string;
  permissions?: string[];
  password?: string;
}

export interface UserFilter {
  role?: string;
  query?: string;
}

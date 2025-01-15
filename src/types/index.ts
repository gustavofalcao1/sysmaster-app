export type Role = 'admin' | 'user';

export type DeviceStatus = 'online' | 'offline' | 'pending';

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface User extends BaseEntity {
  name: string;
  username: string;
  password: string;
  role: Role;
  deviceIds: string[];
}

export interface Group extends BaseEntity {
  name: string;
  location: string;
  prefix: string;
  deviceIds: string[];
}

export interface Device extends BaseEntity {
  name: string;
  displayName: string;
  ipAddress: string;
  macAddress: string;
  groupId?: string;
  userId?: string;
  status: DeviceStatus;
  lastActive: string;
  specs?: {
    cpu?: string;
    memory?: string;
    disk?: string;
    os?: string;
  };
}

// Tipos para operações CRUD
export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'deviceIds'>;
export type UpdateUserInput = Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateGroupInput = Omit<Group, 'id' | 'createdAt' | 'updatedAt' | 'deviceIds'>;
export type UpdateGroupInput = Partial<Omit<Group, 'id' | 'createdAt' | 'updatedAt'>>;

export type CreateDeviceInput = Omit<Device, 'id' | 'createdAt' | 'updatedAt' | 'displayName'>;
export type UpdateDeviceInput = Partial<Omit<Device, 'id' | 'createdAt' | 'updatedAt'>>;

// Tipos para filtros e ordenação
export interface FilterOptions {
  search?: string;
  status?: DeviceStatus;
  role?: Role;
  groupId?: string;
  userId?: string;
}

export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

import {
  User,
  Group,
  Device,
  CreateUserInput,
  UpdateUserInput,
  CreateGroupInput,
  UpdateGroupInput,
  CreateDeviceInput,
  UpdateDeviceInput,
  FilterOptions,
  SortOptions,
} from '@/types';

// Função auxiliar para gerar IDs únicos
const generateId = (): string => Math.random().toString(36).substr(2, 9);

// Função auxiliar para timestamp atual
const now = (): string => new Date().toISOString();

// Função para verificar se está rodando no cliente
const isClient = typeof window !== 'undefined';

// Função para carregar dados da API
async function loadData(entity: string) {
  try {
    const response = await fetch(`/api/data?entity=${entity}`);
    if (!response.ok) throw new Error('Failed to load data');
    const data = await response.json();
    return data[entity] || [];
  } catch (error) {
    console.error(`Error loading ${entity}:`, error);
    return [];
  }
}

// Função para salvar dados via API
async function saveData(entity: string, data: any[]) {
  try {
    const response = await fetch('/api/data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        entity,
        data: { [entity]: data },
      }),
    });
    if (!response.ok) throw new Error('Failed to save data');
  } catch (error) {
    console.error(`Error saving ${entity}:`, error);
  }
}

// Classe para gerenciar os dados
export class Database {
  private users: User[] = [];
  private groups: Group[] = [];
  private devices: Device[] = [];

  constructor() {
    // Carrega dados iniciais
    this.loadInitialData();
  }

  private async loadInitialData() {
    // Tenta carregar do localStorage primeiro (apenas no cliente)
    if (isClient) {
      const savedUsers = localStorage.getItem('users');
      const savedGroups = localStorage.getItem('groups');
      const savedDevices = localStorage.getItem('devices');

      if (savedUsers && savedGroups && savedDevices) {
        this.users = JSON.parse(savedUsers);
        this.groups = JSON.parse(savedGroups);
        this.devices = JSON.parse(savedDevices);
        return;
      }
    }

    // Se não houver dados no localStorage ou estiver no servidor, carrega da API
    this.users = await loadData('users');
    this.groups = await loadData('groups');
    this.devices = await loadData('devices');

    // Salva no localStorage (apenas no cliente)
    if (isClient) {
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('groups', JSON.stringify(this.groups));
      localStorage.setItem('devices', JSON.stringify(this.devices));
    }
  }

  // Método para salvar dados
  private async saveData() {
    // Salva no localStorage (apenas no cliente)
    if (isClient) {
      localStorage.setItem('users', JSON.stringify(this.users));
      localStorage.setItem('groups', JSON.stringify(this.groups));
      localStorage.setItem('devices', JSON.stringify(this.devices));
    }

    // Salva via API
    await Promise.all([
      saveData('users', this.users),
      saveData('groups', this.groups),
      saveData('devices', this.devices),
    ]);
  }

  // Métodos auxiliares
  private applyFilters<T extends User | Group | Device>(
    items: T[],
    filters: FilterOptions
  ): T[] {
    return items.filter((item) => {
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableFields = Object.values(item).filter(
          (value) => typeof value === 'string'
        ) as string[];
        if (!searchableFields.some((field) => field.toLowerCase().includes(searchTerm))) {
          return false;
        }
      }

      if ('status' in item && filters.status && item.status !== filters.status) {
        return false;
      }

      if ('role' in item && filters.role && item.role !== filters.role) {
        return false;
      }

      if ('groupId' in item && filters.groupId && item.groupId !== filters.groupId) {
        return false;
      }

      if ('userId' in item && filters.userId && item.userId !== filters.userId) {
        return false;
      }

      return true;
    });
  }

  private applySorting<T>(items: T[], sort: SortOptions): T[] {
    return [...items].sort((a, b) => {
      const aValue = a[sort.field as keyof T];
      const bValue = b[sort.field as keyof T];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sort.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });
  }

  // Users
  getUsers(filters?: FilterOptions, sort?: SortOptions): User[] {
    let filteredUsers = filters ? this.applyFilters(this.users, filters) : this.users;
    return sort ? this.applySorting(filteredUsers, sort) : filteredUsers;
  }

  getUserById(id: string): User | undefined {
    return this.users.find((user) => user.id === id);
  }

  getUserByUsername(username: string): User | undefined {
    return this.users.find((user) => user.username === username);
  }

  async createUser(input: CreateUserInput): Promise<User> {
    if (this.getUserByUsername(input.username)) {
      throw new Error('Username already exists');
    }

    const user: User = {
      ...input,
      id: generateId(),
      deviceIds: [],
      createdAt: now(),
      updatedAt: now(),
    };

    this.users.push(user);
    await this.saveData();
    return user;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<User> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw new Error('User not found');

    if (input.username && input.username !== this.users[index].username) {
      if (this.getUserByUsername(input.username)) {
        throw new Error('Username already exists');
      }
    }

    const updatedUser = {
      ...this.users[index],
      ...input,
      updatedAt: now(),
    };

    this.users[index] = updatedUser;
    await this.saveData();
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) throw new Error('User not found');

    // Remove user from devices
    this.devices
      .filter((device) => device.userId === id)
      .forEach((device) => {
        device.userId = undefined;
      });

    this.users.splice(index, 1);
    await this.saveData();
  }

  // Groups
  getGroups(filters?: FilterOptions, sort?: SortOptions): Group[] {
    let filteredGroups = filters ? this.applyFilters(this.groups, filters) : this.groups;
    return sort ? this.applySorting(filteredGroups, sort) : filteredGroups;
  }

  getGroupById(id: string): Group | undefined {
    return this.groups.find((group) => group.id === id);
  }

  async createGroup(input: CreateGroupInput): Promise<Group> {
    const group: Group = {
      ...input,
      id: generateId(),
      deviceIds: [],
      createdAt: now(),
      updatedAt: now(),
    };

    this.groups.push(group);
    await this.saveData();
    return group;
  }

  async updateGroup(id: string, input: UpdateGroupInput): Promise<Group> {
    const index = this.groups.findIndex((group) => group.id === id);
    if (index === -1) throw new Error('Group not found');

    const updatedGroup = {
      ...this.groups[index],
      ...input,
      updatedAt: now(),
    };

    this.groups[index] = updatedGroup;

    // Update device display names if prefix changed
    if (input.prefix) {
      this.devices
        .filter((device) => device.groupId === id)
        .forEach((device) => {
          device.displayName = `${input.prefix}-${device.name}`;
        });
    }

    await this.saveData();
    return updatedGroup;
  }

  async deleteGroup(id: string): Promise<void> {
    const index = this.groups.findIndex((group) => group.id === id);
    if (index === -1) throw new Error('Group not found');

    // Remove group from devices
    this.devices
      .filter((device) => device.groupId === id)
      .forEach((device) => {
        device.groupId = undefined;
        device.displayName = device.name;
      });

    this.groups.splice(index, 1);
    await this.saveData();
  }

  // Devices
  getDevices(filters?: FilterOptions, sort?: SortOptions): Device[] {
    let filteredDevices = filters ? this.applyFilters(this.devices, filters) : this.devices;
    return sort ? this.applySorting(filteredDevices, sort) : filteredDevices;
  }

  getDeviceById(id: string): Device | undefined {
    return this.devices.find((device) => device.id === id);
  }

  async createDevice(input: CreateDeviceInput): Promise<Device> {
    const group = input.groupId ? this.getGroupById(input.groupId) : undefined;
    const displayName = group ? `${group.prefix}-${input.name}` : input.name;

    const device: Device = {
      ...input,
      id: generateId(),
      displayName,
      createdAt: now(),
      updatedAt: now(),
    };

    this.devices.push(device);

    // Add device to group
    if (group) {
      group.deviceIds.push(device.id);
    }

    // Add device to user
    if (input.userId) {
      const user = this.getUserById(input.userId);
      if (user) {
        user.deviceIds.push(device.id);
      }
    }

    await this.saveData();
    return device;
  }

  async updateDevice(id: string, input: UpdateDeviceInput): Promise<Device> {
    const index = this.devices.findIndex((device) => device.id === id);
    if (index === -1) throw new Error('Device not found');

    const oldDevice = this.devices[index];
    const updatedDevice = { ...oldDevice, ...input, updatedAt: now() };

    // Update display name if name changed or group changed
    if (input.name || input.groupId !== oldDevice.groupId) {
      const group = updatedDevice.groupId ? this.getGroupById(updatedDevice.groupId) : undefined;
      updatedDevice.displayName = group ? `${group.prefix}-${updatedDevice.name}` : updatedDevice.name;
    }

    // Update group relationships
    if (input.groupId !== oldDevice.groupId) {
      // Remove from old group
      if (oldDevice.groupId) {
        const oldGroup = this.getGroupById(oldDevice.groupId);
        if (oldGroup) {
          oldGroup.deviceIds = oldGroup.deviceIds.filter((deviceId) => deviceId !== id);
        }
      }

      // Add to new group
      if (updatedDevice.groupId) {
        const newGroup = this.getGroupById(updatedDevice.groupId);
        if (newGroup && !newGroup.deviceIds.includes(id)) {
          newGroup.deviceIds.push(id);
        }
      }
    }

    // Update user relationships
    if (input.userId !== oldDevice.userId) {
      // Remove from old user
      if (oldDevice.userId) {
        const oldUser = this.getUserById(oldDevice.userId);
        if (oldUser) {
          oldUser.deviceIds = oldUser.deviceIds.filter((deviceId) => deviceId !== id);
        }
      }

      // Add to new user
      if (updatedDevice.userId) {
        const newUser = this.getUserById(updatedDevice.userId);
        if (newUser && !newUser.deviceIds.includes(id)) {
          newUser.deviceIds.push(id);
        }
      }
    }

    this.devices[index] = updatedDevice;
    await this.saveData();
    return updatedDevice;
  }

  async deleteDevice(id: string): Promise<void> {
    const index = this.devices.findIndex((device) => device.id === id);
    if (index === -1) throw new Error('Device not found');

    const device = this.devices[index];

    // Remove from group
    if (device.groupId) {
      const group = this.getGroupById(device.groupId);
      if (group) {
        group.deviceIds = group.deviceIds.filter((deviceId) => deviceId !== id);
      }
    }

    // Remove from user
    if (device.userId) {
      const user = this.getUserById(device.userId);
      if (user) {
        user.deviceIds = user.deviceIds.filter((deviceId) => deviceId !== id);
      }
    }

    this.devices.splice(index, 1);
    await this.saveData();
  }
}

// Exporta uma instância única do banco de dados
export const db = new Database();

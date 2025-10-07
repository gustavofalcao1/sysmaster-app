import {
  CreateUserInput,
  UpdateUserInput,
  CreateGroupInput,
  UpdateGroupInput,
  CreateDeviceInput,
  UpdateDeviceInput,
  FilterOptions,
  SortOptions,
} from '@/types';
import { prisma } from './prisma';
import { Prisma } from '@prisma/client';

// Helper function to get base URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') return ''; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

class Database {
  // Users
  async getUsers(filters?: FilterOptions, sort?: SortOptions) {
    try {
      return await prisma.user.findMany({
        include: {
          devices: true,
        },
        orderBy: sort?.field ? {
          [sort.field]: sort.direction,
        } : undefined,
        where: filters ? {
          OR: [
            { name: { contains: filters.search } },
            { username: { contains: filters.search } },
          ],
        } : undefined,
      });
    } catch (error) {
      console.error('Error loading users:', error);
      return [];
    }
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        devices: true,
      },
    });
  }

  async createUser(input: CreateUserInput) {
    const userData: Prisma.UserCreateInput = {
      name: input.name,
      username: input.username,
      password: input.password,
      role: input.role,
      devices: {
        create: [],
      },
    };

    return await prisma.user.create({
      data: userData,
      include: {
        devices: true,
      },
    });
  }

  async updateUser(id: string, input: UpdateUserInput) {
    return await prisma.user.update({
      where: { id },
      data: input,
      include: {
        devices: true,
      },
    });
  }

  async deleteUser(id: string) {
    await prisma.user.delete({
      where: { id },
    });
  }

  // Groups
  async getGroups(filters?: FilterOptions, sort?: SortOptions) {
    try {
      return await prisma.group.findMany({
        include: {
          devices: true,
        },
        orderBy: sort?.field ? {
          [sort.field]: sort.direction,
        } : undefined,
        where: filters ? {
          OR: [
            { name: { contains: filters.search } },
            { location: { contains: filters.search } },
          ],
        } : undefined,
      });
    } catch (error) {
      console.error('Error loading groups:', error);
      return [];
    }
  }

  async getGroupById(id: string) {
    return await prisma.group.findUnique({
      where: { id },
      include: {
        devices: true,
      },
    });
  }

  async createGroup(input: CreateGroupInput) {
    const groupData: Prisma.GroupCreateInput = {
      name: input.name,
      location: input.location,
      prefix: input.prefix,
      devices: {
        create: [],
      },
    };

    return await prisma.group.create({
      data: groupData,
      include: {
        devices: true,
      },
    });
  }

  async updateGroup(id: string, input: UpdateGroupInput) {
    return await prisma.group.update({
      where: { id },
      data: input,
      include: {
        devices: true,
      },
    });
  }

  async deleteGroup(id: string) {
    await prisma.group.delete({
      where: { id },
    });
  }

  // Devices
  async getDevices(filters?: FilterOptions, sort?: SortOptions) {
    try {
      return await prisma.device.findMany({
        include: {
          user: true,
          group: true,
        },
        orderBy: sort?.field ? {
          [sort.field]: sort.direction,
        } : undefined,
        where: filters ? {
          OR: [
            { name: { contains: filters.search } },
            { displayName: { contains: filters.search } },
            { ipAddress: { contains: filters.search } },
            { macAddress: { contains: filters.search } },
          ],
        } : undefined,
      });
    } catch (error) {
      console.error('Error loading devices:', error);
      return [];
    }
  }

  async getDeviceById(id: string) {
    return await prisma.device.findUnique({
      where: { id },
      include: {
        user: true,
        group: true,
      },
    });
  }

  async createDevice(input: CreateDeviceInput) {
    const deviceData: Prisma.DeviceCreateInput = {
      name: input.name,
      displayName: input.name,
      ipAddress: input.ipAddress,
      macAddress: input.macAddress,
      status: input.status,
      lastActive: input.lastActive,
      specs: input.specs || {},
      user: {
        connect: { id: input.userId || (await this.getDefaultUser()).id }
      },
      group: {
        connect: { id: input.groupId || (await this.getDefaultGroup()).id }
      },
    };

    return await prisma.device.create({
      data: deviceData,
      include: {
        user: true,
        group: true,
      },
    });
  }

  private async getDefaultUser() {
    const defaultUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (!defaultUser) {
      return await prisma.user.create({
        data: {
          name: 'Admin',
          username: 'admin',
          password: 'admin123',
          role: 'admin',
        }
      });
    }

    return defaultUser;
  }

  private async getDefaultGroup() {
    const defaultGroup = await prisma.group.findFirst();

    if (!defaultGroup) {
      return await prisma.group.create({
        data: {
          name: 'Default Group',
          location: 'Default Location',
          prefix: 'DEF',
        }
      });
    }

    return defaultGroup;
  }

  async updateDevice(id: string, input: UpdateDeviceInput) {
    const updateData: Prisma.DeviceUpdateInput = {
      ...input,
      user: input.userId ? {
        connect: { id: input.userId }
      } : undefined,
      group: input.groupId ? {
        connect: { id: input.groupId }
      } : undefined,
    };

    return await prisma.device.update({
      where: { id },
      data: updateData,
      include: {
        user: true,
        group: true,
      },
    });
  }

  async deleteDevice(id: string) {
    await prisma.device.delete({
      where: { id },
    });
  }
}

export const db = new Database();

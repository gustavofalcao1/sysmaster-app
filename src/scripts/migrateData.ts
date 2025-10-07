import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function migrateData() {
  try {
    // Read JSON files
    const usersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/users.json'), 'utf-8'));
    const groupsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/groups.json'), 'utf-8'));
    const devicesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/devices.json'), 'utf-8'));

    // Migrate Groups
    console.log('Migrating groups...');
    for (const group of groupsData.groups) {
      await prisma.group.create({
        data: {
          id: group.id,
          name: group.name,
          location: group.location,
          prefix: group.prefix,
          createdAt: new Date(group.createdAt),
          updatedAt: new Date(group.updatedAt),
        },
      });
    }

    // Migrate Users
    console.log('Migrating users...');
    for (const user of usersData.users) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          username: user.username,
          password: user.password,
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      });
    }

    // Migrate Devices
    console.log('Migrating devices...');
    for (const device of devicesData.devices) {
      await prisma.device.create({
        data: {
          id: device.id,
          name: device.name,
          displayName: device.displayName,
          ipAddress: device.ipAddress,
          macAddress: device.macAddress,
          status: device.status,
          lastActive: new Date(device.lastActive),
          createdAt: new Date(device.createdAt),
          updatedAt: new Date(device.updatedAt),
          specs: device.specs || {},
          userId: device.userId || (await prisma.user.findFirst()).id,
          groupId: device.groupId,
        },
      });
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();

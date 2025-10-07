import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const id = searchParams.get('id');

    if (!entity) {
      return NextResponse.json({ error: 'Entity parameter is required' }, { status: 400 });
    }

    let data;
    switch (entity) {
      case 'users':
        data = id
          ? await prisma.user.findUnique({ where: { id }, include: { devices: true } })
          : await prisma.user.findMany({ include: { devices: true } });
        break;
      case 'groups':
        data = id
          ? await prisma.group.findUnique({ where: { id }, include: { devices: true } })
          : await prisma.group.findMany({ include: { devices: true } });
        break;
      case 'devices':
        data = id
          ? await prisma.device.findUnique({ where: { id }, include: { user: true, group: true } })
          : await prisma.device.findMany({ include: { user: true, group: true } });
        break;
      default:
        return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { entity, data } = await request.json();

    if (!entity || !data) {
      return NextResponse.json(
        { error: 'Entity and data parameters are required' },
        { status: 400 }
      );
    }

    let result;
    switch (entity) {
      case 'users':
        result = await prisma.user.create({
          data,
          include: { devices: true },
        });
        break;
      case 'groups':
        result = await prisma.group.create({
          data,
          include: { devices: true },
        });
        break;
      case 'devices':
        result = await prisma.device.create({
          data,
          include: { user: true, group: true },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error writing data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const id = searchParams.get('id');
    const data = await request.json();

    if (!entity || !id || !data) {
      return NextResponse.json(
        { error: 'Entity, ID and data parameters are required' },
        { status: 400 }
      );
    }

    let result;
    switch (entity) {
      case 'users':
        result = await prisma.user.update({
          where: { id },
          data,
          include: { devices: true },
        });
        break;
      case 'groups':
        result = await prisma.group.update({
          where: { id },
          data,
          include: { devices: true },
        });
        break;
      case 'devices':
        result = await prisma.device.update({
          where: { id },
          data,
          include: { user: true, group: true },
        });
        break;
      default:
        return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error updating data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    const id = searchParams.get('id');

    if (!entity || !id) {
      return NextResponse.json(
        { error: 'Entity and ID parameters are required' },
        { status: 400 }
      );
    }

    switch (entity) {
      case 'users':
        await prisma.user.delete({ where: { id } });
        break;
      case 'groups':
        await prisma.group.delete({ where: { id } });
        break;
      case 'devices':
        await prisma.device.delete({ where: { id } });
        break;
      default:
        return NextResponse.json({ error: 'Invalid entity type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { readJsonFile, writeJsonFile } from '@/lib/database.api';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');

    if (!entity) {
      return NextResponse.json({ error: 'Entity parameter is required' }, { status: 400 });
    }

    const data = await readJsonFile(`${entity}.json`);
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

    await writeJsonFile(`${entity}.json`, data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error writing data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

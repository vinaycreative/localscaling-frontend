import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJwt } from '@/lib/auth/jwt';

export async function GET() {
  const jar = await cookies();
  const token = jar.get('access_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const payload = await verifyJwt(token);
  if (!payload) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const user = {
    id: payload.sub,
    name: payload.name,
    email: payload.email,
    role: payload.role,
  };
  return NextResponse.json({ user });
}



import { NextResponse } from 'next/server';
import { signJwt } from '@/lib/auth/jwt';
import { Role } from '@/constants/auth';

type LoginBody = { email: string; password: string };

function resolveRoleByEmail(email: string) {
  const lower = email.toLowerCase();
  if (lower.startsWith('admin')) return Role.ADMIN;
  if (lower.startsWith('support.head')) return Role.SUPPORT_HEAD_ADMIN;
  if (lower.startsWith('support.admin')) return Role.SUPPORT_ADMIN;
  return Role.CLIENT;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as LoginBody;
    if (!body?.email || !body?.password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Testing-only auth: accept password === 'password'
    if (body.password !== 'password') {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const role = resolveRoleByEmail(body.email);
    const user = {
      id: 'user-' + Buffer.from(body.email).toString('hex').slice(0, 12),
      name: body.email.split('@')[0],
      email: body.email,
      role,
    } as const;

    const token = await signJwt({
      sub: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const res = NextResponse.json({ user });
    res.cookies.set('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 15,
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}



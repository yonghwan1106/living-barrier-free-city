import { NextResponse } from 'next/server';
import { findRows } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';

export async function GET() {
  try {
    // Find all demo accounts
    const demoUsers = await findRows(
      SHEET_NAMES.USERS,
      (row) => String(row.email).includes('@barrierfree.local')
    );

    // Return simplified user info
    const accounts = demoUsers.map((user) => ({
      email: String(user.email),
      name: String(user.name || ''),
      nickname: String(user.nickname || ''),
      level: Number(user.level || 1),
      xp: Number(user.xp || 0),
    }));

    return NextResponse.json({ accounts });
  } catch (error) {
    console.error('Error fetching demo accounts:', error);
    return NextResponse.json(
      { error: '데모 계정 목록을 가져올 수 없습니다.', details: String(error) },
      { status: 500 }
    );
  }
}

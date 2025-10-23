import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { findRows, updateRowById } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';

/**
 * POST /api/teams/join
 * Join a team
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { team_id } = body;

    if (!team_id) {
      return NextResponse.json(
        { error: 'Missing team_id' },
        { status: 400 }
      );
    }

    // 팀 정보 가져오기
    const teams = await findRows(
      SHEET_NAMES.TEAMS,
      (row) => row.team_id === team_id
    );

    if (teams.length === 0) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      );
    }

    const team = teams[0];

    // 이미 팀원인지 확인
    const memberIds = Array.isArray(team.member_ids) ? team.member_ids as string[] : [];
    if (memberIds.includes(session.user.id)) {
      return NextResponse.json(
        { error: 'You are already a member of this team' },
        { status: 400 }
      );
    }

    // 멤버 추가
    const updatedMemberIds = [...memberIds, session.user.id];

    await updateRowById(SHEET_NAMES.TEAMS, 'team_id', team_id, {
      member_ids: updatedMemberIds,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: 'Successfully joined the team',
      team: {
        ...team,
        member_ids: updatedMemberIds,
      },
    });
  } catch (error) {
    console.error('Error joining team:', error);
    return NextResponse.json(
      { error: 'Failed to join team' },
      { status: 500 }
    );
  }
}

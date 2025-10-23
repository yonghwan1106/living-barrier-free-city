import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { v4 as uuidv4 } from 'uuid';
import { getAllRows, findRows, appendRow, objectToValues, updateRowById } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';
import type { Team } from '@/types';

/**
 * GET /api/teams
 * Get all teams or search teams
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const user_id = searchParams.get('user_id');

    let teams = await getAllRows(SHEET_NAMES.TEAMS);

    // 사용자의 팀만 필터링
    if (user_id) {
      teams = teams.filter((team: Team) =>
        team.member_ids && team.member_ids.includes(user_id)
      );
    }

    // 검색어로 필터링
    if (search) {
      const searchLower = search.toLowerCase();
      teams = teams.filter((team: Team) =>
        team.name.toLowerCase().includes(searchLower) ||
        team.description?.toLowerCase().includes(searchLower)
      );
    }

    // 팀 정렬 (멤버 수 기준)
    teams.sort((a: Team, b: Team) => {
      const aMembers = a.member_ids?.length || 0;
      const bMembers = b.member_ids?.length || 0;
      return bMembers - aMembers;
    });

    return NextResponse.json({
      success: true,
      data: teams,
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/teams
 * Create a new team
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
    const { name, description, is_public } = body;

    // Validation
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Team name is required' },
        { status: 400 }
      );
    }

    if (name.length > 50) {
      return NextResponse.json(
        { error: 'Team name must be 50 characters or less' },
        { status: 400 }
      );
    }

    // 중복 팀명 확인
    const existingTeams = await findRows(
      SHEET_NAMES.TEAMS,
      (row) => row.name.toLowerCase() === name.toLowerCase().trim()
    );

    if (existingTeams.length > 0) {
      return NextResponse.json(
        { error: 'A team with this name already exists' },
        { status: 400 }
      );
    }

    const newTeam: Team = {
      team_id: uuidv4(),
      name: name.trim(),
      description: description?.trim() || '',
      leader_id: session.user.id,
      member_ids: [session.user.id],
      total_xp: 0,
      level: 1,
      is_public: is_public !== false, // 기본값 true
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const values = await objectToValues(SHEET_NAMES.TEAMS, newTeam);
    await appendRow(SHEET_NAMES.TEAMS, values);

    return NextResponse.json({
      success: true,
      data: newTeam,
      message: 'Team created successfully',
    });
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}

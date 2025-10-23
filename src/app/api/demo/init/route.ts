import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { appendRow, findRows, objectToValues } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';
import type { User, Report, Team, BarrierCategory, PraiseCategory } from '@/types';

// Demo user configurations
const DEMO_USERS = [
  {
    email: 'demo1@barrierfree.local',
    name: '김민준',
    nickname: '접근성지킴이',
    xp: 850,
    level: 9,
    titles: ['초보 리포터', '장벽 헌터'],
  },
  {
    email: 'demo2@barrierfree.local',
    name: '이서연',
    nickname: '배리어프리여왕',
    xp: 450,
    level: 5,
    titles: ['첫 걸음'],
  },
  {
    email: 'demo3@barrierfree.local',
    name: '박지호',
    nickname: '도시탐험가',
    xp: 1200,
    level: 12,
    titles: ['베테랑', '문제 해결사'],
  },
];

// Sample report locations in 경기도
const SAMPLE_LOCATIONS = [
  { lat: 37.4563, lng: 126.7052, address: '경기 부천시 원미구 중동로 198', city: '부천시' },
  { lat: 37.2636, lng: 127.0286, address: '경기 수원시 팔달구 정조로 825', city: '수원시' },
  { lat: 37.6543, lng: 127.0618, address: '경기 의정부시 평화로 525', city: '의정부시' },
  { lat: 37.3895, lng: 126.9504, address: '경기 안양시 만안구 문화광장로 36', city: '안양시' },
  { lat: 37.5383, lng: 127.2624, address: '경기 남양주시 다산중앙로 20길 25', city: '남양주시' },
  { lat: 37.3414, lng: 126.7333, address: '경기 시흥시 중심상가로 59', city: '시흥시' },
  { lat: 37.4138, lng: 127.1277, address: '경기 성남시 분당구 성남대로 801', city: '성남시' },
  { lat: 37.6584, lng: 126.8320, address: '경기 고양시 덕양구 화정로 82', city: '고양시' },
];

// Sample barrier categories and descriptions
const BARRIER_SAMPLES: Array<{ category: BarrierCategory; description: string }> = [
  { category: 'no_ramp', description: '지하철역 입구에 경사로가 없어 휠체어 이용이 어렵습니다.' },
  { category: 'blocked_sidewalk', description: '상가 통로가 좁아서 휠체어나 유모차 통행이 불편합니다.' },
  { category: 'restroom_issue', description: '장애인 화장실이 물건 창고로 사용되고 있습니다.' },
  { category: 'damaged_ramp', description: '경사로가 파손되어 이용이 어렵습니다.' },
  { category: 'damaged_tactile_paving', description: '점자 블록이 파손되어 시각장애인이 이용하기 어렵습니다.' },
  { category: 'elevator_issue', description: '엘리베이터가 고장났는데 수리가 안 되고 있습니다.' },
  { category: 'signage_issue', description: '점자 안내판이 파손되어 시각장애인이 이용하기 어렵습니다.' },
  { category: 'high_threshold', description: '출입구 턱이 높아 휠체어 진입이 어렵습니다.' },
];

const PRAISE_SAMPLES: Array<{ category: PraiseCategory; description: string }> = [
  { category: 'good_ramp', description: '새로 설치된 경사로가 매우 편리합니다!' },
  { category: 'clean_restroom', description: '장애인 화장실이 깨끗하고 넓어서 좋습니다.' },
  { category: 'good_voice_guide', description: '음성 안내가 잘 되어 있어 시각장애인도 쉽게 이용할 수 있습니다.' },
  { category: 'friendly_staff', description: '직원분이 매우 친절하게 도와주셨습니다.' },
  { category: 'wide_passage', description: '통로가 넓어서 휠체어 이동이 편리합니다.' },
];

export async function POST() {
  try {
    // Check if demo data already exists
    const existingDemoUsers = await findRows(
      SHEET_NAMES.USERS,
      (row) => String(row.email).includes('@barrierfree.local')
    );

    if (existingDemoUsers.length > 0) {
      return NextResponse.json(
        { message: '데모 데이터가 이미 존재합니다. 기존 데이터를 사용하세요.' },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    const createdUsers: User[] = [];
    const createdReports: Report[] = [];

    // Create demo users
    for (const demoConfig of DEMO_USERS) {
      const user: User = {
        user_id: uuidv4(),
        email: demoConfig.email,
        name: demoConfig.name,
        nickname: demoConfig.nickname,
        provider: 'google', // Use google as placeholder for demo accounts
        avatar_items: [],
        xp: demoConfig.xp,
        level: demoConfig.level,
        titles: demoConfig.titles,
        created_at: now,
        last_login: now,
      };

      const values = await objectToValues(SHEET_NAMES.USERS, user as unknown as Record<string, unknown>);
      await appendRow(SHEET_NAMES.USERS, values);
      createdUsers.push(user);
    }

    // Create sample reports for each user
    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const numReports = 5 + Math.floor(Math.random() * 8); // 5-12 reports per user

      for (let j = 0; j < numReports; j++) {
        const isBarrier = Math.random() > 0.3; // 70% barriers, 30% praise
        const location = SAMPLE_LOCATIONS[Math.floor(Math.random() * SAMPLE_LOCATIONS.length)];

        const sample = isBarrier
          ? BARRIER_SAMPLES[Math.floor(Math.random() * BARRIER_SAMPLES.length)]
          : PRAISE_SAMPLES[Math.floor(Math.random() * PRAISE_SAMPLES.length)];

        // Random date within last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const reportDate = new Date();
        reportDate.setDate(reportDate.getDate() - daysAgo);

        const report: Report = {
          report_id: uuidv4(),
          user_id: user.user_id,
          type: isBarrier ? 'barrier' : 'praise',
          category: sample.category,
          description: sample.description,
          latitude: location.lat,
          longitude: location.lng,
          address: location.address,
          city: location.city,
          district: '', // Not specified in sample data
          media_urls: [], // No images for demo data
          ai_analysis: {
            detected_category: sample.category,
            severity: isBarrier ? (['low', 'medium', 'high'] as const)[Math.floor(Math.random() * 3)] : undefined,
            description: sample.description,
            tags: isBarrier ? ['접근성', '장애물'] : ['친절', '접근가능'],
          },
          confidence_score: 0.85 + Math.random() * 0.15, // 0.85 to 1.0
          status: Math.random() > 0.7 ? 'resolved' : 'active', // 30% resolved
          verify_count: Math.floor(Math.random() * 10),
          admin_status: 'pending',
          created_at: reportDate.toISOString(),
          updated_at: reportDate.toISOString(),
        };

        const reportValues = await objectToValues(SHEET_NAMES.REPORTS, report as unknown as Record<string, unknown>);
        await appendRow(SHEET_NAMES.REPORTS, reportValues);
        createdReports.push(report);
      }
    }

    // Create a demo team
    const demoTeam: Team = {
      team_id: uuidv4(),
      name: '경기도 배리어프리 선구자',
      description: '경기도 전역의 접근성을 개선하는 시민 모임입니다.',
      leader_id: createdUsers[0].user_id,
      member_ids: createdUsers.map(u => u.user_id),
      total_xp: createdUsers.reduce((sum, u) => sum + u.xp, 0),
      level: Math.floor(createdUsers.reduce((sum, u) => sum + u.xp, 0) / 1000), // 1000 XP per level
      is_public: true,
      created_at: now,
      updated_at: now,
    };

    const teamValues = await objectToValues(SHEET_NAMES.TEAMS, demoTeam as unknown as Record<string, unknown>);
    await appendRow(SHEET_NAMES.TEAMS, teamValues);

    return NextResponse.json({
      message: '데모 데이터 생성 완료',
      data: {
        users: createdUsers.length,
        reports: createdReports.length,
        teams: 1,
      },
    });
  } catch (error) {
    console.error('Error creating demo data:', error);
    return NextResponse.json(
      { error: '데모 데이터 생성 실패', details: String(error) },
      { status: 500 }
    );
  }
}

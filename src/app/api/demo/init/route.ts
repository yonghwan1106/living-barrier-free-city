import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { appendRow, appendRows, findRows, objectToValues, getSheetHeaders } from '@/lib/google-sheets/operations';
import { SHEET_NAMES } from '@/lib/google-sheets/client';
import type { User, Report, Team, BarrierCategory, PraiseCategory } from '@/types';

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

// Sample report locations in 경기도 (확장된 50+ 위치)
const SAMPLE_LOCATIONS = [
  // 수원시 (10개) - 수원시는 대략 37.26~37.30, 126.98~127.06
  { lat: 37.2636, lng: 127.0286, address: '경기 수원시 팔달구 정조로 825', city: '수원시' },
  { lat: 37.2795, lng: 127.0176, address: '경기 수원시 장안구 경수대로 893', city: '수원시' },
  { lat: 37.2571, lng: 127.0007, address: '경기 수원시 권선구 세류로 180', city: '수원시' },
  { lat: 37.2981, lng: 127.0553, address: '경기 수원시 영통구 광교로 107', city: '수원시' },
  { lat: 37.2663, lng: 127.0354, address: '경기 수원시 팔달구 수원천로 392', city: '수원시' },
  { lat: 37.2883, lng: 127.0391, address: '경기 수원시 장안구 송죽동 456', city: '수원시' },
  { lat: 37.2514, lng: 127.0155, address: '경기 수원시 권선구 구운로 1', city: '수원시' },
  { lat: 37.3012, lng: 127.0733, address: '경기 수원시 영통구 이의동 1325', city: '수원시' },
  { lat: 37.2821, lng: 127.0099, address: '경기 수원시 장안구 조원동 775', city: '수원시' },
  { lat: 37.2738, lng: 127.0447, address: '경기 수원시 팔달구 인계동 1117', city: '수원시' },

  // 성남시 (8개)
  { lat: 37.4138, lng: 127.1277, address: '경기 성남시 분당구 성남대로 801', city: '성남시' },
  { lat: 37.4201, lng: 127.1276, address: '경기 성남시 분당구 황새울로 200', city: '성남시' },
  { lat: 37.3894, lng: 127.1217, address: '경기 성남시 수정구 태평로 55', city: '성남시' },
  { lat: 37.4335, lng: 127.1378, address: '경기 성남시 분당구 정자동 178', city: '성남시' },
  { lat: 37.4491, lng: 127.1458, address: '경기 성남시 분당구 백현동 541', city: '성남시' },
  { lat: 37.3782, lng: 127.1145, address: '경기 성남시 중원구 성남대로 997', city: '성남시' },
  { lat: 37.4423, lng: 127.1175, address: '경기 성남시 분당구 서현동 256', city: '성남시' },
  { lat: 37.3987, lng: 127.1063, address: '경기 성남시 수정구 신흥동 3378', city: '성남시' },

  // 고양시 (7개)
  { lat: 37.6584, lng: 126.8320, address: '경기 고양시 덕양구 화정로 82', city: '고양시' },
  { lat: 37.6395, lng: 126.8326, address: '경기 고양시 일산동구 중앙로 1261', city: '고양시' },
  { lat: 37.6682, lng: 126.7778, address: '경기 고양시 일산서구 주엽동 75', city: '고양시' },
  { lat: 37.6913, lng: 126.8354, address: '경기 고양시 일산동구 장항동 869', city: '고양시' },
  { lat: 37.6590, lng: 126.8930, address: '경기 고양시 덕양구 원흥동 633', city: '고양시' },
  { lat: 37.6557, lng: 126.7682, address: '경기 고양시 일산서구 탄현동 1548', city: '고양시' },
  { lat: 37.6729, lng: 126.8456, address: '경기 고양시 일산동구 백석동 1256', city: '고양시' },

  // 부천시 (6개)
  { lat: 37.4563, lng: 126.7052, address: '경기 부천시 원미구 중동로 198', city: '부천시' },
  { lat: 37.5035, lng: 126.7660, address: '경기 부천시 소사구 경인로 736', city: '부천시' },
  { lat: 37.4849, lng: 126.7831, address: '경기 부천시 원미구 상동 546', city: '부천시' },
  { lat: 37.4981, lng: 126.7196, address: '경기 부천시 오정구 오정로 272', city: '부천시' },
  { lat: 37.5134, lng: 126.7453, address: '경기 부천시 소사구 소사로 482', city: '부천시' },
  { lat: 37.4891, lng: 126.7234, address: '경기 부천시 원미구 춘의동 192', city: '부천시' },

  // 안산시 (5개)
  { lat: 37.3219, lng: 126.8309, address: '경기 안산시 단원구 광덕대로 195', city: '안산시' },
  { lat: 37.3064, lng: 126.8585, address: '경기 안산시 상록구 안산대학로 155', city: '안산시' },
  { lat: 37.2914, lng: 126.8204, address: '경기 안산시 단원구 원곡동 847', city: '안산시' },
  { lat: 37.3375, lng: 126.8572, address: '경기 안산시 상록구 본오동 701', city: '안산시' },
  { lat: 37.3158, lng: 126.8413, address: '경기 안산시 단원구 고잔동 541', city: '안산시' },

  // 용인시 (5개)
  { lat: 37.2411, lng: 127.1776, address: '경기 용인시 기흥구 중부대로 242', city: '용인시' },
  { lat: 37.2747, lng: 127.2093, address: '경기 용인시 수지구 풍덕천로 152', city: '용인시' },
  { lat: 37.1919, lng: 127.0777, address: '경기 용인시 처인구 금학로 209', city: '용인시' },
  { lat: 37.2574, lng: 127.1842, address: '경기 용인시 기흥구 신갈동 231', city: '용인시' },
  { lat: 37.3012, lng: 127.2547, address: '경기 용인시 수지구 죽전동 1330', city: '용인시' },

  // 남양주시 (4개)
  { lat: 37.6385, lng: 127.2146, address: '경기 남양주시 다산중앙로 20길 25', city: '남양주시' },
  { lat: 37.6865, lng: 127.2048, address: '경기 남양주시 진접읍 금강로 1095', city: '남양주시' },
  { lat: 37.6577, lng: 127.0966, address: '경기 남양주시 별내동 192', city: '남양주시' },
  { lat: 37.7458, lng: 127.2731, address: '경기 남양주시 화도읍 묵현리 356', city: '남양주시' },

  // 화성시 (4개)
  { lat: 37.1990, lng: 126.8312, address: '경기 화성시 봉담읍 동화길 37', city: '화성시' },
  { lat: 37.2031, lng: 127.0017, address: '경기 화성시 동탄대로 636', city: '화성시' },
  { lat: 37.2225, lng: 126.9841, address: '경기 화성시 병점중앙로 140', city: '화성시' },
  { lat: 37.1564, lng: 126.7012, address: '경기 화성시 향남읍 토성로 123', city: '화성시' },

  // 기타 도시들
  { lat: 37.7381, lng: 127.0478, address: '경기 의정부시 평화로 525', city: '의정부시' },
  { lat: 37.3947, lng: 126.9218, address: '경기 안양시 만안구 문화광장로 36', city: '안양시' },
  { lat: 37.3799, lng: 126.8030, address: '경기 시흥시 중심상가로 59', city: '시흥시' },
  { lat: 37.4194, lng: 126.8743, address: '경기 광명시 오리로 613', city: '광명시' },
  { lat: 37.7380, lng: 127.0336, address: '경기 의정부시 의정부동 234', city: '의정부시' },
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

    // Cache headers to avoid repeated API calls (1 read instead of 3+45-72)
    console.log('Fetching sheet headers...');
    const usersHeaders = await getSheetHeaders(SHEET_NAMES.USERS);
    const reportsHeaders = await getSheetHeaders(SHEET_NAMES.REPORTS);
    const teamsHeaders = await getSheetHeaders(SHEET_NAMES.TEAMS);
    console.log('Headers cached successfully');

    // Create demo users (collect all user data first)
    const userRows: unknown[][] = [];
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

      const values = await objectToValues(SHEET_NAMES.USERS, user as unknown as Record<string, unknown>, usersHeaders);
      userRows.push(values);
      createdUsers.push(user);
    }

    // Batch append all users at once (1 API call instead of 3)
    await appendRows(SHEET_NAMES.USERS, userRows);
    console.log(`Created ${createdUsers.length} demo users in batch`);

    // Create sample reports for each user (collect all first, then batch append)
    const allReportRows: unknown[][] = [];

    for (let i = 0; i < createdUsers.length; i++) {
      const user = createdUsers[i];
      const numReports = 15 + Math.floor(Math.random() * 10); // 15-24 reports per user (총 45-72개)

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

        const reportValues = await objectToValues(SHEET_NAMES.REPORTS, report as unknown as Record<string, unknown>, reportsHeaders);
        allReportRows.push(reportValues);
        createdReports.push(report);
      }
    }

    // Batch append reports in chunks of 20 to avoid rate limits
    const BATCH_SIZE = 20;
    for (let i = 0; i < allReportRows.length; i += BATCH_SIZE) {
      const batch = allReportRows.slice(i, i + BATCH_SIZE);
      await appendRows(SHEET_NAMES.REPORTS, batch);
      console.log(`Created batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} reports`);

      // Add a 1-second delay between batches to avoid rate limits
      if (i + BATCH_SIZE < allReportRows.length) {
        await delay(1000);
      }
    }
    console.log(`Created ${createdReports.length} total reports in ${Math.ceil(allReportRows.length / BATCH_SIZE)} batches`);

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

    const teamValues = await objectToValues(SHEET_NAMES.TEAMS, demoTeam as unknown as Record<string, unknown>, teamsHeaders);
    await appendRow(SHEET_NAMES.TEAMS, teamValues);

    // Create sample quests by calling the quest init endpoint
    try {
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/quests/init-sample`, {
        method: 'POST',
      });
      console.log('Sample quests created');
    } catch (questError) {
      console.error('Error creating sample quests:', questError);
      // Continue even if quest creation fails
    }

    return NextResponse.json({
      message: '데모 데이터 생성 완료',
      data: {
        users: createdUsers.length,
        reports: createdReports.length,
        teams: 1,
        quests: 'initialized',
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

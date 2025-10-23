import { google } from 'googleapis';

// Google Sheets 클라이언트 초기화
export function getGoogleSheetsClient() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;

  if (!privateKey || !clientEmail) {
    throw new Error('Google Sheets credentials are not configured');
  }

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

// 시트 이름 상수
export const SHEET_NAMES = {
  USERS: 'Users',
  REPORTS: 'Reports',
  VERIFICATIONS: 'Verifications',
  QUESTS: 'Quests',
  USER_QUESTS: 'UserQuests',
  TEAMS: 'Teams',
  NOTIFICATIONS: 'Notifications',
} as const;

// 헤더 정의
export const HEADERS = {
  USERS: [
    'user_id',
    'email',
    'name',
    'nickname',
    'provider',
    'avatar_items',
    'accessibility_profile',
    'xp',
    'level',
    'titles',
    'team_id',
    'created_at',
    'last_login',
  ],
  REPORTS: [
    'report_id',
    'user_id',
    'type',
    'category',
    'latitude',
    'longitude',
    'address',
    'city',
    'district',
    'description',
    'media_urls',
    'ai_analysis',
    'confidence_score',
    'verify_count',
    'status',
    'resolved_by',
    'resolved_at',
    'admin_status',
    'admin_note',
    'created_at',
    'updated_at',
  ],
  VERIFICATIONS: [
    'verification_id',
    'report_id',
    'user_id',
    'type',
    'media_urls',
    'comment',
    'created_at',
  ],
  QUESTS: [
    'quest_id',
    'type',
    'title',
    'description',
    'target_count',
    'xp_reward',
    'point_reward',
    'start_date',
    'end_date',
    'status',
    'created_at',
  ],
  USER_QUESTS: [
    'user_quest_id',
    'user_id',
    'quest_id',
    'progress',
    'is_completed',
    'completed_at',
    'claimed_reward',
  ],
  TEAMS: [
    'team_id',
    'name',
    'description',
    'leader_id',
    'member_ids',
    'total_xp',
    'level',
    'is_public',
    'created_at',
    'updated_at',
  ],
  NOTIFICATIONS: [
    'notification_id',
    'user_id',
    'type',
    'title',
    'message',
    'link',
    'is_read',
    'created_at',
  ],
} as const;

// 초기 시트 설정 함수
export async function initializeSheets() {
  const sheets = getGoogleSheetsClient();

  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID is not configured');
  }

  try {
    // 각 시트 확인 및 생성
    for (const [key, sheetName] of Object.entries(SHEET_NAMES)) {
      const headerKey = key as keyof typeof HEADERS;
      const headers = HEADERS[headerKey];

      try {
        // 시트가 존재하는지 확인
        await sheets.spreadsheets.values.get({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1:Z1`,
        });
      } catch (error) {
        // 시트가 없으면 생성
        console.log(`Creating sheet: ${sheetName}`);

        // 시트 추가
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId: SPREADSHEET_ID,
          requestBody: {
            requests: [{
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            }],
          },
        });

        // 헤더 추가
        await sheets.spreadsheets.values.update({
          spreadsheetId: SPREADSHEET_ID,
          range: `${sheetName}!A1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[...headers]],
          },
        });
      }
    }

    console.log('Sheets initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing sheets:', error);
    throw error;
  }
}

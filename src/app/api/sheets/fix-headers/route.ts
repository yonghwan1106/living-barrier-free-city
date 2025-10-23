import { NextResponse } from 'next/server';
import { getGoogleSheetsClient, SPREADSHEET_ID, HEADERS, SHEET_NAMES } from '@/lib/google-sheets/client';

/**
 * POST /api/sheets/fix-headers
 * Automatically fix Google Sheets headers to match TypeScript types
 */
export async function POST() {
  try {
    const sheets = getGoogleSheetsClient();

    if (!SPREADSHEET_ID) {
      throw new Error('SPREADSHEET_ID is not configured');
    }

    const results: Record<string, string> = {};

    // Update Quests sheet header
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAMES.QUESTS}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[...HEADERS.QUESTS]],
        },
      });
      results.quests = 'Updated successfully';
    } catch (error) {
      results.quests = `Error: ${String(error)}`;
    }

    // Update Teams sheet header
    try {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAMES.TEAMS}!A1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[...HEADERS.TEAMS]],
        },
      });
      results.teams = 'Updated successfully';
    } catch (error) {
      results.teams = `Error: ${String(error)}`;
    }

    return NextResponse.json({
      message: '헤더가 업데이트되었습니다.',
      results,
    });
  } catch (error) {
    console.error('Error fixing headers:', error);
    return NextResponse.json(
      { error: '헤더 업데이트 실패', details: String(error) },
      { status: 500 }
    );
  }
}

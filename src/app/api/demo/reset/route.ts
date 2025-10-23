import { NextResponse } from 'next/server';
import { findRows } from '@/lib/google-sheets/operations';
import { getGoogleSheetsClient, SHEET_NAMES, SPREADSHEET_ID } from '@/lib/google-sheets/client';

/**
 * Delete all demo data and reset
 */
export async function POST() {
  try {
    const sheets = getGoogleSheetsClient();

    if (!SPREADSHEET_ID) {
      throw new Error('SPREADSHEET_ID is not configured');
    }

    // Get spreadsheet metadata to find actual sheet IDs
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetMap = new Map<string, number>();
    spreadsheet.data.sheets?.forEach((sheet) => {
      const title = sheet.properties?.title;
      const sheetId = sheet.properties?.sheetId;
      if (title && sheetId !== undefined && sheetId !== null) {
        sheetMap.set(title, sheetId);
      }
    });

    console.log('Sheet IDs:', Object.fromEntries(sheetMap));

    // Find all demo users
    const demoUsers = await findRows(
      SHEET_NAMES.USERS,
      (row) => String(row.email).includes('@barrierfree.local')
    );

    if (demoUsers.length === 0) {
      return NextResponse.json({
        message: '삭제할 데모 데이터가 없습니다.',
        deleted: { users: 0, reports: 0, teams: 0, quests: 0 },
      });
    }

    const demoUserIds = demoUsers.map((user) => String(user.user_id));

    // Delete demo users by clearing their rows
    // We need to find row indices and delete them
    // For simplicity, we'll use the API to get all data and filter

    // Get all Users rows
    const usersResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAMES.USERS}!A:Z`,
    });

    const usersRows = usersResponse.data.values || [];
    const deletedUserIndices: number[] = [];

    // Find indices of demo users (skip header row 0)
    usersRows.forEach((row, index) => {
      if (index === 0) return; // Skip header
      const email = row[1]; // Assuming email is in column B (index 1)
      if (email && String(email).includes('@barrierfree.local')) {
        deletedUserIndices.push(index + 1); // +1 for 1-based indexing
      }
    });

    // Delete user rows (in reverse order to maintain indices)
    const usersSheetId = sheetMap.get(SHEET_NAMES.USERS);
    if (usersSheetId === undefined) {
      throw new Error(`Sheet ${SHEET_NAMES.USERS} not found`);
    }

    for (const rowIndex of deletedUserIndices.reverse()) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: usersSheetId,
                  dimension: 'ROWS',
                  startIndex: rowIndex - 1,
                  endIndex: rowIndex,
                },
              },
            },
          ],
        },
      });
    }

    // Delete demo reports
    const reportsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAMES.REPORTS}!A:Z`,
    });

    const reportsRows = reportsResponse.data.values || [];
    const deletedReportIndices: number[] = [];

    reportsRows.forEach((row, index) => {
      if (index === 0) return; // Skip header
      const userId = row[1]; // Assuming user_id is in column B
      if (userId && demoUserIds.includes(String(userId))) {
        deletedReportIndices.push(index + 1);
      }
    });

    const reportsSheetId = sheetMap.get(SHEET_NAMES.REPORTS);
    if (reportsSheetId === undefined) {
      throw new Error(`Sheet ${SHEET_NAMES.REPORTS} not found`);
    }

    for (const rowIndex of deletedReportIndices.reverse()) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: reportsSheetId,
                  dimension: 'ROWS',
                  startIndex: rowIndex - 1,
                  endIndex: rowIndex,
                },
              },
            },
          ],
        },
      });
    }

    // Delete demo teams
    const teamsResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAMES.TEAMS}!A:Z`,
    });

    const teamsRows = teamsResponse.data.values || [];
    const deletedTeamIndices: number[] = [];

    teamsRows.forEach((row, index) => {
      if (index === 0) return; // Skip header
      const teamName = row[1]; // Assuming name is in column B
      if (teamName && String(teamName).includes('경기도 배리어프리 선구자')) {
        deletedTeamIndices.push(index + 1);
      }
    });

    const teamsSheetId = sheetMap.get(SHEET_NAMES.TEAMS);
    if (teamsSheetId === undefined) {
      throw new Error(`Sheet ${SHEET_NAMES.TEAMS} not found`);
    }

    for (const rowIndex of deletedTeamIndices.reverse()) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: teamsSheetId,
                  dimension: 'ROWS',
                  startIndex: rowIndex - 1,
                  endIndex: rowIndex,
                },
              },
            },
          ],
        },
      });
    }

    return NextResponse.json({
      message: '데모 데이터가 삭제되었습니다.',
      deleted: {
        users: deletedUserIndices.length,
        reports: deletedReportIndices.length,
        teams: deletedTeamIndices.length,
      },
    });
  } catch (error) {
    console.error('Error resetting demo data:', error);
    return NextResponse.json(
      { error: '데모 데이터 삭제 실패', details: String(error) },
      { status: 500 }
    );
  }
}

import { getGoogleSheetsClient, SPREADSHEET_ID } from './client';

/**
 * 시트에 데이터 추가
 */
export async function appendRow(sheetName: string, values: unknown[]) {
  const sheets = getGoogleSheetsClient();

  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID is not configured');
  }

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending row:', error);
    throw error;
  }
}

/**
 * 시트에 여러 행 한번에 추가 (배치 작업)
 */
export async function appendRows(sheetName: string, rowsData: unknown[][]) {
  const sheets = getGoogleSheetsClient();

  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID is not configured');
  }

  if (rowsData.length === 0) {
    return;
  }

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:A`,
      valueInputOption: 'RAW',
      requestBody: {
        values: rowsData,
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error appending rows:', error);
    throw error;
  }
}

/**
 * 시트에서 모든 데이터 조회
 */
export async function getAllRows(sheetName: string) {
  const sheets = getGoogleSheetsClient();

  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID is not configured');
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A:Z`,
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return [];
    }

    // 첫 번째 행은 헤더
    const headers = rows[0];
    const data = rows.slice(1);

    // 헤더를 키로 하는 객체 배열로 변환
    return data.map((row) => {
      const obj: Record<string, unknown> = {};
      headers.forEach((header, index) => {
        const value = row[index];

        // JSON 문자열 파싱 시도
        try {
          obj[header] = value ? JSON.parse(value) : value;
        } catch {
          obj[header] = value;
        }
      });
      return obj;
    });
  } catch (error) {
    console.error('Error getting all rows:', error);
    throw error;
  }
}

/**
 * 조건에 맞는 행 찾기
 */
export async function findRows(
  sheetName: string,
  predicate: (row: Record<string, unknown>) => boolean
) {
  const allRows = await getAllRows(sheetName);
  return allRows.filter(predicate);
}

/**
 * 특정 행 업데이트
 */
export async function updateRow(
  sheetName: string,
  rowIndex: number,
  values: unknown[]
) {
  const sheets = getGoogleSheetsClient();

  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID is not configured');
  }

  try {
    // rowIndex는 1-based (헤더를 제외하면 2부터 시작)
    const actualRowIndex = rowIndex + 2;

    const response = await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A${actualRowIndex}`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [values],
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating row:', error);
    throw error;
  }
}

/**
 * ID로 행 찾기 및 업데이트
 */
export async function updateRowById(
  sheetName: string,
  idColumnName: string,
  id: string,
  updatedData: Record<string, unknown>
) {
  const allRows = await getAllRows(sheetName);
  const rowIndex = allRows.findIndex((row) => row[idColumnName] === id);

  if (rowIndex === -1) {
    throw new Error(`Row with ${idColumnName}=${id} not found`);
  }

  // 기존 데이터와 병합
  const existingRow = allRows[rowIndex];
  const mergedRow = { ...existingRow, ...updatedData };

  // 헤더 순서에 맞게 값 배열 생성
  const sheets = getGoogleSheetsClient();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID!,
    range: `${sheetName}!A1:Z1`,
  });

  const headers = response.data.values?.[0] || [];
  const values = headers.map((header) => {
    const value = mergedRow[header];

    // 객체나 배열은 JSON 문자열로 변환
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }

    return value ?? '';
  });

  await updateRow(sheetName, rowIndex, values);

  return mergedRow;
}

/**
 * ID로 행 삭제
 */
export async function deleteRowById(
  sheetName: string,
  idColumnName: string,
  id: string
) {
  const allRows = await getAllRows(sheetName);
  const rowIndex = allRows.findIndex((row) => row[idColumnName] === id);

  if (rowIndex === -1) {
    throw new Error(`Row with ${idColumnName}=${id} not found`);
  }

  const sheets = getGoogleSheetsClient();

  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID is not configured');
  }

  try {
    // Get sheet ID
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheet = spreadsheet.data.sheets?.find(
      (s) => s.properties?.title === sheetName
    );

    if (!sheet || !sheet.properties?.sheetId) {
      throw new Error(`Sheet ${sheetName} not found`);
    }

    // Delete row (rowIndex + 1 for header, + 1 for 0-based index)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId: sheet.properties.sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex + 1,
                endIndex: rowIndex + 2,
              },
            },
          },
        ],
      },
    });

    return true;
  } catch (error) {
    console.error('Error deleting row:', error);
    throw error;
  }
}

/**
 * 객체를 헤더 순서에 맞는 값 배열로 변환
 */
export async function objectToValues(
  sheetName: string,
  obj: Record<string, unknown>,
  cachedHeaders?: string[]
): Promise<unknown[]> {
  let headers: string[];

  if (cachedHeaders) {
    headers = cachedHeaders;
  } else {
    const sheets = getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID!,
      range: `${sheetName}!A1:Z1`,
    });
    headers = response.data.values?.[0] || [];
  }

  return headers.map((header) => {
    const value = obj[header];

    // 객체나 배열은 JSON 문자열로 변환
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }

    return value ?? '';
  });
}

/**
 * 시트의 헤더 가져오기 (한 번만 읽고 캐싱용)
 */
export async function getSheetHeaders(sheetName: string): Promise<string[]> {
  const sheets = getGoogleSheetsClient();

  if (!SPREADSHEET_ID) {
    throw new Error('SPREADSHEET_ID is not configured');
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sheetName}!A1:Z1`,
  });

  return response.data.values?.[0] || [];
}

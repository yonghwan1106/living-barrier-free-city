import { NextResponse } from 'next/server';
import { initializeSheets } from '@/lib/google-sheets/client';

/**
 * Initialize Google Sheets - Creates all necessary sheets with headers
 * Call this once after setting up the spreadsheet
 */
export async function POST() {
  try {
    await initializeSheets();
    return NextResponse.json({
      success: true,
      message: 'Google Sheets initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing sheets:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to initialize sheets'
      },
      { status: 500 }
    );
  }
}

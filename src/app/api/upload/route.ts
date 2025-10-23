import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Vercel Blob 토큰 확인
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      // 개발 환경에서는 임시로 로컬 저장소 사용 (추후 수정)
      console.warn('BLOB_READ_WRITE_TOKEN not configured, using fallback');

      // 임시: 랜덤 URL 반환 (실제로는 저장하지 않음)
      const tempUrl = `https://placeholder.com/${Date.now()}-${filename}`;

      return NextResponse.json({ url: tempUrl });
    }

    const blob = await put(filename, request.body!, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

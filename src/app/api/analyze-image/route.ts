import { NextResponse } from 'next/server';
import { analyzeImage } from '@/lib/claude/analyze';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, reportType, userCategory } = body;

    if (!imageUrl || !reportType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Claude API로 이미지 분석
    const analysis = await analyzeImage({
      imageUrl,
      reportType,
      userCategory,
    });

    return NextResponse.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error('Error in analyze-image API:', error);

    // API 키가 없거나 실패한 경우 기본값 반환
    return NextResponse.json({
      success: false,
      error: 'Image analysis failed',
      data: {
        detected_category: null,
        severity: 'medium',
        description: 'AI 분석을 사용할 수 없습니다.',
        tags: [],
      },
    });
  }
}

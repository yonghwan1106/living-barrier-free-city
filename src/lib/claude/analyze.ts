import { getClaudeClient, imageUrlToBase64, detectImageType } from './client';
import type { AIAnalysis, BarrierCategory, PraiseCategory } from '@/types';

const BARRIER_CATEGORIES_TEXT = `
- blocked_sidewalk: 인도가 불법 주차나 적치물로 막혀있음
- no_ramp: 경사로가 없음
- damaged_ramp: 경사로가 파손되었거나 상태가 불량함
- damaged_tactile_paving: 점자블록이 파손되었거나 없음
- restroom_issue: 장애인 화장실 고장, 부족, 청결 문제
- high_threshold: 문턱이 높아 휠체어나 유모차 진입이 어려움
- elevator_issue: 엘리베이터 고장 또는 없음
- signage_issue: 안내 표지판이 부족하거나 불명확함
- kiosk_accessibility: 키오스크 높이나 인터페이스 접근성 문제
- other: 기타 접근성 장벽
`;

const PRAISE_CATEGORIES_TEXT = `
- good_ramp: 경사로가 잘 설치되어 있음
- clean_restroom: 장애인 화장실이 깨끗하고 잘 작동함
- friendly_staff: 직원이 친절하고 도움을 줌
- good_voice_guide: 음성 안내가 우수함
- wide_passage: 통로가 넓고 이동하기 편함
- other: 기타 우수한 접근성
`;

interface AnalyzeImageOptions {
  imageUrl: string;
  reportType: 'barrier' | 'praise';
  userCategory?: string;
}

export async function analyzeImage({
  imageUrl,
  reportType,
  userCategory,
}: AnalyzeImageOptions): Promise<AIAnalysis> {
  try {
    const client = getClaudeClient();

    // 이미지를 base64로 변환
    const base64Image = await imageUrlToBase64(imageUrl);
    const imageType = detectImageType(imageUrl);

    const categoriesText =
      reportType === 'barrier' ? BARRIER_CATEGORIES_TEXT : PRAISE_CATEGORIES_TEXT;

    const prompt = `
당신은 접근성 전문가입니다. 제공된 이미지를 분석하여 다음 정보를 JSON 형식으로 제공해주세요:

이미지 유형: ${reportType === 'barrier' ? '접근성 장벽' : '접근성 우수 사례'}
${userCategory ? `사용자 선택 카테고리: ${userCategory}` : ''}

가능한 카테고리:
${categoriesText}

다음 JSON 형식으로 응답해주세요:
{
  "detected_category": "카테고리 값 (위 목록 중 하나)",
  "severity": "low | medium | high (장벽인 경우만, 칭찬인 경우 생략)",
  "description": "이미지에서 발견된 접근성 문제 또는 우수 사례에 대한 간단한 설명 (1-2문장)",
  "tags": ["관련", "태그", "목록"]
}

주의사항:
1. detected_category는 반드시 위 목록의 값 중 하나여야 합니다.
2. ${userCategory ? `사용자가 선택한 카테고리(${userCategory})를 우선 고려하되, 이미지와 맞지 않으면 다른 카테고리를 제안할 수 있습니다.` : ''}
3. description은 한국어로 작성하고 구체적이어야 합니다.
4. severity는 장벽 리포트에만 해당됩니다 (low: 불편함, medium: 접근 어려움, high: 접근 불가능).
5. JSON만 출력하고 다른 텍스트는 포함하지 마세요.
`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: imageType,
                data: base64Image,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // Claude의 응답 파싱
    const content = message.content[0];
    if (content.type === 'text') {
      const jsonText = content.text.trim();
      const analysis = JSON.parse(jsonText);

      return {
        detected_category: analysis.detected_category,
        severity: analysis.severity,
        description: analysis.description,
        tags: analysis.tags || [],
      };
    }

    throw new Error('Unexpected response format from Claude');
  } catch (error) {
    console.error('Error analyzing image with Claude:', error);

    // Fallback: 사용자가 선택한 카테고리 사용
    return {
      detected_category: userCategory,
      severity: reportType === 'barrier' ? 'medium' : undefined,
      description: '이미지 분석에 실패했습니다. 사용자가 선택한 카테고리로 분류되었습니다.',
      tags: [],
    };
  }
}

// 간단한 텍스트 기반 분류 (이미지 없을 때)
export async function classifyByText(
  description: string,
  reportType: 'barrier' | 'praise'
): Promise<{ category: string; tags: string[] }> {
  try {
    const client = getClaudeClient();

    const categoriesText =
      reportType === 'barrier' ? BARRIER_CATEGORIES_TEXT : PRAISE_CATEGORIES_TEXT;

    const prompt = `
다음 설명을 읽고 가장 적합한 카테고리를 선택해주세요:

설명: "${description}"

가능한 카테고리:
${categoriesText}

JSON 형식으로만 응답해주세요:
{
  "category": "카테고리 값",
  "tags": ["관련", "태그"]
}
`;

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const result = JSON.parse(content.text.trim());
      return result;
    }

    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Error classifying text:', error);
    return {
      category: 'other',
      tags: [],
    };
  }
}

'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Camera,
  MapPin,
  X,
  Check,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import type { BarrierCategory, PraiseCategory, ReportType } from '@/types';

// 카테고리 정의
const BARRIER_CATEGORIES: { value: BarrierCategory; label: string; icon: string }[] = [
  { value: 'blocked_sidewalk', label: '인도 막힘', icon: '🚧' },
  { value: 'no_ramp', label: '경사로 없음', icon: '⛔' },
  { value: 'damaged_ramp', label: '경사로 파손', icon: '🔧' },
  { value: 'damaged_tactile_paving', label: '점자블록 파손', icon: '⚠️' },
  { value: 'restroom_issue', label: '화장실 문제', icon: '🚽' },
  { value: 'high_threshold', label: '높은 문턱', icon: '📏' },
  { value: 'elevator_issue', label: '엘리베이터 문제', icon: '🛗' },
  { value: 'signage_issue', label: '안내판 부족', icon: '🪧' },
  { value: 'kiosk_accessibility', label: '키오스크 접근성', icon: '🖥️' },
  { value: 'other', label: '기타', icon: '❓' },
];

const PRAISE_CATEGORIES: { value: PraiseCategory; label: string; icon: string }[] = [
  { value: 'good_ramp', label: '경사로 우수', icon: '✅' },
  { value: 'clean_restroom', label: '화장실 청결', icon: '🧼' },
  { value: 'friendly_staff', label: '친절한 직원', icon: '👍' },
  { value: 'good_voice_guide', label: '음성안내 우수', icon: '🔊' },
  { value: 'wide_passage', label: '넓은 통로', icon: '↔️' },
  { value: 'other', label: '기타', icon: '⭐' },
];

export default function NewReportPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState<'type' | 'category' | 'photo' | 'details'>('type');
  const [reportType, setReportType] = useState<ReportType>('barrier');
  const [category, setCategory] = useState<string>('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 로그인 확인
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/reports/new');
    }
  }, [status, router]);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          // TODO: Reverse Geocoding으로 주소 가져오기
          setAddress(`위도: ${position.coords.latitude.toFixed(4)}, 경도: ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setStep('details');
    }
  };

  const handleSubmit = async () => {
    if (!category || !location) {
      alert('모든 필수 정보를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      let photoUrl = '';
      let aiAnalysis = null;

      // 사진 업로드
      if (photo) {
        const uploadResponse = await fetch(
          `/api/upload?filename=${Date.now()}-${photo.name}`,
          {
            method: 'POST',
            body: photo,
          }
        );

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          photoUrl = url;

          // AI 이미지 분석 (선택적)
          try {
            const analyzeResponse = await fetch('/api/analyze-image', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                imageUrl: photoUrl,
                reportType,
                userCategory: category,
              }),
            });

            if (analyzeResponse.ok) {
              const { data } = await analyzeResponse.json();
              aiAnalysis = data;
              console.log('AI Analysis:', aiAnalysis);
            }
          } catch (error) {
            console.error('AI analysis failed, continuing without it:', error);
          }
        }
      }

      // 리포트 생성
      const reportResponse = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: reportType,
          category,
          latitude: location.lat,
          longitude: location.lng,
          address,
          city: '', // TODO: 주소에서 추출
          district: '', // TODO: 주소에서 추출
          description,
          media_urls: photoUrl ? [photoUrl] : [],
          ai_analysis: aiAnalysis,
        }),
      });

      if (reportResponse.ok) {
        const { data } = await reportResponse.json();
        alert(`리포트가 성공적으로 작성되었습니다! +${reportType === 'barrier' ? 10 : 15} XP`);
        router.push('/map');
      } else {
        throw new Error('Failed to create report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('리포트 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const categories = reportType === 'barrier' ? BARRIER_CATEGORIES : PRAISE_CATEGORIES;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="flex h-16 items-center justify-between px-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">리포트 작성</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>
      </header>

      <div className="container max-w-2xl mx-auto p-4">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {['유형', '카테고리', '사진', '완료'].map((label, index) => {
              const currentStep = ['type', 'category', 'photo', 'details'].indexOf(step);
              const isActive = index <= currentStep;
              return (
                <div
                  key={label}
                  className={`text-sm ${isActive ? 'text-blue-600 font-semibold' : 'text-gray-400'}`}
                >
                  {label}
                </div>
              );
            })}
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{
                width: `${(['type', 'category', 'photo', 'details'].indexOf(step) + 1) * 25}%`,
              }}
            />
          </div>
        </div>

        {/* Step: Type Selection */}
        {step === 'type' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">리포트 유형을 선택하세요</h2>
            <Card
              className={`p-6 cursor-pointer transition-all ${reportType === 'barrier' ? 'ring-2 ring-blue-600' : 'hover:bg-gray-50'}`}
              onClick={() => setReportType('barrier')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-red-600">🚧 장벽 리포트</h3>
                  <p className="text-gray-600 mt-1">접근성 장벽을 신고합니다</p>
                  <p className="text-sm text-gray-500 mt-2">+10 XP</p>
                </div>
                {reportType === 'barrier' && <Check className="h-6 w-6 text-blue-600" />}
              </div>
            </Card>
            <Card
              className={`p-6 cursor-pointer transition-all ${reportType === 'praise' ? 'ring-2 ring-blue-600' : 'hover:bg-gray-50'}`}
              onClick={() => setReportType('praise')}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-blue-600">⭐ 칭찬 리포트</h3>
                  <p className="text-gray-600 mt-1">접근성이 우수한 곳을 공유합니다</p>
                  <p className="text-sm text-gray-500 mt-2">+15 XP</p>
                </div>
                {reportType === 'praise' && <Check className="h-6 w-6 text-blue-600" />}
              </div>
            </Card>
            <Button
              className="w-full"
              size="lg"
              onClick={() => setStep('category')}
            >
              다음
            </Button>
          </div>
        )}

        {/* Step: Category Selection */}
        {step === 'category' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">카테고리를 선택하세요</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => (
                <Card
                  key={cat.value}
                  className={`p-4 cursor-pointer transition-all ${category === cat.value ? 'ring-2 ring-blue-600' : 'hover:bg-gray-50'}`}
                  onClick={() => setCategory(cat.value)}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{cat.icon}</div>
                    <div className="text-sm font-medium">{cat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep('type')}
              >
                이전
              </Button>
              <Button
                className="flex-1"
                disabled={!category}
                onClick={() => setStep('photo')}
              >
                다음
              </Button>
            </div>
          </div>
        )}

        {/* Step: Photo */}
        {step === 'photo' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">사진을 촬영하세요</h2>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-600 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">클릭하여 사진 촬영 또는 선택</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoSelect}
              />
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setStep('category')}
            >
              이전
            </Button>
            <Button
              className="w-full"
              variant="outline"
              onClick={() => setStep('details')}
            >
              사진 없이 계속
            </Button>
          </div>
        )}

        {/* Step: Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">세부 정보</h2>

            {/* Photo Preview */}
            {photoPreview && (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => {
                    setPhoto(null);
                    setPhotoPreview('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Location */}
            <div>
              <Label>위치</Label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {location ? address : '위치 정보를 가져오는 중...'}
                </span>
              </div>
            </div>

            {/* Category Display */}
            <div>
              <Label>카테고리</Label>
              <div className="mt-1">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {categories.find((c) => c.value === category)?.icon}
                  {categories.find((c) => c.value === category)?.label}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">설명 (선택)</Label>
              <Input
                id="description"
                placeholder="간단한 설명을 입력하세요 (최대 100자)"
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 100))}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">{description.length}/100</p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep('photo')}
              >
                이전
              </Button>
              <Button
                className="flex-1"
                onClick={handleSubmit}
                disabled={loading || !location}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                제출하기
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

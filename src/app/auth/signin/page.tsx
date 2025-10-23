'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  const handleSignIn = (provider: string) => {
    signIn(provider, { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md p-8 space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <MapPin className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold">배리어프리 경기</span>
          </Link>
          <h1 className="text-xl font-semibold">로그인</h1>
          <p className="text-sm text-gray-600">
            시민 참여형 접근성 데이터 생태계에 참여하세요
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="text-sm">
              로그인 중 오류가 발생했습니다. 다시 시도해주세요.
            </p>
          </div>
        )}

        {/* Login Buttons */}
        <div className="space-y-3">
          {/* Google Login */}
          <Button
            onClick={() => handleSignIn('google')}
            variant="outline"
            className="w-full h-12 text-base font-medium border-2 hover:bg-gray-50"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Google로 계속하기
          </Button>

          {/* Kakao Login */}
          <Button
            onClick={() => handleSignIn('kakao')}
            className="w-full h-12 text-base font-medium bg-[#FEE500] text-[#000000] hover:bg-[#FDD835]"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 01-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3z" />
            </svg>
            카카오로 계속하기
          </Button>

          {/* Naver Login */}
          <Button
            onClick={() => handleSignIn('naver')}
            className="w-full h-12 text-base font-medium bg-[#03C75A] text-white hover:bg-[#02B350]"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z" />
            </svg>
            네이버로 계속하기
          </Button>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">또는</span>
          </div>
        </div>

        {/* Guest Continue */}
        <Button
          onClick={() => (window.location.href = callbackUrl)}
          variant="ghost"
          className="w-full"
        >
          로그인 없이 둘러보기
        </Button>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500">
          로그인하시면{' '}
          <a href="#" className="underline">
            서비스 약관
          </a>{' '}
          및{' '}
          <a href="#" className="underline">
            개인정보 처리방침
          </a>
          에 동의하게 됩니다.
        </p>
      </Card>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <SignInContent />
    </Suspense>
  );
}

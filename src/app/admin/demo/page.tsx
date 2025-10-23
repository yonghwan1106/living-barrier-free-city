'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Trash2, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function AdminDemoPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [resetResult, setResetResult] = useState<string | null>(null);
  const [initResult, setInitResult] = useState<string | null>(null);

  const handleReset = async () => {
    if (!confirm('정말 모든 데모 데이터를 삭제하시겠습니까?')) {
      return;
    }

    setIsResetting(true);
    setResetResult(null);

    try {
      const response = await fetch('/api/demo/reset', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setResetResult(`성공: ${data.message || '데모 데이터 삭제 완료'}`);
      } else {
        const errorDetails = data.details ? `\n\n상세 오류:\n${data.details}` : '';
        setResetResult(`실패: ${data.error || data.message || '알 수 없는 오류'}${errorDetails}`);
      }
    } catch (error) {
      setResetResult(`오류: ${error instanceof Error ? error.message : '네트워크 오류'}`);
    } finally {
      setIsResetting(false);
    }
  };

  const handleInit = async () => {
    setIsInitializing(true);
    setInitResult(null);

    try {
      const response = await fetch('/api/demo/init', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setInitResult(
          `성공: ${data.message || '데모 데이터 생성 완료'}\n` +
          `- 사용자: ${data.data?.users || 0}명\n` +
          `- 리포트: ${data.data?.reports || 0}개\n` +
          `- 팀: ${data.data?.teams || 0}개`
        );
      } else {
        const errorDetails = data.details ? `\n\n상세 오류:\n${data.details}` : '';
        setInitResult(`실패: ${data.error || data.message || '알 수 없는 오류'}${errorDetails}`);
      }
    } catch (error) {
      setInitResult(`오류: ${error instanceof Error ? error.message : '네트워크 오류'}`);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleResetAndInit = async () => {
    if (!confirm('모든 데모 데이터를 삭제하고 새로 생성하시겠습니까?')) {
      return;
    }

    // First reset
    setIsResetting(true);
    setResetResult(null);
    setInitResult(null);

    try {
      const resetResponse = await fetch('/api/demo/reset', {
        method: 'POST',
      });

      const resetData = await resetResponse.json();

      if (resetResponse.ok) {
        setResetResult(`성공: ${resetData.message || '데모 데이터 삭제 완료'}`);

        // Then initialize
        setIsResetting(false);
        setIsInitializing(true);

        const initResponse = await fetch('/api/demo/init', {
          method: 'POST',
        });

        const initData = await initResponse.json();

        if (initResponse.ok) {
          setInitResult(
            `성공: ${initData.message || '데모 데이터 생성 완료'}\n` +
            `- 사용자: ${initData.data?.users || 0}명\n` +
            `- 리포트: ${initData.data?.reports || 0}개\n` +
            `- 팀: ${initData.data?.teams || 0}개`
          );
        } else {
          const errorDetails = initData.details ? `\n\n상세 오류:\n${initData.details}` : '';
          setInitResult(`실패: ${initData.error || initData.message || '알 수 없는 오류'}${errorDetails}`);
        }
      } else {
        const errorDetails = resetData.details ? `\n\n상세 오류:\n${resetData.details}` : '';
        setResetResult(`실패: ${resetData.error || resetData.message || '알 수 없는 오류'}${errorDetails}`);
      }
    } catch (error) {
      setResetResult(`오류: ${error instanceof Error ? error.message : '네트워크 오류'}`);
    } finally {
      setIsResetting(false);
      setIsInitializing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <div className="container px-4 py-12 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">데모 데이터 관리</h1>
          <p className="text-gray-600">
            데모 데이터를 초기화하고 새로 생성할 수 있습니다.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Reset and Initialize */}
          <Card className="p-6 border-2 border-blue-200 bg-blue-50">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <RefreshCw className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">리셋 & 재생성 (권장)</h2>
                <p className="text-gray-700 mb-4">
                  기존 데모 데이터를 모두 삭제하고 정확한 좌표로 새로운 데모 데이터를 생성합니다.
                  이 작업은 약 10-20초 소요됩니다.
                </p>
                <Button
                  onClick={handleResetAndInit}
                  disabled={isResetting || isInitializing}
                  size="lg"
                  className="gap-2"
                >
                  {(isResetting || isInitializing) ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {isResetting ? '삭제 중...' : '생성 중...'}
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5" />
                      리셋 & 재생성
                    </>
                  )}
                </Button>
              </div>
            </div>

            {(resetResult || initResult) && (
              <div className="space-y-2 mt-4 p-4 bg-white rounded-lg">
                {resetResult && (
                  <div className={`flex items-start gap-2 ${resetResult.startsWith('성공') ? 'text-green-700' : 'text-red-700'}`}>
                    {resetResult.startsWith('성공') ? (
                      <CheckCircle2 className="h-5 w-5 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                    )}
                    <pre className="whitespace-pre-wrap text-sm">{resetResult}</pre>
                  </div>
                )}
                {initResult && (
                  <div className={`flex items-start gap-2 ${initResult.startsWith('성공') ? 'text-green-700' : 'text-red-700'}`}>
                    {initResult.startsWith('성공') ? (
                      <CheckCircle2 className="h-5 w-5 mt-0.5" />
                    ) : (
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                    )}
                    <pre className="whitespace-pre-wrap text-sm">{initResult}</pre>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Individual Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Reset Only */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">데이터 삭제</h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    모든 데모 사용자, 리포트, 팀 데이터를 삭제합니다.
                  </p>
                  <Button
                    onClick={handleReset}
                    disabled={isResetting || isInitializing}
                    variant="destructive"
                    className="gap-2"
                  >
                    {isResetting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        삭제 중...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        삭제하기
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {resetResult && !initResult && (
                <div className={`flex items-start gap-2 mt-4 p-3 rounded-lg ${resetResult.startsWith('성공') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {resetResult.startsWith('성공') ? (
                    <CheckCircle2 className="h-5 w-5 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                  )}
                  <pre className="whitespace-pre-wrap text-sm">{resetResult}</pre>
                </div>
              )}
            </Card>

            {/* Initialize Only */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <RefreshCw className="h-6 w-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2">데이터 생성</h2>
                  <p className="text-gray-600 mb-4 text-sm">
                    새로운 데모 데이터를 생성합니다. (기존 데이터가 있으면 실패)
                  </p>
                  <Button
                    onClick={handleInit}
                    disabled={isResetting || isInitializing}
                    variant="default"
                    className="gap-2"
                  >
                    {isInitializing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        생성 중...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="h-4 w-4" />
                        생성하기
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {initResult && !resetResult && (
                <div className={`flex items-start gap-2 mt-4 p-3 rounded-lg ${initResult.startsWith('성공') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {initResult.startsWith('성공') ? (
                    <CheckCircle2 className="h-5 w-5 mt-0.5" />
                  ) : (
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                  )}
                  <pre className="whitespace-pre-wrap text-sm">{initResult}</pre>
                </div>
              )}
            </Card>
          </div>

          {/* Instructions */}
          <Card className="p-6 bg-gray-50">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-blue-600" />
              사용 방법
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• <strong>리셋 & 재생성</strong>: 잘못된 좌표의 마커를 수정하려면 이 버튼을 클릭하세요.</li>
              <li>• 작업 완료 후 지도 페이지를 새로고침하면 정확한 위치에 마커가 표시됩니다.</li>
              <li>• 데모 데이터는 3명의 사용자와 45-72개의 리포트를 생성합니다.</li>
              <li>• 이미 데모 데이터가 있는 경우 먼저 삭제해야 새로 생성할 수 있습니다.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

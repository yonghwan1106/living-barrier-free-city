'use client';

import { useEffect, useState } from 'react';

export function useNaverMaps() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 이미 로드되어 있는지 확인
    if (window.naver && window.naver.maps) {
      setIsLoaded(true);
      return;
    }

    // 스크립트가 이미 추가되어 있는지 확인
    const existingScript = document.getElementById('naver-maps-script');
    if (existingScript) {
      existingScript.addEventListener('load', () => setIsLoaded(true));
      return;
    }

    // Naver Maps API 클라이언트 ID 확인
    const clientId = process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID;
    if (!clientId) {
      setError(new Error('Naver Maps Client ID is not configured'));
      return;
    }

    // 스크립트 추가
    const script = document.createElement('script');
    script.id = 'naver-maps-script';
    script.src = `https://openapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}`;
    script.async = true;

    script.onload = () => {
      setIsLoaded(true);
    };

    script.onerror = () => {
      setError(new Error('Failed to load Naver Maps API'));
    };

    document.head.appendChild(script);

    return () => {
      // 클린업 - 스크립트 제거하지 않음 (재사용을 위해)
    };
  }, []);

  return { isLoaded, error };
}

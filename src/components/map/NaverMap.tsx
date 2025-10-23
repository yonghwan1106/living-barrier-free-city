'use client';

import { useEffect, useRef, useState } from 'react';
import { useNaverMaps } from '@/hooks/useNaverMaps';

interface NaverMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
  onMapLoad?: (map: NaverMap) => void;
}

export function NaverMap({
  center = { lat: 37.5665, lng: 126.9780 }, // 서울시청 기본값
  zoom = 13,
  className = 'w-full h-full',
  onMapLoad,
}: NaverMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<NaverMap | null>(null);
  const { isLoaded, error } = useNaverMaps();
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  // 지도 초기화
  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;

    // 이미 지도가 생성되어 있으면 리턴
    if (mapInstanceRef.current) return;

    const { naver } = window;
    if (!naver?.maps) return;

    // 현재 위치가 있으면 사용, 없으면 기본 center 사용
    const mapCenter = currentLocation || center;

    const mapOptions = {
      center: new naver.maps.LatLng(mapCenter.lat, mapCenter.lng),
      zoom,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
      mapTypeControl: true,
      mapTypeControlOptions: {
        position: naver.maps.Position.RIGHT_CENTER,
      },
      scaleControl: true,
      logoControl: false,
      mapDataControl: false,
    };

    const map = new naver.maps.Map(mapRef.current, mapOptions);
    mapInstanceRef.current = map;

    // 현재 위치에 마커 표시
    if (currentLocation) {
      new naver.maps.Marker({
        position: new naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
        map,
        icon: {
          content: `
            <div style="
              width: 20px;
              height: 20px;
              background-color: #3b82f6;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          anchor: new naver.maps.Point(10, 10),
        },
      });
    }

    if (onMapLoad) {
      onMapLoad(map);
    }
  }, [isLoaded, center, zoom, currentLocation, onMapLoad]);

  if (error) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <p className="text-red-600 font-semibold">지도를 불러오는데 실패했습니다.</p>
          <p className="text-sm text-gray-600 mt-2">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">지도를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className={className} />;
}

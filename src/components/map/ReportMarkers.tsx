'use client';

import { useEffect, useState } from 'react';
import type { Report } from '@/types';

interface ReportMarkersProps {
  map: NaverMap;
  reports: Report[];
  onMarkerClick?: (report: Report) => void;
}

export function ReportMarkers({ map, reports, onMarkerClick }: ReportMarkersProps) {
  const [markers, setMarkers] = useState<NaverMarker[]>([]);

  useEffect(() => {
    if (!map || !window.naver) return;

    // 기존 마커 제거
    markers.forEach((marker) => marker.setMap(null));

    const { naver } = window;
    if (!naver?.maps) return;

    const naverMaps = naver.maps;
    const newMarkers: NaverMarker[] = [];

    // 같은 위치에 있는 리포트들을 그룹화
    const locationGroups = new Map<string, Report[]>();
    reports.forEach((report) => {
      const key = `${report.latitude},${report.longitude}`;
      if (!locationGroups.has(key)) {
        locationGroups.set(key, []);
      }
      locationGroups.get(key)!.push(report);
    });

    // 각 리포트에 대해 마커 생성
    reports.forEach((report) => {
      const key = `${report.latitude},${report.longitude}`;
      const group = locationGroups.get(key)!;
      const groupIndex = group.findIndex(r => r.report_id === report.report_id);
      const groupSize = group.length;

      // 같은 위치에 여러 마커가 있으면 원형으로 배치
      let offsetLat = 0;
      let offsetLng = 0;
      if (groupSize > 1) {
        const angle = (groupIndex / groupSize) * 2 * Math.PI;
        const radius = 0.0005; // 약 50m 정도의 반경
        offsetLat = Math.cos(angle) * radius;
        offsetLng = Math.sin(angle) * radius;
      }

      const position = new naverMaps.LatLng(
        report.latitude + offsetLat,
        report.longitude + offsetLng
      );

      // 마커 색상 결정
      let markerColor = '#DC2626'; // 기본: 빨강 (장벽)
      if (report.type === 'praise') {
        markerColor = '#2563EB'; // 파랑 (칭찬)
      }
      if (report.status === 'resolved') {
        markerColor = '#16A34A'; // 녹색 (해결됨)
      }

      // 커스텀 마커 HTML
      const markerContent = `
        <div style="
          width: 30px;
          height: 30px;
          background-color: ${markerColor};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          font-weight: bold;
          transition: transform 0.2s;
        "
        onmouseover="this.style.transform='scale(1.2)'"
        onmouseout="this.style.transform='scale(1)'"
        >
          ${report.type === 'barrier' ? '🚧' : '⭐'}
        </div>
      `;

      const marker = new naverMaps.Marker({
        position,
        map,
        icon: {
          content: markerContent,
          anchor: new naverMaps.Point(15, 15),
        },
        zIndex: report.status === 'active' ? 100 : 50,
      });

      // 마커 클릭 이벤트
      naverMaps.Event.addListener(marker, 'click', () => {
        if (onMarkerClick) {
          onMarkerClick(report);
        }
      });

      newMarkers.push(marker);
    });

    setMarkers(newMarkers);

    // 클린업
    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, reports, onMarkerClick]);

  return null; // 이 컴포넌트는 렌더링하지 않음
}

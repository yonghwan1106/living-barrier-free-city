'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { NaverMap } from '@/components/map/NaverMap';
import { ReportMarkers } from '@/components/map/ReportMarkers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Header } from '@/components/layout/Header';
import {
  Plus,
  Search,
  Filter,
  Navigation,
  X,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import type { Report } from '@/types';

export default function MapPage() {
  const { data: session } = useSession();
  const [map, setMap] = useState<NaverMap | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showBarriers, setShowBarriers] = useState(true);
  const [showPraise, setShowPraise] = useState(true);
  const [showResolved, setShowResolved] = useState(false);

  const fetchReports = useCallback(async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const { data } = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  }, []);

  // 리포트 데이터 가져오기
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  // 필터링된 리포트
  const filteredReports = reports.filter((report) => {
    if (report.type === 'barrier' && !showBarriers) return false;
    if (report.type === 'praise' && !showPraise) return false;
    if (report.status === 'resolved' && !showResolved) return false;
    if (report.status !== 'resolved' && showResolved && !(showBarriers || showPraise)) return false;
    return true;
  });

  const handleMapLoad = (mapInstance: NaverMap) => {
    setMap(mapInstance);
    console.log('Map loaded:', mapInstance);
  };

  const handleMyLocation = () => {
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { naver } = window;
          if (!naver?.maps) return;

          const location = new naver.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude
          );
          map.setCenter(location);
          map.setZoom(16);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('현재 위치를 가져올 수 없습니다.');
        }
      );
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20">
        <Header />
      </div>

      {/* Search Bar */}
      <div className="absolute top-20 left-4 right-4 z-10 flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="장소, 주소 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white shadow-lg"
          />
        </div>
        <Button
          variant={isFilterOpen ? 'default' : 'outline'}
          size="icon"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="bg-white shadow-lg"
        >
          {isFilterOpen ? <X className="h-4 w-4" /> : <Filter className="h-4 w-4" />}
        </Button>
      </div>

      {/* Filter Panel */}
      {isFilterOpen && (
        <div className="absolute top-36 left-4 right-4 z-10 bg-white rounded-lg shadow-xl p-4 max-w-sm">
          <h3 className="font-semibold mb-3">필터</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded"
                checked={showBarriers}
                onChange={(e) => setShowBarriers(e.target.checked)}
              />
              <span className="text-sm">장벽 리포트</span>
              <span className="ml-auto text-xs text-gray-500">
                ({reports.filter(r => r.type === 'barrier' && r.status === 'active').length})
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded"
                checked={showPraise}
                onChange={(e) => setShowPraise(e.target.checked)}
              />
              <span className="text-sm">칭찬 리포트</span>
              <span className="ml-auto text-xs text-gray-500">
                ({reports.filter(r => r.type === 'praise').length})
              </span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="rounded"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
              />
              <span className="text-sm">해결된 장벽</span>
              <span className="ml-auto text-xs text-gray-500">
                ({reports.filter(r => r.status === 'resolved').length})
              </span>
            </label>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              총 <span className="font-semibold text-blue-600">{filteredReports.length}</span>개 리포트 표시 중
            </div>
          </div>
        </div>
      )}

      {/* Map */}
      <div className="h-full w-full pt-16">
        <NaverMap
          center={{ lat: 37.5665, lng: 126.9780 }}
          zoom={13}
          onMapLoad={handleMapLoad}
        />
        {map && (
          <ReportMarkers
            map={map}
            reports={filteredReports}
            onMarkerClick={(report) => setSelectedReport(report)}
          />
        )}
      </div>

      {/* Selected Report Panel */}
      {selectedReport && (
        <div className="absolute bottom-24 left-4 right-4 z-10 max-w-md mx-auto">
          <Card className="bg-white/95 backdrop-blur p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    selectedReport.type === 'barrier'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedReport.type === 'barrier' ? '장벽' : '칭찬'}
                  </span>
                  {selectedReport.status === 'resolved' && (
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-green-100 text-green-800">
                      해결됨
                    </span>
                  )}
                </div>
                <h3 className="font-bold">{selectedReport.category}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedReport.address || '주소 없음'}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedReport(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {selectedReport.description && (
              <p className="text-sm mb-3">{selectedReport.description}</p>
            )}

            {selectedReport.media_urls && selectedReport.media_urls.length > 0 && (
              <img
                src={selectedReport.media_urls[0]}
                alt="Report"
                className="w-full h-32 object-cover rounded mb-3"
              />
            )}

            {selectedReport.ai_analysis && (
              <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-3">
                <div className="font-semibold mb-1">AI 분석:</div>
                <div>{selectedReport.ai_analysis.description}</div>
                {selectedReport.ai_analysis.severity && (
                  <div className="mt-1">
                    심각도: <span className="font-semibold">{selectedReport.ai_analysis.severity}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-2 text-xs text-gray-500 mb-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                검증 {selectedReport.verify_count}회
              </div>
              <div>
                신뢰도 {selectedReport.confidence_score}%
              </div>
            </div>

            {/* Verification Buttons */}
            {session && selectedReport.status !== 'resolved' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/verifications', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          report_id: selectedReport.report_id,
                          type: 'confirm'
                        })
                      });

                      if (response.ok) {
                        alert('검증이 완료되었습니다! (+5 XP)');
                        fetchReports(); // 리포트 새로고침
                        setSelectedReport(null);
                      } else {
                        const error = await response.json();
                        alert(error.error || '검증에 실패했습니다.');
                      }
                    } catch (error) {
                      console.error('Verification error:', error);
                      alert('검증 중 오류가 발생했습니다.');
                    }
                  }}
                >
                  👁️ 나도 봤어요!
                </Button>
                {selectedReport.type === 'barrier' && (
                  <Button
                    size="sm"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={async () => {
                      try {
                        const response = await fetch('/api/verifications', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            report_id: selectedReport.report_id,
                            type: 'resolved'
                          })
                        });

                        if (response.ok) {
                          alert('장벽 해결 확인! (+5 XP)');
                          fetchReports(); // 리포트 새로고침
                          setSelectedReport(null);
                        } else {
                          const error = await response.json();
                          alert(error.error || '해결 확인에 실패했습니다.');
                        }
                      } catch (error) {
                        console.error('Resolution error:', error);
                        alert('해결 확인 중 오류가 발생했습니다.');
                      }
                    }}
                  >
                    ✅ 해결됐어요!
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Quick Actions - Bottom Right */}
      <div className="absolute bottom-8 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          onClick={handleMyLocation}
        >
          <Navigation className="h-5 w-5" />
        </Button>
        <Button
          size="icon"
          className="h-16 w-16 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700"
          asChild
        >
          <Link href="/reports/new">
            <Plus className="h-6 w-6" />
          </Link>
        </Button>
      </div>

      {/* Legend - Bottom Left */}
      <div className="absolute bottom-8 left-4 z-10 bg-white/95 backdrop-blur rounded-lg shadow-lg p-3">
        <div className="text-xs space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>장벽</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>칭찬</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>해결됨</span>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Plus,
  MapPin,
  Calendar,
  User,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
} from 'lucide-react';
import type { Report } from '@/types';

export default function ReportsPage() {
  const { data: session } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resolved'>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'barrier' | 'praise'>('all');

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    filterReports();
  }, [reports, searchQuery, statusFilter, typeFilter]);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      if (response.ok) {
        const { data } = await response.json();
        setReports(data);
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterReports = () => {
    let filtered = [...reports];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter((report) => report.type === typeFilter);
    }

    setFilteredReports(filtered);
  };

  const getCategoryLabel = (category: string): string => {
    const categoryMap: Record<string, string> = {
      blocked_sidewalk: '인도 막힘',
      no_ramp: '경사로 없음',
      damaged_ramp: '경사로 파손',
      damaged_tactile_paving: '점자블록 파손',
      restroom_issue: '화장실 문제',
      high_threshold: '높은 문턱',
      elevator_issue: '엘리베이터 문제',
      signage_issue: '안내판 부족',
      kiosk_accessibility: '키오스크 접근성',
      good_ramp: '경사로 우수',
      clean_restroom: '화장실 청결',
      friendly_staff: '친절한 직원',
      good_voice_guide: '음성안내 우수',
      wide_passage: '넓은 통로',
      other: '기타',
    };
    return categoryMap[category] || category;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">리포트를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">리포트 목록</h1>
            <p className="text-lg text-blue-100 mb-6">
              시민들이 제보한 모든 장벽과 칭찬 리포트를 확인하세요
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                전체 리포트: <span className="font-bold">{reports.length}</span>개
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                장벽: <span className="font-bold">{reports.filter((r: Report) => r.type === 'barrier').length}</span>개
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                칭찬: <span className="font-bold">{reports.filter((r: Report) => r.type === 'praise').length}</span>개
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                해결됨: <span className="font-bold">{reports.filter((r: Report) => r.status === 'resolved').length}</span>개
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="주소, 설명, 카테고리로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">상태:</span>
              </div>
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
              >
                전체
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
              >
                대기중
              </Button>
              <Button
                variant={statusFilter === 'resolved' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('resolved')}
              >
                해결됨
              </Button>

              <div className="flex items-center gap-2 ml-4">
                <span className="text-sm font-medium text-gray-700">타입:</span>
              </div>
              <Button
                variant={typeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('all')}
              >
                전체
              </Button>
              <Button
                variant={typeFilter === 'barrier' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('barrier')}
              >
                장벽
              </Button>
              <Button
                variant={typeFilter === 'praise' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTypeFilter('praise')}
              >
                칭찬
              </Button>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4 text-sm text-gray-600">
          총 <span className="font-bold text-gray-900">{filteredReports.length}</span>개의 리포트
        </div>

        {/* Reports List */}
        {filteredReports.length === 0 ? (
          <Card className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">리포트가 없습니다</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || statusFilter !== 'all' || typeFilter !== 'all'
                ? '검색 조건을 변경해보세요'
                : '첫 번째 리포트를 작성해보세요'}
            </p>
            {session && (
              <Button asChild>
                <Link href="/reports/new">
                  <Plus className="h-4 w-4 mr-2" />
                  새 리포트 작성
                </Link>
              </Button>
            )}
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredReports.map((report) => (
              <Card
                key={report.report_id}
                className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.open(`https://map.naver.com/p/search/${encodeURIComponent(report.address)}`, '_blank')}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${
                        report.type === 'barrier'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {report.type === 'barrier' ? (
                          <AlertCircle className="h-5 w-5" />
                        ) : (
                          <CheckCircle2 className="h-5 w-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            report.type === 'barrier'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}>
                            {report.type === 'barrier' ? '장벽' : '칭찬'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            report.status === 'resolved'
                              ? 'bg-blue-100 text-blue-700'
                              : report.status === 'archived'
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {report.status === 'resolved' ? '해결됨' : report.status === 'archived' ? '보관됨' : '활성'}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold mb-1">
                          {getCategoryLabel(report.category)}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {report.description || '설명 없음'}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{report.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(report.created_at).toLocaleDateString('ko-KR')}</span>
                      </div>
                      {report.verify_count > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>검증 {report.verify_count}회</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image */}
                  {report.media_urls && report.media_urls.length > 0 && (
                    <div className="flex-shrink-0">
                      <img
                        src={report.media_urls[0]}
                        alt={getCategoryLabel(report.category)}
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Floating Action Button */}
        {session && (
          <Link href="/reports/new">
            <Button
              size="lg"
              className="fixed bottom-8 right-8 rounded-full shadow-2xl w-14 h-14 p-0"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}

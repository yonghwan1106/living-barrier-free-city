'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { MapPin, Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';

export function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <div className="flex flex-col">
            <span className="text-xl font-bold leading-tight">배리어프리 경기</span>
            <span className="text-[10px] text-gray-500 font-medium leading-tight">Living Barrier-Free City</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium hover:text-blue-600 transition-colors">
            소개
          </Link>
          <Link href="/guide" className="text-sm font-medium hover:text-blue-600 transition-colors">
            매뉴얼
          </Link>
          <Link href="/map" className="text-sm font-medium hover:text-blue-600 transition-colors">
            지도
          </Link>
          <Link href="/quests" className="text-sm font-medium hover:text-blue-600 transition-colors">
            퀘스트
          </Link>
          <Link href="/teams" className="text-sm font-medium hover:text-blue-600 transition-colors">
            팀
          </Link>
          {session && (
            <Link href="/profile" className="text-sm font-medium hover:text-blue-600 transition-colors">
              프로필
            </Link>
          )}
        </nav>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-2">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <div className="font-semibold">{session.user?.nickname || session.user?.name}</div>
                <div className="text-xs text-gray-500">레벨 {session.user?.level || 1} · {session.user?.xp || 0} XP</div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signOut({ callbackUrl: '/' })}
                className="gap-2 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </div>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/auth/signin">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/signin">시작하기</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-white">
          <nav className="container px-4 py-4 flex flex-col gap-3">
            <Link
              href="/about"
              className="text-sm font-medium hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              소개
            </Link>
            <Link
              href="/guide"
              className="text-sm font-medium hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              매뉴얼
            </Link>
            <Link
              href="/map"
              className="text-sm font-medium hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              지도
            </Link>
            <Link
              href="/quests"
              className="text-sm font-medium hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              퀘스트
            </Link>
            <Link
              href="/teams"
              className="text-sm font-medium hover:text-blue-600 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              팀
            </Link>
            {session && (
              <Link
                href="/profile"
                className="text-sm font-medium hover:text-blue-600 py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                프로필
              </Link>
            )}
            <div className="border-t pt-3 mt-2">
              {session ? (
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-semibold">{session.user?.nickname || session.user?.name}</div>
                    <div className="text-xs text-gray-500">레벨 {session.user?.level || 1} · {session.user?.xp || 0} XP</div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full gap-2 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      setIsMenuOpen(false);
                      signOut({ callbackUrl: '/' });
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" asChild className="w-full">
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>로그인</Link>
                  </Button>
                  <Button asChild className="w-full">
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(false)}>시작하기</Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

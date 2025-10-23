import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Kakao from "next-auth/providers/kakao";
import Naver from "next-auth/providers/naver";
import type { NextAuthConfig } from "next-auth";
import { v4 as uuidv4 } from 'uuid';
import { findRows, appendRow, updateRowById, objectToValues } from '../google-sheets/operations';
import { SHEET_NAMES } from '../google-sheets/client';
import type { User } from '@/types';

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Kakao({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET!,
    }),
    Naver({
      clientId: process.env.NAVER_CLIENT_ID!,
      clientSecret: process.env.NAVER_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;

      // 카카오나 네이버의 경우 이메일이 없을 수 있음
      const userEmail = user.email || `${account.provider}_${account.providerAccountId}@placeholder.local`;

      try {
        // Google Sheets에서 사용자 찾기
        const existingUsers = await findRows(
          SHEET_NAMES.USERS,
          (row) => row.email === userEmail
        );

        const now = new Date().toISOString();

        if (existingUsers.length === 0) {
          // 신규 사용자 생성
          const newUser: User = {
            user_id: uuidv4(),
            email: userEmail,
            name: user.name || '',
            nickname: user.name || account.providerAccountId || 'User',
            provider: account.provider as 'google' | 'kakao' | 'naver',
            avatar_items: [],
            xp: 0,
            level: 1,
            titles: [],
            created_at: now,
            last_login: now,
          };

          const values = await objectToValues(SHEET_NAMES.USERS, newUser as unknown as Record<string, unknown>);
          await appendRow(SHEET_NAMES.USERS, values);

          console.log('New user created:', newUser.user_id);
        } else {
          // 기존 사용자 last_login 업데이트
          await updateRowById(SHEET_NAMES.USERS, 'email', userEmail, {
            last_login: now,
          });

          console.log('User login updated:', userEmail);
        }

        return true;
      } catch (error) {
        console.error('Error in signIn callback:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        try {
          // Google Sheets에서 사용자 정보 가져오기
          const users = await findRows(
            SHEET_NAMES.USERS,
            (row) => row.email === session.user.email
          );

          if (users.length > 0) {
            const userData = users[0];
            session.user.id = String(userData.user_id);
            session.user.xp = Number(userData.xp || 0);
            session.user.level = Number(userData.level || 1);
            session.user.nickname = String(userData.nickname || '');
          }
        } catch (error) {
          console.error('Error fetching user data in session:', error);
        }
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

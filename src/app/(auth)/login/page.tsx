'use client'; // Required for state and event handlers

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Assuming Alert component exists
import { AlertCircle } from 'lucide-react';
import { auth, googleProvider } from '@/lib/firebase'; // Import auth instance and Google provider
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/'); // Redirect to dashboard on successful login
      Cookies.set('auth-session', 'true', { expires: 1 }); // Set session cookie

    } catch (err: any) {
      console.error("Login failed:", err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email' || err.code === 'auth/wrong-password') {
        setError('メールアドレスまたはパスワードが正しくありません。');
      } else if (err.code === 'auth/user-not-found') {
         setError('指定されたメールアドレスのユーザーが見つかりません。');
      } else if (err.code === 'auth/too-many-requests') {
         setError('ログイン試行回数が多すぎます。しばらくしてから再度お試しください。');
      }
       else {
        setError('ログイン中にエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        router.push('/'); // Redirect to dashboard on successful login
        Cookies.set('auth-session', 'true', { expires: 1 }); // Set session cookie
      }
    } catch (err: any) {
      console.error("Google login failed:", err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('ログインがキャンセルされました。');
      } else if (err.code === 'auth/popup-blocked') {
        setError('ポップアップがブロックされました。ポップアップを許可してください。');
      } else {
        setError('Googleログイン中にエラーが発生しました。');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle className="text-2xl">管理者ログイン</CardTitle>
            <CardDescription>
              メールアドレスとパスワードを入力してください。
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>エラー</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'ログイン中...' : 'メールアドレスでログイン'}
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-900 px-2 text-muted-foreground">または</span>
              </div>
            </div>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                <path fill="none" d="M1 1h22v22H1z" />
              </svg>
              Googleでログイン
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Suspense } from 'react';

// Error messages mapping
const errorMessages: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: 'Server Configuration Error',
    description: 'There is a problem with the server configuration. Please contact support.',
  },
  AccessDenied: {
    title: 'Access Denied',
    description: 'You do not have permission to sign in.',
  },
  Verification: {
    title: 'Verification Error',
    description: 'The verification link may have expired or already been used.',
  },
  OAuthSignin: {
    title: 'OAuth Sign In Error',
    description: 'Error in constructing an authorization URL.',
  },
  OAuthCallback: {
    title: 'OAuth Callback Error',
    description: 'Error in handling the response from an OAuth provider.',
  },
  OAuthCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create OAuth provider user in the database.',
  },
  EmailCreateAccount: {
    title: 'Account Creation Error',
    description: 'Could not create email provider user in the database.',
  },
  Callback: {
    title: 'Callback Error',
    description: 'Error in the OAuth callback handler route.',
  },
  OAuthAccountNotLinked: {
    title: 'Account Not Linked',
    description: 'Email on the account is already linked, but not with this OAuth account.',
  },
  EmailSignin: {
    title: 'Email Sign In Error',
    description: 'Check if the email address is correct and try again.',
  },
  CredentialsSignin: {
    title: 'Sign In Failed',
    description: 'Invalid email or password. Please check your credentials.',
  },
  SessionRequired: {
    title: 'Session Required',
    description: 'You need to be signed in to access this page.',
  },
  Default: {
    title: 'Authentication Error',
    description: 'An error occurred during authentication. Please try again.',
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  
  const { title, description } = errorMessages[error] || errorMessages.Default;

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="glass rounded-2xl p-8 text-center">
            {/* Error Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-ink mb-3">
              {title}
            </h1>

            {/* Error Description */}
            <p className="text-ink/60 mb-8">
              {description}
            </p>

            {/* Error Code */}
            {error !== 'Default' && (
              <div className="mb-8 p-3 rounded-lg bg-ink/5 text-sm text-ink/50">
                Error code: <code className="font-mono">{error}</code>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-a1 text-white rounded-xl font-medium hover:bg-a1/90 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 glass text-ink rounded-xl font-medium hover:glass-strong transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Home
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-center text-sm text-ink/50 mt-6">
            If this problem persists, please{' '}
            <Link href="/contact" className="text-a1 hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-ink/60">Loading...</div>
        </div>
      </Layout>
    }>
      <ErrorContent />
    </Suspense>
  );
}
















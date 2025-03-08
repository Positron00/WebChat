import Chat from '@/components/Chat';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1C1C1C] text-white flex items-center justify-center">
      <div className="w-[75%] flex flex-col items-center gap-6">
        {/* Logo and Tagline */}
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={32}
            height={32}
            className="text-[#00FFE0]"
          />
          
          <h1 className="text-4xl font-light">
            Intelligence at your fingertips
          </h1>
        </div>

        {/* Chat Interface */}
        <ErrorBoundary>
          <Chat />
        </ErrorBoundary>
      </div>
    </main>
  );
}

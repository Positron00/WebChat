import Chat from '@/components/Chat';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1C1C1C] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="mb-2">
          <Image
            src="/logo.svg"
            alt="Logo"
            width={48}
            height={48}
            className="text-[#00FFE0]"
          />
        </div>
        
        {/* Tagline */}
        <h1 className="text-2xl md:text-3xl font-light text-center mb-8">
          Intelligence at your fingertips
        </h1>

        <ErrorBoundary>
          <Chat />
        </ErrorBoundary>
      </div>
    </main>
  );
}

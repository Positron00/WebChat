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
          
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-teal-300 font-playfair py-2 leading-relaxed">
              Intelligence at your fingertips
            </h1>
            <span className="text-lg text-teal-300">©</span>
          </div>
        </div>

        {/* Chat Interface */}
        <ErrorBoundary>
          <Chat />
        </ErrorBoundary>
      </div>
    </main>
  );
}

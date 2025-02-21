import Chat from '@/components/Chat';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <ErrorBoundary>
        <Chat />
      </ErrorBoundary>
    </main>
  );
}

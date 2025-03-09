import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { ChatProvider } from "@/contexts/ChatContext";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ 
  subsets: ["latin"],
  weight: "600",  // Semi-bold weight
  variable: '--font-playfair'
});

export const metadata: Metadata = {
  title: "AI Chatbot with Llama 3.3",
  description: "A modern chatbot powered by Together AI's Llama 3.3 model",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <AppProvider>
          <ChatProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
              <div
                id="offline-banner"
                className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center transform transition-transform duration-300 ease-in-out translate-y-[-100%] data-[visible=true]:translate-y-0"
                data-visible="false"
                role="alert"
                aria-live="polite"
              >
                You are currently offline. Some features may be limited.
              </div>
              {children}
            </div>
          </ChatProvider>
        </AppProvider>
      </body>
    </html>
  );
}

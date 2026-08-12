import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InactivityWatcher from '@/components/InactivityWatcher';
import { SmoothScrollProvider } from '@/components/providers/SmoothScrollProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { SplashIntro } from '@/components/ui/SplashIntro';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <SplashIntro />
      <CustomCursor />
      <InactivityWatcher timeoutMinutes={60} />
      <Header />
      <div className="min-h-screen">{children}</div>
      <Footer />
    </SmoothScrollProvider>
  );
}

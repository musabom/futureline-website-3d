import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InactivityWatcher from '@/components/InactivityWatcher';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InactivityWatcher timeoutMinutes={60} />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}


import { Sidebar } from '@/components/organisms/Sidebar';
import { WalletHeader } from '@/components/organisms/WalletHeader';

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <WalletHeader />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
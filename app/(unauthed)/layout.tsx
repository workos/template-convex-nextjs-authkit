import { ConvexClientProvider } from '@/components/ConvexClientProvider';

export default function UnauthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <ConvexClientProvider>{children}</ConvexClientProvider>;
}

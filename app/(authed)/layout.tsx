import { ConvexClientProvider } from '@/components/ConvexClientProvider';

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return <ConvexClientProvider expectAuth>{children}</ConvexClientProvider>;
}

// Отключаем пререндеринг для demo-viewer - страница полностью динамическая
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

export default function DemoViewerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}




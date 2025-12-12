import Layout from '../../components/Layout';

export default function Loading() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 w-48 bg-a1/10 rounded-lg animate-pulse mx-auto mb-4"></div>
          <div className="h-6 w-80 bg-a1/10 rounded animate-pulse mx-auto"></div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="glass rounded-3xl overflow-hidden animate-pulse">
              <div className="h-48 bg-a1/10"></div>
              <div className="p-6">
                <div className="h-6 bg-a1/10 rounded mb-3 w-3/4"></div>
                <div className="h-4 bg-a1/10 rounded mb-2"></div>
                <div className="h-4 bg-a1/10 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}










import Layout from '../../components/Layout';

export default function Loading() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        {/* Header skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 w-48 bg-a1/10 rounded-lg animate-pulse mx-auto mb-4"></div>
          <div className="h-6 w-72 bg-a1/10 rounded animate-pulse mx-auto"></div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="glass rounded-3xl p-6 text-center animate-pulse">
              <div className="w-32 h-32 bg-a1/10 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-a1/10 rounded mb-2 w-3/4 mx-auto"></div>
              <div className="h-4 bg-a1/10 rounded w-1/2 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}








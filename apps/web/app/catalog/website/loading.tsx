import Layout from '../../../components/Layout';

export default function Loading() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <div className="h-10 w-48 bg-a1/10 rounded-lg animate-pulse mb-2"></div>
            <div className="h-5 w-72 bg-a1/10 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-24 bg-a1/10 rounded-lg animate-pulse"></div>
            <div className="h-10 w-24 bg-a1/10 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Search bar skeleton */}
        <div className="h-12 w-full bg-a1/10 rounded-xl animate-pulse mb-8"></div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="glass rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-a1/10"></div>
              <div className="p-4">
                <div className="h-5 bg-a1/10 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-a1/10 rounded mb-4 w-1/2"></div>
                <div className="h-8 bg-a1/10 rounded mb-3"></div>
                <div className="flex gap-2">
                  <div className="h-10 bg-a1/10 rounded flex-1"></div>
                  <div className="h-10 bg-a1/10 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}












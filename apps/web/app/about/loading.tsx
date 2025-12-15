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

        {/* Content skeleton */}
        <div className="max-w-4xl mx-auto glass rounded-3xl p-8 animate-pulse">
          <div className="h-64 bg-a1/10 rounded-2xl mb-8"></div>
          <div className="h-5 bg-a1/10 rounded mb-3"></div>
          <div className="h-5 bg-a1/10 rounded mb-3 w-11/12"></div>
          <div className="h-5 bg-a1/10 rounded mb-3 w-10/12"></div>
          <div className="h-5 bg-a1/10 rounded w-9/12"></div>
        </div>
      </div>
    </Layout>
  );
}












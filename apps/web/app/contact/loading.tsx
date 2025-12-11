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

        {/* Form skeleton */}
        <div className="max-w-2xl mx-auto glass rounded-3xl p-8 animate-pulse">
          <div className="space-y-6">
            <div className="h-12 bg-a1/10 rounded-xl"></div>
            <div className="h-12 bg-a1/10 rounded-xl"></div>
            <div className="h-12 bg-a1/10 rounded-xl"></div>
            <div className="h-32 bg-a1/10 rounded-xl"></div>
            <div className="h-12 bg-a1/20 rounded-xl w-1/3"></div>
          </div>
        </div>
      </div>
    </Layout>
  );
}








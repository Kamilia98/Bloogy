import { Award, Rocket, Shield, Target, Users, Zap } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';

export default function FeaturesPage() {
  return (
    <PageLayout
      title="Features"
      subtitle="Discover the powerful tools that make Bloogy the perfect platform for creators."
    >
      <div className="space-y-16">
        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg">
            <div className="bg-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Lightning Fast
            </h3>
            <p className="text-gray-600">
              Optimized for speed with instant loading and smooth navigation.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg">
            <div className="bg-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your content is protected with enterprise-grade security.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg">
            <div className="bg-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <Rocket className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Easy Publishing
            </h3>
            <p className="text-gray-600">
              Write, edit, and publish your content with our intuitive editor.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg">
            <div className="bg-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Community Driven
            </h3>
            <p className="text-gray-600">
              Connect with readers and fellow creators in a vibrant community.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg">
            <div className="bg-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Analytics & Insights
            </h3>
            <p className="text-gray-600">
              Track your content performance with detailed analytics.
            </p>
          </div>

          <div className="rounded-lg border border-gray-100 bg-white p-6 shadow-lg">
            <div className="bg-primary mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
              <Award className="h-6 w-6 text-white" />
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Premium Templates
            </h3>
            <p className="text-gray-606">
              Beautiful, responsive templates to showcase your content.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

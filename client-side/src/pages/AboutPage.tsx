import { Users, Target, Award } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';

export default function AboutPage() {
  return (
    <PageLayout
      title="About Bloogy"
      subtitle="Building amazing experiences for our users. Connect, share, and grow with our platform."
    >
      <div className="space-y-16">
        {/* Mission Section */}
        <div className="text-center">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Our Mission
            </h2>
            <p className="text-lg leading-relaxed text-gray-600">
              At Bloogy, we believe in the power of storytelling and community.
              Our platform empowers creators, writers, and thinkers to share
              their ideas with the world while building meaningful connections
              with their audience.
            </p>
          </div>
        </div>

        {/* Values Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <div className="bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Community
            </h3>
            <p className="text-gray-600">
              Foster meaningful connections between creators and readers
              worldwide.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <div className="bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Purpose
            </h3>
            <p className="text-gray-600">
              Help creators share their stories and build their personal brand.
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-6 text-center">
            <div className="bg-primary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Award className="h-8 w-8 text-white" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              Excellence
            </h3>
            <p className="text-gray-600">
              Deliver the best blogging experience with powerful, intuitive
              tools.
            </p>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-900">
            Meet Our Team
          </h2>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-lg bg-white p-8 shadow-lg">
              <div className="from-primary to-tertiary mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br">
                <span className="text-2xl font-bold text-white">K</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold text-gray-900">
                Kamilia Ahmed
              </h3>
              <p className="text-primary mb-4 font-medium">
                Founder & Developer
              </p>
              <p className="text-gray-600">
                Passionate about creating digital experiences that empower
                creators and connect communities through the art of
                storytelling.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

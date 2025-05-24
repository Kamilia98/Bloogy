import { Eye } from "lucide-react";
import PageLayout from "../layouts/PageLayout";

export default function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      subtitle="How we collect, use, and protect your information."
    >
      <div className="prose prose-lg mx-auto max-w-4xl">
        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="flex items-center space-x-3">
            <Eye className="text-primary h-6 w-6" />
            <div>
              <h3 className="mb-1 font-semibold text-gray-900">
                Last updated: January 2024
              </h3>
              <p className="text-sm text-gray-600">
                This policy explains how Bloogy handles your personal
                information.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Information We Collect
            </h2>
            <p className="mb-4 text-gray-600">
              We collect information you provide directly to us, such as when
              you create an account, write blog posts, or contact us for
              support.
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Account information (name, email, profile details)</li>
              <li>Content you create (blog posts, comments, media)</li>
              <li>Communication data (support messages, feedback)</li>
              <li>Usage analytics (how you interact with our platform)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              How We Use Your Information
            </h2>
            <p className="mb-4 text-gray-600">
              We use the information we collect to provide, maintain, and
              improve our services.
            </p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Provide and maintain your account and content</li>
              <li>Send important updates and communications</li>
              <li>Improve our platform and develop new features</li>
              <li>Ensure security and prevent fraud</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Data Protection
            </h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your
              personal information against unauthorized access, alteration,
              disclosure, or destruction. Your data is encrypted in transit and
              at rest.
            </p>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Your Rights
            </h2>
            <p className="mb-4 text-gray-600">You have the right to:</p>
            <ul className="list-inside list-disc space-y-2 text-gray-600">
              <li>Access and update your personal information</li>
              <li>Delete your account and associated data</li>
              <li>Export your content and data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Contact Us
            </h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, please contact us
              at{' '}
              <a
                href="mailto:kamiliaahmed01@gmail.com"
                className="text-primary hover:underline"
              >
                kamiliaahmed01@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </PageLayout>
  );
}

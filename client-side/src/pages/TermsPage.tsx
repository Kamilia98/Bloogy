import { FileText } from "lucide-react";
import PageLayout from "../layouts/PageLayout";

export default function TermsPage() {
    return (
      <PageLayout
        title="Terms of Service"
        subtitle="The terms and conditions for using Bloogy."
      >
        <div className="prose prose-lg mx-auto max-w-4xl">
          <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-amber-600" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  Effective Date: January 2024
                </h3>
                <p className="text-sm text-gray-600">
                  By using Bloogy, you agree to these terms.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Acceptance of Terms
              </h2>
              <p className="text-gray-600">
                By accessing and using Bloogy, you accept and agree to be bound
                by the terms and provision of this agreement. These terms apply
                to all visitors, users, and others who access or use the
                service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Use of the Service
              </h2>
              <p className="mb-4 text-gray-600">
                You may use our service only for lawful purposes. You agree not
                to:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>
                  Violate any applicable local, state, national, or
                  international law
                </li>
                <li>
                  Transmit or post harmful, offensive, or inappropriate content
                </li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the service or servers</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                User Content
              </h2>
              <p className="text-gray-600">
                You retain ownership of content you create on Bloogy. By posting
                content, you grant us a license to use, display, and distribute
                your content as part of the service. You are responsible for
                ensuring you have the right to post any content you share.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Account Termination
              </h2>
              <p className="text-gray-600">
                We may terminate or suspend your account at our sole discretion
                if you violate these terms. You may also delete your account at
                any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Limitation of Liability
              </h2>
              <p className="text-gray-600">
                Bloogy shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages resulting from your
                use of the service.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Contact Information
              </h2>
              <p className="text-gray-600">
                Questions about the Terms of Service should be sent to{' '}
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

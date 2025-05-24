import { Cookie } from "lucide-react";
import PageLayout from "../layouts/PageLayout";

export default function CookiesPage () {
    return (
      <PageLayout
        title="Cookie Policy"
        subtitle="How we use cookies to improve your experience."
      >
        <div className="prose prose-lg mx-auto max-w-4xl">
          <div className="mb-8 rounded-lg border border-green-200 bg-green-50 p-6">
            <div className="flex items-center space-x-3">
              <Cookie className="h-6 w-6 text-green-600" />
              <div>
                <h3 className="mb-1 font-semibold text-gray-900">
                  Cookie Usage
                </h3>
                <p className="text-sm text-gray-600">
                  We use cookies to enhance your browsing experience.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                What Are Cookies
              </h2>
              <p className="text-gray-600">
                Cookies are small text files that are stored on your device when
                you visit our website. They help us provide you with a better
                experience by remembering your preferences and understanding how
                you use our site.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Types of Cookies We Use
              </h2>

              <div className="space-y-6">
                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Essential Cookies
                  </h3>
                  <p className="text-gray-600">
                    Required for the website to function properly. These include
                    authentication and security cookies.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Analytics Cookies
                  </h3>
                  <p className="text-gray-600">
                    Help us understand how visitors interact with our website by
                    collecting anonymous information.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6">
                  <h3 className="mb-2 font-semibold text-gray-900">
                    Preference Cookies
                  </h3>
                  <p className="text-gray-600">
                    Remember your settings and preferences to provide a
                    personalized experience.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Managing Cookies
              </h2>
              <p className="mb-4 text-gray-600">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-inside list-disc space-y-2 text-gray-600">
                <li>Use your browser settings to block or delete cookies</li>
                <li>Adjust your preferences in our cookie banner</li>
                <li>Opt out of analytics cookies through our settings</li>
                <li>Use private/incognito browsing mode</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Contact Us
              </h2>
              <p className="text-gray-600">
                If you have questions about our use of cookies, please contact
                us at{' '}
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



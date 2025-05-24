import { MessageCircle } from 'lucide-react';
import PageLayout from '../layouts/PageLayout';

export default function HelpCenterPage() {
  return (
    <PageLayout
      title="Help Center"
      subtitle="Find answers to common questions and get the support you need."
    >
      <div className="space-y-12">
        {/* FAQ Section */}
        <div>
          <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-4xl space-y-4">
            {[
              {
                q: 'How do I create my first blog post?',
                a: "Click the 'New Post' button in your dashboard, use our intuitive editor to write your content, add images if needed, and hit publish when you're ready.",
              },
              {
                q: 'Can I customize the appearance of my blog?',
                a: 'Yes! We offer various themes and customization options to make your blog uniquely yours. Access these through your settings panel.',
              },
              {
                q: 'How do I connect with other bloggers?',
                a: 'Use our discovery features to find blogs in your niche, follow other creators, and engage with their content through comments and likes.',
              },
              {
                q: 'Is there a mobile app available?',
                a: "While we don't have a dedicated mobile app yet, our website is fully responsive and works great on all devices.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="mb-2 font-semibold text-gray-900">{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="rounded-lg bg-gray-50 p-8 text-center">
          <MessageCircle className="text-primary mx-auto mb-4 h-16 w-16" />
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Still need help?
          </h3>
          <p className="mb-4 text-gray-600">
            Our support team is here to help you with any questions.
          </p>
          <button className="bg-primary hover:bg-tertiary rounded-lg px-6 py-2 text-white transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </PageLayout>
  );
}

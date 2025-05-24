import {
  Clock,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from 'lucide-react';
import PageLayout from '../layouts/PageLayout';

export default function ContactPage() {
  return (
    <PageLayout
      title="Contact Us"
      subtitle="Get in touch with us. We'd love to hear from you."
    >
      <div className="mx-auto max-w-4xl">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Contact Form */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Send us a message
            </h2>
            <form className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Subject
                </label>
                <input
                  type="text"
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="How can we help?"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Message
                </label>
                <textarea
                  rows={5}
                  className="focus:border-primary focus:ring-primary w-full rounded-lg border border-gray-300 px-4 py-2"
                  placeholder="Your message..."
                />
              </div>
              <button className="bg-primary hover:bg-tertiary w-full rounded-lg py-3 text-white transition-colors">
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="mb-6 text-2xl font-bold text-gray-900">
              Get in touch
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Email</h3>
                  <p className="text-gray-600">kamiliaahmed01@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Phone</h3>
                  <p className="text-gray-600">+20 1124529888</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Location</h3>
                  <p className="text-gray-600">Cairo, Egypt</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Response Time</h3>
                  <p className="text-gray-600">Usually within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <h3 className="mb-4 font-semibold text-gray-900">Follow us</h3>
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all"
                >
                  <Twitter size={16} />
                </a>
                <a
                  href="#"
                  className="hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="#"
                  className="hover:border-primary hover:text-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all"
                >
                  <Github size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

import Link from 'next/link';
import { Brain, Cpu, Zap, Bot, Mail, Clock, ArrowRight, Sparkles, Cog, BarChart3 } from 'lucide-react';
import type { Metadata } from 'next';
import { getBrandSettings } from '@/lib/brand';

export const metadata: Metadata = {
  title: 'AI & Automation — FutureLine | Intelligent Business Solutions',
  description: 'AI-powered solutions to help businesses automate processes, gain insights, and operate smarter. Machine learning, process automation, and AI-powered analytics.',
  openGraph: {
    title: 'AI & Automation — FutureLine',
    description: 'AI-powered solutions to help businesses automate processes, gain insights, and operate smarter.',
    type: 'website',
    url: '/ai',
  },
};

export default async function AIPage() {
  const brand = await getBrandSettings();
  const contactEmail = brand.contactEmail;

  return (
    <>
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute top-40 left-1/2 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-4">FL AI & Automation</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Intelligent Systems,{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Coming Soon</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              We are building AI-powered solutions to help businesses automate processes, gain insights, and operate smarter.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Our AI & Automation division is currently in development. Get in touch to discuss your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`mailto:${contactEmail}?subject=FL%20AI%20Enquiry`}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Get in Touch <Mail size={18} />
              </Link>
              <Link
                href="/courses"
                className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-navy inline-flex items-center justify-center gap-2"
              >
                Explore Our Courses <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-3">What We're Building</span>
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">AI Capabilities</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Here is a preview of the AI-powered services we are preparing to launch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Machine Learning',
                desc: 'Custom ML models that learn and adapt to your business data for predictive analytics and automation.',
              },
              {
                icon: Cog,
                title: 'Process Automation',
                desc: 'Intelligent automation solutions that streamline workflows and reduce manual effort across your organisation.',
              },
              {
                icon: BarChart3,
                title: 'AI-Powered Analytics',
                desc: 'Turn raw data into actionable insights with AI-driven dashboards, reports, and decision support tools.',
              },
            ].map((item) => (
              <div key={item.title} className="card p-8 text-center relative overflow-hidden group">
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-semibold rounded-full flex items-center gap-1">
                    <Clock size={10} /> Coming Soon
                  </span>
                </div>
                <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-teal/20 transition-all">
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-3">The Vision</span>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                AI That Works for Your Business
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our approach is practical and results-driven. We do not believe in AI for the sake of AI. Every solution we build is designed to solve a real problem, save time, and deliver measurable impact.
              </p>
              <ul className="space-y-4">
                {[
                  'Custom AI models tailored to your industry and data',
                  'Automation of repetitive tasks and decision-making',
                  'Integration with your existing tools and workflows',
                  'Ongoing support and model improvement',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Sparkles className="text-teal mt-1 flex-shrink-0" size={16} />
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '50+', label: 'AI Projects Planned' },
                { num: '98%', label: 'Target Satisfaction' },
                { num: '5+', label: 'Industries Served' },
                { num: '24/7', label: 'AI-Powered Systems' },
              ].map((stat) => (
                <div key={stat.label} className="card p-6 text-center">
                  <div className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent mb-2">{stat.num}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20">
            <Bot className="text-teal" size={36} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Interested in AI for Your Business?
          </h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            We are currently taking expressions of interest. Tell us about your challenge and we will reach out when our AI services go live.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`mailto:${contactEmail}?subject=FL%20AI%20-%20Expression%20of%20Interest`}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Express Interest <Mail size={18} />
            </Link>
            <Link
              href="/courses"
              className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-navy inline-flex items-center justify-center gap-2"
            >
              Browse Courses <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

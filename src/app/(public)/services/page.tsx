'use client';
import Link from 'next/link';
import {
  ArrowRight, ArrowDown, Factory, Building2, Landmark,
  GraduationCap, Briefcase, Layers, Mail, Plus
} from 'lucide-react';

const services = [
  {
    id: 'digitalisation',
    name: 'Digitalisation',
    shortDescription: 'We turn scattered workflows into one structured, trackable system—improving governance, accountability, and efficiency.',
    tags: ['Workflow', 'Governance', 'Dashboards', 'Automation'],
    icon: Layers,
    href: '/services/digitalisation',
    active: true,
  },
];

const industries = [
  { name: 'Oil & Gas', icon: Factory },
  { name: 'Construction & Infrastructure', icon: Building2 },
  { name: 'Government & Public Sector', icon: Landmark },
  { name: 'Education & Training', icon: GraduationCap },
  { name: 'SMEs Scaling Operations', icon: Briefcase },
];

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

export default function ServicesPage() {
  return (
    <>
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-4">FL Services</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Practical Solutions That{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Deliver Results</span>
            </h1>
            <p className="text-xl text-gray-300 mb-4 leading-relaxed">
              Practical solutions that improve how organizations operate, communicate, and deliver results.
            </p>
            <p className="text-sm text-gray-400 mb-8">
              Currently available: <span className="text-teal font-medium">Digitalisation</span> — more services coming soon.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="mailto:contact@futureline.com"
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Book a Consultation <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => scrollTo('services-grid')}
                className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-navy inline-flex items-center justify-center gap-2"
              >
                Explore Services <ArrowDown size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="services-grid" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-3">What We Offer</span>
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">Our Services</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Scalable solutions designed to transform how your organization operates.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="card p-8 flex flex-col hover:shadow-lg transition-shadow duration-300">
                <div className="w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-navy mb-3">{service.name}</h3>
                <p className="text-gray-500 mb-5 flex-1 leading-relaxed">{service.shortDescription}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {service.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium bg-teal/10 text-teal">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link
                  href={service.href}
                  className="btn-primary inline-flex items-center justify-center gap-2 w-full"
                >
                  View Details <ArrowRight size={16} />
                </Link>
              </div>
            ))}

            <div className="card p-8 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-gray-50/50">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-6">
                <Plus className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-gray-400 mb-2">More Services Coming Soon</h3>
              <p className="text-gray-400 text-sm text-center leading-relaxed">
                We are expanding FL Services. Stay tuned.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-3">Industries</span>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Who We Support</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {industries.map((industry) => (
              <div key={industry.name} className="card p-6 text-center hover:shadow-md transition-shadow group">
                <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-gradient transition-colors">
                  <industry.icon className="text-teal group-hover:text-white transition-colors" size={22} />
                </div>
                <p className="text-sm font-semibold text-navy">{industry.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-teal/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Want to Improve Governance and Efficiency?
          </h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Let&apos;s review your current workflow and recommend a clear digital approach—then build a system your teams actually use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="mailto:contact@futureline.com?subject=Strategy%20Session%20Request"
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Book a Strategy Session <ArrowRight size={18} />
            </Link>
            <Link
              href="mailto:contact@futureline.com"
              className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-navy inline-flex items-center justify-center gap-2"
            >
              Contact Us <Mail size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

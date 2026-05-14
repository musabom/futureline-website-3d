import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Wrench, MessageSquare } from 'lucide-react';
import ServiceEnquiryForm from '@/components/ServiceEnquiryForm';
import ServicesScrollBtn from '@/components/ui/services-scroll-btn';
import MetricCards from '@/components/ui/MetricCards';
import { MorphicBackground } from '@/components/ui/morhic-background';
import HeroBullets from '@/components/ui/hero-bullets';

export const dynamic = 'force-dynamic';

const CATEGORY_COLORS: Record<string, string> = {
  'AI & Automation': 'bg-teal-500/10 border-teal-500/20 text-teal-400',
  'Consulting':      'bg-blue-500/10 border-blue-500/20 text-blue-400',
  'Training':        'bg-purple-500/10 border-purple-500/20 text-purple-400',
  'Digital':         'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
};

function categoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? 'bg-slate-500/10 border-slate-500/20 text-slate-400';
}

// Maps service title → page slug
const SERVICE_SLUGS: Record<string, string> = {
  'Digitalisation':  '/services/digitalisation',
  'Custom Software': '/services/custom-software',
  'Automations':     '/services/automations',
  'Consultation':    '/services/consultation',
};

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { status: 'ACTIVE' },
    orderBy: [{ featured: 'desc' }, { createdAt: 'asc' }],
  });

  return (
    <div className="min-h-screen bg-[#030d1a]">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        {/* Lava-lamp goo bubbles — z-[1], behind gradients and content */}
        <MorphicBackground />

        {/* Gradient overlays — z-[10] */}
        <div className="absolute inset-0 z-[10] bg-gradient-to-br from-[#18a999]/5 via-[#030d1a]/75 to-[#030d1a]" />
        <div className="absolute -top-32 -right-32 z-[10] w-96 h-96 bg-[#18a999]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 z-[10] w-72 h-72 bg-[#18a999]/[0.05] rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-[20] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#18a999]/15 border border-[#18a999]/30 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#18a999]" />
                <span className="text-[11px] text-[#18a999] font-bold tracking-widest uppercase">Business Solutions</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tight">
                Practical Solutions That{' '}
                <span
                  style={{
                    background: 'linear-gradient(to right, #2dd4bf, #3b82f6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Deliver Results
                </span>
              </h1>

              {/* Staggered bullet points — client component */}
              <HeroBullets />

              <div className="flex flex-col sm:flex-row gap-3">
                <ServicesScrollBtn />
              </div>
            </div>

            {/* Right: animated metric cards */}
            <MetricCards />

          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section id="services" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-[#18a999]" />
              <span className="text-sm font-bold text-[#18a999] tracking-widest uppercase">Available Now</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight">Our Services</h2>
          </div>

          {services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Wrench className="text-slate-700 mb-4" size={48} />
              <p className="text-slate-400 font-semibold">No services listed yet</p>
              <p className="text-slate-600 text-sm mt-1">Check back soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((service) => {
                const slug = SERVICE_SLUGS[service.title];
                const className = "group rounded-xl border border-white/[0.07] bg-slate-950/40 backdrop-blur-sm hover:border-[#18a999]/30 hover:shadow-xl hover:shadow-[#18a999]/[0.08] transition-all duration-300 p-6 flex flex-col cursor-pointer";

                const inner = (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#18a999]/10 border border-[#18a999]/20 flex items-center justify-center">
                        <Wrench size={18} className="text-[#18a999]" />
                      </div>
                      {service.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-teal-500/10 border border-teal-500/20 text-teal-400">
                          Featured
                        </span>
                      )}
                    </div>
                    <span className={`self-start px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-widest mb-3 ${categoryColor(service.category)}`}>
                      {service.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mb-2 group-hover:text-teal-300 transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed flex-1 mb-4">
                      {service.description}
                    </p>
                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                        {service.pricingModel ?? 'Learn More'}
                      </span>
                      <ArrowRight size={13} className="text-slate-600 group-hover:text-teal-400 group-hover:translate-x-1 transition-all" />
                    </div>
                  </>
                );

                if (slug) {
                  return (
                    <Link key={service.id} href={slug} className={className}>
                      {inner}
                    </Link>
                  );
                }
                return (
                  <div key={service.id} className={className}>
                    {inner}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Enquiry ── */}
      <section id="enquiry" className="py-20 border-t border-white/[0.06]">
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="text-white" size={24} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-3">Get in Touch</h2>
            <p className="text-slate-400 leading-relaxed">
              Tell us about your project and we&apos;ll recommend the right approach for your organisation.
            </p>
          </div>
          <ServiceEnquiryForm />
        </div>
      </section>

    </div>
  );
}

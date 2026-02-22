import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Cpu, ArrowRight, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: { status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-2">Our Services</h1>
        <p className="text-gray-500">Professional digital solutions for your business</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {services.map((service) => (
          <div key={service.id} className="card p-8 flex flex-col">
            <div className="w-14 h-14 bg-brand-gradient rounded-2xl flex items-center justify-center mb-6">
              <Cpu className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3">{service.title}</h3>
            <p className="text-gray-500 mb-4 flex-1 leading-relaxed">{service.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-sm font-semibold text-teal">{service.category}</span>
              <span className="text-sm text-gray-400">{service.pricingModel}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-navy rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Solution?</h2>
        <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
          Our team of experts is ready to help you design and implement the perfect solution for your business challenges.
        </p>
        <Link
          href="mailto:contact@futureline.com"
          className="bg-white text-navy px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center gap-2"
        >
          Request Consultation <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ArrowLeft, CheckCircle, Workflow, Shield, BarChart3,
  Zap, AlertTriangle, Clock, Eye, FileText, Users,
  MessageSquare, Target, TrendingUp, Lock, Bell,
  Database, Bot, Layers, Mail, ExternalLink
} from 'lucide-react';

const deliverySteps = [
  {
    step: 1,
    title: 'Process Mapping',
    description: 'We understand your workflows, approvals, and bottlenecks.',
    icon: Target,
  },
  {
    step: 2,
    title: 'Governance Design',
    description: 'We define roles, responsibilities, SLAs, and accountability.',
    icon: Shield,
  },
  {
    step: 3,
    title: 'Custom System Build',
    description: 'We build a centralized app tailored to your business logic.',
    icon: Layers,
  },
  {
    step: 4,
    title: 'KPI & Intelligence Layer',
    description: 'Dashboards, reporting, and optional AI-powered insights.',
    icon: BarChart3,
  },
];

const deliverables = [
  { text: 'Centralized workflow management', icon: Workflow },
  { text: 'Role-based access & approvals', icon: Lock },
  { text: 'Automated notifications & tracking', icon: Bell },
  { text: 'Real-time dashboards & reporting', icon: BarChart3 },
  { text: 'Audit trail & governance visibility', icon: Eye },
  { text: 'Scalable and secure architecture', icon: Database },
  { text: 'Optional: AI Knowledge Assistant connected to your internal knowledge base', icon: Bot },
];

const problems = [
  { text: 'Communication scattered across emails, WhatsApp, and spreadsheets', icon: MessageSquare },
  { text: 'No clear accountability or workflow ownership', icon: Users },
  { text: 'Delayed approvals and operational bottlenecks', icon: Clock },
  { text: 'Limited visibility on KPIs and performance', icon: Eye },
  { text: 'Manual reporting and duplicated effort', icon: FileText },
];

const outcomes = [
  'Faster response and approval cycles',
  'Clear ownership and accountability',
  'Centralized records and audit trail',
  'Live status tracking and KPIs',
  'Reduced operational friction',
];

export default function DigitalisationPage() {
  const [contactEmail, setContactEmail] = useState('flservices.ai@gmail.com');

  useEffect(() => {
    fetch('/api/brand').then(r => r.json()).then(data => {
      if (data?.contactEmail) setContactEmail(data.contactEmail);
    }).catch(() => {});
  }, []);

  return (
    <>
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <Link href="/services" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-4">FL Services</span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Digitalisation
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              FutureLine designs customizable business applications that centralize operations, eliminate fragmented communication, and create measurable performance through governance and KPIs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href={`mailto:${contactEmail}?subject=Digitalisation%20Consultation`}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                Book a Consultation <ArrowRight size={18} />
              </Link>
              <a
                href="https://turnaround-hub.replit.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-navy inline-flex items-center justify-center gap-2"
              >
                View Live Demo <ExternalLink size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-blue-500" size={20} />
            </div>
            <h2 className="text-2xl font-bold text-navy">Live Case</h2>
          </div>
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 lg:p-10">
            <p className="text-gray-600 leading-relaxed mb-6 text-lg">
              Useful for complex environments where requests, approvals, and updates are spread across multiple tools. The hub centralizes communication, provides traceability, and gives leadership real-time visibility.
            </p>
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-navy uppercase tracking-wider mb-4">Outcomes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-teal flex-shrink-0" size={18} />
                    <span className="text-gray-600">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">See a live example of a digitalisation project:</p>
              <a
                href="https://turnaround-hub.replit.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-navy text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-light transition-colors text-sm"
              >
                View Turnaround Hub Demo <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-navy">What We Fix</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {problems.map((problem, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-100 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <problem.icon className="text-red-400" size={18} />
                </div>
                <p className="text-gray-600 leading-relaxed">{problem.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center">
              <Zap className="text-teal" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-navy">How We Deliver</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliverySteps.map((step) => (
              <div key={step.step} className="bg-gray-50 rounded-xl p-6 border border-gray-100 relative hover:shadow-md transition-shadow">
                <div className="absolute -top-3 -left-3 w-8 h-8 bg-brand-gradient rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md">
                  {step.step}
                </div>
                <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mb-4 mt-2">
                  <step.icon className="text-teal" size={22} />
                </div>
                <h4 className="text-lg font-bold text-navy mb-2">{step.title}</h4>
                <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="text-green-500" size={20} />
            </div>
            <h3 className="text-2xl font-bold text-navy">What You Get</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {deliverables.map((item, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-green-500" size={18} />
                </div>
                <p className="text-gray-700 font-medium text-sm">{item.text}</p>
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
            Ready to Digitalise Your Operations?
          </h2>
          <p className="text-gray-300 mb-8 text-lg leading-relaxed">
            Let&apos;s review your current workflow and recommend a clear digital approach—then build a system your teams actually use.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`mailto:${contactEmail}?subject=Digitalisation%20Strategy%20Session`}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Book a Strategy Session <ArrowRight size={18} />
            </Link>
            <Link
              href={`mailto:${contactEmail}`}
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

import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { ArrowRight, Brain, Rocket, TrendingUp, Star, Users, BookOpen, Cpu, Compass, GraduationCap, Briefcase, Bot } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'FutureLine — Design. Deploy. Evolve. | AI Solutions & Professional Training',
  description: 'AI-driven solutions, professional training, and intelligent digital services that empower your business to thrive in the modern era. Explore courses, services, tourism, and AI.',
  openGraph: {
    title: 'FutureLine — Design. Deploy. Evolve.',
    description: 'AI-driven solutions, professional training, and intelligent digital services that empower your business to thrive in the modern era.',
    type: 'website',
    url: '/',
  },
};

export default async function HomePage() {
  const featuredCourses = await prisma.course.findMany({
    where: { status: 'PUBLISHED', approvalStatus: 'APPROVED' },
    include: { instructor: { select: { name: true } } },
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  const services = await prisma.service.findMany({
    where: { featured: true, status: 'ACTIVE' },
    take: 3,
  });

  const testimonials = await prisma.testimonial.findMany({
    where: { featured: true },
    take: 3,
  });

  return (
    <>
      <section className="relative bg-navy overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy-light to-navy opacity-90" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-teal/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-36">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Design. Deploy.{' '}
              <span className="bg-brand-gradient bg-clip-text text-transparent">Evolve.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              AI-driven solutions, professional training, and intelligent digital services
              that empower your business to thrive in the modern era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/courses" className="btn-primary inline-flex items-center justify-center gap-2">
                Explore Courses <ArrowRight size={18} />
              </Link>
              <Link href="/services" className="btn-secondary !border-white !text-white hover:!bg-white hover:!text-navy inline-flex items-center justify-center gap-2">
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal/5 rounded-full blur-3xl -translate-y-1/2" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-teal tracking-wider uppercase mb-3">Our Divisions</span>
            <h2 className="text-3xl md:text-5xl font-bold text-navy mb-4">Business Divisions</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              Four specialised divisions delivering excellence across industries
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Compass,
                title: 'FL Tourism',
                desc: 'Authentic tours & destination experiences',
                gradient: 'from-[#0F1E3D] to-[#1B4B6D]',
                accent: 'bg-sky-400/20 text-sky-300',
                href: '/tourism',
                comingSoon: false,
              },
              {
                icon: GraduationCap,
                title: 'FL Courses',
                desc: 'Professional & technical education',
                gradient: 'from-[#1B2C63] to-[#18A999]',
                accent: 'bg-teal/20 text-teal-300',
                href: '/courses',
                comingSoon: false,
              },
              {
                icon: Briefcase,
                title: 'FL Services',
                desc: 'Consulting & operational solutions',
                gradient: 'from-[#0F1E3D] to-[#2D3A6E]',
                accent: 'bg-indigo-400/20 text-indigo-300',
                href: '/services',
                comingSoon: true,
              },
              {
                icon: Bot,
                title: 'FL AI',
                desc: 'Artificial intelligence & automation systems',
                gradient: 'from-[#1B2C63] to-[#0F8B6E]',
                accent: 'bg-emerald-400/20 text-emerald-300',
                href: '/ai',
                comingSoon: true,
              },
            ].map((division) => (
              <Link
                key={division.title}
                href={division.href}
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${division.gradient}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_60%)]" />
                {division.comingSoon && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 bg-amber-400/90 text-navy text-[10px] font-bold uppercase rounded-full tracking-wider">
                      Coming Soon
                    </span>
                  </div>
                )}
                <div className="relative p-8 flex flex-col items-center text-center min-h-[280px] justify-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${division.accent} backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-300`}>
                    <division.icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-wide">{division.title}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">{division.desc}</p>
                  <div className="mt-6 w-12 h-0.5 bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:w-20 transition-all duration-500" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">What We Do</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Comprehensive solutions across three pillars of digital excellence
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Brain, title: 'Design', desc: 'We craft intelligent AI solutions and custom software tailored to your unique business challenges and goals.' },
              { icon: Rocket, title: 'Deploy', desc: 'From cloud infrastructure to training delivery, we bring solutions to life with precision and reliability.' },
              { icon: TrendingUp, title: 'Evolve', desc: 'Continuous improvement through data-driven insights, upskilling, and adaptive technology strategies.' },
            ].map((item) => (
              <div key={item.title} className="card p-8 text-center group hover:-translate-y-1">
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

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-2">Featured Courses</h2>
              <p className="text-gray-500">Start your learning journey today</p>
            </div>
            <Link href="/courses" className="hidden sm:flex items-center gap-2 text-teal font-semibold hover:gap-3 transition-all">
              View All <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Link href={`/courses/${course.slug}`} key={course.id} className="card overflow-hidden group">
                <div className="h-48 bg-brand-gradient flex items-center justify-center">
                  <BookOpen className="text-white/50" size={48} />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold px-2 py-1 bg-teal/10 text-teal rounded-full">
                      {course.deliveryType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-400">{course.level}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-teal transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">{course.shortDescription}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="font-bold text-teal text-lg">Free</span>
                    <span className="text-xs text-gray-400">{course.durationHours}h</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="sm:hidden text-center mt-8">
            <Link href="/courses" className="btn-primary inline-flex items-center gap-2">View All Courses <ArrowRight size={18} /></Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                AI-Powered Solutions for Your Business
              </h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Leverage cutting-edge artificial intelligence to automate processes, gain insights,
                and stay ahead of the competition. Our AI recommendation engine can help you find
                the perfect training path for your goals.
              </p>
              <Link href="/ai" className="btn-primary inline-flex items-center gap-2">
                Explore AI Solutions <Cpu size={18} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { num: '50+', label: 'AI Projects Delivered' },
                { num: '98%', label: 'Client Satisfaction' },
                { num: '200+', label: 'Students Trained' },
                { num: '15+', label: 'Industry Partners' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
                  <div className="text-3xl font-bold bg-brand-gradient bg-clip-text text-transparent mb-2">
                    {stat.num}
                  </div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {services.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">Our Services</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Professional solutions tailored to your needs</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service) => (
                <div key={service.id} className="card p-8">
                  <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center mb-4">
                    <Cpu className="text-teal" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-3">{service.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-3">{service.description}</p>
                  <span className="text-xs font-semibold text-teal">{service.pricingModel}</span>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link href="/services" className="btn-secondary inline-flex items-center gap-2">
                View All Services <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4">What Our Clients Say</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <div key={t.id} className="card p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="text-yellow-400 fill-yellow-400" size={16} />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">&ldquo;{t.content}&rdquo;</p>
                  <div>
                    <div className="font-semibold text-navy">{t.name}</div>
                    <div className="text-sm text-gray-400">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-brand-gradient">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Future?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join hundreds of professionals who have upskilled with FutureLine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses" className="bg-white text-navy px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center gap-2">
              Browse Courses <ArrowRight size={18} />
            </Link>
            <Link href="/register" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center gap-2">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

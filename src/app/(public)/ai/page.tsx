import { prisma } from '@/lib/prisma';
import { Brain, Cpu, Zap, Target } from 'lucide-react';
import AIRecommendationForm from '@/components/AIRecommendationForm';

export const dynamic = 'force-dynamic';

export default async function AIPage() {
  const aiSettings = await prisma.aISettings.findFirst();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">AI Solutions</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Harness the power of artificial intelligence to transform your business and advance your skills.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Brain, title: 'Machine Learning', desc: 'Custom ML models that learn and adapt to your business data for predictive analytics and automation.' },
          { icon: Cpu, title: 'Process Automation', desc: 'Intelligent automation solutions that streamline workflows and reduce manual effort across your organisation.' },
          { icon: Zap, title: 'AI Integration', desc: 'Seamlessly integrate AI capabilities into your existing systems and applications for enhanced performance.' },
        ].map((item) => (
          <div key={item.title} className="card p-8 text-center">
            <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
              <item.icon className="text-white" size={28} />
            </div>
            <h3 className="text-xl font-bold text-navy mb-3">{item.title}</h3>
            <p className="text-gray-500">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Target className="text-white" size={28} />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-navy mb-2">AI Course Recommendation</h2>
          <p className="text-gray-500">
            {aiSettings?.welcomeMessage || 'Tell us about your goals and we\'ll recommend the perfect course for you.'}
          </p>
        </div>
        <AIRecommendationForm />
      </div>
    </div>
  );
}

import Container from '@/shared/components/Container';
import {
  Bot,
  Check,
  Film,
  HardDrive,
  Radio,
  Shield,
  Sparkles,
  Star,
  Users,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

interface Plan {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: React.ElementType;
  features: {
    text: string;
    included: boolean;
    highlight?: boolean;
  }[];
  popular?: boolean;
}

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans: Plan[] = [
    {
      id: 'starter',
      name: 'Starter',
      price: 0,
      description: 'Perfect for getting started with streaming',
      icon: Star,
      features: [
        { text: '10 Widgets', included: true },
        { text: '30 Media Storage Items', included: true },
        { text: '100MB Storage Space', included: true },
        { text: 'Basic Chatbot', included: true },
        { text: '1 Editor/Moderator Slot', included: true },
        { text: '100 AI Tokens Monthly', included: true },
        { text: 'Basic Moderation Tools', included: true },
        { text: 'Real-time Apps', included: false },
        { text: 'Priority Support', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Professional',
      price: 3.99,
      description: 'Everything you need for professional streaming',
      icon: Zap,
      popular: true,
      features: [
        { text: 'Unlimited Widgets', included: true, highlight: true },
        { text: '100 Media Storage Items', included: true },
        { text: '5GB Storage Space', included: true },
        { text: 'Advanced Chatbot', included: true },
        { text: '5 Editor/Moderator Slots', included: true },
        { text: '1000 AI Tokens Monthly', included: true },
        { text: 'Advanced Moderation Tools', included: true },
        { text: 'Real-time Apps', included: true, highlight: true },
        { text: 'Priority Support', included: true },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 19.99,
      description: 'Advanced features for large communities',
      icon: Shield,
      features: [
        { text: 'Unlimited Widgets', included: true },
        { text: 'Unlimited Media Storage', included: true, highlight: true },
        { text: '50GB Storage Space', included: true, highlight: true },
        { text: 'Custom Chatbot', included: true },
        {
          text: 'Unlimited Editor/Moderator Slots',
          included: true,
          highlight: true,
        },
        { text: 'Unlimited AI Tokens', included: true, highlight: true },
        { text: 'Enterprise Moderation Suite', included: true },
        { text: 'Real-time Apps + Custom Apps', included: true },
        { text: '24/7 Priority Support', included: true },
      ],
    },
  ];

  const features = [
    {
      icon: Bot,
      title: 'Smart Chatbot',
      description: 'AI-powered chatbot to engage with your audience',
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Collaborate with editors and moderators',
    },
    {
      icon: HardDrive,
      title: 'Media Storage',
      description: 'Secure cloud storage for your streaming assets',
    },
    {
      icon: Sparkles,
      title: 'AI Features',
      description: 'Powerful AI tools to enhance your stream',
    },
    {
      icon: Radio,
      title: 'Custom Widgets',
      description: 'Beautiful overlays and alerts for your stream',
    },
    {
      icon: Film,
      title: 'Media Management',
      description: 'Organize and manage all your streaming media',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Get started for free and upgrade as you grow. All plans include core
          features to help you succeed.
        </p>

        <div className="mt-8 inline-flex items-center p-1 bg-white/5 rounded-lg">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !isAnnual
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isAnnual
                ? 'bg-purple-500 text-white'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Annual
            <span className="ml-1 text-xs text-purple-400">Save 20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {plans.map((plan) => {
          const Icon = plan.icon;
          const price = isAnnual ? plan.price * 0.8 * 12 : plan.price;

          return (
            <div
              key={plan.id}
              className={`
                  relative glass rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]
                  ${plan.popular ? 'ring-2 ring-purple-500' : ''}
                `}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-3 py-1 text-sm font-medium rounded-bl-lg">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-200">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <Icon
                    className={`h-8 w-8 ${
                      plan.popular ? 'text-purple-400' : 'text-gray-400'
                    }`}
                  />
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-200">
                      ${price.toFixed(2)}
                    </span>
                    <span className="text-gray-400 ml-2">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check
                        className={`h-5 w-5 mr-3 mt-0.5 ${
                          feature.included
                            ? feature.highlight
                              ? 'text-purple-400'
                              : 'text-green-400'
                            : 'text-gray-500'
                        }`}
                      />
                      <span
                        className={`text-sm ${
                          feature.included
                            ? feature.highlight
                              ? 'text-purple-300 font-medium'
                              : 'text-gray-300'
                            : 'text-gray-500'
                        }`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  className={`
                      w-full rounded-lg px-4 py-2 font-medium transition-colors
                      ${
                        plan.popular
                          ? 'bg-purple-500 hover:bg-purple-600 text-white'
                          : 'bg-white/5 hover:bg-white/10 text-gray-200'
                      }
                    `}
                >
                  {plan.price === 0 ? 'Get Started' : 'Subscribe Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center mb-12">
        <h2 className="text-2xl font-bold text-gray-200 mb-4">
          Everything You Need to Stream Like a Pro
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          All plans include essential features to help you create engaging
          streams and manage your community.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <Container key={index} className="p-6">
              <div className="bg-purple-500/20 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </Container>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Configure page - User selects deployment options
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import ConfigForm from '@/components/ConfigForm';
import TraitSelector from '@/components/TraitSelector/TraitSelector';
import ThemeToggle from '@/components/ThemeToggle';
import { DeploymentConfig, AgentType, PersonalityTraits } from '@/types';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Configure() {
  const router = useRouter();
  const [agentType, setAgentType] = useState<AgentType>('standard');
  const [traits, setTraits] = useState<PersonalityTraits>({
    responseLength: 'balanced',
    communicationStyle: 'casual',
    technicalLevel: 'balanced',
    personality: ['friendly'],
    special: [],
  });

  const handleGenerate = () => {
    // Save config to localStorage
    const config: DeploymentConfig = {
      agentType,
      traits,
    };
    localStorage.setItem('deploymentConfig', JSON.stringify(config));

    // Navigate to deploy page
    router.push('/deploy');
  };

  return (
    <div className="min-h-screen bg-bg-primary dark:bg-bg-primary-dark">
      {/* Header */}
      <header className="border-b border-border dark:border-border-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark hover:opacity-80 transition-opacity">
              SecretForge
            </h1>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h2 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
              Configure Your Deployment
            </h2>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              Choose your AI agent type for your private chat service
            </p>
          </div>

          {/* Configuration Form */}
          <ConfigForm
            agentType={agentType}
            onAgentTypeChange={setAgentType}
          />

          {/* Personality Traits Selection */}
          <div className="mt-8">
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
              Personality Traits
            </h3>
            <p className="text-text-secondary dark:text-text-secondary-dark mb-6">
              Customize how your AI agent communicates
            </p>
            <TraitSelector traits={traits} onTraitsChange={setTraits} />
          </div>

          {/* Actions */}
          <div className="mt-8 flex gap-4">
            <Button onClick={handleGenerate} size="lg" className="flex-1">
              Generate Deployment
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 rounded-lg bg-bg-secondary dark:bg-bg-secondary-dark border border-border dark:border-border-dark">
            <h3 className="font-semibold text-text-primary dark:text-text-primary-dark mb-2">
              What happens next?
            </h3>
            <ul className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-1">
              <li>• We'll generate a docker-compose.yml file for your configuration</li>
              <li>• You'll copy the file and paste it into the SecretAI portal</li>
              <li>• Add your SecretAI API key as an environment variable</li>
              <li>• Launch your encrypted AI chat service</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

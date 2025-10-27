/**
 * Deploy page - Show docker-compose template and deployment instructions
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Button from '@/components/Button';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import CodeBlock from '@/components/CodeBlock';
import ThemeToggle from '@/components/ThemeToggle';
import { generateDockerCompose } from '@/lib/generator';
import { DeploymentConfig, AgentType } from '@/types';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

// VM Size recommendations per agent type (easy to update for future agents)
const VM_RECOMMENDATIONS: Record<AgentType, 'small' | 'medium' | 'large'> = {
  'standard': 'small',
  'secret': 'small'
};

export default function Deploy() {
  const [dockerCompose, setDockerCompose] = useState<string>('');
  const [config, setConfig] = useState<DeploymentConfig | null>(null);

  useEffect(() => {
    // Load config from localStorage
    const saved = localStorage.getItem('deploymentConfig');
    if (saved) {
      const loadedConfig: DeploymentConfig = JSON.parse(saved);
      setConfig(loadedConfig);
      const enableSecretNetwork = loadedConfig.agentType === 'secret';
      setDockerCompose(
        generateDockerCompose({
          enableSecretNetwork,
          traits: loadedConfig.traits,
        })
      );
    } else {
      // Default to standard agent with default traits
      setDockerCompose(
        generateDockerCompose({
          enableSecretNetwork: false,
        })
      );
    }
  }, []);

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
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h2 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
              Deploy Your Private AI Chat
            </h2>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              Copy this docker-compose template and deploy to SecretVM
            </p>
          </div>

          {/* Configuration Summary */}
          {config && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Your Configuration</CardTitle>
                <CardDescription>
                  Selected deployment settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Agent Type */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary dark:text-text-secondary-dark">
                      Agent Type:
                    </span>
                    <span className="font-medium text-text-primary dark:text-text-primary-dark">
                      {config.agentType === 'secret' ? (
                        <span className="inline-flex items-center gap-2">
                          Secret Agent
                          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500 text-white">
                            Secret Network
                          </span>
                        </span>
                      ) : (
                        'Standard Agent'
                      )}
                    </span>
                  </div>

                  {/* Personality Traits */}
                  {config.traits && (
                    <>
                      <div className="border-t border-border dark:border-border-dark pt-3">
                        <div className="text-sm font-semibold text-text-primary dark:text-text-primary-dark mb-2">
                          Personality Traits
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary dark:text-text-secondary-dark">
                              Response Length:
                            </span>
                            <span className="font-medium text-text-primary dark:text-text-primary-dark capitalize">
                              {config.traits.responseLength}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary dark:text-text-secondary-dark">
                              Style:
                            </span>
                            <span className="font-medium text-text-primary dark:text-text-primary-dark capitalize">
                              {config.traits.communicationStyle}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-text-secondary dark:text-text-secondary-dark">
                              Education Level:
                            </span>
                            <span className="font-medium text-text-primary dark:text-text-primary-dark capitalize">
                              {config.traits.technicalLevel}
                            </span>
                          </div>
                          {config.traits.personality.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary dark:text-text-secondary-dark">
                                Personality:
                              </span>
                              <span className="font-medium text-text-primary dark:text-text-primary-dark capitalize">
                                {config.traits.personality.join(', ')}
                              </span>
                            </div>
                          )}
                          {config.traits.special.length > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="text-text-secondary dark:text-text-secondary-dark">
                                Special:
                              </span>
                              <span className="font-medium text-text-primary dark:text-text-primary-dark capitalize">
                                {config.traits.special.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Docker Compose File */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">
              Docker Compose Template
            </h3>
            <CodeBlock code={dockerCompose} filename="docker-compose.yml" />
          </div>

          {/* Deployment Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Deployment Steps</CardTitle>
              <CardDescription>
                Follow these steps to deploy your encrypted AI chat service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-4">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <div>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                      Copy the docker-compose.yml
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                      Use the copy button above to copy the configuration
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <div>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                      Go to SecretAI Portal
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2">
                      Navigate to the SecretVM creation page
                    </p>
                    <a
                      href="https://secretai.scrtlabs.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-text-primary dark:text-text-primary-dark hover:underline"
                    >
                      Open SecretAI Portal
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <div>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                      Configure your SecretVM
                    </p>
                    <ul className="text-sm text-text-secondary dark:text-text-secondary-dark space-y-1 mt-2">
                      <li>• <strong>VM Name:</strong> Choose any name (e.g., "my-ai-chat")</li>
                      <li>• <strong>VM Type:</strong> Select small/medium/large based on your needs</li>
                      <li>• <strong>Environment:</strong> Choose Production or Development</li>
                      <li>• <strong>Enable Persistence:</strong> ✅ Check this to save chat history</li>
                      <li>• <strong>Docker Compose file:</strong> Paste your copied template</li>
                    </ul>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <div>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                      Add your SecretAI API Key
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2">
                      In "Encrypted Secrets" section, add:
                    </p>
                    <div className="bg-bg-secondary dark:bg-bg-secondary-dark p-3 rounded text-sm font-mono">
                      SECRET_AI_API_KEY=your_api_key_here
                    </div>
                    <a
                      href="https://secretai.scrtlabs.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-text-primary dark:text-text-primary-dark hover:underline mt-2"
                    >
                      Get API Key from SecretAI Portal
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center text-sm font-bold">
                    5
                  </span>
                  <div>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                      Launch your SecretVM
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                      Click "Launch your SecretVM" and wait 2-3 minutes for deployment
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                      Access your private AI chat
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                      SecretVM will provide a unique URL (e.g., http://your-vm.vm.scrtlabs.com) to access your encrypted chat service
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>

          {/* VM Size Recommendations */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>VM Size Recommendations</CardTitle>
              <CardDescription>
                {config && `Recommended size for ${config.agentType === 'secret' ? 'Secret Agent' : 'Standard Agent'}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className={config && VM_RECOMMENDATIONS[config.agentType] === 'small' ? 'p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : ''}>
                  <div className="flex items-center gap-2">
                    <strong className="text-text-primary dark:text-text-primary-dark">Small (1 vCPU, 2GB RAM, 20GB Storage)</strong>
                    {config && VM_RECOMMENDATIONS[config.agentType] === 'small' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary dark:text-text-secondary-dark mt-1">Recommended for basic chat usage</p>
                </div>
                <div className={config && VM_RECOMMENDATIONS[config.agentType] === 'medium' ? 'p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : ''}>
                  <div className="flex items-center gap-2">
                    <strong className="text-text-primary dark:text-text-primary-dark">Medium (2 vCPU, 4GB RAM, 40GB Storage)</strong>
                    {config && VM_RECOMMENDATIONS[config.agentType] === 'medium' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary dark:text-text-secondary-dark mt-1">Better performance with persistence enabled</p>
                </div>
                <div className={config && VM_RECOMMENDATIONS[config.agentType] === 'large' ? 'p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : ''}>
                  <div className="flex items-center gap-2">
                    <strong className="text-text-primary dark:text-text-primary-dark">Large (4 vCPU, 8GB RAM, 80GB Storage)</strong>
                    {config && VM_RECOMMENDATIONS[config.agentType] === 'large' && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white font-medium">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-text-secondary dark:text-text-secondary-dark mt-1">Heavy usage or multiple concurrent users</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Info */}
          <Card>
            <CardHeader>
              <CardTitle>Verify Your Deployment</CardTitle>
              <CardDescription>
                After deployment, you can cryptographically verify your service
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-4">
                SecretVM provides attestation that allows you to verify your service runs in
                genuine TEE hardware with your exact configuration.
              </p>
              <a
                href="https://docs.scrt.network/secret-network-documentation/secret-ai/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline">
                  Learn About Verification
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

/**
 * Deploy page - Show generated docker-compose and instructions
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import CodeBlock from '@/components/CodeBlock';
import ThemeToggle from '@/components/ThemeToggle';
import { DeploymentConfig } from '@/types';
import { generateDockerCompose } from '@/lib/generator';
import { ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

export default function Deploy() {
  const router = useRouter();
  const [config, setConfig] = useState<DeploymentConfig | null>(null);
  const [dockerCompose, setDockerCompose] = useState<string>('');

  useEffect(() => {
    // Load config from localStorage
    const savedConfig = localStorage.getItem('deploymentConfig');
    if (!savedConfig) {
      // No config found, redirect to configure page
      router.push('/configure');
      return;
    }

    const parsedConfig: DeploymentConfig = JSON.parse(savedConfig);
    setConfig(parsedConfig);
    setDockerCompose(generateDockerCompose(parsedConfig));
  }, [router]);

  if (!config) {
    return (
      <div className="min-h-screen bg-bg-primary dark:bg-bg-primary-dark flex items-center justify-center">
        <p className="text-text-secondary dark:text-text-secondary-dark">Loading...</p>
      </div>
    );
  }

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
            <Link href="/configure">
              <Button variant="outline" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Configuration
              </Button>
            </Link>
            <h2 className="text-3xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
              Your Deployment is Ready
            </h2>
            <p className="text-text-secondary dark:text-text-secondary-dark">
              Configuration: {config.vmSize.toUpperCase()} • History: {config.enableHistory ? 'Enabled' : 'Disabled'}
            </p>
          </div>

          {/* Docker Compose File */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-text-primary dark:text-text-primary-dark mb-4">
              Docker Compose Configuration
            </h3>
            <CodeBlock code={dockerCompose} filename="docker-compose.yml" />
          </div>

          {/* Deployment Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Deployment Instructions</CardTitle>
              <CardDescription>
                Follow these steps to deploy your private AI chat service
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
                      Copy the docker-compose.yml file
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                      Use the copy button above to copy the configuration to your clipboard
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
                      Create a new SecretVM
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                      Select "{config.vmSize}" size and paste your docker-compose.yml
                    </p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <div>
                    <p className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                      Add your SecretAI API key
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2">
                      Set the SECRET_AI_API_KEY environment variable in the portal
                    </p>
                    <a
                      href="https://secretai.scrtlabs.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm text-text-primary dark:text-text-primary-dark hover:underline"
                    >
                      Get API Key
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
                      Launch your VM
                    </p>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                      Click "Launch" and wait for your SecretVM to start (usually 2-3 minutes)
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
                      Use the unique URL provided by SecretVM to access your encrypted chat service
                    </p>
                  </div>
                </li>
              </ol>
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
                SecretVM provides attestation endpoints that allow you to verify your service runs in
                genuine TEE hardware with your exact configuration.
              </p>
              <a
                href="https://secretai.scrtlabs.com/verify"
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

          {/* Start Over Button */}
          <div className="mt-8 text-center">
            <Link href="/configure">
              <Button variant="secondary">
                Create Another Deployment
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

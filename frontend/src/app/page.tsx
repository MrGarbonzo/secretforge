/**
 * Home page - Landing/Introduction
 */

import Link from 'next/link';
import Button from '@/components/Button';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import ThemeToggle from '@/components/ThemeToggle';
import { Shield, Lock, Code, Zap } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-primary dark:bg-bg-primary-dark">
      {/* Header */}
      <header className="border-b border-border dark:border-border-dark">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
            SecretForge
          </h1>
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-text-primary dark:text-text-primary-dark mb-6">
            Deploy Private AI Services
          </h2>
          <p className="text-xl text-text-secondary dark:text-text-secondary-dark mb-8">
            Privacy-first deployment platform for Secret Network. Generate docker-compose configurations
            and deploy encrypted services to your own SecretVM instance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/deploy">
              <Button size="lg">
                Get Docker Compose
              </Button>
            </Link>
            <a href="https://docs.scrt.network/secret-network-documentation/secret-ai/" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <Shield className="w-10 h-10 mb-4 text-text-primary dark:text-text-primary-dark" />
              <CardTitle className="mb-2">Verifiable Privacy</CardTitle>
              <CardDescription>
                Cryptographically prove your services run in genuine TEE hardware
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Lock className="w-10 h-10 mb-4 text-text-primary dark:text-text-primary-dark" />
              <CardTitle className="mb-2">Encrypted Compute</CardTitle>
              <CardDescription>
                All processing happens in a Trusted Execution Environment
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Code className="w-10 h-10 mb-4 text-text-primary dark:text-text-primary-dark" />
              <CardTitle className="mb-2">Open Source</CardTitle>
              <CardDescription>
                All code is public and auditable. No vendor lock-in.
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <Zap className="w-10 h-10 mb-4 text-text-primary dark:text-text-primary-dark" />
              <CardTitle className="mb-2">Simple Deploy</CardTitle>
              <CardDescription>
                Generate configuration, paste, and launch in minutes
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-16 border-t border-border dark:border-border-dark">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-bold text-center text-text-primary dark:text-text-primary-dark mb-12">
            How It Works
          </h3>
          <div className="space-y-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                  Get Docker Compose Template
                </h4>
                <p className="text-text-secondary dark:text-text-secondary-dark">
                  Copy the ready-to-deploy configuration file from SecretForge
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                  Go to SecretAI Portal
                </h4>
                <p className="text-text-secondary dark:text-text-secondary-dark">
                  Configure VM size, enable persistence, and paste your docker-compose
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                  Add Your API Key & Launch
                </h4>
                <p className="text-text-secondary dark:text-text-secondary-dark">
                  Set your SecretAI API key as an environment variable and deploy
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                  Start Chatting Privately
                </h4>
                <p className="text-text-secondary dark:text-text-secondary-dark">
                  Access your encrypted AI assistant via your unique SecretVM URL
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border dark:border-border-dark mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-text-secondary dark:text-text-secondary-dark">
          <p>
            Built with ❤️ for privacy and decentralization
          </p>
          <p className="mt-2 text-sm">
            Powered by{' '}
            <a
              href="https://scrt.network"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text-primary dark:hover:text-text-primary-dark"
            >
              Secret Network
            </a>
            {' '}&{' '}
            <a
              href="https://secretai.scrtlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text-primary dark:hover:text-text-primary-dark"
            >
              SecretVM
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

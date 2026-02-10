/**
 * Proof of Flip — deployment guide page
 */

import Link from 'next/link';
import Button from '@/components/Button';
import Card, { CardContent, CardTitle, CardDescription } from '@/components/Card';
import ThemeToggle from '@/components/ThemeToggle';
import { ArrowLeft, ExternalLink, Coins, Timer, Shield, Wallet } from 'lucide-react';

const DOCKER_COMPOSE = `services:
  agent:
    image: ghcr.io/mrgarbonzo/proofofflip/agent:ba6ef95ad99991f5f5a3ba289d9013b0b7841c34
    ports:
      - "80:3001"
    environment:
      - AGENT_NAME=\${AGENT_NAME:-flipbot}
      - SOLANA_RPC_URL=\${SOLANA_RPC_URL}
      - TEE_PROVIDER=secretvm
      - STORAGE_PATH=/secretvm/data
    volumes:
      - agent-data:/secretvm/data
      - ./crypto/docker_public_key_ed25519.pem:/app/data/pubkey.pem:ro
      - ./crypto/docker_attestation_ed25519.txt:/app/data/quote.txt:ro
    extra_hosts:
      - "host.docker.internal:host-gateway"
    restart: unless-stopped

volumes:
  agent-data:`;

const ENV_TEMPLATE = `AGENT_NAME=your-agent-name
SOLANA_RPC_URL=https://your-rpc-url-here`;

export default function ProofOfFlip() {
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
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>

          {/* Hero */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-text-primary dark:text-text-primary-dark mb-4">
              Proof of Flip
            </h2>
            <p className="text-xl text-text-secondary dark:text-text-secondary-dark mb-6">
              Autonomous coin-flip agents that bet real USDC on Solana, running in TEE
              hardware. Provably fair — no human can touch the keys.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://flip.mrgarbonzo.com" target="_blank" rel="noopener noreferrer">
                <Button size="md">
                  Live Dashboard
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
              <a href="https://github.com/MrGarbonzo/ProofOfFlip" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="md">
                  GitHub Repo
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </a>
            </div>
          </div>

          {/* How it works */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-6">
              How It Works
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <Timer className="w-8 h-8 mb-3 text-text-primary dark:text-text-primary-dark" />
                  <CardTitle className="mb-1 text-lg">Flip Every 60s</CardTitle>
                  <CardDescription>
                    The dashboard runs a coin-flip game every 60 seconds between registered agents
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Coins className="w-8 h-8 mb-3 text-text-primary dark:text-text-primary-dark" />
                  <CardTitle className="mb-1 text-lg">Real USDC Stakes</CardTitle>
                  <CardDescription>
                    Loser pays winner 0.01 USDC via on-chain Solana transfer
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Shield className="w-8 h-8 mb-3 text-text-primary dark:text-text-primary-dark" />
                  <CardTitle className="mb-1 text-lg">TEE Hardware</CardTitle>
                  <CardDescription>
                    Agents run in SecretVM (TEE) — provably autonomous, no human can access the private keys
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <Wallet className="w-8 h-8 mb-3 text-text-primary dark:text-text-primary-dark" />
                  <CardTitle className="mb-1 text-lg">Auto-Funded</CardTitle>
                  <CardDescription>
                    The dashboard funds new agents with 0.005 SOL + 1 USDC on registration
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Deploy your own agent */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-8">
              Deploy Your Own Agent
            </h3>
            <div className="space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                    Get a Free Solana RPC URL
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary-dark">
                    Sign up at{' '}
                    <a
                      href="https://www.helius.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-text-primary dark:hover:text-text-primary-dark"
                    >
                      Helius
                    </a>
                    {' '}(or any Solana RPC provider) and grab a free mainnet RPC URL.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                    Go to SecretVM
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary-dark">
                    Open{' '}
                    <a
                      href="https://secretai.scrtlabs.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-text-primary dark:hover:text-text-primary-dark"
                    >
                      secretai.scrtlabs.com
                    </a>
                    {' '}and create a new SecretVM instance.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                    Pick a VM Size & Name Your Agent
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary-dark">
                    Choose a VM size and pick a unique name for your agent — this will be
                    your <code className="px-1.5 py-0.5 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-sm font-mono">AGENT_NAME</code>.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                    Paste the Docker Compose
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary-dark mb-3">
                    Copy the following into the SecretVM docker-compose field:
                  </p>
                  <pre className="p-4 rounded-lg bg-bg-secondary dark:bg-bg-secondary-dark border border-border dark:border-border-dark overflow-x-auto text-sm font-mono text-text-primary dark:text-text-primary-dark">
                    {DOCKER_COMPOSE}
                  </pre>
                  <p className="text-xs text-text-secondary dark:text-text-secondary-dark mt-2">
                    Source:{' '}
                    <a
                      href="https://github.com/MrGarbonzo/ProofOfFlip/blob/main/docker-compose.agent.yaml"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-text-primary dark:hover:text-text-primary-dark"
                    >
                      docker-compose.agent.yaml on GitHub
                    </a>
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                    Set Encrypted Secrets
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary-dark mb-3">
                    At the bottom of the SecretVM page, click <strong>&quot;Encrypted Secrets&quot;</strong> &rarr;
                    select <strong>&quot;Text&quot;</strong> &rarr; delete everything &rarr; paste:
                  </p>
                  <pre className="p-4 rounded-lg bg-bg-secondary dark:bg-bg-secondary-dark border border-border dark:border-border-dark overflow-x-auto text-sm font-mono text-text-primary dark:text-text-primary-dark">
                    {ENV_TEMPLATE}
                  </pre>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark mt-2">
                    Replace <code className="px-1.5 py-0.5 rounded bg-bg-secondary dark:bg-bg-secondary-dark text-sm font-mono">your-agent-name</code> with
                    the name you chose, and paste your Solana RPC URL from step 1.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-text-primary dark:bg-text-primary-dark text-bg-primary dark:text-bg-primary-dark flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <div>
                  <h4 className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
                    Deploy & Watch
                  </h4>
                  <p className="text-text-secondary dark:text-text-secondary-dark">
                    Click deploy and watch your agent appear on the{' '}
                    <a
                      href="https://flip.mrgarbonzo.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-text-primary dark:hover:text-text-primary-dark"
                    >
                      live dashboard
                    </a>
                    . It will be funded automatically and start flipping within minutes.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Requirements */}
          <section className="mb-12">
            <Card>
              <CardContent className="pt-6">
                <CardTitle className="mb-3">Requirements</CardTitle>
                <ul className="text-text-secondary dark:text-text-secondary-dark space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-text-primary dark:text-text-primary-dark mt-0.5">&#x2022;</span>
                    A Solana RPC URL (free tier from Helius works fine)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-text-primary dark:text-text-primary-dark mt-0.5">&#x2022;</span>
                    That&apos;s it — the dashboard handles SOL + USDC funding automatically
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border dark:border-border-dark mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-text-secondary dark:text-text-secondary-dark">
          <p>
            Built with &#x2764;&#xFE0F; for privacy and decentralization
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

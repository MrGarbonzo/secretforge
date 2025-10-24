/**
 * Configuration form component
 */

'use client';

import React from 'react';
import { AgentType } from '@/types';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Check } from 'lucide-react';

interface ConfigFormProps {
  agentType: AgentType;
  onAgentTypeChange: (type: AgentType) => void;
}

export default function ConfigForm({
  agentType,
  onAgentTypeChange,
}: ConfigFormProps) {
  return (
    <div className="space-y-6">
      {/* Agent Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Type</CardTitle>
          <CardDescription>
            Choose between standard AI or Secret Network-enabled agent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {/* Standard Agent */}
            <button
              onClick={() => onAgentTypeChange('standard')}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all
                ${
                  agentType === 'standard'
                    ? 'border-text-primary dark:border-text-primary-dark bg-bg-secondary dark:bg-bg-secondary-dark'
                    : 'border-border dark:border-border-dark hover:border-border-hover dark:hover:border-border-hover-dark'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                      Standard Agent
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2">
                    Basic AI chat capabilities without blockchain tools
                  </p>
                  <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                    Lightweight • Fast • General purpose
                  </div>
                </div>
                {agentType === 'standard' && (
                  <Check className="w-5 h-5 text-text-primary dark:text-text-primary-dark flex-shrink-0" />
                )}
              </div>
            </button>

            {/* Secret Agent */}
            <button
              onClick={() => onAgentTypeChange('secret')}
              className={`
                relative p-4 rounded-lg border-2 text-left transition-all
                ${
                  agentType === 'secret'
                    ? 'border-text-primary dark:border-text-primary-dark bg-bg-secondary dark:bg-bg-secondary-dark'
                    : 'border-border dark:border-border-dark hover:border-border-hover dark:hover:border-border-hover-dark'
                }
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                      Secret Agent
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500 text-white">
                      Secret Network
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2">
                    AI with Secret Network blockchain query tools and Keplr wallet integration
                  </p>
                  <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                    Blockchain tools • Query balances • Transaction history
                  </div>
                </div>
                {agentType === 'secret' && (
                  <Check className="w-5 h-5 text-text-primary dark:text-text-primary-dark flex-shrink-0" />
                )}
              </div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

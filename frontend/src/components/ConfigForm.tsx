/**
 * Configuration form component
 */

'use client';

import React from 'react';
import { VMSize, VM_SIZES } from '@/types';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from './Card';
import { Check } from 'lucide-react';

interface ConfigFormProps {
  vmSize: VMSize;
  enableHistory: boolean;
  onVMSizeChange: (size: VMSize) => void;
  onEnableHistoryChange: (enabled: boolean) => void;
}

export default function ConfigForm({
  vmSize,
  enableHistory,
  onVMSizeChange,
  onEnableHistoryChange,
}: ConfigFormProps) {
  return (
    <div className="space-y-6">
      {/* VM Size Selection */}
      <Card>
        <CardHeader>
          <CardTitle>VM Size</CardTitle>
          <CardDescription>
            Select the compute resources for your deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {VM_SIZES.map((size) => (
              <button
                key={size.value}
                onClick={() => onVMSizeChange(size.value)}
                className={`
                  relative p-4 rounded-lg border-2 text-left transition-all
                  ${
                    vmSize === size.value
                      ? 'border-text-primary dark:border-text-primary-dark bg-bg-secondary dark:bg-bg-secondary-dark'
                      : 'border-border dark:border-border-dark hover:border-border-hover dark:hover:border-border-hover-dark'
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-text-primary dark:text-text-primary-dark">
                        {size.label}
                      </span>
                      {size.recommended && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500 text-white">
                          Recommended
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-2">
                      {size.description}
                    </p>
                    <div className="text-xs text-text-tertiary dark:text-text-tertiary-dark">
                      {size.vcpus} vCPU • {size.ram} RAM • {size.storage} Storage
                    </div>
                  </div>
                  {vmSize === size.value && (
                    <Check className="w-5 h-5 text-text-primary dark:text-text-primary-dark flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat History Toggle */}
      <Card>
        <CardHeader>
          <CardTitle>Chat History</CardTitle>
          <CardDescription>
            Enable persistent chat history storage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <label className="flex items-center justify-between cursor-pointer p-4 rounded-lg border border-border dark:border-border-dark hover:bg-bg-secondary dark:hover:bg-bg-secondary-dark transition-colors">
            <div className="flex-1">
              <div className="font-medium text-text-primary dark:text-text-primary-dark mb-1">
                Save Conversation History
              </div>
              <p className="text-sm text-text-secondary dark:text-text-secondary-dark">
                Store chat messages in SQLite database (requires persistent volume)
              </p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={enableHistory}
                onChange={(e) => onEnableHistoryChange(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-bg-tertiary dark:bg-bg-tertiary-dark rounded-full peer peer-checked:bg-text-primary dark:peer-checked:bg-text-primary-dark transition-colors"></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
            </div>
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * TraitCard component - Individual trait selection card
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { TraitMetadata } from '@/lib/traitDefinitions';

interface TraitCardProps<T> {
  trait: TraitMetadata<T>;
  selected: boolean;
  onSelect: () => void;
  multiSelect?: boolean;
}

export default function TraitCard<T>({
  trait,
  selected,
  onSelect,
  multiSelect = false,
}: TraitCardProps<T>) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      {/* Card */}
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'w-full p-4 rounded-lg border-2 text-left transition-all',
          'hover:border-border-hover dark:hover:border-border-hover-dark',
          selected
            ? 'border-text-primary dark:border-text-primary-dark bg-bg-secondary dark:bg-bg-secondary-dark'
            : 'border-border dark:border-border-dark'
        )}
      >
        {/* Icon and selection indicator */}
        <div className="flex items-center justify-between mb-2">
          {trait.icon && <span className="text-2xl">{trait.icon}</span>}
          <div
            className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              !trait.icon && 'ml-auto',
              selected
                ? 'border-text-primary dark:border-text-primary-dark bg-text-primary dark:bg-text-primary-dark'
                : 'border-border dark:border-border-dark'
            )}
          >
            {selected && (
              <svg
                className="w-3 h-3 text-bg-primary dark:text-bg-primary-dark"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7"></path>
              </svg>
            )}
          </div>
        </div>

        {/* Label */}
        <div className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
          {trait.label}
        </div>

        {/* Short description */}
        <div className="text-xs text-text-secondary dark:text-text-secondary-dark line-clamp-2">
          {trait.description}
        </div>

        {/* Info hint */}
        <div className="mt-2 text-xs text-text-tertiary dark:text-text-tertiary-dark">
          Hover for details
        </div>
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute z-50 w-72 p-4 mt-2 rounded-lg border border-border dark:border-border-dark bg-bg-primary dark:bg-bg-primary-dark shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            {trait.icon && <span className="text-2xl">{trait.icon}</span>}
            <span className="font-semibold text-text-primary dark:text-text-primary-dark">
              {trait.label}
            </span>
          </div>

          <p className="text-sm text-text-secondary dark:text-text-secondary-dark mb-3">
            {trait.description}
          </p>

          <div className="mb-3">
            <div className="text-xs font-semibold text-text-primary dark:text-text-primary-dark mb-1">
              Best for:
            </div>
            <ul className="text-xs text-text-secondary dark:text-text-secondary-dark space-y-0.5">
              {trait.useCases.map((useCase, index) => (
                <li key={index}>• {useCase}</li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-semibold text-text-primary dark:text-text-primary-dark mb-1">
              Example:
            </div>
            <p className="text-xs text-text-secondary dark:text-text-secondary-dark italic">
              "{trait.example}"
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

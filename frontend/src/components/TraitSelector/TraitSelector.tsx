/**
 * TraitSelector component - Main trait selection interface
 */

'use client';

import React, { useState } from 'react';
import TraitCategory from './TraitCategory';
import { cn } from '@/lib/utils';
import {
  RESPONSE_LENGTH_TRAITS,
  COMMUNICATION_STYLE_TRAITS,
  TECHNICAL_LEVEL_TRAITS,
  PERSONALITY_TRAITS,
  SPECIAL_TRAITS,
} from '@/lib/traitDefinitions';
import {
  PersonalityTraits,
  ResponseLength,
  CommunicationStyle,
  TechnicalLevel,
  Personality,
  SpecialTrait,
} from '@/types';

interface TraitSelectorProps {
  traits: PersonalityTraits;
  onTraitsChange: (traits: PersonalityTraits) => void;
}

export default function TraitSelector({
  traits,
  onTraitsChange,
}: TraitSelectorProps) {
  const [mode, setMode] = useState<'default' | 'custom'>('default');

  const handleModeChange = (newMode: 'default' | 'custom') => {
    setMode(newMode);
    if (newMode === 'default') {
      // Reset to default traits
      onTraitsChange({
        responseLength: 'balanced',
        communicationStyle: 'casual',
        technicalLevel: 'balanced',
        personality: ['friendly'],
        special: [],
      });
    }
  };

  const handleResponseLengthChange = (value: ResponseLength) => {
    onTraitsChange({ ...traits, responseLength: value });
  };

  const handleCommunicationStyleChange = (value: CommunicationStyle) => {
    onTraitsChange({ ...traits, communicationStyle: value });
  };

  const handleTechnicalLevelChange = (value: TechnicalLevel) => {
    onTraitsChange({ ...traits, technicalLevel: value });
  };

  const handlePersonalityChange = (value: Personality) => {
    const current = traits.personality;
    const newPersonality = current.includes(value)
      ? current.filter((p) => p !== value)
      : [...current, value];
    onTraitsChange({ ...traits, personality: newPersonality });
  };

  const handleSpecialChange = (value: SpecialTrait) => {
    const current = traits.special;
    const newSpecial = current.includes(value)
      ? current.filter((s) => s !== value)
      : [...current, value];
    onTraitsChange({ ...traits, special: newSpecial });
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-4">
        {/* Default Option */}
        <button
          type="button"
          onClick={() => handleModeChange('default')}
          className={cn(
            'p-4 rounded-lg border-2 text-left transition-all',
            'hover:border-border-hover dark:hover:border-border-hover-dark',
            mode === 'default'
              ? 'border-text-primary dark:border-text-primary-dark bg-bg-secondary dark:bg-bg-secondary-dark'
              : 'border-border dark:border-border-dark'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto',
                mode === 'default'
                  ? 'border-text-primary dark:border-text-primary-dark bg-text-primary dark:bg-text-primary-dark'
                  : 'border-border dark:border-border-dark'
              )}
            >
              {mode === 'default' && (
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
          <div className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
            Default
          </div>
          <div className="text-xs text-text-secondary dark:text-text-secondary-dark">
            Balanced, friendly AI - perfect for most users
          </div>
        </button>

        {/* Custom Option */}
        <button
          type="button"
          onClick={() => handleModeChange('custom')}
          className={cn(
            'p-4 rounded-lg border-2 text-left transition-all',
            'hover:border-border-hover dark:hover:border-border-hover-dark',
            mode === 'custom'
              ? 'border-text-primary dark:border-text-primary-dark bg-bg-secondary dark:bg-bg-secondary-dark'
              : 'border-border dark:border-border-dark'
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div
              className={cn(
                'w-5 h-5 rounded-full border-2 flex items-center justify-center ml-auto',
                mode === 'custom'
                  ? 'border-text-primary dark:border-text-primary-dark bg-text-primary dark:bg-text-primary-dark'
                  : 'border-border dark:border-border-dark'
              )}
            >
              {mode === 'custom' && (
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
          <div className="font-semibold text-text-primary dark:text-text-primary-dark mb-1">
            Custom
          </div>
          <div className="text-xs text-text-secondary dark:text-text-secondary-dark">
            Customize personality traits to your preferences
          </div>
        </button>
      </div>

      {/* Trait Categories - Only show when Custom is selected */}
      {mode === 'custom' && (
        <div className="space-y-6">
      {/* Response Length */}
      <TraitCategory
        title="Response Length"
        description="How much detail should the AI provide?"
        traits={RESPONSE_LENGTH_TRAITS}
        selectedValue={traits.responseLength}
        onSelect={handleResponseLengthChange}
      />

      {/* Communication Style */}
      <TraitCategory
        title="Communication Style"
        description="Choose the AI's speaking style and tone"
        traits={COMMUNICATION_STYLE_TRAITS}
        selectedValue={traits.communicationStyle}
        onSelect={handleCommunicationStyleChange}
      />

      {/* Education Level */}
      <TraitCategory
        title="Education Level"
        description="What level of complexity should the AI use?"
        traits={TECHNICAL_LEVEL_TRAITS}
        selectedValue={traits.technicalLevel}
        onSelect={handleTechnicalLevelChange}
      />

      {/* Personality */}
      <TraitCategory
        title="Personality"
        description="Add personality characteristics (select multiple)"
        traits={PERSONALITY_TRAITS}
        selectedValue={traits.personality}
        onSelect={handlePersonalityChange}
        multiSelect
      />

      {/* Special Traits */}
      <TraitCategory
        title="Special Traits"
        description="Additional personality enhancements (select multiple)"
        traits={SPECIAL_TRAITS}
        selectedValue={traits.special}
        onSelect={handleSpecialChange}
        multiSelect
      />
        </div>
      )}
    </div>
  );
}

/**
 * TraitCategory component - Wrapper for a category of traits
 */

'use client';

import React from 'react';
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '../Card';
import TraitCard from './TraitCard';
import { TraitMetadata } from '@/lib/traitDefinitions';

interface TraitCategoryProps<T> {
  title: string;
  description: string;
  traits: TraitMetadata<T>[];
  selectedValue?: T | T[];
  onSelect: (value: T) => void;
  multiSelect?: boolean;
}

export default function TraitCategory<T extends string>({
  title,
  description,
  traits,
  selectedValue,
  onSelect,
  multiSelect = false,
}: TraitCategoryProps<T>) {
  const isSelected = (value: T): boolean => {
    if (multiSelect && Array.isArray(selectedValue)) {
      return selectedValue.includes(value);
    }
    return selectedValue === value;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {traits.map((trait) => (
            <TraitCard
              key={String(trait.value)}
              trait={trait}
              selected={isSelected(trait.value)}
              onSelect={() => onSelect(trait.value)}
              multiSelect={multiSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

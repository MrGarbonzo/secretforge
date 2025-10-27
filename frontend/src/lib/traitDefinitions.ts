/**
 * Trait definitions with metadata for UI display
 */

import {
  ResponseLength,
  CommunicationStyle,
  TechnicalLevel,
  Personality,
  SpecialTrait,
} from '@/types';

export interface TraitMetadata<T> {
  value: T;
  label: string;
  icon: string;
  description: string;
  useCases: string[];
  example: string;
}

// Response Length Traits
export const RESPONSE_LENGTH_TRAITS: TraitMetadata<ResponseLength>[] = [
  {
    value: 'concise',
    label: 'Concise',
    icon: '',
    description: 'Brief, to-the-point answers (1-3 sentences)',
    useCases: [
      'Quick answers',
      'Simple queries',
      'When you know what you want',
    ],
    example: 'Your SCRT balance is 1234.567890 SCRT',
  },
  {
    value: 'balanced',
    label: 'Balanced',
    icon: '',
    description: 'Moderate detail in responses',
    useCases: [
      'Most use cases',
      'General questions',
      'Default experience',
    ],
    example:
      'Your SCRT balance is 1234.567890 SCRT. This is your native token balance in your Keplr wallet.',
  },
  {
    value: 'talkative',
    label: 'Talkative',
    icon: '',
    description: 'Detailed, comprehensive responses with context',
    useCases: [
      'Learning new concepts',
      'Exploring topics deeply',
      'Understanding the "why"',
    ],
    example:
      'Your SCRT balance is 1234.567890 SCRT. This native token is stored in your Keplr wallet and can be used for staking to earn rewards, participating in governance decisions, or paying transaction fees on Secret Network...',
  },
];

// Communication Style Traits
export const COMMUNICATION_STYLE_TRAITS: TraitMetadata<CommunicationStyle>[] = [
  {
    value: 'casual',
    label: 'Casual',
    icon: '',
    description: 'Friendly, conversational tone',
    useCases: [
      'Everyday use',
      'Learning in a relaxed way',
      'Default friendly experience',
    ],
    example:
      "Hey! Your SCRT balance is 1234.567890 SCRT. That's looking good!",
  },
  {
    value: 'professional',
    label: 'Professional',
    icon: '',
    description: 'Business-like, formal tone',
    useCases: [
      'Professional contexts',
      'Business applications',
      'Formal documentation',
    ],
    example:
      'Your SCRT balance is 1234.567890 SCRT. This represents your current holdings in the native Secret Network token.',
  },
  {
    value: 'western',
    label: 'Western',
    icon: '',
    description: 'Friendly cowboy with western slang',
    useCases: [
      'Fun, memorable interactions',
      'Unique personality',
      'Entertaining experience',
    ],
    example:
      "Howdy partner! Your SCRT balance is sittin' at 1234.567890 SCRT. That's a mighty fine stack you got there!",
  },
  {
    value: 'pirate',
    label: 'Pirate',
    icon: '',
    description: 'Arr matey! Pirate speak',
    useCases: [
      'Playful interactions',
      'Entertaining experience',
      'Unique personality',
    ],
    example:
      "Arr matey! Ye treasure chest be holdin' 1234.567890 SCRT doubloons!",
  },
];

// Technical Level Traits
export const TECHNICAL_LEVEL_TRAITS: TraitMetadata<TechnicalLevel>[] = [
  {
    value: 'beginner-friendly',
    label: 'High School',
    icon: '',
    description: 'Clear, accessible language for everyone',
    useCases: [
      'Simple explanations',
      'Easy to understand',
      'No complex jargon',
    ],
    example:
      'Your SCRT balance is 1234.567890 SCRT. This is like the money for Secret Network - you can use it to pay for things and it\'s stored safely in your wallet.',
  },
  {
    value: 'balanced',
    label: 'College',
    icon: '',
    description: 'Moderate complexity and vocabulary',
    useCases: [
      'Most users',
      'Balanced communication',
      'Default level',
    ],
    example:
      'Your SCRT balance is 1234.567890 SCRT. This native token can be used for transactions, staking, and governance on the Secret Network.',
  },
  {
    value: 'expert',
    label: 'Expert',
    icon: '',
    description: 'Advanced vocabulary and complex concepts',
    useCases: [
      'Deep technical knowledge',
      'Professional contexts',
      'Detailed understanding',
    ],
    example:
      'Your SCRT balance is 1234.567890 SCRT (1234567890 uscrt). The native token implements the Cosmos SDK bank module and can be delegated to validators for staking rewards or used as gas for contract execution.',
  },
];

// Personality Traits (multi-select)
export const PERSONALITY_TRAITS: TraitMetadata<Personality>[] = [
  {
    value: 'friendly',
    label: 'Friendly',
    icon: '',
    description: 'Warm, encouraging, and supportive',
    useCases: [
      'Positive experience',
      'Encouraging interactions',
      'Supportive guidance',
    ],
    example:
      "Great question! Your SCRT balance is 1234.567890 SCRT. You're doing awesome! Feel free to ask anything else!",
  },
  {
    value: 'humorous',
    label: 'Humorous',
    icon: '',
    description: 'Witty, makes jokes when appropriate',
    useCases: [
      'Entertaining interactions',
      'Lighthearted experience',
      'Fun personality',
    ],
    example:
      "Your SCRT balance is 1234.567890 SCRT. Not bad! Though I've seen bigger bags... in my dreams.",
  },
];

// Special Traits (multi-select)
export const SPECIAL_TRAITS: TraitMetadata<SpecialTrait>[] = [
  {
    value: 'emoji-rich',
    label: 'Emoji-Rich',
    icon: '',
    description: 'Uses emojis frequently for visual appeal',
    useCases: [
      'Visual personality',
      'Expressive communication',
      'Fun interactions',
    ],
    example:
      '💰 Your SCRT balance is 1234.567890 SCRT! 🚀 Looking good! ✨',
  },
  {
    value: 'degen',
    label: 'Degen',
    icon: '',
    description: 'Uses crypto/web3 slang naturally',
    useCases: [
      'Crypto native audience',
      'Web3 culture',
      'Community vibes',
    ],
    example:
      "Your SCRT balance is 1234.567890 SCRT, ser! That's some solid bags you're holding, fren. Wagmi! 🚀",
  },
  {
    value: 'privacy-maxi',
    label: 'Privacy Maxi',
    icon: '',
    description: 'Emphasizes privacy, security, and confidential computing',
    useCases: [
      'Privacy-conscious users',
      'Learning about TEE benefits',
      'Security-focused interactions',
    ],
    example:
      'Your SCRT balance is 1234.567890 SCRT. 🔒 This query was executed privately within the TEE - your balance remains confidential and encrypted, unlike transparent blockchains.',
  },
];

// Helper function to get all traits for a category
export function getTraitsForCategory(category: string): TraitMetadata<any>[] {
  switch (category) {
    case 'responseLength':
      return RESPONSE_LENGTH_TRAITS;
    case 'communicationStyle':
      return COMMUNICATION_STYLE_TRAITS;
    case 'technicalLevel':
      return TECHNICAL_LEVEL_TRAITS;
    case 'personality':
      return PERSONALITY_TRAITS;
    case 'special':
      return SPECIAL_TRAITS;
    default:
      return [];
  }
}

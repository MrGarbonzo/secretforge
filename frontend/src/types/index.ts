/**
 * TypeScript type definitions for SecretForge
 */

export type VMSize = 'small' | 'medium' | 'large';
export type AgentType = 'standard' | 'secret';

export interface DeploymentConfig {
  agentType: AgentType;
}

export interface VMSizeOption {
  value: VMSize;
  label: string;
  vcpus: number;
  ram: string;
  storage: string;
  description: string;
  recommended?: boolean;
}

export const VM_SIZES: VMSizeOption[] = [
  {
    value: 'small',
    label: 'Small',
    vcpus: 1,
    ram: '2 GB',
    storage: '20 GB',
    description: 'Basic chat, minimal history',
    recommended: true,
  },
  {
    value: 'medium',
    label: 'Medium',
    vcpus: 2,
    ram: '4 GB',
    storage: '40 GB',
    description: 'Chat with history',
  },
  {
    value: 'large',
    label: 'Large',
    vcpus: 4,
    ram: '8 GB',
    storage: '80 GB',
    description: 'Heavy usage',
  },
];

/**
 * Code block component with syntax highlighting
 */

'use client';

import React, { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { copyToClipboard, downloadFile } from '@/lib/generator';
import Button from './Button';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ code, language = 'yaml', filename = 'docker-compose.yml' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    downloadFile(code, filename);
  };

  return (
    <div className="relative rounded-lg border border-border dark:border-border-dark overflow-hidden">
      <div className="flex items-center justify-between bg-bg-secondary dark:bg-bg-secondary-dark px-4 py-2 border-b border-border dark:border-border-dark">
        <span className="text-sm font-mono text-text-secondary dark:text-text-secondary-dark">
          {filename}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="p-1.5 rounded hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark transition-colors"
            aria-label="Download file"
          >
            <Download className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded hover:bg-bg-tertiary dark:hover:bg-bg-tertiary-dark transition-colors"
            aria-label="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4 text-text-secondary dark:text-text-secondary-dark" />
            )}
          </button>
        </div>
      </div>
      <pre className="p-4 overflow-x-auto bg-bg-tertiary dark:bg-bg-tertiary-dark">
        <code className="text-sm font-mono text-text-primary dark:text-text-primary-dark whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}

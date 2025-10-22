/**
 * Docker Compose generator for SecretForge deployments
 */

export function generateDockerCompose(): string {
  return `version: '3.8'

services:
  secretforge-chat:
    image: ghcr.io/mrgarbonzo/secretforge/chat:latest
    container_name: secretforge-chat

    environment:
      - SECRET_AI_API_KEY=\${SECRET_AI_API_KEY}

    ports:
      - "3000:3000"

    restart: unless-stopped

    healthcheck:
      test: ["CMD", "python", "-c", "import urllib.request; urllib.request.urlopen('http://localhost:3000/api/health')"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
`;
}

export function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    return new Promise((resolve, reject) => {
      document.execCommand('copy') ? resolve() : reject();
      textArea.remove();
    });
  }
}

export function downloadFile(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

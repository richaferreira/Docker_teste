import { Copy, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function DockerComposeInfo() {
  const [copied, setCopied] = useState(false);

  const dockerComposeYaml = `version: '3.8'

services:
  apache:
    image: httpd:latest
    ports:
      - "8080:80"
    volumes:
      - ./apache:/usr/local/apache2/htdocs
    environment:
      - TZ=UTC

  nginx:
    image: nginx:latest
    ports:
      - "8081:80"
    volumes:
      - ./nginx:/usr/share/nginx/html
    environment:
      - TZ=UTC`;

  const handleCopy = () => {
    navigator.clipboard.writeText(dockerComposeYaml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="terminal-border border-cyan-400/30 p-6 rounded-sm glow-cyan">
        <h2 className="text-lg font-bold text-cyan-400 mb-4 tracking-wider">DOCKER COMPOSE CONFIGURATION</h2>
        
        <div className="relative bg-black/50 rounded-sm p-4 border border-cyan-400/20 font-mono text-xs text-green-400 overflow-x-auto">
          <pre className="whitespace-pre-wrap break-words">{dockerComposeYaml}</pre>
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 p-2 bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-500/50 rounded-sm transition-all duration-200"
            title="Copy to clipboard"
          >
            <Copy size={14} className={copied ? 'text-green-400' : 'text-cyan-400'} />
          </button>
        </div>

        {copied && (
          <div className="mt-2 text-xs text-green-400 font-mono">✓ COPIED TO CLIPBOARD</div>
        )}
      </div>

      <div className="terminal-border border-lime-400/30 p-6 rounded-sm glow-lime">
        <h2 className="text-lg font-bold text-lime-400 mb-4 tracking-wider">QUICK START</h2>
        
        <div className="space-y-3 text-sm text-foreground font-mono">
          <div className="bg-black/50 p-3 rounded-sm border border-lime-400/20">
            <p className="text-lime-400 mb-2"># 1. Create docker-compose.yml file</p>
            <p className="text-gray-400">$ nano docker-compose.yml</p>
          </div>

          <div className="bg-black/50 p-3 rounded-sm border border-lime-400/20">
            <p className="text-lime-400 mb-2"># 2. Start containers</p>
            <p className="text-gray-400">$ docker-compose up -d</p>
          </div>

          <div className="bg-black/50 p-3 rounded-sm border border-lime-400/20">
            <p className="text-lime-400 mb-2"># 3. Check status</p>
            <p className="text-gray-400">$ docker-compose ps</p>
          </div>

          <div className="bg-black/50 p-3 rounded-sm border border-lime-400/20">
            <p className="text-lime-400 mb-2"># 4. View logs</p>
            <p className="text-gray-400">$ docker-compose logs -f</p>
          </div>

          <div className="bg-black/50 p-3 rounded-sm border border-lime-400/20">
            <p className="text-lime-400 mb-2"># 5. Stop containers</p>
            <p className="text-gray-400">$ docker-compose down</p>
          </div>
        </div>
      </div>

      <div className="terminal-border border-yellow-400/30 p-6 rounded-sm">
        <h2 className="text-lg font-bold text-yellow-400 mb-4 tracking-wider">USEFUL LINKS</h2>
        
        <div className="space-y-2">
          <a
            href="https://hub.docker.com/_/httpd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
          >
            <ExternalLink size={14} />
            Apache HTTP Server (httpd) - Docker Hub
          </a>

          <a
            href="https://hub.docker.com/_/nginx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
          >
            <ExternalLink size={14} />
            Nginx - Docker Hub
          </a>

          <a
            href="https://docs.docker.com/compose/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
          >
            <ExternalLink size={14} />
            Docker Compose Documentation
          </a>

          <a
            href="https://docs.docker.com/desktop/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
          >
            <ExternalLink size={14} />
            Docker Desktop Documentation
          </a>
        </div>
      </div>
    </div>
  );
}

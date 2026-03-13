import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ServerStatus from '@/components/ServerStatus';
import DockerComposeInfo from '@/components/DockerComposeInfo';
import LoadTestPanel from '@/components/LoadTestPanel';

export default function Home() {
  const [showInfo, setShowInfo] = useState(false);
  const [activeTab, setActiveTab] = useState<'servers' | 'loadtest' | 'info'>('servers');

  const apacheIconUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663188242003/2BuRQvMr9cQztZEb4tAZZt/apache-server-icon-Rjitz4RWr3sRtNbcBq8hK2.webp';
  const nginxIconUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663188242003/2BuRQvMr9cQztZEb4tAZZt/nginx-server-icon-bLj4MjJvAtvAtonXEih4Kb.webp';
  const heroImageUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663188242003/2BuRQvMr9cQztZEb4tAZZt/docker-hero-background-5s3kX3S5ZqjLzHXGnajcJH.webp';

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-cyan-400/20 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-cyan-500/20 border border-cyan-400 flex items-center justify-center">
              <span className="text-cyan-400 font-bold text-lg">&lt;/&gt;</span>
            </div>
            <h1 className="text-xl font-bold tracking-wider text-cyan-400">DOCKER COMPOSE TESTER</h1>
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="p-2 hover:bg-cyan-500/20 rounded-sm border border-cyan-400/30 transition-all duration-200 text-cyan-400"
          >
            {showInfo ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-cyan-400/20">
        <img
          src={heroImageUrl}
          alt="Docker Compose Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/50 to-background" />

        <div className="relative container py-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4 tracking-wider">
            WEB SERVER TEST SUITE
          </h2>
          <p className="text-lg text-muted-foreground font-mono mb-8 max-w-2xl mx-auto">
            Monitor and test Apache HTTP Server and Nginx running simultaneously via Docker Compose Desktop
          </p>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setShowInfo(false);
                setActiveTab('servers');
              }}
              className={`px-6 py-2 rounded-sm font-mono font-bold tracking-wider transition-all duration-200 ${
                activeTab === 'servers'
                  ? 'bg-cyan-500/30 border border-cyan-400 text-cyan-400 glow-cyan'
                  : 'bg-cyan-500/10 border border-cyan-400/30 text-cyan-400/70 hover:bg-cyan-500/20'
              }`}
            >
              TEST SERVERS
            </button>
            <button
              onClick={() => {
                setShowInfo(false);
                setActiveTab('loadtest');
              }}
              className={`px-6 py-2 rounded-sm font-mono font-bold tracking-wider transition-all duration-200 ${
                activeTab === 'loadtest'
                  ? 'bg-yellow-500/30 border border-yellow-400 text-yellow-400 glow-orange'
                  : 'bg-yellow-500/10 border border-yellow-400/30 text-yellow-400/70 hover:bg-yellow-500/20'
              }`}
            >
              LOAD TEST
            </button>
            <button
              onClick={() => {
                setShowInfo(true);
                setActiveTab('info');
              }}
              className={`px-6 py-2 rounded-sm font-mono font-bold tracking-wider transition-all duration-200 ${
                activeTab === 'info'
                  ? 'bg-lime-500/30 border border-lime-400 text-lime-400 glow-lime'
                  : 'bg-lime-500/10 border border-lime-400/30 text-lime-400/70 hover:bg-lime-500/20'
              }`}
            >
              SETUP GUIDE
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-12">
        {activeTab === 'servers' && (
          <div className="space-y-8">
            {/* Status Overview */}
            <div className="terminal-border border-cyan-400/30 p-6 rounded-sm glow-cyan">
              <h2 className="text-lg font-bold text-cyan-400 mb-2 tracking-wider">SERVER STATUS MONITOR</h2>
              <p className="text-sm text-muted-foreground font-mono mb-4">
                Real-time monitoring of Apache and Nginx containers
              </p>
            </div>

            {/* Server Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <ServerStatus
                name="APACHE"
                port={8080}
                icon={apacheIconUrl}
                color="orange"
              />
              <ServerStatus
                name="NGINX"
                port={8081}
                icon={nginxIconUrl}
                color="cyan"
              />
            </div>

            {/* Testing Instructions */}
            <div className="terminal-border border-yellow-400/30 p-6 rounded-sm">
              <h2 className="text-lg font-bold text-yellow-400 mb-4 tracking-wider">HOW TO TEST</h2>
              <div className="space-y-3 text-sm text-foreground font-mono">
                <div className="flex gap-3">
                  <span className="text-cyan-400 font-bold">1.</span>
                  <span>Ensure Docker Compose is running with both services</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400 font-bold">2.</span>
                  <span>Click "TEST CONNECTION" buttons to verify server status</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400 font-bold">3.</span>
                  <span>Monitor response times and connection status in real-time</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-cyan-400 font-bold">4.</span>
                  <span>Use Load Test tab for comprehensive performance comparison</span>
                </div>
              </div>
            </div>

            {/* Access URLs */}
            <div className="terminal-border border-lime-400/30 p-6 rounded-sm glow-lime">
              <h2 className="text-lg font-bold text-lime-400 mb-4 tracking-wider">ACCESS SERVERS</h2>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-center justify-between bg-black/50 p-3 rounded-sm border border-lime-400/20">
                  <span className="text-muted-foreground">Apache HTTP Server:</span>
                  <a
                    href="http://localhost:8080"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime-400 hover:text-lime-300 transition-colors"
                  >
                    http://localhost:8080
                  </a>
                </div>
                <div className="flex items-center justify-between bg-black/50 p-3 rounded-sm border border-lime-400/20">
                  <span className="text-muted-foreground">Nginx Server:</span>
                  <a
                    href="http://localhost:8081"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lime-400 hover:text-lime-300 transition-colors"
                  >
                    http://localhost:8081
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'loadtest' && <LoadTestPanel />}

        {activeTab === 'info' && <DockerComposeInfo />}
      </main>

      {/* Footer */}
      <footer className="border-t border-cyan-400/20 bg-background/50 py-8 mt-12">
        <div className="container text-center text-sm text-muted-foreground font-mono">
          <p>Docker Compose Tester v1.1 | Powered by React + Tailwind CSS + Recharts</p>
          <p className="mt-2 text-xs text-cyan-400/50">
            &lt; Monitor Apache &amp; Nginx Performance /&gt;
          </p>
        </div>
      </footer>
    </div>
  );
}

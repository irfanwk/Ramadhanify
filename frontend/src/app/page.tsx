import { ThemeToggle } from "@/components/ThemeToggle";
import { ServerStatusIndicator } from "@/components/ServerStatusIndicator";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-background relative overflow-hidden">

      {/* Decorative background circle */}
      <div className="absolute top-[-10%] -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 relative z-10">

        <header className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-display font-black tracking-tighter text-primary uppercase">Ramadhanify</h1>
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
          </div>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex flex-col gap-10">

          {/* Hero Section */}
          <div className="space-y-4 pt-6 pb-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-border bg-card text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_var(--hard-shadow)]">
              <Sparkles size={14} className="text-accent" />
              <span>Ramadan 1447 H</span>
            </div>

            <h2 className="text-5xl sm:text-6xl font-display font-black tracking-tight leading-[1.05] uppercase">
              Bikin Ucapan Ramadan &<br />
              <span className="text-primary bg-accent px-2 mr-1 rotate-1 inline-block transform -skew-x-3">Meme Relate</span>
              di Satu Tempat
            </h2>
            <p className="text-lg leading-relaxed font-medium opacity-90 border-l-4 border-primary pl-4 py-1">
              Pilih template kartu ucapan yang personal atau bikin meme kocak buat ngetawain momen bulan puasa bareng <span className="italic font-bold">circle</span> terdekat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Main Action 1 */}
            <Link
              href="/meme"
              className="group block"
            >
              <div className="brutalist-card bg-card p-6 flex flex-col gap-3 relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-secondary opacity-30 transform rotate-12 group-hover:scale-110 transition-transform">
                  <Zap size={100} />
                </div>
                <div className="relative z-10 flex flex-col items-start gap-4">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight">Meme Generator</h3>
                  <p className="text-sm font-medium opacity-80 leading-relaxed">
                    Bikin meme relatable saur telat, bukber wacana, atau tarawih speedrun pakai AI secara instan.
                  </p>
                  <div className="mt-2 brutalist-button bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2 text-sm group-hover:bg-accent group-hover:text-accent-foreground">
                    Build Meme <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>

            {/* Main Action 2 */}
            <Link
              href="/greeting"
              className="group block"
            >
              <div className="brutalist-card bg-primary text-primary-foreground p-6 flex flex-col gap-3 relative overflow-hidden ring-offset-background">
                <div className="relative z-10 flex flex-col items-start gap-4">
                  <h3 className="text-2xl font-display font-black uppercase tracking-tight">Aesthetic Greeting</h3>
                  <p className="text-sm font-medium text-primary-foreground/90 leading-relaxed">
                    Kartu ucapan aesthetic dan personal. Pilih tone-nya (ke pacar, dosen, atau sirkel) biar gak template.
                  </p>
                  <div className="mt-2 brutalist-button bg-background text-foreground px-4 py-2 flex items-center gap-2 text-sm">
                    Create Card <ArrowRight size={16} />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </main>

        <footer className="text-center pb-8 pt-10 border-t-2 border-border border-dashed mt-auto flex flex-col items-center gap-4">
          <ServerStatusIndicator />
          <div className="font-display font-bold uppercase text-xs tracking-widest opacity-60">
            © 2026 Ramadhanify <br /> Powered by Qwen / Wan AI
          </div>
        </footer>
      </div>
    </div>
  );
}

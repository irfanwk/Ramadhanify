import { ThemeToggle } from "@/components/ThemeToggle";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
      <div className="w-full max-w-md mx-auto flex flex-col gap-8 relative">
        <header className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold tracking-tight text-primary">Rada Islami.</h1>
          <ThemeToggle />
        </header>

        <main className="flex-1 flex flex-col gap-6">
          <div className="text-center space-y-3 pt-8 pb-4">
            <h2 className="text-4xl font-extrabold tracking-tight">Ramadan,<br />Tapi Jujur.</h2>
            <p className="text-secondary-foreground/80">Generator meme dan ucapan Ramadan AI untuk kamu yang struggle tapi tetep survive.</p>
          </div>

          <div className="grid gap-4">
            <Link
              href="/meme"
              className="group relative overflow-hidden rounded-2xl p-6 bg-card border border-secondary shadow-sm hover:shadow-md transition-all aesthetic-card"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Meme Generator</h3>
                <p className="text-sm opacity-90">Bikin meme sahur, tarawih, ngabuburit yang relate banget pake AI.</p>
              </div>
            </Link>

            <Link
              href="/greeting"
              className="group relative overflow-hidden rounded-2xl p-6 bg-primary text-primary-foreground shadow-sm hover:shadow-md transition-all aesthetic-card"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Personal Greeting</h3>
                <p className="text-sm opacity-90 text-primary-foreground/90">Ucapan maaf-maafan anti template garing untuk teman, dosen, atau crush.</p>
              </div>
            </Link>
          </div>
        </main>

        <footer className="text-center pb-8 pt-12 opacity-60 text-sm">
          <p>© 2026 Rada Islami. Powered by Qwen AI.</p>
        </footer>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Wand2, Loader2, Download, Copy, Check } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CustomSelect } from "@/components/CustomSelect";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

const genreOptions = [
    { value: "self-deprecating", label: "💀 SELF-DEPRECATING — i'm cooked vibes" },
    { value: "pov-situational", label: "👁️ POV SITUATIONAL — gue banget!" },
    { value: "ironi-meta", label: "😭 IRONI & META-HUMOR — post-irony" },
    { value: "corporate-satire", label: "🏢 CORPORATE SATIRE — gaji numpang lewat" },
];

const styleOptions = [
    { value: "classic", label: "CLASSIC — Kotak (Feed 1:1)" },
    { value: "aesthetic", label: "AESTHETIC — Portrait (Story 9:16)" },
];

type MemeResult = {
    imageUrl: string;
    contentText: string;
    imagePrompt: string;
    metadata: { style: string; genre: string };
};

export default function MemeGeneratorPage() {
    const [userJoke, setUserJoke] = useState("");
    const [genre, setGenre] = useState("self-deprecating");
    const [style, setStyle] = useState("classic");

    const [isLoading, setIsLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState<"text" | "image">("text");
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<MemeResult | null>(null);
    const [copied, setCopied] = useState(false);

    const handleGenerate = async () => {
        setIsLoading(true);
        setLoadingStage("text");
        setError(null);
        setResult(null);

        try {
            // Simulate stage indicator (text gen is fast, then image takes longer)
            const stageTimer = setTimeout(() => setLoadingStage("image"), 5000);

            const response = await fetch(`${API_URL}/content/generate-meme`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    category: "meme-genz",
                    userJoke: userJoke.trim() || undefined,
                    genre,
                    style,
                }),
            });

            clearTimeout(stageTimer);

            const json = await response.json();

            if (!response.ok) {
                const rawError: string = json.error || `Server error: ${response.status}`;
                const friendly =
                    rawError.includes("401") || rawError.toLowerCase().includes("api key")
                        ? "API key AI tidak valid. Hubungi pengembang."
                        : rawError.includes("429")
                        ? "Terlalu banyak request. Tunggu sebentar, lalu coba lagi."
                        : rawError.includes("timed out")
                        ? "Gambar terlalu lama di-generate. Coba lagi."
                        : rawError.length > 150
                        ? rawError.substring(0, 150) + "…"
                        : rawError;
                throw new Error(friendly);
            }

            setResult(json.data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan. Coba lagi.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!result?.contentText) return;
        await navigator.clipboard.writeText(result.contentText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        if (!result?.imageUrl) return;
        const a = document.createElement("a");
        a.href = result.imageUrl;
        a.download = `meme-radaislami-${Date.now()}.jpg`;
        a.target = "_blank";
        a.click();
    };

    const parseMemeText = (text: string) => {
        const parts = text.split("|||");
        return {
            top: parts[0]?.trim() ?? text,
            bottom: parts[1]?.trim() ?? null,
        };
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-background">
            <div className="w-full max-w-md mx-auto flex flex-col gap-6 relative z-10">

                {/* Header */}
                <header className="flex justify-between items-center py-4 border-b-4 border-border">
                    <Link href="/" className="p-2 hover:bg-card rounded-full transition-colors border-2 border-transparent hover:border-border">
                        <ArrowLeft size={24} className="text-foreground" />
                    </Link>
                    <h1 className="text-xl font-display font-black uppercase tracking-widest text-primary">Meme Gen.</h1>
                    <ThemeToggle />
                </header>

                <main className="flex-1 flex flex-col gap-6 w-full">

                    {/* Banner */}
                    <div className="brutalist-card bg-accent p-5 text-accent-foreground text-center">
                        <h2 className="text-2xl font-display font-black uppercase">MEME KITCHEN 🍳</h2>
                        <p className="text-sm font-medium mt-1">
                            Tulis bahan jokes-mu, pilih genre, biarkan AI Qwen bikin gambar meme-nya.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="brutalist-card bg-card p-6 flex flex-col gap-5">

                        {/* Joke input */}
                        <div className="space-y-2">
                            <label className="font-display font-bold uppercase text-sm">Topik / Ide Jokes</label>
                            <textarea
                                value={userJoke}
                                onChange={(e) => setUserJoke(e.target.value)}
                                placeholder="Contoh: Gue kalau ada tugas malah malah beres-beres kamar dulu."
                                rows={3}
                                className="w-full p-3 bg-background border-4 border-border rounded-none focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-mono text-sm resize-none"
                            />
                            <p className="text-xs text-foreground/50 font-medium">Opsional — kalau kosong AI bikin sendiri sesuai genre.</p>
                        </div>

                        {/* Genre */}
                        <div className="space-y-2">
                            <label className="font-display font-bold uppercase text-sm">Genre Humor</label>
                            <CustomSelect
                                options={genreOptions}
                                value={genre}
                                onChange={setGenre}
                                placeholder="Pilih Genre"
                            />
                        </div>

                        {/* Style */}
                        <div className="space-y-2">
                            <label className="font-display font-bold uppercase text-sm">Format</label>
                            <CustomSelect
                                options={styleOptions}
                                value={style}
                                onChange={setStyle}
                                placeholder="Pilih Format"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="border-4 border-red-500 bg-red-50 dark:bg-red-950 p-4">
                                <p className="text-red-700 dark:text-red-300 text-sm font-bold">⚠ Gagal generate</p>
                                <p className="text-red-600 dark:text-red-400 text-sm font-mono mt-1">{error}</p>
                            </div>
                        )}

                        {/* CTA */}
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="brutalist-button w-full bg-foreground text-background py-4 flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all"
                        >
                            {isLoading
                                ? <><Loader2 size={20} className="animate-spin" /><span>{loadingStage === "text" ? "AI nulis jokes..." : "AI gambar meme... (~20 detik)"}</span></>
                                : <><Wand2 size={20} /><span>MASAK MEME (AI)</span></>
                            }
                        </button>
                    </div>

                    {/* Result */}
                    {(isLoading || result) && (
                        <div className="brutalist-card bg-card overflow-hidden">
                            {isLoading ? (
                                <div className="p-10 flex flex-col items-center justify-center gap-4 text-foreground/60">
                                    <Loader2 size={42} className="animate-spin text-primary" />
                                    <div className="text-center">
                                        <p className="font-display font-black uppercase text-sm tracking-wider">
                                            {loadingStage === "text" ? "Step 1/2: Nulis jokes..." : "Step 2/2: Nge-gambar..."}
                                        </p>
                                        <p className="text-xs mt-1 font-mono">
                                            {loadingStage === "image" && "AI image gen butuh ~15-30 detik ☕"}
                                        </p>
                                    </div>
                                    {/* Progress indicator */}
                                    <div className="flex gap-2 mt-2">
                                        <div className={`h-2 w-16 ${loadingStage === "text" ? "bg-primary animate-pulse" : "bg-primary"}`} />
                                        <div className={`h-2 w-16 ${loadingStage === "image" ? "bg-primary animate-pulse" : "bg-border"}`} />
                                    </div>
                                </div>
                            ) : result ? (
                                <>
                                    {/* Generated image */}
                                    <div className="relative bg-black">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={result.imageUrl}
                                            alt="Generated meme"
                                            className="w-full object-cover"
                                            style={{ aspectRatio: result.metadata.style === "aesthetic" ? "9/16" : "1/1" }}
                                        />
                                        {/* Overlay text */}
                                        <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
                                            <p className="font-display font-black text-white text-lg sm:text-xl text-center uppercase leading-tight"
                                                style={{ textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000" }}>
                                                {parseMemeText(result.contentText).top}
                                            </p>
                                            {parseMemeText(result.contentText).bottom && (
                                                <p className="font-display font-black text-white text-lg sm:text-xl text-center uppercase leading-tight"
                                                    style={{ textShadow: "2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000" }}>
                                                    {parseMemeText(result.contentText).bottom}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="p-4 flex justify-between items-center border-t-4 border-border gap-2">
                                        <span className="text-xs font-mono text-foreground/40 shrink-0">
                                            {result.metadata.genre} · {result.metadata.style}
                                        </span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleCopy}
                                                className="brutalist-button flex items-center gap-1.5 text-xs px-3 py-2 bg-background border-2 border-border hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Teks</>}
                                            </button>
                                            <button
                                                onClick={handleDownload}
                                                className="brutalist-button flex items-center gap-1.5 text-xs px-3 py-2 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors"
                                            >
                                                <Download size={13} /> Unduh
                                            </button>
                                        </div>
                                    </div>
                                </>
                            ) : null}
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
}

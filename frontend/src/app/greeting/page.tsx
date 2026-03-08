"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Sparkles, Loader2, Copy, Check } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CustomSelect } from "@/components/CustomSelect";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

const THEME_MAP: Record<string, { bg: string; text: string; label: string }> = {
    "lailatul-qadr": {
        bg: "var(--theme-lailatul-qadr)",
        text: "var(--text-lailatul-qadr)",
        label: "Lailatul Qadr",
    },
    senja: {
        bg: "var(--theme-senja)",
        text: "var(--text-senja)",
        label: "Senja",
    },
    hijau: {
        bg: "var(--theme-hijau)",
        text: "var(--text-hijau)",
        label: "Hijau Masjid",
    },
};

export default function GreetingGeneratorPage() {
    const [recipientName, setRecipientName] = useState("");
    const [hubungan, setHubungan] = useState("");
    const [pesanCustom, setPesanCustom] = useState("");
    const [selectedTheme, setSelectedTheme] = useState("lailatul-qadr");

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<{ greetingText: string; theme: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const hubunganOptions = [
        { label: 'Teman Kuliah (The "Academic Trauma" Bond)', value: "teman-kuliah" },
        { label: 'Sahabat Dekat (The "No Filter" Zone)', value: "sahabat-dekat" },
        { label: "Pacar/Gebetan (Sweet but Grounded)", value: "pacar" },
        { label: "Dosen/Atasan (Professional Respect)", value: "atasan" },
        { label: "Orang Tua (Deep Gratitude)", value: "orang-tua" },
    ];

    const handleGenerate = async () => {
        if (!recipientName.trim()) {
            setError("Isi nama penerima dulu ya!");
            return;
        }
        if (!hubungan) {
            setError("Pilih tipe hubungan dulu!");
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await fetch(`${API_URL}/content/generate-greeting`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    recipientName: recipientName.trim(),
                    relationship: hubungan,
                    tone: selectedTheme,
                    visualTheme: selectedTheme,
                    customMessage: pesanCustom.trim() || undefined,
                }),
            });

            const json = await response.json();

            if (!response.ok) {
                // Sederhanakan pesan error agar tidak tampil raw JSON
                const rawError: string = json.error || json.message || `Server error: ${response.status}`;
                const friendlyError = rawError.includes('401') || rawError.toLowerCase().includes('api key')
                    ? 'API key AI tidak valid atau belum dikonfigurasi. Hubungi pengembang.'
                    : rawError.includes('429')
                    ? 'Terlalu banyak request. Tunggu sebentar lalu coba lagi.'
                    : rawError.length > 120
                    ? rawError.substring(0, 120) + '…'
                    : rawError;
                throw new Error(friendlyError);
            }

            setResult(json.data);
        } catch (err: any) {
            setError(err.message || "Terjadi kesalahan. Coba lagi.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!result?.greetingText) return;
        await navigator.clipboard.writeText(result.greetingText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const activeTheme = THEME_MAP[result?.theme ?? selectedTheme] ?? THEME_MAP["lailatul-qadr"];

    return (
        <div className="flex flex-col items-center min-h-screen p-4 sm:p-8 bg-background">
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-6 relative z-10">

                <header className="flex justify-between items-center py-4 border-b-4 border-border">
                    <Link href="/" className="p-2 hover:bg-card rounded-full transition-colors border-2 border-transparent hover:border-border">
                        <ArrowLeft size={24} className="text-foreground" />
                    </Link>
                    <h1 className="text-xl font-display font-black uppercase tracking-widest text-primary">Aesth Greeting</h1>
                    <ThemeToggle />
                </header>

                <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start">

                    {/* Left Column: Form */}
                    <div className="brutalist-card bg-card p-6 flex flex-col gap-6 order-2 lg:order-1">

                        <div className="space-y-2">
                            <label className="font-display font-bold uppercase text-sm">Nama Penerima</label>
                            <input
                                type="text"
                                value={recipientName}
                                onChange={(e) => setRecipientName(e.target.value)}
                                placeholder="misal: Pak Budi, Si Raka, Mama"
                                className="w-full p-3 bg-background border-4 border-border rounded-none focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-bold text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-display font-bold uppercase text-sm">Hubungan / Tipe</label>
                            <CustomSelect
                                options={hubunganOptions}
                                value={hubungan}
                                onChange={setHubungan}
                                placeholder="Pilih Hubungan"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="font-display font-bold uppercase text-sm">Pesan / Poin yang Ingin Disampaikan</label>
                            <textarea
                                value={pesanCustom}
                                onChange={(e) => setPesanCustom(e.target.value)}
                                rows={5}
                                placeholder={`Tulis poin-poin ucapanmu di sini.\n\nContoh:\nMinta maaf kalau sering bikin deadline-mu molor\n`}
                                className="w-full p-3 bg-background border-4 border-border rounded-none focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all font-mono text-sm resize-none leading-relaxed"
                            />
                            <p className="text-xs text-foreground/50 font-medium">Opsional — kalau kosong, AI akan generate berdasarkan tipe hubungan.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="font-display font-bold uppercase text-sm">Vibe Tema Card</label>
                            <div className="flex gap-3 pb-2">
                                {Object.entries(THEME_MAP).map(([key, val]) => (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedTheme(key)}
                                        title={val.label}
                                        className={`h-10 w-10 flex-shrink-0 rounded-full border-4 focus:outline-none hover:scale-110 transition-all ${selectedTheme === key ? "border-primary scale-110 ring-2 ring-primary ring-offset-2" : "border-border"}`}
                                        style={{ background: val.bg }}
                                        aria-label={`Theme ${val.label}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {error && (
                            <div className="border-4 border-red-500 bg-red-50 dark:bg-red-950 p-4 rounded-sm">
                                <p className="text-red-700 dark:text-red-300 text-sm font-bold">⚠ Gagal generate</p>
                                <p className="text-red-600 dark:text-red-400 text-sm font-mono mt-1">{error}</p>
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={isLoading}
                            className="brutalist-button w-full bg-accent text-accent-foreground py-4 flex items-center justify-center gap-2 mt-4 hover:bg-foreground hover:text-background transform hover:-translate-y-1 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading
                                ? <><Loader2 size={20} className="animate-spin" /><span>AI lagi nulis...</span></>
                                : <><Sparkles size={20} /><span>GENERATE CARD (AI)</span></>
                            }
                        </button>
                    </div>

                    {/* Right Column: Preview */}
                    <div
                        className="brutalist-card p-8 flex flex-col gap-6 min-h-[400px] order-1 lg:order-2 transition-all duration-700"
                        style={{
                            background: activeTheme.bg,
                            color: activeTheme.text,
                            borderColor: "rgba(255,255,255,0.2)",
                        }}
                    >
                        {result ? (
                            <>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-mono font-bold uppercase opacity-70 tracking-widest">
                                        {THEME_MAP[result.theme]?.label ?? result.theme}
                                    </span>
                                    <button
                                        onClick={handleCopy}
                                        className="flex items-center gap-1.5 text-xs font-bold uppercase px-3 py-1.5 border-2 rounded-sm hover:opacity-80 transition-all"
                                        style={{ borderColor: activeTheme.text, color: activeTheme.text }}
                                    >
                                        {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Salin Teks</>}
                                    </button>
                                </div>

                                <div className="flex-1 font-serif text-lg leading-relaxed whitespace-pre-wrap">
                                    {result.greetingText}
                                </div>

                                <p className="text-xs opacity-50 font-mono text-right">
                                    ✨ dibuat oleh Rada Islami AI
                                </p>
                            </>
                        ) : isLoading ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-80">
                                <Loader2 size={40} className="animate-spin" style={{ color: activeTheme.text }} />
                                <p className="font-display font-bold uppercase text-sm tracking-wider">
                                    AI sedang merangkai kata-kata...
                                </p>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center opacity-70">
                                <h2 className="text-2xl font-display font-black uppercase">PREVIEW KARTU UCAPAN</h2>
                                <p className="text-sm font-medium max-w-md leading-relaxed">
                                    Isi form di sebelah kiri, lalu klik <strong>Generate Card</strong>. Kartu ucapan personalmu akan muncul di sini — dibuat oleh AI, terasa seperti dari hati.
                                </p>
                                <div className="text-4xl">✨</div>
                            </div>
                        )}
                    </div>

                </main>
            </div>
        </div>
    );
}

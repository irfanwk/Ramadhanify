import { config } from '../config/unifiedConfig';

const QWEN_CHAT_URL = 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1/chat/completions';
const WANX_SUBMIT_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const WANX_TASK_URL = 'https://dashscope-intl.aliyuncs.com/api/v1/tasks';
const QWEN_MODEL = 'qwen-plus';

// --- Types ---

interface QwenMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

interface WanxTaskResult {
    task_id: string;
    task_status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
    output?: {
        results?: Array<{ url: string }>;
    };
    message?: string;
}

// --- Genre labels for prompt context ---

const genreLabel: Record<string, string> = {
    'self-deprecating': 'Self-Deprecating & Nihilistik — menertawakan penderitaan diri sendiri dengan nada "it is what it is", gelap tapi santai. Contoh vibes: "I\'m cooked", "gue tamat", "ya sudahlah".',
    'pov-situational': 'POV & Situational Humor — format "POV: ..." menggambarkan kejadian sehari-hari Gen Z yang sangat spesifik dan akrab, membuat pembaca merasa "gue banget!".',
    'ironi-meta': 'Ironi, Post-Ironi & Meta-Humor — menggunakan sesuatu yang garing atau tidak lucu secara sengaja sampai jadi lucu. Sering pakai emoji 💀 atau 😭 untuk merespons hal yang tragis maupun lucu.',
    'corporate-satire': 'Corporate Satire — menyindir budaya kantoran dan magang yang absurd. Bahasa korporat berlebihan, gaji numpang lewat, mental "yang penting nggak resign hari ini".',
};

// --- Core LLM caller ---

async function callQwenChat(messages: QwenMessage[], maxTokens = 600): Promise<string> {
    const response = await fetch(QWEN_CHAT_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.ai.qwenApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: QWEN_MODEL,
            messages,
            temperature: 0.85,
            max_tokens: maxTokens,
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Qwen API Error ${response.status}: ${errorBody}`);
    }

    const data = await response.json() as any;
    return data.choices?.[0]?.message?.content?.trim() ?? '';
}

// --- Wanx image generation (async polling) ---

async function submitWanxTask(imagePrompt: string, style: 'classic' | 'aesthetic'): Promise<string> {
    // Classic = square feed format, Aesthetic = portrait story format
    const size = style === 'aesthetic' ? '768*1280' : '1024*1024';

    const response = await fetch(WANX_SUBMIT_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${config.ai.qwenApiKey}`,
            'Content-Type': 'application/json',
            'X-DashScope-Async': 'enable',
        },
        body: JSON.stringify({
            model: 'wan2.1-t2i-turbo',
            input: { prompt: imagePrompt },
            parameters: {
                size,
                n: 1,
                style: '<auto>',
            },
        }),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Wanx submit failed (${response.status}): ${errorBody}`);
    }

    const data = await response.json() as any;
    const taskId: string = data?.output?.task_id;
    if (!taskId) throw new Error('Wanx API did not return a task_id');

    return taskId;
}

async function pollWanxTask(taskId: string, maxSeconds = 90): Promise<string> {
    const intervalMs = 3000;
    const maxAttempts = Math.floor((maxSeconds * 1000) / intervalMs);

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(r => setTimeout(r, intervalMs));

        const response = await fetch(`${WANX_TASK_URL}/${taskId}`, {
            headers: { 'Authorization': `Bearer ${config.ai.qwenApiKey}` },
        });

        if (!response.ok) {
            throw new Error(`Wanx poll failed (${response.status})`);
        }

        const data = await response.json() as any;
        const status: WanxTaskResult['task_status'] = data?.output?.task_status;

        if (status === 'SUCCEEDED') {
            const url: string = data?.output?.results?.[0]?.url;
            if (!url) throw new Error('Wanx task succeeded but no image URL returned');
            return url;
        }

        if (status === 'FAILED') {
            const message = data?.output?.message || 'Unknown failure';
            throw new Error(`Wanx image generation failed: ${message}`);
        }
        // PENDING / RUNNING → continue polling
    }

    throw new Error(`Wanx image generation timed out after ${maxSeconds}s`);
}

// --- QwenService ---

export class QwenService {

    async generateGreeting(
        recipientName: string,
        relationship: string,
        tone: string,
        customMessage?: string
    ): Promise<string> {
        const customPoints = customMessage?.trim()
            ? `\n\nPoin-poin spesifik yang WAJIB masuk ke dalam kartu:\n${customMessage.trim()}`
            : '';

        const relationshipLabel: Record<string, string> = {
            'teman-kuliah': 'teman kuliah (penuh inside joke dan kenangan perjuangan akademik)',
            'sahabat-dekat': 'sahabat dekat (sangat akrab, no filter, jujur dan hangat)',
            'pacar': 'pasangan / gebetan (romantis tapi tetap grounded dan genuine)',
            'atasan': 'dosen atau atasan kerja (profesional, penuh rasa hormat, tapi personal)',
            'orang-tua': 'orang tua (penuh cinta, rasa syukur, dan ketulusan mendalam)',
        };

        const toneLabel: Record<string, string> = {
            'lailatul-qadr': 'khidmat, puitis, penuh ketenangan spiritual seperti malam Lailatul Qadr',
            'senja': 'hangat, nostalgis, seperti senja Ramadan yang sendu namun penuh harapan',
            'hijau': 'segar, optimistis, penuh semangat ibadah seperti warna masjid',
        };

        return callQwenChat([
            { role: 'system', content: `Kamu adalah penulis kartu ucapan Idul Fitri yang brilian dan empatik. Tugasmu adalah menulis kartu ucapan yang terasa personal, tulus, dan tidak seperti template broadcast biasa. Gaya bahasamu: campuran Indonesia dan sedikit gaul sesuai konteks, mengalir natural, tidak lebay. Format output: HANYA teks kartu ucapan itu sendiri. Tidak perlu judul, tidak perlu penjelasan. Panjang: 3-5 paragraf singkat yang padat makna.` },
            { role: 'user', content: `Buatkan kartu ucapan Idul Fitri untuk ${recipientName}.\nHubungan kami: ${relationshipLabel[relationship] || relationship}.\nSuasana / tema visual: ${toneLabel[tone] || tone}.${customPoints}\n\nMulai langsung dengan sapaan hangat kepada ${recipientName}. Buat seolah ini benar-benar ditulis dari hati, bukan template.` },
        ]);
    }

    /**
     * Menghasilkan teks meme berformat "setup ||| punchline"
     * + image prompt siap dikirim ke wanx API.
     */
    async generateMemeText(genre: string, userJoke?: string): Promise<{ displayText: string; imagePrompt: string }> {
        const jokeContext = userJoke?.trim()
            ? `Jokes dari user: "${userJoke.trim()}"`
            : 'Buatkan jokes sendiri yang sangat relatable untuk konteks ini.';

        const genreDesc = genreLabel[genre] || genre;

        // Step 1: generate the joke text
        const displayText = await callQwenChat([
            {
                role: 'system',
                content: 'Kamu adalah kreator konten meme Gen Z Indonesia yang sangat paham humor anak muda. Humor kamu cerdas, relatable, dan tidak menyinggung SARA.',
            },
            {
                role: 'user',
                content: `Buatkan teks meme dengan genre: ${genreDesc}

${jokeContext}

Format output WAJIB: "teks setup ||| teks punchline"
Pisahkan setup dan punchline dengan |||
Jangan gunakan tanda kutip di awal/akhir.
Contoh: POV: lo lagi coding deadline jam 3 pagi ||| eh tau-tau malah buka YouTube 💀`,
            },
        ], 200);

        // Step 2: build image prompt from template
        const imagePrompt = await callQwenChat([
            {
                role: 'system',
                content: 'Kamu adalah prompt engineer untuk AI image generation. Buat prompt gambar yang vivid, spesifik, dan cocok untuk meme Gen Z Indonesia.',
            },
            {
                role: 'user',
                content: `Buatlah meme gambar untuk jokes dengan kata "${displayText}" dan tolong gunakan template gambar yang umum digunakan pada jokes di indonesia yang disesuaikan dengan konteks pada kalimat jokes tersebut, targetnya adalah gen z sehingga gambar lebih relate dengan pengguna gen z. dengan tema jokes adalah ${genreDesc}.

Buat dalam bahasa Inggris agar AI image generator mengerti. Maksimal 2 kalimat, deskriptif dan visual. Jangan sebut merek atau nama artis nyata.`,
            },
        ], 150);

        return { displayText, imagePrompt };
    }

    /**
     * Menghasilkan gambar meme via Wanx API (async polling).
     * Mengembalikan URL gambar yang sudah jadi.
     */
    async generateMemeImage(imagePrompt: string, style: 'classic' | 'aesthetic'): Promise<string> {
        const taskId = await submitWanxTask(imagePrompt, style);
        return pollWanxTask(taskId);
    }
}

export const qwenService = new QwenService();

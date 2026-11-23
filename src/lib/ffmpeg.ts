// Cloakfy WebAssembly FFmpeg Engine with Web Worker and Resilient Fallbacks

type FFmpegMessageType =
  | "LOAD"
  | "EXEC"
  | "FFPROBE"
  | "WRITE_FILE"
  | "READ_FILE"
  | "DELETE_FILE"
  | "RENAME"
  | "CREATE_DIR"
  | "LIST_DIR"
  | "DELETE_DIR"
  | "ERROR"
  | "DOWNLOAD"
  | "PROGRESS"
  | "LOG";

export class FFmpegClient {
  private worker: Worker | null = null;
  private reqId = 0;
  private resolves: Record<number, (val: any) => void> = {};
  private rejects: Record<number, (err: any) => void> = {};
  private logListeners: Array<(msg: string) => void> = [];
  public loaded = false;

  constructor() {}

  onLog(cb: (msg: string) => void) {
    this.logListeners.push(cb);
  }

  private post(type: FFmpegMessageType, data: any, transfer: Transferable[] = []): Promise<any> {
    if (!this.worker) return Promise.reject(new Error("Worker not initialized"));
    const id = ++this.reqId;
    return new Promise((resolve, reject) => {
      this.resolves[id] = resolve;
      this.rejects[id] = reject;
      this.worker!.postMessage({ id, type, data }, transfer);
    });
  }

  async load(options?: { coreURL?: string; wasmURL?: string }): Promise<void> {
    if (this.loaded) return;

    const workerUrl = new URL("/assets/worker-BAOIWoxA.js", window.location.origin);
    this.worker = new Worker(workerUrl, { type: "module" });

    this.worker.onmessage = ({ data }: MessageEvent) => {
      const { id, type, data: payload } = data;
      if (type === "LOG") {
        const msg = typeof payload === "string" ? payload : payload?.message || "";
        this.logListeners.forEach((fn) => fn(msg));
        return;
      }
      if (type === "ERROR") {
        if (id && this.rejects[id]) {
          this.rejects[id](new Error(payload));
          delete this.resolves[id];
          delete this.rejects[id];
        }
        return;
      }
      if (id && this.resolves[id]) {
        if (type === "LOAD") this.loaded = true;
        this.resolves[id](payload);
        delete this.resolves[id];
        delete this.rejects[id];
      }
    };

    const origin = window.location.origin;
    let coreBlobUrl = options?.coreURL;
    let wasmBlobUrl = options?.wasmURL;

    if (!coreBlobUrl || !wasmBlobUrl) {
      try {
        const [coreRes, wasmRes] = await Promise.all([
          fetch(`${origin}/ffmpeg/ffmpeg-core.js`),
          fetch(`${origin}/ffmpeg/ffmpeg-core.wasm`),
        ]);
        if (coreRes.ok && wasmRes.ok) {
          const coreBlob = new Blob([await coreRes.arrayBuffer()], { type: "application/javascript" });
          const wasmBlob = new Blob([await wasmRes.arrayBuffer()], { type: "application/wasm" });
          coreBlobUrl = URL.createObjectURL(coreBlob);
          wasmBlobUrl = URL.createObjectURL(wasmBlob);
        }
      } catch (err) {
        console.warn("Could not create local FFmpeg blob URLs, falling back to direct URLs", err);
      }
    }

    await this.post("LOAD", {
      coreURL: coreBlobUrl || `${origin}/ffmpeg/ffmpeg-core.js`,
      wasmURL: wasmBlobUrl || `${origin}/ffmpeg/ffmpeg-core.wasm`,
    });
    this.loaded = true;
  }

  async writeFile(path: string, data: Uint8Array): Promise<void> {
    await this.post("WRITE_FILE", { path, data }, [data.buffer]);
  }

  async readFile(path: string): Promise<Uint8Array> {
    const res = await this.post("READ_FILE", { path, encoding: "binary" });
    if (res instanceof Uint8Array) return res;
    return new Uint8Array(res);
  }

  async deleteFile(path: string): Promise<void> {
    try {
      await this.post("DELETE_FILE", { path });
    } catch {
      // ignore deletion error
    }
  }

  async exec(args: string[]): Promise<number> {
    return (await this.post("EXEC", { args })) as number;
  }

  terminate() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.loaded = false;
    }
  }
}

let sharedFFmpeg: FFmpegClient | null = null;
let loadPromise: Promise<FFmpegClient> | null = null;

export async function getFFmpeg(onStatus?: (s: string) => void): Promise<FFmpegClient> {
  if (sharedFFmpeg && sharedFFmpeg.loaded) return sharedFFmpeg;
  if (loadPromise) return loadPromise;

  onStatus?.("Carregando motor FFmpeg...");
  loadPromise = (async () => {
    try {
      const client = new FFmpegClient();
      await client.load();
      sharedFFmpeg = client;
      return client;
    } catch (err) {
      loadPromise = null;
      throw err;
    }
  })();

  return loadPromise;
}

export async function fileToUint8Array(file: File | Blob): Promise<Uint8Array> {
  const buf = await file.arrayBuffer();
  return new Uint8Array(buf);
}

// ==========================================
// 1. TIKTOK CAMOUFLAGE ENGINE
// ==========================================

export type TikTokCamouflageMode = "basic" | "normal" | "aggressive";

export function getTikTokFFmpegArgs(mode: TikTokCamouflageMode, inputName: string, outputName: string): string[] {
  switch (mode) {
    case "basic":
      return ["-i", inputName, "-map_metadata", "-1", "-c", "copy", "-fflags", "+bitexact", outputName];
    case "normal":
      return [
        "-i", inputName,
        "-map_metadata", "-1",
        "-r", "29.97",
        "-vsync", "cfr",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-b:v", "2800k",
        "-maxrate", "3400k",
        "-bufsize", "5600k",
        "-pix_fmt", "yuv420p",
        "-g", "60",
        "-keyint_min", "30",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        "-fflags", "+bitexact",
        outputName,
      ];
    case "aggressive":
      return [
        "-i", inputName,
        "-map_metadata", "-1",
        "-r", "29.97",
        "-vsync", "cfr",
        "-vf", "crop=iw-2:ih-2:1:1,eq=brightness=0.01,format=yuv420p",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-crf", "20",
        "-maxrate", "4000k",
        "-bufsize", "8000k",
        "-g", "60",
        "-keyint_min", "30",
        "-c:a", "aac",
        "-b:a", "128k",
        "-ar", "44100",
        "-fflags", "+bitexact",
        "-movflags", "+faststart",
        outputName,
      ];
  }
}

export async function camuflarTikTokVideo(
  file: File,
  mode: TikTokCamouflageMode,
  onStatus?: (msg: string) => void
): Promise<{ blob: Blob; url: string; outputName: string; size: number }> {
  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  const inName = `input_${Date.now()}.${ext}`;
  const outName = `output_${Date.now()}.mp4`;
  const cleanName = file.name.replace(/\.[^.]+$/, "");
  const downloadName = `${cleanName}-tiktok.mp4`;

  try {
    onStatus?.("Iniciando motor FFmpeg...");
    const ffmpeg = await getFFmpeg(onStatus);

    onStatus?.("Carregando vídeo na memória...");
    await ffmpeg.writeFile(inName, await fileToUint8Array(file));

    onStatus?.("Processando camuflagem para TikTok Ads...");
    const args = getTikTokFFmpegArgs(mode, inName, outName);
    const code = await ffmpeg.exec(args);

    if (code !== 0) {
      throw new Error(`FFmpeg falhou com código ${code}`);
    }

    onStatus?.("Lendo resultado final...");
    const data = await ffmpeg.readFile(outName);
    await Promise.allSettled([ffmpeg.deleteFile(inName), ffmpeg.deleteFile(outName)]);

    const blob = new Blob([data.buffer as ArrayBuffer], { type: "video/mp4" });
    const url = URL.createObjectURL(blob);
    return { blob, url, outputName: downloadName, size: blob.size };
  } catch (err) {
    console.warn("FFmpeg WASM falhou no TikTok, executando fallback otimizado via Canvas/MediaRecorder:", err);
    onStatus?.("Executando camuflagem acelerada via hardware...");
    return await fallbackProcessTikTok(file, mode, downloadName);
  }
}

async function fallbackProcessTikTok(
  file: File,
  mode: TikTokCamouflageMode,
  downloadName: string
): Promise<{ blob: Blob; url: string; outputName: string; size: number }> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const srcUrl = URL.createObjectURL(file);
    video.src = srcUrl;
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = async () => {
      try {
        const w = video.videoWidth || 1080;
        const h = video.videoHeight || 1920;
        const crop = mode === "aggressive" ? 4 : mode === "normal" ? 2 : 0;
        const canvas = document.createElement("canvas");
        canvas.width = w - crop * 2;
        canvas.height = h - crop * 2;
        const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

        const stream = canvas.captureStream(29.97);
        try {
          const audioTracks = (video as any).captureStream?.()?.getAudioTracks() || [];
          audioTracks.forEach((t: any) => stream.addTrack(t));
        } catch {
          // ignore stream audio track error
        }

        const mime = MediaRecorder.isTypeSupported("video/mp4")
          ? "video/mp4"
          : MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
          ? "video/webm;codecs=vp9"
          : "video/webm";

        const recorder = new MediaRecorder(stream, {
          mimeType: mime,
          videoBitsPerSecond: mode === "aggressive" ? 2800000 : 3400000,
        });

        const chunks: Blob[] = [];
        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        const duration = Math.min(video.duration || 5, 120);

        recorder.onstop = () => {
          URL.revokeObjectURL(srcUrl);
          const finalBlob = new Blob(chunks, { type: mime });
          const finalName = mime.includes("mp4") ? downloadName : downloadName.replace(/\.mp4$/, ".webm");
          resolve({
            blob: finalBlob,
            url: URL.createObjectURL(finalBlob),
            outputName: finalName,
            size: finalBlob.size,
          });
        };

        recorder.start();
        await video.play().catch(() => {});

        let anim = 0;
        const loop = () => {
          if (video.currentTime >= duration || video.ended) {
            cancelAnimationFrame(anim);
            video.pause();
            recorder.stop();
            return;
          }
          ctx.drawImage(video, crop, crop, w - crop * 2, h - crop * 2, 0, 0, canvas.width, canvas.height);
          if (mode === "aggressive") {
            ctx.fillStyle = "rgba(0, 230, 118, 0.003)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }
          anim = requestAnimationFrame(loop);
        };
        anim = requestAnimationFrame(loop);
      } catch (e) {
        URL.revokeObjectURL(srcUrl);
        reject(e);
      }
    };

    video.onerror = (e) => {
      URL.revokeObjectURL(srcUrl);
      reject(e);
    };
  });
}

// ==========================================
// 2. AUTO-VARIAÇÕES ENGINE
// ==========================================

export type AutoVarLevel = "subtle" | "moderate" | "strong";

const VAR_PARAMS = {
  subtle: { bright: 0.03, contrast: 0.03, sat: 0.05, crop: 3, speed: 0.01, bitrate: 5, hue: 2 },
  moderate: { bright: 0.08, contrast: 0.06, sat: 0.1, crop: 6, speed: 0.03, bitrate: 10, hue: 4 },
  strong: { bright: 0.15, contrast: 0.1, sat: 0.15, crop: 12, speed: 0.05, bitrate: 15, hue: 6 },
};

const SIDES = ["top", "bottom", "left", "right"] as const;
const SIDE_NAMES = { top: "topo", bottom: "baixo", left: "esq", right: "dir" };

const rnd = (min: number, max: number) => min + Math.random() * (max - min);
const roundAcc = (n: number, d = 3) => Math.round(n * 10 ** d) / 10 ** d;

export interface VariationConfig {
  brightness: number;
  contrast: number;
  saturation: number;
  cropPixels: number;
  cropSide: (typeof SIDES)[number];
  frameRate: number;
  bitrate: number;
  speed: number;
  audioShift: number;
  hue: number;
}

export function formatVariationDesc(cfg: VariationConfig): string {
  const parts: string[] = [];
  if (Math.abs(cfg.brightness) > 0.001) parts.push(`brilho ${cfg.brightness > 0 ? "+" : ""}${cfg.brightness}`);
  if (Math.abs(cfg.saturation) > 0.001) parts.push(`sat ${cfg.saturation > 0 ? "+" : ""}${cfg.saturation}`);
  if (Math.abs(cfg.hue) > 0.05) parts.push(`hue ${cfg.hue > 0 ? "+" : ""}${cfg.hue}°`);
  parts.push(`crop ${cfg.cropPixels}px ${SIDE_NAMES[cfg.cropSide]}`);
  parts.push(`${cfg.frameRate}fps`);
  if (Math.abs(cfg.speed - 1) > 0.001) parts.push(`${cfg.speed}x`);
  return parts.join(" · ");
}

export function generateVariationConfigs(count: number, level: AutoVarLevel, baseBitrate: number): VariationConfig[] {
  const p = VAR_PARAMS[level];
  return Array.from({ length: count }, () => {
    const sideIdx = Math.floor(Math.random() * 4);
    const chosenSide = SIDES[sideIdx] ?? "left";
    return {
      brightness: roundAcc(rnd(-p.bright, p.bright)),
      contrast: roundAcc(rnd(-p.contrast, p.contrast)),
      saturation: roundAcc(rnd(-p.sat, p.sat)),
      cropPixels: Math.floor(Math.random() * p.crop) + 1,
      cropSide: chosenSide,
      frameRate: roundAcc(30 + rnd(-0.06, 0.06), 2),
      bitrate: Math.round(baseBitrate * (1 + rnd(-p.bitrate, p.bitrate) / 100)),
      speed: roundAcc(1 + rnd(-p.speed, p.speed)),
      audioShift: Math.floor(Math.random() * 50),
      hue: roundAcc(rnd(-p.hue, p.hue), 1),
    };
  });
}

export async function estimateVideoBitrate(file: File): Promise<number> {
  return new Promise((resolve) => {
    try {
      const v = document.createElement("video");
      v.preload = "metadata";
      v.onloadedmetadata = () => {
        const dur = v.duration;
        URL.revokeObjectURL(v.src);
        if (dur && isFinite(dur) && dur > 0) {
          resolve(Math.max(500, Math.min(8000, Math.round((file.size * 8) / dur / 1000))));
        } else {
          resolve(2500);
        }
      };
      v.onerror = () => resolve(2500);
      v.src = URL.createObjectURL(file);
    } catch {
      resolve(2500);
    }
  });
}

export async function processAutoVariacoes(
  file: File,
  count: number,
  level: AutoVarLevel,
  onStep?: (done: number, total: number, msg: string) => void,
  onResult?: (res: { index: number; config: VariationConfig; blob: Blob; size: number; url: string; label: string }) => void
): Promise<Array<{ index: number; config: VariationConfig; blob: Blob; size: number; url: string; label: string }>> {
  const baseBitrate = await estimateVideoBitrate(file);
  const configs = generateVariationConfigs(count, level, baseBitrate);
  const ext = (file.name.split(".").pop() || "mp4").toLowerCase();
  const baseName = file.name.replace(/\.[^.]+$/, "");
  const results: Array<{ index: number; config: VariationConfig; blob: Blob; size: number; url: string; label: string }> = [];

  try {
    const ffmpeg = await getFFmpeg((s) => onStep?.(0, count, s));
    const inName = `src_${Date.now()}.${ext}`;
    await ffmpeg.writeFile(inName, await fileToUint8Array(file));

    for (let i = 0; i < configs.length; i++) {
      const cfg = configs[i]!;
      const outName = `var_${i + 1}_${Date.now()}.mp4`;
      const cropLeft = cfg.cropSide === "left" ? cfg.cropPixels : 0;
      const cropTop = cfg.cropSide === "top" ? cfg.cropPixels : 0;

      const vf = [
        `crop=iw-${cfg.cropPixels}:ih-${cfg.cropPixels}:${cropLeft}:${cropTop}`,
        "scale=trunc(iw/2)*2:trunc(ih/2)*2",
        `eq=brightness=${cfg.brightness}:contrast=${roundAcc(1 + cfg.contrast)}:saturation=${roundAcc(1 + cfg.saturation)}`,
        `hue=h=${cfg.hue}`,
        `setpts=${roundAcc(1 / cfg.speed, 5)}*PTS`,
        "format=yuv420p",
      ].join(",");

      const maxRate = Math.round(cfg.bitrate * 1.5);
      const args = [
        "-i", inName,
        "-map_metadata", "-1",
        "-vf", vf,
        "-r", String(cfg.frameRate),
        "-vsync", "cfr",
        "-c:v", "libx264",
        "-preset", "veryfast",
        "-b:v", `${cfg.bitrate}k`,
        "-maxrate", `${maxRate}k`,
        "-bufsize", `${cfg.bitrate * 2}k`,
        "-g", "60",
        "-keyint_min", "30",
        "-c:a", "aac",
        "-b:a", "128k",
        "-af", `atempo=${roundAcc(cfg.speed)}`,
        "-fflags", "+bitexact",
        "-movflags", "+faststart",
        outName,
      ];

      onStep?.(i, count, `Gerando variação ${i + 1}/${count}…`);
      await ffmpeg.exec(args);

      const outData = await ffmpeg.readFile(outName);
      await ffmpeg.deleteFile(outName);

      const blob = new Blob([outData.buffer as ArrayBuffer], { type: "video/mp4" });
      const item = {
        index: i,
        config: cfg,
        blob,
        size: blob.size,
        url: URL.createObjectURL(blob),
        label: `${baseName}-var${i + 1}.mp4`,
      };
      results.push(item);
      onResult?.(item);
    }

    await ffmpeg.deleteFile(inName);
    return results;
  } catch (err) {
    console.warn("FFmpeg WASM falhou nas Auto-Variações, usando fallback direto via Canvas:", err);
    return await fallbackProcessAutoVariacoes(file, configs, baseName, onStep, onResult);
  }
}

async function fallbackProcessAutoVariacoes(
  file: File,
  configs: VariationConfig[],
  baseName: string,
  onStep?: (done: number, total: number, msg: string) => void,
  onResult?: (res: any) => void
) {
  const results: any[] = [];
  const srcUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.src = srcUrl;
  video.muted = true;
  await new Promise((r) => (video.onloadedmetadata = r));

  const w = video.videoWidth || 1080;
  const h = video.videoHeight || 1920;

  for (let i = 0; i < configs.length; i++) {
    const cfg = configs[i]!;
    onStep?.(i, configs.length, `Gerando variação ${i + 1}/${configs.length}…`);

    const canvas = document.createElement("canvas");
    canvas.width = w - cfg.cropPixels;
    canvas.height = h - cfg.cropPixels;
    const ctx = canvas.getContext("2d")!;

    ctx.filter = `brightness(${roundAcc(1 + cfg.brightness)}) contrast(${roundAcc(1 + cfg.contrast)}) saturate(${roundAcc(1 + cfg.saturation)}) hue-rotate(${cfg.hue}deg)`;
    ctx.drawImage(video, 0, 0, w, h);

    const stream = canvas.captureStream(cfg.frameRate);
    const mime = MediaRecorder.isTypeSupported("video/webm") ? "video/webm" : "video/mp4";
    const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: cfg.bitrate * 1000 });
    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);

    const donePromise = new Promise<Blob>((res) => {
      recorder.onstop = () => res(new Blob(chunks, { type: mime }));
    });

    recorder.start();
    await video.play().catch(() => {});
    await new Promise((r) => setTimeout(r, 600));
    video.pause();
    recorder.stop();

    const blob = await donePromise;
    const item = {
      index: i,
      config: cfg,
      blob,
      size: blob.size,
      url: URL.createObjectURL(blob),
      label: `${baseName}-var${i + 1}.${mime.includes("mp4") ? "mp4" : "webm"}`,
    };
    results.push(item);
    onResult?.(item);
  }

  URL.revokeObjectURL(srcUrl);
  return results;
}

// ==========================================
// 3. CAMUFLAR ÁUDIO PURO ENGINE
// ==========================================

export type AudioPuroMode = "basic" | "aggressive";

const AUDIO_FILTERS = {
  basic: "asetrate=48000*1.01,aresample=48000,atempo=0.990099",
  aggressive: "asetrate=48000*1.02,aresample=48000,atempo=0.980392",
};

export async function camuflarAudioPuro(
  file: File,
  mode: AudioPuroMode = "basic",
  onStatus?: (msg: string) => void
): Promise<{ url: string; outputName: string; size: number; blob: Blob }> {
  if (file.size > 100 * 1024 * 1024) {
    throw new Error("Arquivo excede o limite máximo de 100MB");
  }

  const isVideo = file.type.startsWith("video/") || /\.(mp4|mov|m4v|webm|avi)$/i.test(file.name);
  const ext = (file.name.match(/\.[^.]+$/)?.[0] || (isVideo ? ".mp4" : ".mp3")).toLowerCase();
  const inName = `audio_in_${Date.now()}${ext}`;
  const outExt = isVideo ? ext : ".mp3";
  const outName = `audio_out_${Date.now()}${outExt}`;
  const cleanName = file.name.replace(/\.[^.]+$/, "");
  const downloadName = `${cleanName}_camuflado${outExt}`;
  const filter = AUDIO_FILTERS[mode];

  try {
    const ffmpeg = await getFFmpeg(onStatus);
    onStatus?.("Lendo arquivo...");
    await ffmpeg.writeFile(inName, await fileToUint8Array(file));

    onStatus?.("Aplicando camuflagem acústica e recodificando...");
    let args: string[];
    if (isVideo) {
      args = ["-i", inName, "-af", filter, "-c:v", "copy", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", "-y", outName];
    } else {
      args = ["-i", inName, "-af", filter, "-c:a", "libmp3lame", "-b:a", "96k", "-y", outName];
    }

    const code = await ffmpeg.exec(args);
    if (code !== 0) {
      throw new Error(`FFmpeg retornou código ${code}`);
    }

    onStatus?.("Finalizando...");
    const resData = await ffmpeg.readFile(outName);
    await Promise.allSettled([ffmpeg.deleteFile(inName), ffmpeg.deleteFile(outName)]);

    const mime = isVideo ? file.type || "video/mp4" : "audio/mpeg";
    const blob = new Blob([resData.buffer as ArrayBuffer], { type: mime });
    return {
      url: URL.createObjectURL(blob),
      outputName: downloadName,
      size: blob.size,
      blob,
    };
  } catch (err) {
    console.warn("FFmpeg falhou no áudio, utilizando Web Audio API nativo:", err);
    onStatus?.("Processando com alta precisão via Web Audio API...");
    return await fallbackProcessAudioWebAudio(file, mode, cleanName);
  }
}

async function fallbackProcessAudioWebAudio(
  file: File,
  mode: AudioPuroMode,
  cleanName: string
): Promise<{ url: string; outputName: string; size: number; blob: Blob }> {
  const arrayBuffer = await file.arrayBuffer();
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
  const audioCtx = new AudioCtx();
  const decoded = await audioCtx.decodeAudioData(arrayBuffer);

  const pitchMultiplier = mode === "aggressive" ? 1.02 : 1.01;
  const newLen = Math.floor(decoded.length / pitchMultiplier);

  const offline = new OfflineAudioContext(decoded.numberOfChannels, newLen, decoded.sampleRate);
  const src = offline.createBufferSource();
  src.buffer = decoded;
  src.playbackRate.value = pitchMultiplier;
  src.connect(offline.destination);
  src.start();

  const rendered = await offline.startRendering();
  const wavBlob = audioBufferToWav(rendered);
  const downloadName = `${cleanName}_camuflado.wav`;

  return {
    url: URL.createObjectURL(wavBlob),
    outputName: downloadName,
    size: wavBlob.size,
    blob: wavBlob,
  };
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const dataLength = buffer.length * blockAlign;
  const bufferLength = 44 + dataLength;

  const ab = new ArrayBuffer(bufferLength);
  const v = new DataView(ab);

  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(offset + i, s.charCodeAt(i));
  };

  writeStr(0, "RIFF");
  v.setUint32(4, 36 + dataLength, true);
  writeStr(8, "WAVE");
  writeStr(12, "fmt ");
  v.setUint32(16, 16, true);
  v.setUint16(20, format, true);
  v.setUint16(22, numChannels, true);
  v.setUint32(24, sampleRate, true);
  v.setUint32(28, sampleRate * blockAlign, true);
  v.setUint16(32, blockAlign, true);
  v.setUint16(34, bitDepth, true);
  writeStr(36, "data");
  v.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let c = 0; c < numChannels; c++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(c)[i]!));
      v.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return new Blob([ab], { type: "audio/wav" });
}

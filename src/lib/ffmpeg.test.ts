import { describe, it, expect } from "vitest";
import {
  generateVariationConfigs,
  formatVariationDesc,
  getTikTokFFmpegArgs,
} from "./ffmpeg";

describe("FFmpeg Cloakfy Engine logic", () => {
  it("generates correct TikTok FFmpeg arguments for all modes", () => {
    const basicArgs = getTikTokFFmpegArgs("basic", "in.mp4", "out.mp4");
    expect(basicArgs).toContain("-map_metadata");
    expect(basicArgs).toContain("-1");
    expect(basicArgs).toContain("copy");

    const normalArgs = getTikTokFFmpegArgs("normal", "in.mp4", "out.mp4");
    expect(normalArgs).toContain("29.97");
    expect(normalArgs).toContain("libx264");
    expect(normalArgs).toContain("2800k");

    const aggressiveArgs = getTikTokFFmpegArgs("aggressive", "in.mp4", "out.mp4");
    expect(aggressiveArgs.some((a) => a.includes("crop=iw-2:ih-2"))).toBe(true);
    expect(aggressiveArgs).toContain("44100");
  });

  it("generates exact number of unique variation configurations", () => {
    const configs = generateVariationConfigs(5, "subtle", 2500);
    expect(configs).toHaveLength(5);
    configs.forEach((c) => {
      expect(c.cropPixels).toBeGreaterThanOrEqual(1);
      expect(c.cropPixels).toBeLessThanOrEqual(4);
      expect(["top", "bottom", "left", "right"]).toContain(c.cropSide);
      expect(c.bitrate).toBeGreaterThan(1000);
      expect(c.frameRate).toBeCloseTo(30, 0);
    });
  });

  it("formats variation descriptions clearly for user display", () => {
    const sampleCfg = {
      brightness: 0.02,
      contrast: 0.03,
      saturation: 0.04,
      cropPixels: 3,
      cropSide: "left" as const,
      frameRate: 29.98,
      bitrate: 2600,
      speed: 1.01,
      audioShift: 15,
      hue: 1.5,
    };
    const desc = formatVariationDesc(sampleCfg);
    expect(desc).toContain("brilho +0.02");
    expect(desc).toContain("crop 3px esq");
    expect(desc).toContain("29.98fps");
    expect(desc).toContain("1.01x");
  });
});

import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin(async () => {
  const Tone = await import("tone");

  return {
    provide: {
      tone: Tone,
    },
  };
});

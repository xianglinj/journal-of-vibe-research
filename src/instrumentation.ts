export async function register() {
  // Only run scheduler on the server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const intervalMs = parseInt(process.env.GENERATION_INTERVAL_MS || '600000', 10);
    console.log(`[Scheduler] Starting paper generation every ${intervalMs / 1000}s`);

    // Wait 30 seconds after startup before first generation
    setTimeout(async () => {
      runGeneration();
      // Then schedule recurring generation
      setInterval(runGeneration, intervalMs);
    }, 30000);
  }
}

async function runGeneration() {
  try {
    console.log(`[Scheduler] Triggering paper generation at ${new Date().toISOString()}`);
    const { runFullPipeline } = await import('./lib/pipeline');
    const paper = await runFullPipeline();
    console.log(`[Scheduler] Generated paper: ${paper.id} - ${paper.title} (${paper.status})`);
  } catch (error) {
    console.error('[Scheduler] Generation failed:', error);
  }
}

export async function register() {
  // Only run scheduler on the server side
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const intervalMs = parseInt(process.env.GENERATION_INTERVAL_MS || '600000', 10);
    console.log(`[Scheduler] Starting paper generation every ${intervalMs / 1000}s`);

    // Wait 30 seconds after startup before first generation
    setTimeout(async () => {
      triggerGeneration();
      // Then schedule recurring generation
      setInterval(triggerGeneration, intervalMs);
    }, 30000);
  }
}

async function triggerGeneration() {
  try {
    console.log(`[Scheduler] Triggering paper generation at ${new Date().toISOString()}`);
    const port = process.env.PORT || '3000';
    const apiSecret = process.env.API_SECRET;
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (apiSecret) {
      headers['Authorization'] = `Bearer ${apiSecret}`;
    }

    // Fire-and-forget: don't await the response since pipeline can take 10+ minutes
    // The /api/generate endpoint logs its own success/failure
    fetch(`http://localhost:${port}/api/generate`, {
      method: 'POST',
      headers,
    }).then(async (res) => {
      const data = await res.json();
      if (data.success) {
        console.log(`[Scheduler] Generated paper: ${data.paper.id} - ${data.paper.title} (${data.paper.status})`);
      } else {
        console.error('[Scheduler] Generation failed:', data.error);
      }
    }).catch((error) => {
      // This is expected if the request takes very long - pipeline handles its own errors
      console.log('[Scheduler] Fire-and-forget fetch completed with error (pipeline may still be running):', error.message);
    });
  } catch (error) {
    console.error('[Scheduler] Generation trigger error:', error);
  }
}

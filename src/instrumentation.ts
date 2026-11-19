export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { default: initDNS } = await import("./lib/dns");
    initDNS();

    try {
      const { default: connectDB } = await import("./lib/mongodb");
      await connectDB();
      console.log("[instrumentation] MongoDB pre-connected");
    } catch (err) {
      console.warn("[instrumentation] MongoDB pre-connect failed (will retry on first request)");
    }
  }
}

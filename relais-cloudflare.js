// Relais Ascension -> Mistral (Cloudflare Worker)
// Il ne stocke rien : il transmet la requête de l'app à Mistral avec ta clé, et renvoie la réponse.
const ORIGINE = "https://chaussy91.github.io"; // seule page autorisée à l'utiliser

export default {
  async fetch(req) {
    const cors = {
      "Access-Control-Allow-Origin": ORIGINE,
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Max-Age": "86400"
    };
    if (req.method === "OPTIONS") return new Response(null, { headers: cors });
    if (req.method !== "POST") return new Response("Relais Ascension en ligne.", { headers: cors });
    if (req.headers.get("Origin") !== ORIGINE) return new Response("Origine refusée.", { status: 403, headers: cors });
    const r = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": req.headers.get("Authorization") || "", "Content-Type": "application/json" },
      body: await req.text()
    });
    return new Response(r.body, { status: r.status, headers: { ...cors, "Content-Type": r.headers.get("Content-Type") || "application/json" } });
  }
};

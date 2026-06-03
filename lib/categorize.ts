export const CATEGORIES = [
  "Art & Design", "ASMR", "Comedy", "Cooking", "Fashion", "Film & TV", "Fitness",
  "Gaming", "Music", "News", "Travel", "Tech", "Education", "Other",
]

export async function categorizeVideos(
  videos: { youtubeId: string; title: string; channel: string }[]
): Promise<{ map: Record<string, string>; error?: string }> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return { map: {}, error: "GROQ_API_KEY not set" }
  if (videos.length === 0) return { map: {} }

  const list = videos
    .map((v, i) => `${i + 1}. [${v.youtubeId}] "${v.title}" by ${v.channel}`)
    .join("\n")

  const prompt = `Categorize each YouTube video into exactly one category from this list: ${CATEGORIES.join(", ")}.

Rules:
- Pick the most specific category that fits. Only use "Other" if truly none of the others apply.
- ASMR videos go in "ASMR" even if they involve food or talking.
- Vlogs, lifestyle, and personal channels — pick the closest topic category (Travel, Fitness, Fashion, etc.).
- Tutorials and how-to videos go in "Education" unless the topic has its own category (e.g. cooking tutorial → "Cooking").
- "Other" is a last resort for videos that genuinely don't fit any category.

Videos:
${list}

Respond with ONLY a JSON array like: [{"youtubeId":"abc","category":"Music"}, ...]
No explanation, no markdown, just the JSON array.`

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
    }),
  })

  const data = await res.json()

  if (!res.ok) {
    return { map: {}, error: `Groq API error ${res.status}: ${JSON.stringify(data?.error)}` }
  }

  const text: string = data.choices?.[0]?.message?.content ?? ""
  const jsonStr = text.replace(/```json|```/g, "").trim()

  try {
    const parsed: { youtubeId: string; category: string }[] = JSON.parse(jsonStr)
    return {
      map: Object.fromEntries(
        parsed
          .filter((r) => CATEGORIES.includes(r.category))
          .map((r) => [r.youtubeId, r.category])
      ),
    }
  } catch {
    return { map: {}, error: `Failed to parse Groq response: ${jsonStr.slice(0, 200)}` }
  }
}

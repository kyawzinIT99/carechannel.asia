export type PatientReplyCopy = {
  greeting: string;
  paragraphs: string[];
  nextSteps: string[];
};

type ComposeInput = {
  locale: "en" | "my";
  visitorName: string;
  message: string;
  facts: unknown;
};

const FORBIDDEN = /052-00|chiangmairam\.com|@chiangmairam|emergency 24|24.hour/i;

function parseCopy(raw: string): PatientReplyCopy | null {
  try {
    const parsed = JSON.parse(raw) as Partial<PatientReplyCopy>;
    const greeting = parsed.greeting?.trim() ?? "";
    const paragraphs = (parsed.paragraphs ?? []).map((p) => p.trim()).filter(Boolean).slice(0, 2)
      .map((p) => (p.length > 220 ? `${p.slice(0, 217)}…` : p));
    const nextSteps = (parsed.nextSteps ?? []).map((p) => p.trim()).filter(Boolean).slice(0, 2);
    if (!greeting || paragraphs.length === 0) return null;
    const blob = [greeting, ...paragraphs, ...nextSteps].join(" ");
    if (FORBIDDEN.test(blob)) return null;
    return { greeting, paragraphs, nextSteps };
  } catch {
    return null;
  }
}

export async function composePatientReply(input: ComposeInput): Promise<PatientReplyCopy | null> {
  const key = process.env.OPENAI_API_KEY?.trim();
  if (!key) return null;
  const model = process.env.OPENAI_MODEL?.trim() || "gpt-4o-mini";
  const language = input.locale === "my" ? "Myanmar Unicode (Noto Sans Myanmar)" : "English";
  const system = `You write the full guest reply for Chiangmai Ram Hospital Myanmar — official partner incentive-visit channel.

Rules:
- Use ONLY the FACTS JSON. Never invent prices, tests, hours, diagnoses, departments, or phone numbers.
- Never mention or show any email address, phone number, or website URL, except messenger links and the apartment URL in FACTS.
- Never mention emergency 24-hour lines.
- Do NOT diagnose. If the visitor describes symptoms, say a coordinator will continue the conversation; do not recommend treatment.
- Language: ${language}.
- This is a SHORT reply. Do not write a long letter.
- Tone: warm, clear, brief.

Return ONLY valid JSON:
{"greeting":"Dear Name,","paragraphs":["..."],"nextSteps":["..."]}
- greeting: 1 short line addressing ${JSON.stringify(input.visitorName)}
- paragraphs: 1 short paragraph (max 2 sentences). Include the incentive visitor code from FACTS if present. Do not paste long package lists or centre essays.
- nextSteps: 1 or 2 very short follow-up items`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.35,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: JSON.stringify({
              visitorName: input.visitorName,
              visitorMessage: input.message,
              facts: input.facts,
            }),
          },
        ],
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) return null;
    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = data.choices?.[0]?.message?.content;
    if (!raw) return null;
    return parseCopy(raw);
  } catch {
    return null;
  }
}

import type { GeneratedInstrumentData } from "@/types/instrumentData";

const instrumentGeneratedDataPathsBySlug = {
  "big-five": "big-five.json",
  "bis-bas": "bis-bas.json",
  "barchard-ei": "barchard-ei.json",
  "via-is": "via-is.json",
  "trait-ei": "trait-ei.json",
} as const;

const instrumentGeneratedDataCache = new Map<
  string,
  Promise<GeneratedInstrumentData>
>();

export async function loadInstrumentGeneratedData(
  slug: string,
): Promise<GeneratedInstrumentData> {
  const filename =
    instrumentGeneratedDataPathsBySlug[
      slug as keyof typeof instrumentGeneratedDataPathsBySlug
    ];

  if (!filename) {
    throw new Error(`No generated instrument data path found for slug: ${slug}`);
  }

  const cached = instrumentGeneratedDataCache.get(slug);

  if (cached) {
    return cached;
  }

  const path = `${import.meta.env.BASE_URL}instruments/${filename}`;
  const request = fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to load generated instrument data for "${slug}" from ${path}.`,
        );
      }

      return response.json() as Promise<GeneratedInstrumentData>;
    })
    .catch((error) => {
      instrumentGeneratedDataCache.delete(slug);
      throw error;
    });

  instrumentGeneratedDataCache.set(slug, request);
  return request;
}

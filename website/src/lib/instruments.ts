import { instrumentGeneratedDataBySlug } from "@/lib/data/instrumentGeneratedData";
import { instrumentMetadataBySlug } from "@/lib/data/instrumentMetadata";
import type { GeneratedInstrumentData, Instrument } from "@/types";

export function getInstrument(slug: string): Instrument | undefined {
  return instrumentMetadataBySlug[slug];
}

export function getInstrumentData(
  slug: string,
): GeneratedInstrumentData | undefined {
  return instrumentGeneratedDataBySlug[slug];
}

export function hasInstrument(slug: string): boolean {
  return Boolean(getInstrument(slug) && getInstrumentData(slug));
}

export function getScaleNames(data: GeneratedInstrumentData): string[] {
  return [...new Set(data.items.map((item) => item.scale))];
}

export function getScaleIds(data: GeneratedInstrumentData): string[] {
  return [...new Set(data.items.map((item) => item.scaleId))];
}

export function getSubscaleNames(data: GeneratedInstrumentData): string[] {
  return [
    ...new Set(
      data.items
        .map((item) => item.subscale)
        .filter((subscale): subscale is string => Boolean(subscale)),
    ),
  ];
}

export function getSubscaleIds(data: GeneratedInstrumentData): string[] {
  return [
    ...new Set(
      data.items
        .map((item) => item.subscaleId)
        .filter((subscaleId): subscaleId is string => Boolean(subscaleId)),
    ),
  ];
}

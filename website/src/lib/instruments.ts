import { instrumentMetadataBySlug } from "@/lib/data/instrumentMetadata";
import type { GeneratedInstrumentData, Instrument } from "@/types";

export function getInstrument(slug: string): Instrument | undefined {
  return instrumentMetadataBySlug[slug];
}

export function hasInstrument(slug: string): boolean {
  return Boolean(getInstrument(slug));
}

export function getScaleNames(data: GeneratedInstrumentData): string[] {
  return [
    ...new Set(
      data.items
        .map((item) => item.scale)
        .filter((scale): scale is string => Boolean(scale)),
    ),
  ];
}

export function getScaleIds(data: GeneratedInstrumentData): string[] {
  return [
    ...new Set(
      data.items
        .map((item) => item.scaleId)
        .filter((scaleId): scaleId is string => Boolean(scaleId)),
    ),
  ];
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

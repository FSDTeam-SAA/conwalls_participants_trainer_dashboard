type Language = "en" | "de";

type Labels = Partial<Record<Language, string>>;

type NamedItem = {
  name: string;
  labels?: Labels;
};

type CategoryItem = NamedItem & {
  measureTypes?: NamedItem[];
};

type MeasureLike = {
  category?: string;
  type?: string;
  categoryLabels?: Labels;
  typeLabels?: Labels;
};

type SystemSettingsLike = {
  categoryTypes?: CategoryItem[];
};

const getLabelFromMap = (
  labels: Labels | undefined,
  language: Language,
  fallback: string,
) => {
  if (language === "de") {
    return labels?.de || labels?.en || fallback;
  }

  return labels?.en || fallback;
};

export const getLocalizedNamedLabel = (
  item: NamedItem | undefined,
  language: Language,
) => {
  if (!item) return "";
  return getLabelFromMap(item.labels, language, item.name || "");
};

export const getLocalizedMeasureCategory = (
  measure: MeasureLike,
  language: Language,
  systemSettings?: SystemSettingsLike,
) => {
  const fallback = measure.category || "";

  if (measure.categoryLabels?.de || measure.categoryLabels?.en) {
    return getLabelFromMap(measure.categoryLabels, language, fallback);
  }

  const category = systemSettings?.categoryTypes?.find(
    (item) => item.name === measure.category,
  );

  return getLocalizedNamedLabel(category, language) || fallback;
};

export const getLocalizedMeasureType = (
  measure: MeasureLike,
  language: Language,
  systemSettings?: SystemSettingsLike,
) => {
  const fallback = measure.type || "";

  if (measure.typeLabels?.de || measure.typeLabels?.en) {
    return getLabelFromMap(measure.typeLabels, language, fallback);
  }

  const allMeasureTypes =
    systemSettings?.categoryTypes?.flatMap((category) => category.measureTypes || []) || [];

  const type = allMeasureTypes.find((item) => item.name === measure.type);

  return getLocalizedNamedLabel(type, language) || fallback;
};


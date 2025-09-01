export const languages = ["en", "nl", "af"];
export const fallbackLng = "en";
export function getOptions(lng = fallbackLng) {
  return { supportedLngs: languages, fallbackLng, lng };
}

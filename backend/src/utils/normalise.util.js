export const normalizeOutput = (text) => {
  if (!text) return "";

  return text
    .toString()
    .trim()
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/\r/g, "")          // windows newline safety
        .replace(/\[\s+/g, "[")      // "[ 1" -> "[1"
        .replace(/\s+\]/g, "]")      // "1 ]" -> "1]"
        .replace(/\s*,\s*/g, ",")    // "1 , 2" -> "1,2"
    )
    .filter(Boolean)
    .join("\n");
};

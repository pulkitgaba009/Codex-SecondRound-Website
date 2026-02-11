export const generateWrapper = (language, userCode, input) => {
  if (language !== "javascript") return userCode;

  return `
${userCode}

// -------- resolve solution --------
const solution =
  typeof module !== "undefined" && typeof module.exports === "function"
    ? module.exports
    : null;

if (!solution) {
  console.log("");
  process.exit(0);
}

// -------- parse input --------
const raw = \`${input}\`
  .trim()
  .split(/\\s+/)
  .map(v => (isNaN(v) ? v : Number(v)));

let result;

// -------- CASE 1: n nums... target (Two Sum, array problems)
if (typeof raw[0] === "number" && raw.length >= 3) {
  const n = raw[0];
  const nums = raw.slice(1, n + 1);
  const target = raw[n + 1];
  result = solution(nums, target);
}

// -------- CASE 2: single value (Reverse String)
else if (raw.length === 1) {
  result = solution(raw[0]);
}

// -------- fallback
else {
  result = solution(raw);
}

// -------- output --------
if (Array.isArray(result)) {
  console.log(result.join(" "));
} else {
  console.log(result);
}
`;
};

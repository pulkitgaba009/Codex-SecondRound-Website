const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const LANGUAGE_CONFIG = {
  javascript: {
    language: "javascript",
    version: "18.15.0",
    file: "main.js",
  },
  python: {
    language: "python",
    version: "3.10.0",
    file: "main.py",
  },
  c: {
    language: "c",
    version: "10.2.0",
    file: "main.c",
  },
  cpp: {
    language: "cpp",
    version: "10.2.0",
    file: "main.cpp",
  },
  java: {
    language: "java",
    version: "15.0.2",
    file: "Main.java", // ⚠️ CASE-SENSITIVE
  },
};

export const executeWithPiston = async (language, code) => {
  const config = LANGUAGE_CONFIG[language];

  if (!config) {
    throw new Error(`Unsupported language: ${language}`);
  }

  const response = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: config.language,
      version: config.version,
      files: [
        {
          name: config.file,
          content: code,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Piston error: ${response.status}`);
  }

  const data = await response.json();

  return {
    stdout: data.run?.stdout || "",
    stderr: data.run?.stderr || "",
    output: data.run?.output || "",
  };
};

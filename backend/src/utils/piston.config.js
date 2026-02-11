const PISTON_API = "https://emkc.org/api/v2/piston";

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0", ext: "js" },
  python: { language: "python", version: "3.10.0", ext: "py" },
  java: { language: "java", version: "15.0.2", ext: "java" },
  c: { language: "c", version: "10.2.0", ext: "c" },
  cpp: { language: "cpp", version: "10.2.0", ext: "cpp" },
};

export const executeCode = async (language, code) => {
  try {
    const config = LANGUAGE_VERSIONS[language];

    if (!config) {
      return {
        success: false,
        error: `Unsupported language: ${language}`,
      };
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: config.language,
        version: config.version,
        files: [
          {
            name: `main.${config.ext}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Piston HTTP Error: ${response.status}`,
      };
    }

    const data = await response.json();

    const stdout = data?.run?.stdout ?? "";
    const stderr = data?.run?.stderr ?? "";

    if (stderr) {
      return {
        success: false,
        error: stderr,
        output: stdout,
      };
    }

    return {
      success: true,
      output: stdout || "",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Execution failed",
    };
  }
};

import Result from "../models/results.model.js";
import Question from "../models/question.model.js";
import { executeWithPiston } from "../services/piston.config.js";

/* -------------------- CODE NORMALIZER -------------------- */
/* -------------------- CODE NORMALIZER -------------------- */
const normalizeCode = (code) => {
  if (!code) return "";

  return code
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.trimEnd())
    .filter((line, i, arr) => {
      if (i === 0 || i === arr.length - 1) {
        return line.trim() !== "";
      }
      return true;
    })
    .join("\n")
    .trim();
};

/* -------------------- OUTPUT NORMALIZER -------------------- */
const normalizeOutput = (text) => {
  if (!text) return [];

  return text
    .trim()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .replace(/[\[\]]/g, "")     // remove [ ]
        .replace(/\s*,\s*/g, " ")   // commas → space
        .replace(/\s+/g, " ")       // normalize spaces
        .trim()
    )
    .filter(Boolean);
};

/* -------------------- OUTPUT COMPARISON -------------------- */
const compareOutputs = (executionOutput, hiddenTests) => {
  const actualLines = normalizeOutput(executionOutput);

  return hiddenTests.map((test, index) => {
    const expected = normalizeOutput(test.output)[0] || "";
    const actual = actualLines[index] || "";

    return {
      testCase: index + 1,
      expected,
      actual,
      passed: expected === actual,
    };
  });
};

/* -------------------- CONTROLLER -------------------- */
export const evaluateSubmissions = async (req, res) => {
  try {
    const { resultId } = req.params;

    /* 1️⃣ Fetch Result */
    const result = await Result.findById(resultId).lean();
    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    /* 2️⃣ Populate Question Data */
    const populatedResults = await Promise.all(
      result.results.map(async (submission) => {
        const question = await Question.findById(
          submission.questionId,
          { hiddenTests: 1, functionCallCode: 1 }
        ).lean();

        return {
          ...submission,
          hiddenTests: question?.hiddenTests || [],
          functionCallCode: question?.functionCallCode || {},
        };
      })
    );

    /* 3️⃣ Pick submission (based on stored language) */
    const submission = populatedResults.find(
      (s) => s.language && s.code
    );

    if (!submission) {
      return res.status(400).json({
        message: "No valid submission found",
      });
    }

    const language = submission.language;

    if (!submission.functionCallCode[language]) {
      return res.status(400).json({
        message: `No functionCallCode found for language: ${language}`,
      });
    }

    /* 🚫 Prevent double scoring */
    if (submission.verdict === "Accepted") {
      return res.json({
        message: "Already accepted. Score not updated again.",
      });
    }

    /* 4️⃣ Build FINAL executable code (THIS IS THE FIXED PART) */
    const normalizedFinalCode = normalizeCode(`
${submission.code}
${submission.functionCallCode[language]}
`);

    /* 5️⃣ Execute on Piston */
    const executionResult = await executeWithPiston(
      language,
      normalizedFinalCode
    );

    /* 6️⃣ Compare Outputs */
    const comparisonResults = compareOutputs(
      executionResult.output,
      submission.hiddenTests
    );

    /* 7️⃣ Calculate Score */
    const passedCount = comparisonResults.filter(t => t.passed).length;
    const submissionScore = passedCount * 100;

    /* 8️⃣ Decide Verdict */
    const verdict =
      passedCount === submission.hiddenTests.length
        ? "Accepted"
        : "Wrong Answer";

    /* 9️⃣ Update MongoDB */
    await Result.updateOne(
      {
        _id: resultId,
        "results.questionId": submission.questionId,
        "results.language": language,
      },
      {
        $set: {
          "results.$.verdict": verdict,
          "results.$.testResults": comparisonResults,
        },
        $inc: {
          score: submissionScore,
        },
      }
    );

    /* ✅ Response */
    res.json({
      language,
      verdict,
      passedTests: passedCount,
      scoreAdded: submissionScore,
      comparisonResults,
    });

  } catch (error) {
    console.error("========== JUDGE ERROR ==========");
    console.error(error);
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    console.error("================================");

    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
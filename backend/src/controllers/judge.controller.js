import Result from "../models/results.model.js";
import Question from "../models/question.model.js";
import { executeWithPiston } from "../services/piston.config.js";

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
    .map((line) => {
      const val = line.trim().toLowerCase();

      if (val === "true" || val === "1") return "true";
      if (val === "false" || val === "0") return "false";

      return val
        .replace(/[\[\]]/g, "")
        .replace(/\s*,\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    })
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

    /* 1️⃣ Fetch result document */
    const resultDoc = await Result.findById(resultId);
    if (!resultDoc) {
      return res.status(404).json({ message: "Result not found" });
    }

    /* 2️⃣ Populate question data */
    const populatedResults = await Promise.all(
      resultDoc.results.map(async (submission) => {
        const question = await Question.findById(submission.questionId, {
          hiddenTests: 1,
          functionCallCode: 1,
        }).lean();

        return {
          ...submission.toObject(),
          hiddenTests: question?.hiddenTests || [],
          functionCallCode: question?.functionCallCode || {},
        };
      }),
    );

    const responseResults = [];
    let totalScoreAdded = 0;
    let didUpdate = false;

    /* 🔁 3️⃣ Evaluate ALL submissions */
    for (const submission of populatedResults) {
      const language = submission.language;

      if (!submission.functionCallCode[language]) {
        responseResults.push({
          questionId: submission.questionId,
          language,
          verdict: "Judge Error",
          error: "Missing functionCallCode",
        });
        continue;
      }

      /* 4️⃣ Build executable code */
      const finalCode = normalizeCode(`
${submission.code}
${submission.functionCallCode[language]}
`);

      /* 5️⃣ Execute with Piston (SAFE) */
      let executionResult;
      try {
        executionResult = await executeWithPiston(language, finalCode);
      } catch (err) {
        responseResults.push({
          questionId: submission.questionId,
          language,
          verdict: "Runtime Error",
          error: err.message || "Piston execution crashed",
        });
        continue;
      }

      if (!executionResult || executionResult.error) {
        responseResults.push({
          questionId: submission.questionId,
          language,
          verdict: "Runtime Error",
          error: executionResult?.error || "Execution failed",
        });
        continue;
      }

      if (!submission.hiddenTests.length) {
        responseResults.push({
          questionId: submission.questionId,
          language,
          verdict: "Judge Error",
          error: "Hidden tests missing",
        });
        continue;
      }

      /* 6️⃣ Compare outputs */
      const programOutput =
        executionResult.stdout?.trim() || executionResult.output?.trim() || "";

      const comparisonResults = compareOutputs(
        programOutput,
        submission.hiddenTests,
      );

      const passedCount = comparisonResults.filter((t) => t.passed).length;
      const scoreAdded = passedCount * 100;

      const verdict =
        passedCount === submission.hiddenTests.length
          ? "Accepted"
          : "Wrong Answer";

      let actuallyAddedScore = 0;

      /* 7️⃣ Update DB ONLY if Pending */
      if (!submission.verdict || submission.verdict === "Pending") {
        const idx = resultDoc.results.findIndex(
          (r) =>
            r.questionId.toString() === submission.questionId.toString() &&
            r.language === language,
        );

        if (idx !== -1) {
          resultDoc.results[idx].verdict = verdict;
          resultDoc.results[idx].testResults = comparisonResults;
          resultDoc.score += scoreAdded;

          totalScoreAdded += scoreAdded;
          actuallyAddedScore = scoreAdded;
          didUpdate = true;
        }
      }

      /* 8️⃣ Always push response */
      responseResults.push({
        questionId: submission.questionId,
        language,
        executionOutput: programOutput,
        verdict,
        passedTests: passedCount,
        scoreAdded: actuallyAddedScore,
        comparisonResults,
      });
    }

    /* 9️⃣ Save only if something changed */
    if (didUpdate) {
      await resultDoc.save();
    }

    /* ✅ FINAL RESPONSE */
    res.json({
      message: "Evaluation completed",
      totalScoreAdded,
      results: responseResults,
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

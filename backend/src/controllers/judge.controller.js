import Result from "../models/results.model.js";
import { executeCode } from "../utils/piston.config.js";
import { normalizeOutput } from "../utils/normalise.util.js";
import { generateWrapper } from "../utils/wrapper.util.js";

export const evaluateSubmissions = async (req, res) => {
  try {
    const { resultId } = req.params;

    const result = await Result.findById(resultId).populate(
      "results.questionId"
    );

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    let totalScore = 0;

    for (const submission of result.results) {
      const question = submission.questionId;
      let accepted = true;

      for (const test of question.hiddenTests) {
        const wrappedCode = generateWrapper(
          submission.language,
          submission.code,
          test.input
        );


        const exec = await executeCode(submission.language, wrappedCode);

        if (!exec.success) {
          submission.verdict = "Runtime Error";
          accepted = false;
          break;
        }

        const userOut = normalizeOutput(exec.output);
        const expectedOut = normalizeOutput(test.output);

        if (userOut !== expectedOut) {
          submission.verdict = "Wrong Answer";
          accepted = false;
          break;
        }
      }

      if (accepted) {
        submission.verdict = "Accepted";
        totalScore += 10;
      }
    }

    result.score = totalScore;
    await result.save();

    res.json({
      message: "Evaluation completed",
      score: totalScore,
      resultId: result._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Judge failed" });
  }
};

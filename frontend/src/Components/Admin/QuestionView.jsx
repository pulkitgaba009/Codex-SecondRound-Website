import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function QuestionView({ formData }) {
  return (
    <>
      <h1 className="authHeading">Question View</h1>
      <hr className="horizontalLine mt-2" />

      <div className="w-full mt-4 h-[85%] overflow-auto scrollbar-hidden px-8">
        <h2 className="question">Problem :</h2>
        <h2 className="font-[Orbitron] text-neutral-300 [text-shadow:_0_0_10px_white] text-xl text-left inline">
          {formData?.title || "—"}
        </h2>

        <br />
        <br />

        <p className="font-[Orbitron] text-md text-[#34e47b] [text-shadow:_0_0_10px_#3eeb91]">
          Question Description
        </p>
        <p className="questionPara">
          {formData?.description || "No description available"}
        </p>

        <br />
        <br />

        {formData?.imageURL && (
          <>
            <p className="font-[Orbitron] text-md text-[#34e47b] [text-shadow:_0_0_10px_#3eeb91]">
              Image Explanation
            </p>

            <img
              src={formData.imageURL}
              alt={formData?.title || "Question image"}
              className="mt-2 rounded-xl w-[50%]"
            />

            <br />
          </>
        )}

        <p className="font-[Orbitron] text-md text-[#34e47b] [text-shadow:_0_0_10px_#3eeb91]">
          Example
        </p>

        {Array.isArray(formData?.examples) &&
          formData.examples.map((item, index) => (
            <div key={index} className="mt-2 p-2 bg-black rounded-2xl">
              <div className="p-2 font-mono">
                <p className="text-[#34d8e4] [text-shadow:_0_0_12px_#34e47b]">
                  Input :{" "}
                  <span className="text-neutral-300 [text-shadow:_0_0_10px_white]">
                    {item?.input || "—"}
                  </span>
                </p>

                <p className="text-[#34d8e4] [text-shadow:_0_0_12px_#34e47b]">
                  Output :{" "}
                  <span className="text-neutral-300 [text-shadow:_0_0_10px_white]">
                    {item?.output || "—"}
                  </span>
                </p>

                {item?.explanation && (
                  <p className="text-neutral-400 [text-shadow:_0_0_15px_white]">
                    Explanation : <span>{item.explanation}</span>
                  </p>
                )}
              </div>
            </div>
          ))}

        <br />

        <p className="font-[Orbitron] text-md text-[#34e47b] [text-shadow:_0_0_10px_#3eeb91]">
          Hidden Test Cases
        </p>

        {Array.isArray(formData?.examples) &&
          formData.hiddenTests.map((item, index) => (
            <div key={index} className="mt-2 p-2 bg-black rounded-2xl">
              <div className="p-2 font-mono">
                <p className="text-[#34d8e4] [text-shadow:_0_0_12px_#34e47b]">
                  Input :{" "}
                  <span className="text-neutral-300 [text-shadow:_0_0_10px_white]">
                    {item?.input || "—"}
                  </span>
                </p>

                <p className="text-[#34d8e4] [text-shadow:_0_0_12px_#34e47b]">
                  Output :{" "}
                  <span className="text-neutral-300 [text-shadow:_0_0_10px_white]">
                    {item?.output || "—"}
                  </span>
                </p>
              </div>
            </div>
          ))}

        <br />

        <p className="font-[Orbitron] text-md text-[#34e47b] [text-shadow:_0_0_10px_#3eeb91] mb-2">
          Constraints :
        </p>

        {Array.isArray(formData?.constraints) &&
          formData.constraints.map((c, index) => (
            <p
              key={index}
              className="font-mono text-lg text-neutral-300 [text-shadow:_0_0_10px_white]"
            >
              • {c}
            </p>
          ))}

        <br />
        <br />

        <p className="question">Language Starter Codes :</p>

        {formData?.starterCode &&
          Object.entries(formData.starterCode).map(
            ([language, code], index) => (
              <div key={index} className="mt-4 bg-black rounded-2xl">
                <h2 className="text-xl font-semibold ml-4 pt-2 code">
                  Code: {language}
                </h2>

                <div className="p-2">
                  <SyntaxHighlighter
                    language={language.toLowerCase()}
                    style={atomDark}
                    customStyle={{
                      borderRadius: "8px",
                      padding: "1rem",
                      fontSize: "0.9rem",
                      backgroundColor: "oklch(12.9% 0.042 264.695)",
                    }}
                  >
                    {code
                      ? code
                      : language === "python"
                        ? "# No code yet"
                        : "// No code yet"}
                  </SyntaxHighlighter>
                </div>
              </div>
            ),
          )}
      </div>
    </>
  );
}

export default QuestionView;

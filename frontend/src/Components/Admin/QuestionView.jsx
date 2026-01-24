import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function QuestionView({ formData }) {
  return (
    <>
      <h1 className="authHeading">Question View</h1>
      <hr className="horizontalLine mt-2" />
      <div className="w-full mt-4 h-[85%] overflow-auto scrollbar-hidden px-8">
        <h2 className="question">Question : </h2>
        <p className="questionPara">
          {formData.question || "Your question will appear here"}
        </p>

        {formData.code && (
          <div className="mt-4 bg-black rounded-2xl">
            <h2 className="text-xl font-semibold ml-4 pt-2 code">
              Code: {formData.language}
            </h2>
            <div className="p-2">
              <SyntaxHighlighter
                language={formData.language?.toLowerCase()}
                style={atomDark}
                customStyle={{
                  borderRadius: "8px",
                  padding: "1rem",
                  fontSize: "0.9rem",
                  backgroundColor: "oklch(12.9% 0.042 264.695)",
                }}
              >
                {formData.code}
              </SyntaxHighlighter>
            </div>
          </div>
        )}

        <div className="pt-4">
          <div className="option">a) {formData.optionA}</div>
          <div className="option">b) {formData.optionB}</div>
          <div className="option">c) {formData.optionC}</div>
          <div className="option">d) {formData.optionD}</div>
        </div>
      </div>
    </>
  );
}

export default QuestionView;

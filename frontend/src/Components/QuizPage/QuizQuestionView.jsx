import { useState, useEffect } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function QuestionView({ question, onAnswer, selectedAnswer }) {
  const [selected, setSelected] = useState(selectedAnswer || "");

  useEffect(() => {
    setSelected(selectedAnswer || "");
  }, [question, selectedAnswer]);

  const handleSelect = (value) => {
    setSelected(value);
    const isCorrect = value === question.answer;
    onAnswer(question._id, value);
  };

  if (!question) return null;

  return (
    <div className="w-full mt-4 h-[80%] md:h-[85%] overflow-auto scrollbar-hidden px-8">
      <h2 className="question">Question :</h2>

      <p className="questionPara">{question.question}</p>

      {question.code && (
        <div className="mt-4 bg-black rounded-2xl">
          <h2 className="text-xl font-semibold ml-4 pt-2 code">
            Code: {question.language}
          </h2>

          <div className="p-2">
            <SyntaxHighlighter
              language={question.language.toLowerCase()}
              style={atomDark}
              customStyle={{
                borderRadius: "8px",
                padding: "1rem",
                fontSize: "0.9rem",
                backgroundColor: "oklch(12.9% 0.042 264.695)",
              }}
              className="scrollbar-hidden"
            >
              {question.code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      {/* Options */}
      <div className="pt-4 space-y-3">

        {["optionA", "optionB", "optionC", "optionD"].map((optKey, i) => {
          const optLabel = ["a", "b", "c", "d"][i];
          const optValue = question[optKey];
          const isSelected = selected === optValue;

          return (
            <label
              key={optKey}
              className={`flex items-center gap-3 option cursor-pointer p-3 rounded-xl transition-all duration-200 
              ${isSelected ? "shadow-[0_0_15px_#16fa8f] bg-green-900/30" : "bg-black/20"}`}
            >
              <input
                type="radio"
                name={`q-${question._id}`}
                value={optValue}
                checked={isSelected}
                onChange={(e) => handleSelect(e.target.value)}
              />
              <span>{optLabel}) {optValue}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionView;

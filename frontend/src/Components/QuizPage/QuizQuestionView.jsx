function QuestionView({ question }) {
  if (!question) return null;

  const formData = question;

  return (
    <div className="w-full h-full overflow-y-auto scrollbar-hidden px-8 py-4">

      {/* Description */}
      <p className="font-[Orbitron] text-md text-[#34e47b] [text-shadow:_0_0_10px_#3eeb91]">
        Question Description
      </p>
      <p className="questionPara">
        {formData?.description || "No description available"}
      </p>

      <div className="h-6" />

      {/* Image */}
      {formData?.imageURL && (
        <>
          <p className="font-[Orbitron] text-md text-[#34e47b] [text-shadow:_0_0_10px_#3eeb91]">
            Image Explanation
          </p>

          <img
            src={formData.imageURL}
            alt={formData?.title || "Question image"}
            className="mt-3 rounded-xl w-1/2"
          />

          <div className="h-6" />
        </>
      )}

      {/* Examples */}
      <p className="font-[Orbitron] text-md text-[#34e47b] [text-shadow:_0_0_10px_#3eeb91]">
        Example
      </p>

      {Array.isArray(formData?.examples) &&
        formData.examples.map((item, index) => (
          <div key={index} className="mt-3 p-3 bg-black rounded-2xl">
            <div className="font-mono">
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
                <p className="text-neutral-400 mt-1">
                  Explanation : <span>{item.explanation}</span>
                </p>
              )}
            </div>
          </div>
        ))}

      <div className="h-6" />

      {/* Constraints */}
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

      <div className="h-10" />
    </div>
  );
}

export default QuestionView;

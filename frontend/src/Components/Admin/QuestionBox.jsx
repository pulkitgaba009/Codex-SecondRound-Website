function QuestionBox({ questions, onSelect, activeId }) {
  return (
    <>
      <h1 className="authHeading pb-2">Questions</h1>
      <hr className="horizontalLine" />

      <div className="w-full flex h-[67%] overflow-auto scrollbar-hidden px-4 pb-4 mt-4 text-white gap-8 flex-wrap">
        {questions.map((q, index) => {
          const id = q._id || q.id;        // support API + local data
          const isActive = id === activeId;

          return (
            <button
              key={id}
              onClick={() => onSelect(q)}
              className={`w-[6rem] h-[6rem] text-2xl rounded-full font-[Montserrat] font-semibold transition-all duration-200 mx-1 bg-[rgba(0,0,0,0.5)] text-[#e6dede] [text-shadow:_0_0_10px_#e6dede] mt-2
                ${
                  isActive
                    ? "[box-shadow:_0_0_10px_#16fa8f]"
                    : "bg-[#ff3838f4] hover:[box-shadow:_0_0_10px_#FFCC00] [box-shadow:_0_0_10px_#e6dede]"
                }`}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </>
  );
}

export default QuestionBox;

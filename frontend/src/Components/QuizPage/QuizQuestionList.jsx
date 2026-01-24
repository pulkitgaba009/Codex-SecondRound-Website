function QuizQuestionsList({ questions, activeId, onSelect, answers }) {
  return (
    <div className="flex items-center md:items-start w-full h-[55%] md:h-[89%] overflow-x-auto md:overflow-y-auto md:overflow-x-hidden scrollbar-hidden mt-2 md:mt-0 ">
      <div className="px-4 mt-[5px] w-full md:mt-4 text-white gap-4 flex justify-start md:justify-evenly lg:justify-evenly md:flex-wrap min-w-max md:min-w-0">
        {questions.map((q, index) => {
          const isActive = q._id === activeId;          
          const isAnswered = answers[q._id] !== undefined;

          return (
            <button
              key={q._id}
              onClick={() => onSelect(q)}
              className={`
                w-[3rem] h-[3rem] md:w-[5rem] md:h-[5rem]
                text-2xl rounded-full font-[Montserrat] font-semibold
                transition-all duration-200 mx-1 bg-black
                text-white

                ${
                  isActive
                    ? "border-2 border-[#fcf53a] [box-shadow:_0_0_12px_#FFCC00]"
                    : isAnswered
                    ? "border-2 border-[#34e47b] [box-shadow:_0_0_12px_#34e47b]"
                    : "border-2 border-[#34cae4] [box-shadow:_0_0_12px_#34cae4]"
                }
              `}
            >
              {index + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuizQuestionsList;

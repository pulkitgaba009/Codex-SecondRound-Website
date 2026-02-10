function QuizQuestionsList({ questions, activeId, onSelect }) {
  const handleChange = (e) => {
    const selectedIndex = Number(e.target.value);
    const selectedQuestion = questions[selectedIndex];
    if (selectedQuestion) {
      onSelect(selectedQuestion);
    }
  };

  const activeIndex = questions.findIndex((q) => q._id === activeId);

  return (
    <div>
      <select
        value={activeIndex}
        onChange={handleChange}
        className="
        font-[Orbitron] text-[#e434e4] [text-shadow:_0_0_10px_#a934e4]
          bg-black/80
          border-2
          px-2 py-1
          rounded-xl
          font-semibold
          outline-none
          focus:border-[#eb0d57]
          focus:shadow-[0_0_12px_#fc3a3a]
          transition-all
        "
      >
        {questions.map((q, index) => (
          <option key={q._id} value={index} className="bg-black text-white">
            Question {index + 1}
          </option>
        ))}
      </select>
    </div>
  );
}

export default QuizQuestionsList;

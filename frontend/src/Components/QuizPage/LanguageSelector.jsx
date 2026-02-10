function LanguageSelector({ languages,value, onChange }) {

  return (
    <div className="flex items-center gap-3">

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          font-[Orbitron] [text-shadow:_0_0_12px_#FFCC00]  text-[#fcf53a]
          bg-black/80
          border-2
          px-3 py-1
          rounded-xl
          font-semibold
          outline-none
          focus:border-[#eb0d57]
          focus:shadow-[0_0_12px_#fc3a3a]
          transition-all
        "
      >
        {languages.map((lang) => (
          <option
            key={lang.id}
            value={lang.id}
            className="bg-black text-white"
          >
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSelector;

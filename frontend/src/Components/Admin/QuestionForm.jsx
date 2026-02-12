import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

function QuestionForm({
  formData,
  setFormData,
  onSubmit,
  mode = "post",
  isDelete = false,
  isLoading,
  setQuestions,
  setRateLimited,
}) {
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const updateArray = (key, index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addItem = (key, item) => {
    setFormData((prev) => ({
      ...prev,
      [key]: [...prev[key], item],
    }));
  };

  const removeItem = (key, index) => {
    setFormData((prev) => ({
      ...prev,
      [key]: prev[key].filter((_, i) => i !== index),
    }));
  };

  const updateStarterCode = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      starterCode: {
        ...prev.starterCode,
        [lang]: value,
      },
    }));
  };

  const updateFunctionCallCode = (lang, value) => {
    setFormData((prev) => ({
      ...prev,
      functionCallCode: {
        ...prev.functionCallCode,
        [lang]: value,
      },
    }));
  };

  const updateQuestion = async () => {
    try {
      setUpdating(true);

      await axios.put(
        `http://localhost:3000/api/question/${formData._id}`,
        formData,
      );

      const { data } = await axios.get("http://localhost:3000/api/question");
      setQuestions(data);

      toast.success("Question updated successfully ✅");
    } catch (error) {
      if (error.response?.status === 429) {
        setRateLimited(true);
      } else {
        toast.error("Failed to update question");
      }
    } finally {
      setUpdating(false);
    }
  };

  const deleteQuestion = async () => {
    try {
      setDeleting(true);

      await axios.delete(`http://localhost:3000/api/question/${formData._id}`);

      setQuestions((prev) => prev.filter((q) => q._id !== formData._id));

      toast.success("Question deleted successfully 🗑️");
    } catch (error) {
      if (error.response?.status === 429) {
        setRateLimited(true);
      } else {
        toast.error("Failed to delete question");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (mode === "post") {
      onSubmit();
    }

    if (mode === "put") {
      updateQuestion();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-white">
      <section className="subDivs p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 formHead"> Basic Details</h2>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Problem Title"
          className="input w-full mb-3"
          required={true}
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Problem Description"
          className="input w-full h-32"
          required={true}
        />
        <br />
        <br />
        <p className="text-[#e6dede] ml-5 text-[13px] [text-shadow:_0_0_10px_#e6dede]">
          {" "}
          Click on link to host image and paste HTML src link here{" "}
          <a
            href="https://imgbb.com/"
            className="text-[#34d8e4] [text-shadow:_0_0_12px_#34e47b]"
          >
            {" "}
            - Link{" "}
          </a>
        </p>

        <input
          name="imageURL"
          value={formData.imageURL}
          onChange={handleChange}
          placeholder="Image URL (optional)"
          className="input w-full mt-3"
        />
      </section>

      <section className="subDivs p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 formHead">Examples</h2>

        {formData.examples.map((ex, i) => (
          <div key={i} className="border border-gray-700 p-4 rounded-lg mb-4">
            <input
              required={true}
              value={ex.input}
              onChange={(e) =>
                updateArray("examples", i, "input", e.target.value)
              }
              placeholder="Input"
              className="input w-full mb-2"
            />

            <input
              required={true}
              value={ex.output}
              onChange={(e) =>
                updateArray("examples", i, "output", e.target.value)
              }
              placeholder="Output"
              className="input w-full mb-2"
            />

            <textarea
              placeholder="Explanation"
              value={ex.explanation || ""}
              onChange={(e) =>
                updateArray("examples", i, "explanation", e.target.value)
              }
              className="input w-full"
            />
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            addItem("examples", { input: "", output: "", explaination: "" })
          }
          className="btn-secondary"
        >
          + Add Example
        </button>
      </section>

      <section className="subDivs p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 formHead">Constraints</h2>

        {formData.constraints.map((constraint, index) => (
          <div key={index} className="mb-3">
            <input
              required={true}
              type="text"
              value={constraint}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  constraints: prev.constraints.map((c, i) =>
                    i === index ? e.target.value : c,
                  ),
                }))
              }
              className="input w-full"
              placeholder={`Constraint ${index + 1}`}
            />
            <br />

            {formData.constraints.length > 1 && (
              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    constraints: prev.constraints.filter((_, i) => i !== index),
                  }))
                }
                className="text-red-400 text-sm mt-1"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              constraints: [...prev.constraints, ""],
            }))
          }
          className="btn-secondary"
        >
          + Add Constraint
        </button>
      </section>

      <section className="subDivs p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 formHead">
          Hidden Test Cases
        </h2>

        {formData.hiddenTests.map((test, i) => (
          <div key={i} className="border border-gray-700 p-4 rounded-lg mb-4">
            <input
              required={true}
              placeholder="Input"
              value={test.input}
              onChange={(e) =>
                updateArray("hiddenTests", i, "input", e.target.value)
              }
              className="input w-full mb-2"
            />

            <input
              required={true}
              placeholder="Output"
              value={test.output}
              onChange={(e) =>
                updateArray("hiddenTests", i, "output", e.target.value)
              }
              className="input w-full"
            />

            {formData.hiddenTests.length > 1 && (
              <button
                type="button"
                onClick={() => removeItem("hiddenTests", i)}
                className="font-[Orbitron] text-red-400 text-sm mt-2"
              >
                Remove
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => addItem("hiddenTests", { input: "", output: "" })}
          className="btn-secondary"
        >
          + Add Hidden Test
        </button>
      </section>

      <section className="subDivs p-5 rounded-xl">
        <h2 className="text-xl font-semibold mb-4 formHead">
          Language Code Configuration
        </h2>

        {Object.keys(formData.starterCode).map((lang) => (
          <div
            key={lang}
            className="mb-8 border border-white/10 rounded-xl p-4"
          >
            {/* LANGUAGE HEADER */}
            <h3 className="text-lg font-[Orbitron] capitalize text-[#34e47b] mb-4 [text-shadow:_0_0_10px_#3eeb91]">
              {lang}
            </h3>

            {/* STARTER CODE */}
            <label className="block text-sm mb-1 font-[Orbitron] text-green-400">
              Starter Code (User writes this)
            </label>
            <textarea
              required
              value={formData.starterCode[lang]}
              onChange={(e) => updateStarterCode(lang, e.target.value)}
              className="input font-mono bg-black text-green-400 w-full h-28 mb-4"
              placeholder={`Starter code for ${lang}`}
            />

            {/* FUNCTION CALL CODE */}
            <label className="block text-sm mb-1 font-[Orbitron] text-yellow-400">
              Function Call Code (Judge runs this)
            </label>
            <textarea
              required
              value={formData.functionCallCode?.[lang] || ""}
              onChange={(e) => updateFunctionCallCode(lang, e.target.value)}
              className="input font-mono bg-black text-yellow-400 w-full h-28"
              placeholder={`Judge function call for ${lang}`}
            />
          </div>
        ))}
      </section>

      <div className="flex justify-evenly">
        <button
          type="submit"
          className="font-[Orbitron] text-[#001f1a] hover:text-white hover:bg-[#ff3838d7] hover:[box-shadow:_0_0_15px_#fa5716f4]  mx-auto py-2 text-2xl rounded-lg [box-shadow:_0_0_15px_#00FF9E] bg-[#16fa8f] cursor-pointer px-10"
          disabled={isLoading || updating}
        >
          {mode === "put"
            ? updating
              ? "Updating..."
              : "Update Question"
            : isLoading
              ? "Saving..."
              : "Save Question"}
        </button>

        {mode === "put" && isDelete && (
          <button
            type="button"
            onClick={deleteQuestion}
            disabled={deleting}
            className="font-[Orbitron] hover:text-[#001f1a] px-10 text-white bg-[#ff3838d7] [box-shadow:_0_0_15px_#fa5716f4]  mx-auto py-2 text-2xl rounded-lg hover:[box-shadow:_0_0_15px_#00FF9E] hover:bg-[#16fa8f] cursor-pointer"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        )}
      </div>
    </form>
  );
}

export default QuestionForm;

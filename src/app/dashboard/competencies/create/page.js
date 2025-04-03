"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../competencies.module.scss";

export default function CreateCompetencyPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    levels: [{ level: 1, description: "", skills: [] }],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleLevelChange = (index, field, value) => {
    const updatedLevels = [...formData.levels];
    updatedLevels[index] = {
      ...updatedLevels[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      levels: updatedLevels,
    });
  };

  const handleSkillsChange = (index, value) => {
    const skills = value.split(",").map((skill) => skill.trim());
    const updatedLevels = [...formData.levels];
    updatedLevels[index] = {
      ...updatedLevels[index],
      skills,
    };
    setFormData({
      ...formData,
      levels: updatedLevels,
    });
  };

  const addLevel = () => {
    const newLevel = {
      level: formData.levels.length + 1,
      description: "",
      skills: [],
    };
    setFormData({
      ...formData,
      levels: [...formData.levels, newLevel],
    });
  };

  const removeLevel = (index) => {
    if (formData.levels.length > 1) {
      const updatedLevels = formData.levels.filter((_, i) => i !== index);
      // Reorder level numbers
      const reorderedLevels = updatedLevels.map((level, i) => ({
        ...level,
        level: i + 1,
      }));
      setFormData({
        ...formData,
        levels: reorderedLevels,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/competencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create competency");
      }

      router.push("/dashboard/competencies/view");
    } catch (error) {
      console.error("Error creating competency:", error);
      alert("Failed to create competency. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Create New Competency</h1>
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Competency Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <h2>Competency Levels</h2>
        {formData.levels.map((level, index) => (
          <div key={index} className={styles.formGroup}>
            <h3>Level {level.level}</h3>

            <label htmlFor={`level-desc-${index}`}>Level Description</label>
            <textarea
              id={`level-desc-${index}`}
              value={level.description}
              onChange={(e) =>
                handleLevelChange(index, "description", e.target.value)
              }
              required
            />

            <label htmlFor={`level-skills-${index}`}>
              Skills (comma-separated)
            </label>
            <textarea
              id={`level-skills-${index}`}
              value={level.skills.join(", ")}
              onChange={(e) => handleSkillsChange(index, e.target.value)}
            />

            {formData.levels.length > 1 && (
              <button
                type="button"
                onClick={() => removeLevel(index)}
                className={styles.deleteBtn}
              >
                Remove Level
              </button>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addLevel}
          className={styles.btnSubmit}
          style={{ marginRight: "10px", marginBottom: "20px" }}
        >
          Add Level
        </button>

        <div>
          <button
            type="submit"
            className={styles.btnSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Competency"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import styles from "../src/app/dashboard/roles/roles.module.scss";

const CompetencyPopup = ({
  isOpen,
  onClose,
  roleId,
  competencyType,
  roleName,
}) => {
  const [competencies, setCompetencies] = useState([]);
  const [newCompetency, setNewCompetency] = useState("");
  const [isEditing, setIsEditing] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allExistingCompetencies, setAllExistingCompetencies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && roleId) {
      fetchCompetencies();
      fetchAllCompetencies();
    }
  }, [isOpen, roleId, competencyType]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionRef.current &&
        !suggestionRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update suggestions as user types
  useEffect(() => {
    if (newCompetency.trim().length > 0) {
      const filtered = allExistingCompetencies.filter(
        (comp) =>
          comp.toLowerCase().includes(newCompetency.toLowerCase()) &&
          !competencies.includes(comp)
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [newCompetency, allExistingCompetencies, competencies]);

  const fetchCompetencies = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/competencies/role/${roleId}?type=${competencyType}`
      );

      if (response.ok) {
        const data = await response.json();
        if (data.competency) {
          setCompetencies(data.competency.competencies);
          setIsEditing(false);
        } else {
          setCompetencies([]);
          setIsEditing(true);
        }
      } else {
        setCompetencies([]);
        setIsEditing(true);
      }
    } catch (error) {
      console.error("Error fetching competencies:", error);
      setCompetencies([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllCompetencies = async () => {
    try {
      const response = await fetch("/api/competencies");
      if (response.ok) {
        const data = await response.json();
        // Extract all unique competencies from different roles and types
        const allCompetencies = new Set();

        if (data.competencies && data.competencies.length > 0) {
          data.competencies.forEach((comp) => {
            if (comp.competencies && Array.isArray(comp.competencies)) {
              comp.competencies.forEach((c) => allCompetencies.add(c));
            }
          });
        }

        setAllExistingCompetencies(Array.from(allCompetencies));
      }
    } catch (error) {
      console.error("Error fetching all competencies:", error);
    }
  };

  const handleSave = async () => {
    if (competencies.length === 0) {
      alert("Please add at least one competency.");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/competencies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          competencies,
          type: competencyType,
          roleId,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
      } else {
        console.error("Failed to save competencies");
        alert("Failed to save competencies. Please try again.");
      }
    } catch (error) {
      console.error("Error saving competencies:", error);
      alert("An error occurred while saving competencies.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCompetency = () => {
    if (newCompetency.trim()) {
      setCompetencies([...competencies, newCompetency.trim()]);
      setNewCompetency("");
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setCompetencies([...competencies, suggestion]);
    setNewCompetency("");
    setShowSuggestions(false);
    inputRef.current.focus();
  };

  const handleRemoveCompetency = (index) => {
    setCompetencies(competencies.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCompetency();
    } else if (
      e.key === "ArrowDown" &&
      showSuggestions &&
      suggestions.length > 0
    ) {
      // Focus the first suggestion with arrow down
      const firstSuggestion = document.querySelector(
        `.${styles.suggestionItem}`
      );
      if (firstSuggestion) {
        firstSuggestion.focus();
      }
    }
  };

  const handleSuggestionKeyDown = (e, index, suggestion) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelectSuggestion(suggestion);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      // Move focus to the next suggestion
      const nextSuggestion = document.querySelectorAll(
        `.${styles.suggestionItem}`
      )[index + 1];
      if (nextSuggestion) {
        nextSuggestion.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (index === 0) {
        // Move focus back to input if at first suggestion
        inputRef.current.focus();
      } else {
        // Move focus to the previous suggestion
        const prevSuggestion = document.querySelectorAll(
          `.${styles.suggestionItem}`
        )[index - 1];
        if (prevSuggestion) {
          prevSuggestion.focus();
        }
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h2>
            {competencyType} Competencies for {roleName}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading competencies...</div>
        ) : (
          <>
            <div className={styles.competencyList}>
              {isEditing ? (
                <div className={styles.addCompetencyForm}>
                  <div className={styles.inputWithSuggestions}>
                    <input
                      ref={inputRef}
                      type="text"
                      value={newCompetency}
                      onChange={(e) => setNewCompetency(e.target.value)}
                      onKeyDown={handleKeyPress}
                      onFocus={() => setShowSuggestions(suggestions.length > 0)}
                      placeholder="Enter a competency"
                      disabled={!isEditing}
                    />
                    {showSuggestions && (
                      <div
                        className={styles.suggestionsList}
                        ref={suggestionRef}
                      >
                        {suggestions.map((suggestion, index) => (
                          <div
                            key={index}
                            className={styles.suggestionItem}
                            onClick={() => handleSelectSuggestion(suggestion)}
                            onKeyDown={(e) =>
                              handleSuggestionKeyDown(e, index, suggestion)
                            }
                            tabIndex="0"
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleAddCompetency}
                    disabled={!isEditing || !newCompetency.trim()}
                  >
                    Add
                  </button>
                </div>
              ) : null}

              <ul>
                {competencies.map((competency, index) => (
                  <li key={index} className={styles.competencyItem}>
                    {competency}
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveCompetency(index)}
                        className={styles.removeButton}
                      >
                        ×
                      </button>
                    )}
                  </li>
                ))}
                {competencies.length === 0 && !isEditing && (
                  <li className={styles.noCompetencies}>
                    No competencies added yet.
                  </li>
                )}
              </ul>
            </div>

            <div className={styles.popupActions}>
              <button
                onClick={() => setIsEditing(true)}
                disabled={isEditing || saving}
                className={styles.editButton}
              >
                Edit
              </button>
              <button
                onClick={handleSave}
                disabled={!isEditing || saving}
                className={styles.saveButton}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CompetencyPopup;

"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    if (isOpen && roleId) {
      fetchCompetencies();
    }
  }, [isOpen, roleId, competencyType]);

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
    }
  };

  const handleRemoveCompetency = (index) => {
    setCompetencies(competencies.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCompetency();
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
                  <input
                    type="text"
                    value={newCompetency}
                    onChange={(e) => setNewCompetency(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a competency"
                    disabled={!isEditing}
                  />
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

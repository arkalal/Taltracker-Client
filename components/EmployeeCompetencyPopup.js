"use client";

import React, { useState, useEffect } from "react";
import styles from "../src/app/dashboard/employees/employees.module.scss";
import { toast } from "react-hot-toast";
import { IoMdClose } from "react-icons/io";

const EmployeeCompetencyPopup = ({
  isOpen,
  onClose,
  employeeId,
  employeeName,
  roleId,
}) => {
  const [technicalCompetencies, setTechnicalCompetencies] = useState([]);
  const [functionalCompetencies, setFunctionalCompetencies] = useState([]);
  const [behavioralCompetencies, setBehavioralCompetencies] = useState([]);
  const [selectedCompetencies, setSelectedCompetencies] = useState({
    technical: [],
    functional: [],
    behavioral: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && employeeId && roleId) {
      fetchCompetencies();
      fetchEmployeeCompetencies();
    }
  }, [isOpen, employeeId, roleId]);

  const fetchCompetencies = async () => {
    try {
      setLoading(true);
      // Fetch technical competencies
      const technicalResponse = await fetch(
        `/api/competencies/role/${roleId}?type=Technical`
      );
      // Fetch functional competencies
      const functionalResponse = await fetch(
        `/api/competencies/role/${roleId}?type=Functional`
      );
      // Fetch behavioral competencies
      const behavioralResponse = await fetch(
        `/api/competencies/role/${roleId}?type=Behavioral`
      );

      if (
        !technicalResponse.ok ||
        !functionalResponse.ok ||
        !behavioralResponse.ok
      ) {
        throw new Error("Failed to fetch competencies");
      }

      const technicalData = await technicalResponse.json();
      const functionalData = await functionalResponse.json();
      const behavioralData = await behavioralResponse.json();

      // Set competencies arrays if they exist
      setTechnicalCompetencies(technicalData.competency?.competencies || []);
      setFunctionalCompetencies(functionalData.competency?.competencies || []);
      setBehavioralCompetencies(behavioralData.competency?.competencies || []);
    } catch (error) {
      console.error("Error fetching competencies:", error);
      toast.error("Failed to load competencies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeCompetencies = async () => {
    try {
      const response = await fetch(`/api/employees/${employeeId}/competencies`);

      if (!response.ok) {
        throw new Error("Failed to fetch employee competencies");
      }

      const data = await response.json();

      // If employee already has competencies, set them
      if (data.competencies) {
        setSelectedCompetencies({
          technical: data.competencies.technical || [],
          functional: data.competencies.functional || [],
          behavioral: data.competencies.behavioral || [],
        });
      }
    } catch (error) {
      console.error("Error fetching employee competencies:", error);
      // Don't show error toast here, it's okay if the employee doesn't have competencies yet
    }
  };

  const handleCheckboxChange = (type, competency) => {
    setSelectedCompetencies((prev) => {
      const currentList = [...prev[type]];

      if (currentList.includes(competency)) {
        return {
          ...prev,
          [type]: currentList.filter((item) => item !== competency),
        };
      } else {
        return {
          ...prev,
          [type]: [...currentList, competency],
        };
      }
    });
  };

  const saveCompetencies = async () => {
    try {
      setSaving(true);

      const response = await fetch(
        `/api/employees/${employeeId}/competencies`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            competencies: selectedCompetencies,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save competencies");
      }

      toast.success("Competencies saved successfully!");
      onClose();
    } catch (error) {
      console.error("Error saving competencies:", error);
      toast.error("Failed to save competencies. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.popupOverlay} onClick={onClose}>
      <div className={styles.popupContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.popupHeader}>
          <h2>Competency Mapping for {employeeName}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <IoMdClose />
          </button>
        </div>

        {loading ? (
          <div className={styles.loading}>Loading competencies...</div>
        ) : (
          <div className={styles.competenciesGrid}>
            <div className={`${styles.competencyColumn} ${styles.technical}`}>
              <h3>Technical</h3>
              {technicalCompetencies.length === 0 ? (
                <p>No technical competencies found for this role.</p>
              ) : (
                technicalCompetencies.map((competency, index) => (
                  <div key={`tech-${index}`} className={styles.competencyItem}>
                    <input
                      type="checkbox"
                      id={`tech-${index}`}
                      className={styles.checkbox}
                      checked={selectedCompetencies.technical.includes(
                        competency
                      )}
                      onChange={() =>
                        handleCheckboxChange("technical", competency)
                      }
                    />
                    <label htmlFor={`tech-${index}`}>{competency}</label>
                  </div>
                ))
              )}
            </div>

            <div className={`${styles.competencyColumn} ${styles.functional}`}>
              <h3>Functional</h3>
              {functionalCompetencies.length === 0 ? (
                <p>No functional competencies found for this role.</p>
              ) : (
                functionalCompetencies.map((competency, index) => (
                  <div key={`func-${index}`} className={styles.competencyItem}>
                    <input
                      type="checkbox"
                      id={`func-${index}`}
                      className={styles.checkbox}
                      checked={selectedCompetencies.functional.includes(
                        competency
                      )}
                      onChange={() =>
                        handleCheckboxChange("functional", competency)
                      }
                    />
                    <label htmlFor={`func-${index}`}>{competency}</label>
                  </div>
                ))
              )}
            </div>

            <div className={`${styles.competencyColumn} ${styles.behavioral}`}>
              <h3>Behavioral</h3>
              {behavioralCompetencies.length === 0 ? (
                <p>No behavioral competencies found for this role.</p>
              ) : (
                behavioralCompetencies.map((competency, index) => (
                  <div key={`behav-${index}`} className={styles.competencyItem}>
                    <input
                      type="checkbox"
                      id={`behav-${index}`}
                      className={styles.checkbox}
                      checked={selectedCompetencies.behavioral.includes(
                        competency
                      )}
                      onChange={() =>
                        handleCheckboxChange("behavioral", competency)
                      }
                    />
                    <label htmlFor={`behav-${index}`}>{competency}</label>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className={styles.popupFooter}>
          <button
            className={styles.saveButton}
            onClick={saveCompetencies}
            disabled={saving || loading}
          >
            {saving ? "Saving..." : "Save Competencies"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCompetencyPopup;

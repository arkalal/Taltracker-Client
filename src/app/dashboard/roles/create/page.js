"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../roles.module.scss";
import { toast } from "react-hot-toast";

const CreateRole = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState([{ jobRole: "", jobDescription: "" }]);

  const handleInputChange = (index, field, value) => {
    const updatedRoles = [...roles];
    updatedRoles[index][field] = value;
    setRoles(updatedRoles);
  };

  const addNewRole = () => {
    setRoles([...roles, { jobRole: "", jobDescription: "" }]);
  };

  const removeRole = (index) => {
    if (roles.length === 1) return;
    const updatedRoles = [...roles];
    updatedRoles.splice(index, 1);
    setRoles(updatedRoles);
  };

  const saveRoles = async () => {
    // Validate all roles
    const invalidRoles = roles.filter(
      (role) => !role.jobRole.trim() || !role.jobDescription.trim()
    );
    if (invalidRoles.length > 0) {
      toast.error("Please fill in all fields for all roles.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/roles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roles),
      });

      if (!response.ok) {
        throw new Error("Failed to create roles");
      }

      toast.success("Roles created successfully!");

      // Reset form and redirect to view page
      setRoles([{ jobRole: "", jobDescription: "" }]);

      // Add a slight delay before redirecting to ensure toast is visible
      setTimeout(() => {
        router.push("/dashboard/roles/view");
      }, 500);
    } catch (error) {
      console.error("Error creating roles:", error);
      toast.error("Failed to create roles. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.rolesContainer}>
      <h1>Create New Role</h1>

      {roles.map((role, index) => (
        <div key={index} className={styles.createRoleForm}>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Job Role</label>
            <input
              type="text"
              value={role.jobRole}
              onChange={(e) =>
                handleInputChange(index, "jobRole", e.target.value)
              }
              className={styles.formInput}
              placeholder="Enter job role"
              required
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Job Description</label>
            <textarea
              value={role.jobDescription}
              onChange={(e) =>
                handleInputChange(index, "jobDescription", e.target.value)
              }
              className={`${styles.formInput} ${styles.textArea}`}
              placeholder="Enter job description"
              required
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>
              Job Description Upload (Disabled)
            </label>
            <input type="file" className={styles.formInput} disabled />
          </div>

          {roles.length > 1 && (
            <div className={styles.formButtons}>
              <button
                onClick={() => removeRole(index)}
                className={styles.removeButton}
                type="button"
              >
                Remove Role
              </button>
            </div>
          )}
        </div>
      ))}

      <div className={styles.formButtons}>
        <div className={styles.buttonContainer}>
          <button
            onClick={addNewRole}
            className={styles.addButton}
            type="button"
            disabled={isSubmitting}
          >
            Add New Role
          </button>

          <button
            onClick={saveRoles}
            className={styles.saveButton}
            type="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Roles"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;

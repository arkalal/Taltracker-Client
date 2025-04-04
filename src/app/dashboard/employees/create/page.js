"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../employees.module.scss";
import { toast } from "react-hot-toast";

const CreateEmployee = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState([
    { name: "", profileDescription: "", roleId: "" },
  ]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch("/api/roles");
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }
      const data = await response.json();
      setRoles(data.roles || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedEmployees = [...employees];
    updatedEmployees[index][field] = value;
    setEmployees(updatedEmployees);
  };

  const addNewEmployee = () => {
    setEmployees([
      ...employees,
      { name: "", profileDescription: "", roleId: "" },
    ]);
  };

  const removeEmployee = (index) => {
    if (employees.length === 1) return;
    const updatedEmployees = [...employees];
    updatedEmployees.splice(index, 1);
    setEmployees(updatedEmployees);
  };

  const saveEmployees = async () => {
    // Validate all employees
    const invalidEmployees = employees.filter(
      (employee) =>
        !employee.name.trim() ||
        !employee.profileDescription.trim() ||
        !employee.roleId
    );

    if (invalidEmployees.length > 0) {
      toast.error("Please fill in all fields for all employees.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employees),
      });

      if (!response.ok) {
        throw new Error("Failed to create employees");
      }

      toast.success("Employees created successfully!");

      // Reset form and redirect to view page
      setEmployees([{ name: "", profileDescription: "", roleId: "" }]);

      // Add a slight delay before redirecting to ensure toast is visible
      setTimeout(() => {
        router.push("/dashboard/employees/view");
      }, 500);
    } catch (error) {
      console.error("Error creating employees:", error);
      toast.error("Failed to create employees. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading roles...</div>;
  }

  return (
    <div className={styles.employeesContainer}>
      <h1>Create New Employee</h1>

      {employees.map((employee, index) => (
        <div key={index} className={styles.createEmployeeForm}>
          <div className={styles.formRow}>
            <label className={styles.formLabel}>Employee Name</label>
            <input
              type="text"
              value={employee.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              className={styles.formInput}
              placeholder="Enter employee name"
              required
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Profile Description</label>
            <textarea
              value={employee.profileDescription}
              onChange={(e) =>
                handleInputChange(index, "profileDescription", e.target.value)
              }
              className={`${styles.formInput} ${styles.textArea}`}
              placeholder="Enter profile description"
              required
            />
          </div>

          <div className={styles.formRow}>
            <label className={styles.formLabel}>Assign Role</label>
            <select
              value={employee.roleId}
              onChange={(e) =>
                handleInputChange(index, "roleId", e.target.value)
              }
              className={styles.formSelect}
              required
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.jobRole}
                </option>
              ))}
            </select>
          </div>

          {employees.length > 1 && (
            <div className={styles.formButtons}>
              <button
                onClick={() => removeEmployee(index)}
                className={styles.removeButton}
                type="button"
              >
                Remove Employee
              </button>
            </div>
          )}
        </div>
      ))}

      <div className={styles.formButtons}>
        <div className={styles.buttonContainer}>
          <button
            onClick={addNewEmployee}
            className={styles.addButton}
            type="button"
            disabled={isSubmitting}
          >
            Add New Employee
          </button>

          <button
            onClick={saveEmployees}
            className={styles.saveButton}
            type="button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Employees"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEmployee;

"use client";

import { useState, useEffect } from "react";
import styles from "../roles.module.scss";
import { toast } from "react-hot-toast";
import Link from "next/link";

const ViewRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState([]);

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
      setRoles(data.roles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error("Failed to load roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (roleId) => {
    setSelectedRoles((prev) => {
      if (prev.includes(roleId)) {
        return prev.filter((id) => id !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRoles(roles.map((role) => role._id));
    } else {
      setSelectedRoles([]);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading roles...</div>;
  }

  if (roles.length === 0) {
    return (
      <div className={styles.rolesContainer}>
        <div className={styles.noRoles}>
          <p>No roles found. Please create some roles.</p>
          <Link href="/dashboard/roles/create">Create Roles</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.rolesContainer}>
      <h1>Role List</h1>

      <table className={styles.rolesTable}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={handleSelectAll}
                checked={
                  selectedRoles.length === roles.length && roles.length > 0
                }
              />
            </th>
            <th>SL No</th>
            <th>Organization</th>
            <th>Job Role</th>
            <th>Job Description</th>
            <th>JD Link</th>
            <th>Competency</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role, index) => (
            <tr key={role._id}>
              <td>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedRoles.includes(role._id)}
                  onChange={() => handleCheckboxChange(role._id)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{role.organization}</td>
              <td>{role.jobRole}</td>
              <td>
                {role.jobDescription.length > 100
                  ? `${role.jobDescription.substring(0, 100)}...`
                  : role.jobDescription}
              </td>
              <td>
                <a
                  href={role.jdLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.link}
                >
                  {role.jdLink}
                </a>
              </td>
              <td>
                <div>
                  <button
                    className={`${styles.competencyButton} ${styles.technical}`}
                  >
                    Technical
                  </button>
                  <button
                    className={`${styles.competencyButton} ${styles.functional}`}
                  >
                    Functional
                  </button>
                  <button
                    className={`${styles.competencyButton} ${styles.behavioral}`}
                  >
                    Behavioral
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewRoles;

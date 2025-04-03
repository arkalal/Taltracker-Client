"use client";

import { useState, useEffect } from "react";
import styles from "../roles.module.scss";
import { toast } from "react-hot-toast";
import Link from "next/link";
import CompetencyPopup from "../../../../../components/CompetencyPopup";

const ViewRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedCompetencyType, setSelectedCompetencyType] = useState(null);

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
      // Roles are already sorted by createdAt in ascending order from the API
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

  const openCompetencyPopup = (roleId, competencyType, e) => {
    e.preventDefault();
    const role = roles.find((r) => r._id === roleId);
    if (role) {
      setSelectedRole(role);
      setSelectedCompetencyType(competencyType);
      setPopupOpen(true);
    }
  };

  const closeCompetencyPopup = () => {
    setPopupOpen(false);
    setSelectedRole(null);
    setSelectedCompetencyType(null);
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
                    onClick={(e) =>
                      openCompetencyPopup(role._id, "Technical", e)
                    }
                  >
                    Technical
                  </button>
                  <button
                    className={`${styles.competencyButton} ${styles.functional}`}
                    onClick={(e) =>
                      openCompetencyPopup(role._id, "Functional", e)
                    }
                  >
                    Functional
                  </button>
                  <button
                    className={`${styles.competencyButton} ${styles.behavioral}`}
                    onClick={(e) =>
                      openCompetencyPopup(role._id, "Behavioral", e)
                    }
                  >
                    Behavioral
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popupOpen && selectedRole && selectedCompetencyType && (
        <CompetencyPopup
          isOpen={popupOpen}
          onClose={closeCompetencyPopup}
          roleId={selectedRole._id}
          roleName={selectedRole.jobRole}
          competencyType={selectedCompetencyType}
        />
      )}
    </div>
  );
};

export default ViewRoles;

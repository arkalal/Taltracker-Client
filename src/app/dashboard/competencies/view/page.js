"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../competencies.module.scss";

export default function ViewCompetenciesPage() {
  const [competencies, setCompetencies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch roles
      const rolesResponse = await fetch("/api/roles");
      if (!rolesResponse.ok) {
        throw new Error("Failed to fetch roles");
      }
      const rolesData = await rolesResponse.json();
      // Roles are already sorted by createdAt in ascending order from the API
      setRoles(rolesData.roles || []);

      // Fetch competencies
      const competenciesResponse = await fetch("/api/competencies");
      if (!competenciesResponse.ok) {
        throw new Error("Failed to fetch competencies");
      }
      const competenciesData = await competenciesResponse.json();
      // Competencies are already sorted by createdAt in ascending order from the API
      setCompetencies(competenciesData.competencies || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group competencies by role ID and type
  const getCompetenciesByRoleAndType = (roleId, type) => {
    const roleCompetencies = competencies.find(
      (comp) => comp.roleId?._id === roleId && comp.type === type
    );
    return roleCompetencies ? roleCompetencies.competencies : [];
  };

  // Get all roles that have competencies
  const getRolesWithCompetencies = () => {
    if (competencies.length === 0) return roles;

    // Get unique role IDs from competencies
    const roleIdsWithCompetencies = [
      ...new Set(competencies.map((comp) => comp.roleId?._id).filter(Boolean)),
    ];

    // Filter roles to only those that have competencies or all roles if no competencies exist
    return roles.filter(
      (role) =>
        roleIdsWithCompetencies.includes(role._id) || competencies.length === 0
    );
  };

  // Get CSS class for competency type
  const getTypeClassName = (type) => {
    switch (type) {
      case "Technical":
        return styles.technicalType;
      case "Functional":
        return styles.functionalType;
      case "Behavioral":
        return styles.behavioralType;
      default:
        return "";
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading competencies...</div>;
  }

  const rolesWithCompetencies = getRolesWithCompetencies();
  const competencyTypes = ["Technical", "Functional", "Behavioral"];

  return (
    <div className={styles.container}>
      <h1>Competency Mapping</h1>

      {rolesWithCompetencies.length === 0 ? (
        <div className={styles.noData}>
          <p>No roles found. Please create roles and add competencies.</p>
          <button
            onClick={() => router.push("/dashboard/roles/view")}
            className={styles.btnSubmit}
          >
            View Roles
          </button>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.competencyTable}>
            <thead>
              <tr>
                <th>Job Role</th>
                <th>Types of Competencies</th>
                <th>Competencies</th>
              </tr>
            </thead>
            <tbody>
              {rolesWithCompetencies.map((role, roleIndex) =>
                competencyTypes.map((type, typeIndex) => (
                  <tr
                    key={`${role._id}-${type}`}
                    className={
                      roleIndex % 2 === 0
                        ? styles.evenRoleRow
                        : styles.oddRoleRow
                    }
                  >
                    {/* Show job role only in the first row for each role */}
                    {typeIndex === 0 ? (
                      <td
                        rowSpan={competencyTypes.length}
                        className={styles.jobRoleCell}
                      >
                        {role.jobRole}
                      </td>
                    ) : null}
                    <td className={getTypeClassName(type)}>{type}</td>
                    <td>
                      {(() => {
                        const typeCompetencies = getCompetenciesByRoleAndType(
                          role._id,
                          type
                        );
                        return typeCompetencies.length > 0 ? (
                          <ul className={styles.competencyList}>
                            {typeCompetencies.map((competency, index) => (
                              <li key={index}>{competency}</li>
                            ))}
                          </ul>
                        ) : (
                          <span className={styles.noCompetencies}>
                            No competencies added
                          </span>
                        );
                      })()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

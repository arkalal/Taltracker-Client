"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../competencies.module.scss";

export default function ViewCompetenciesPage() {
  const [competencies, setCompetencies] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState({
    total: 0,
    completed: 0,
    currentCompetency: "",
  });
  const [selectedCompetency, setSelectedCompetency] = useState(null);
  const [generatedCompetencies, setGeneratedCompetencies] = useState({}); // Track which competencies have been generated in the current session
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

  // Check if all competencies have levels generated
  const allCompetenciesHaveLevels = () => {
    if (competencies.length === 0) return false;

    return competencies.every(
      (comp) => comp.hasLevels && comp.levels && comp.levels.length > 0
    );
  };

  // Generate competency levels
  const generateMatrixLevels = async () => {
    setGenerating(true);
    // Reset any previously tracked generated competencies
    setGeneratedCompetencies({});

    const competenciesNeedingLevels = competencies.filter(
      (comp) => !comp.hasLevels || !comp.levels || comp.levels.length === 0
    );

    if (competenciesNeedingLevels.length === 0) {
      setGenerating(false);
      return;
    }

    let totalCompetencyCount = 0;
    for (const comp of competenciesNeedingLevels) {
      totalCompetencyCount += comp.competencies.length;
    }

    setGenerationProgress({
      total: totalCompetencyCount,
      completed: 0,
      currentCompetency: "",
    });

    let completedCount = 0;
    let updatedCompetencies = [...competencies];

    for (const competency of competenciesNeedingLevels) {
      try {
        // Initialize levels array if not present
        const newLevels = [];

        // Create a copy of the competency for real-time updates
        let updatedCompetency = { ...competency, levels: [], hasLevels: false };

        // For each competency that needs levels
        for (let i = 0; i < competency.competencies.length; i++) {
          const competencyName = competency.competencies[i];

          // Update progress with current competency name
          setGenerationProgress((prev) => ({
            ...prev,
            currentCompetency: competencyName,
          }));

          try {
            // Call OpenAI API to generate levels
            const openaiResponse = await fetch("/api/openai", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                competencies: [competencyName],
              }),
            });

            if (!openaiResponse.ok) {
              console.error(
                `OpenAI API error status: ${openaiResponse.status}`
              );
              const errorText = await openaiResponse.text();
              console.error(`OpenAI API error: ${errorText}`);
              throw new Error(
                `Failed to generate levels for ${competencyName}`
              );
            }

            const openaiData = await openaiResponse.json();

            if (!openaiData.results || openaiData.results.length === 0) {
              throw new Error(`No results returned for ${competencyName}`);
            }

            // Get the levels from the OpenAI response
            const levels = openaiData.results[0].levels;

            // Store levels for this competency
            newLevels[i] = levels;

            // Update the copy of the competency with the new level
            updatedCompetency.levels[i] = levels;

            // Mark this competency as being generated in the current session
            setGeneratedCompetencies((prev) => ({
              ...prev,
              [`${competency._id}-${i}`]: true,
            }));

            // Real-time update of the competencies state
            updatedCompetencies = updatedCompetencies.map((comp) =>
              comp._id === competency._id
                ? { ...comp, levels: [...newLevels], hasLevels: true }
                : comp
            );
            setCompetencies(updatedCompetencies);

            // Update progress
            completedCount++;
            setGenerationProgress((prev) => ({
              ...prev,
              completed: completedCount,
            }));

            // Add a small delay for visual effect of streaming generation
            await new Promise((resolve) => setTimeout(resolve, 300));
          } catch (innerError) {
            console.error(
              `Error for competency ${competencyName}:`,
              innerError
            );
            // Add placeholder levels if generation fails
            newLevels[i] = Array(5).fill(
              `Level description for ${competencyName} (generation failed)`
            );

            // Update the copy for real-time display
            updatedCompetency.levels[i] = newLevels[i];

            completedCount++;
            setGenerationProgress((prev) => ({
              ...prev,
              completed: completedCount,
            }));
          }
        }

        // Ensure each competency has 5 levels
        for (let i = 0; i < newLevels.length; i++) {
          if (!Array.isArray(newLevels[i])) {
            newLevels[i] = Array(5).fill(
              `Level description for ${
                competency.competencies[i] || "Competency"
              }`
            );
          } else if (newLevels[i].length !== 5) {
            // Pad or trim to exactly 5 levels
            while (newLevels[i].length < 5) {
              newLevels[i].push(
                `Level ${newLevels[i].length + 1} description for ${
                  competency.competencies[i]
                }`
              );
            }
            if (newLevels[i].length > 5) {
              newLevels[i] = newLevels[i].slice(0, 5);
            }
          }
        }

        // Update the competency in the database
        const updateResponse = await fetch("/api/competencies/levels", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            competencyId: competency._id,
            levels: newLevels,
          }),
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json().catch(() => null);
          console.error("API error response:", errorData);
          throw new Error(
            `Failed to update competency with levels: ${
              updateResponse.status
            } ${errorData?.error || ""}`
          );
        }
      } catch (error) {
        console.error("Error generating competency levels:", error);
      }
    }

    // Final refresh to ensure UI is in sync with database
    await fetchData();
    setGenerating(false);
    setGenerationProgress((prev) => ({
      ...prev,
      currentCompetency: "Completed!",
    }));

    // Clear the "completed" message after 2 seconds
    setTimeout(() => {
      setGenerationProgress({
        total: 0,
        completed: 0,
        currentCompetency: "",
      });
    }, 2000);
  };

  // Group competencies by role ID and type
  const getCompetenciesByRoleAndType = (roleId, type) => {
    const roleCompetencies = competencies.find(
      (comp) => comp.roleId?._id === roleId && comp.type === type
    );
    return roleCompetencies ? roleCompetencies : null;
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

  // Check if a competency was recently generated
  const isRecentlyGenerated = (competencyId, index) => {
    return !!generatedCompetencies[`${competencyId}-${index}`];
  };

  // View competency levels
  const viewCompetencyLevels = (competency, index, competencyData) => {
    setSelectedCompetency({
      name: competency,
      levels: competencyData?.levels?.[index] || [],
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading competencies...</div>;
  }

  const rolesWithCompetencies = getRolesWithCompetencies();
  const competencyTypes = ["Technical", "Functional", "Behavioral"];

  return (
    <div className={styles.container}>
      <h1>Competency Mapping</h1>

      <div className={styles.matrixActions}>
        <button
          className={`${styles.generateMatrixBtn} ${
            allCompetenciesHaveLevels() ? styles.disabled : ""
          }`}
          onClick={generateMatrixLevels}
          disabled={generating || allCompetenciesHaveLevels()}
        >
          {generating
            ? `Generating: ${generationProgress.currentCompetency} (${generationProgress.completed}/${generationProgress.total})`
            : allCompetenciesHaveLevels()
            ? "All Competency Levels Generated"
            : "Generate Matrix"}
        </button>
      </div>

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
                competencyTypes.map((type, typeIndex) => {
                  const competencyData = getCompetenciesByRoleAndType(
                    role._id,
                    type
                  );
                  const competencyList = competencyData?.competencies || [];

                  return (
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
                        {competencyList.length > 0 ? (
                          <ul className={styles.competencyList}>
                            {competencyList.map((competency, index) => (
                              <li
                                key={index}
                                className={`
                                  ${
                                    competencyData?.levels?.[index]
                                      ? styles.clickableCompetency
                                      : ""
                                  }
                                  ${
                                    isRecentlyGenerated(
                                      competencyData?._id,
                                      index
                                    )
                                      ? styles.recentlyGenerated
                                      : ""
                                  }
                                `}
                                onClick={
                                  competencyData?.hasLevels
                                    ? () =>
                                        viewCompetencyLevels(
                                          competency,
                                          index,
                                          competencyData
                                        )
                                    : null
                                }
                              >
                                {competency}
                                {competencyData?.levels?.[index] && (
                                  <span
                                    className={styles.viewLevelsIndicator}
                                  ></span>
                                )}
                                {!competencyData?.hasLevels &&
                                  generating &&
                                  isRecentlyGenerated(
                                    competencyData?._id,
                                    index
                                  ) && (
                                    <span
                                      className={styles.generatingIndicator}
                                    >
                                      Generating...
                                    </span>
                                  )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className={styles.noCompetencies}>
                            No competencies added
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Competency Levels Modal/Popup */}
      {selectedCompetency && (
        <div className={styles.levelModal}>
          <div className={styles.levelModalContent}>
            <button
              className={styles.closeModalBtn}
              onClick={() => setSelectedCompetency(null)}
            >
              ×
            </button>
            <h3>{selectedCompetency.name}</h3>
            <div className={styles.levelsGrid}>
              {selectedCompetency.levels.map((level, index) => (
                <div key={index} className={styles.levelCard}>
                  <h4>Level {index + 1}</h4>
                  <p>{level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

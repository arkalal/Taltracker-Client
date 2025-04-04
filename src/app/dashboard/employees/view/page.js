"use client";

import { useState, useEffect } from "react";
import styles from "../employees.module.scss";
import { toast } from "react-hot-toast";
import Link from "next/link";
import EmployeeCompetencyPopup from "../../../../../components/EmployeeCompetencyPopup";

const ViewEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employees");
      }
      const data = await response.json();
      setEmployees(data.employees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast.error("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (employeeId) => {
    setSelectedEmployees((prev) => {
      if (prev.includes(employeeId)) {
        return prev.filter((id) => id !== employeeId);
      } else {
        return [...prev, employeeId];
      }
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedEmployees(employees.map((employee) => employee._id));
    } else {
      setSelectedEmployees([]);
    }
  };

  const openCompetencyPopup = (employee) => {
    setSelectedEmployee(employee);
    setPopupOpen(true);
  };

  const closeCompetencyPopup = () => {
    setPopupOpen(false);
    setSelectedEmployee(null);
    // Refresh employee data after mapping
    fetchEmployees();
  };

  // Function to count mapped competencies for an employee
  const countCompetencies = (competencies) => {
    if (!competencies) return 0;

    const technicalCount = competencies.technical?.length || 0;
    const functionalCount = competencies.functional?.length || 0;
    const behavioralCount = competencies.behavioral?.length || 0;

    return technicalCount + functionalCount + behavioralCount;
  };

  if (loading) {
    return <div className={styles.loading}>Loading employees...</div>;
  }

  if (employees.length === 0) {
    return (
      <div className={styles.employeesContainer}>
        <div className={styles.noEmployees}>
          <p>No employees found. Please create some employees.</p>
          <Link href="/dashboard/employees/create">Create Employees</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.employeesContainer}>
      <h1>Employee List</h1>

      <table className={styles.employeesTable}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                className={styles.checkbox}
                onChange={handleSelectAll}
                checked={
                  selectedEmployees.length === employees.length &&
                  employees.length > 0
                }
              />
            </th>
            <th>SL No</th>
            <th>Employee</th>
            <th>Profile</th>
            <th>Role</th>
            <th>Competency</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={employee._id}>
              <td>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selectedEmployees.includes(employee._id)}
                  onChange={() => handleCheckboxChange(employee._id)}
                />
              </td>
              <td>{index + 1}</td>
              <td>{employee.name}</td>
              <td>
                {employee.profileDescription.length > 100
                  ? `${employee.profileDescription.substring(0, 100)}...`
                  : employee.profileDescription}
              </td>
              <td>{employee.roleId?.jobRole || "N/A"}</td>
              <td>
                <div className={styles.competencyCell}>
                  <span>{countCompetencies(employee.competencies)} mapped</span>
                  <button
                    className={styles.mapButton}
                    onClick={() => openCompetencyPopup(employee)}
                  >
                    Map Competency
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {popupOpen && selectedEmployee && (
        <EmployeeCompetencyPopup
          isOpen={popupOpen}
          onClose={closeCompetencyPopup}
          employeeId={selectedEmployee._id}
          employeeName={selectedEmployee.name}
          roleId={selectedEmployee.roleId._id}
        />
      )}
    </div>
  );
};

export default ViewEmployees;

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const SalaryTable = () => {
  const [data, setData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'year', direction: 'ascending' });
  const [selectedYear, setSelectedYear] = useState(null);
  const [jobDetails, setJobDetails] = useState([]);

  useEffect(() => {
    Papa.parse('/salaries.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const parsedData = results.data.reduce((acc, row) => {
          const year = parseInt(row.work_year, 10);
          const salary = parseFloat(row.salary_in_usd);
          if (!isNaN(year) && !isNaN(salary)) {
            if (!acc[year]) {
              acc[year] = { totalJobs: 0, totalSalary: 0 };
            }
            acc[year].totalJobs += 1;
            acc[year].totalSalary += salary;
          }
          return acc;
        }, {});

        const formattedData = Object.keys(parsedData).map((year) => ({
          year,
          totalJobs: parsedData[year].totalJobs,
          averageSalary: (parsedData[year].totalSalary / parsedData[year].totalJobs).toFixed(2),
        }));

        setData(formattedData);
      },
    });
  }, []);

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        return <FontAwesomeIcon icon={faSortUp} />;
      } else {
        return <FontAwesomeIcon icon={faSortDown} />;
      }
    } else {
      return <FontAwesomeIcon icon={faSort} />;
    }
  };

  const handleRowClick = (year) => {
    Papa.parse('/salaries.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const jobsForYear = results.data
          .filter((row) => parseInt(row.work_year, 10) === parseInt(year, 10))
          .reduce((acc, row) => {
            const jobTitle = row.job_title;
            if (!acc[jobTitle]) {
              acc[jobTitle] = 0;
            }
            acc[jobTitle] += 1;
            return acc;
          }, {});

        const jobDetailsArray = Object.keys(jobsForYear).map((jobTitle) => ({
          jobTitle,
          count: jobsForYear[jobTitle],
        }));

        setJobDetails(jobDetailsArray);
        setSelectedYear(year);
      },
    });
  };

  return (
    <div>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th onClick={() => requestSort('year')}>
              Year {getSortIcon('year')}
            </th>
            <th onClick={() => requestSort('totalJobs')}>
              Number of Jobs {getSortIcon('totalJobs')}
            </th>
            <th onClick={() => requestSort('averageSalary')}>
              Average Salary (USD) {getSortIcon('averageSalary')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row) => (
            <tr key={row.year} onClick={() => handleRowClick(row.year)}>
              <td>{row.year}</td>
              <td>{row.totalJobs}</td>
              <td>{row.averageSalary}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {selectedYear && (
        <div>
          <h3>Job Titles in {selectedYear}</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Number of Jobs</th>
              </tr>
            </thead>
            <tbody>
              {jobDetails.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.jobTitle}</td>
                  <td>{detail.count}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SalaryTable;

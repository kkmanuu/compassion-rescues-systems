import { Link } from 'react-router-dom';

const RecentCases = ({ cases }) => {
  return (
    <div className="recent-cases">
      <h3>Recent Cases</h3>
      <ul>
        {cases.map((caseItem) => (
          <li key={caseItem.id}>
            <Link to={`/cases/${caseItem.id}`}>
              <span className="case-id">Case #{caseItem.id}</span>
              <span className={`status-badge ${caseItem.status}`}>
                {caseItem.status}
              </span>
              <span className="location">{caseItem.location}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentCases;
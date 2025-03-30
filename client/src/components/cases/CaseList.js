import { useEffect, useState } from 'react';
import { getCases } from '../../services/caseService';

function CaseList() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await getCases();
        setCases(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCases();
  }, []);

  if (loading) return <div>Loading cases...</div>;

  return (
    <div className="case-list">
      {cases.map((caseItem) => (
        <div key={caseItem.id} className="case-card">
          <h3>Case #{caseItem.id}</h3>
          <p>Status: {caseItem.status}</p>
          <p>Location: {caseItem.location}</p>
        </div>
      ))}
    </div>
  );
}

export default CaseList;
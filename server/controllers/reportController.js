const pool = require("../config/db");

exports.generateCaseReport = async (req, res) => {
  try {
    const [caseTypes] = await pool.query(`
      SELECT 
        case_type, 
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cases), 2) as percentage
      FROM cases 
      GROUP BY case_type
      ORDER BY count DESC
    `);

    const [caseStatuses] = await pool.query(`
      SELECT 
        status, 
        COUNT(*) as count,
        ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM cases), 2) as percentage
      FROM cases 
      GROUP BY status
      ORDER BY FIELD(status, 'pending', 'in_progress', 'resolved', 'rejected')
    `);

    const [caseLocations] = await pool.query(`
      SELECT 
        location, 
        COUNT(*) as count
      FROM cases 
      GROUP BY location 
      ORDER BY count DESC 
      LIMIT 10
    `);

    const [monthlyTrends] = await pool.query(`
      SELECT 
        DATE_FORMAT(created_at, '%Y-%m') as month,
        COUNT(*) as count
      FROM cases
      GROUP BY month
      ORDER BY month
      LIMIT 12
    `);

    res.status(200).json({
      status: "success",
      data: {
        caseTypes,
        caseStatuses,
        caseLocations,
        monthlyTrends,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Failed to generate report" });
  }
};

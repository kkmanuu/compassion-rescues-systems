const pool = require('../config/db');

class Report {
    static async create(title, description, data) {
      const [result] = await pool.query(
        'INSERT INTO reports (title, description, data, created_at) VALUES (?, ?, ?, NOW())',
        [title, description, JSON.stringify(data)]
      );
      return result.insertId;
    }
  
    static async findAll() {
      const [rows] = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
      return rows;
    }
  
    static async findById(id) {
      const [rows] = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);
      return rows[0];
    }
  }
  
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
  
      const reportData = { caseTypes, caseStatuses, caseLocations, monthlyTrends, generatedAt: new Date().toISOString() };
      const reportId = await Report.create('Case Statistics Report', 'A detailed report on case statistics', reportData);
  
      res.status(200).json({
        status: 'success',
        data: { reportId, ...reportData }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ status: 'error', message: 'Failed to generate report' });
    }
  };
  
  module.exports = { Case, Report };
  
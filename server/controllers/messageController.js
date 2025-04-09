const pool = require("../config/db");

exports.getCaseMessages = async (req, res) => {
  try {
    const { caseId } = req.params;

    const [messages] = await pool.query(
      "SELECT * FROM messages WHERE case_id = ? ORDER BY created_at ASC",
      [caseId]
    );

    res.status(200).json({
      status: "success",
      results: messages.length,
      data: { messages },
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Failed to fetch messages" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { caseId, senderType, message } = req.body;
    const userId = req.user.id;

    if (!caseId || !message) {
      return res
        .status(400)
        .json({
          status: "fail",
          message: "Please provide case ID and message content",
        });
    }

    const [result] = await pool.query(
      "INSERT INTO messages (case_id, user_id, sender_type, message) VALUES (?, ?, ?, ?)",
      [caseId, userId, senderType || "admin", message]
    );

    res
      .status(201)
      .json({ status: "success", data: { messageId: result.insertId } });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ status: "error", message: "Failed to send message" });
  }
};

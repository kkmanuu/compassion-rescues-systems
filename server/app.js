require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const socketIo = require('socket.io');

const authRoutes = require('./routes/authRoutes');
const caseRoutes = require('./routes/caseRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const messageRoutes = require('./routes/messageRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = require('./config/db');
pool.getConnection()
  .then(conn => {
    console.log('✅ MySQL Database Connected');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database Connection Failed:', err.message);
  });

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  socket.on('join_case', (caseId) => {
    socket.join(`case_${caseId}`);
    console.log(`👥 User joined case room: case_${caseId}`);
  });
  socket.on('send_message', async (data) => {
    try {
      const { caseId, senderType, message } = data;
      const [result] = await pool.query(
        'INSERT INTO messages (case_id, sender_type, message) VALUES (?, ?, ?)',
        [caseId, senderType, message]
      );
      io.to(`case_${caseId}`).emit('receive_message', {
        id: result.insertId,
        case_id: caseId,
        sender_type: senderType,
        message: message,
        created_at: new Date()
      });
    } catch (err) {
      console.error('💥 Socket message error:', err);
    }
  });
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
// app.use('/cases', caseRoutes); 
app.use('/api/messages', messageRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date(),
    database: pool.pool.config.connectionConfig.database
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error('🔥 Server Error:', err.stack);
  res.status(500).json({ 
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
  🚀 Server running in ${process.env.NODE_ENV || 'development'} mode
  📡 Listening on port ${PORT}
  🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
  `);
});
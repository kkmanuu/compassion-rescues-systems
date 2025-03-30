import { useState, useEffect, useContext } from 'react';
import AuthContext from '../../context/AuthContext';

function ChatWindow({ caseId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const { socket, user } = useContext(AuthContext);

  useEffect(() => {
    socket.emit('join_case', caseId);
    
    socket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [caseId, socket]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('send_message', {
        caseId,
        senderType: user.role,
        message: newMessage
      });
      setNewMessage('');
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.senderType}`}>
            {msg.message}
          </div>
        ))}
      </div>
      <div className="message-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default ChatWindow;
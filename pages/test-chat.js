import { useState } from 'react';

export default function TestChat() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setChatHistory(prev => [...prev, userMessage]);
    
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'test-user-123',
          message: message
        })
      });
      
      const data = await res.json();
      
      // Add assistant response to chat
      const assistantMessage = { 
        role: 'assistant', 
        content: data.message || data.error || 'No response received'
      };
      setChatHistory(prev => [...prev, assistantMessage]);
      
      // Clear input
      setMessage('');
    } catch (error) {
      const errorMessage = { 
        role: 'error', 
        content: 'Error: ' + error.message 
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
    
    setLoading(false);
  };

  const clearChat = () => {
    setChatHistory([]);
    setMessage('');
  };

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h1 style={{ margin: 0 }}>🤖 AI Assistant Test</h1>
        <button 
          onClick={clearChat}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Clear Chat
        </button>
      </div>

      <div style={{
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        minHeight: '400px',
        maxHeight: '500px',
        overflowY: 'auto',
        marginBottom: '20px'
      }}>
        {chatHistory.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#999', 
            marginTop: '100px' 
          }}>
            <p>Start a conversation! Try asking:</p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li>• "What is your name?"</li>
              <li>• "What is your phone number?"</li>
              <li>• "Tell me about your experience"</li>
              <li>• "What skills do you have?"</li>
            </ul>
          </div>
        ) : (
          chatHistory.map((msg, index) => (
            <div 
              key={index}
              style={{
                marginBottom: '15px',
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? '#e3f2fd' : 
                                msg.role === 'error' ? '#ffebee' : '#fff',
                border: msg.role === 'assistant' ? '1px solid #ddd' : 'none',
                marginLeft: msg.role === 'user' ? '50px' : '0',
                marginRight: msg.role === 'user' ? '0' : '50px'
              }}
            >
              <div style={{ 
                fontWeight: 'bold', 
                marginBottom: '5px',
                color: msg.role === 'user' ? '#1976d2' : 
                       msg.role === 'error' ? '#d32f2f' : '#388e3c'
              }}>
                {msg.role === 'user' ? '👤 You' : 
                 msg.role === 'error' ? '⚠️ Error' : '🤖 Achraf'}
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Type your message here..."
          disabled={loading}
          style={{
            flex: 1,
            padding: '12px',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            outline: 'none'
          }}
        />
        <button 
          onClick={sendMessage} 
          disabled={loading || !message.trim()}
          style={{
            padding: '12px 30px',
            fontSize: '16px',
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 'bold'
          }}
        >
          {loading ? '⏳ Sending...' : '📤 Send'}
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd',
        borderRadius: '5px',
        fontSize: '14px'
      }}>
        <strong>💡 Note:</strong> Make sure your <code>.env</code> file has <code>OPENROUTER_API_KEY</code> set correctly.
      </div>
    </div>
  );
}

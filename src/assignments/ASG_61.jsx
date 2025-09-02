import BackToHome from "../component/BackToHome";
import "../assignments/ASG_61.css";
import { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";

export default function ASG_61() {

  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState("");
  const [isHovered, setIsHovered] = useState(false);

  // connect to the server (wss)

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:3080');

    socket.onopen = () => {
      console.log("Connected to the server");
      setSocket(socket);
    }

    socket.onmessage = (event) => {
      console.log("Received a message from the server")

      // check if event.data is a Blob and convert it to text
      if (event.data instanceof Blob) {
        const reader = new FileReader()
        reader.onload = () => {
          const text = reader.result.toString();
          const time = new Date().toLocaleTimeString();

          setMessages((prevMessage) => [...prevMessage, { text, type: 'received', time }])
        }
        reader.readAsText(event.data)
      } else if (typeof event.data === "string") {
        const time = new Date().toLocaleTimeString();
        setMessages((prevMessage) => [...prevMessage, { text: event.data, type: 'received', time }])
      }
    }
    socket.onclose = () => {
      console.log("Disconnect from the server")
      setSocket(null)
    }

    socket.onerror = (error) => {
      if (socket.readyState !== WebSocket.CLOSED) {
        console.error('WebSocket error:', error);
      }
      socket.close();
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    }
  }, [])

  const sendMessage = () => {
    if (socket && userMessage.trim()) {
      const time = new Date().toLocaleTimeString();
      socket.send(userMessage);
      setMessages((prev) => [...prev, { text: userMessage, type: 'sent', time }]);
      setUserMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  if (!socket) {
    return (
      <div>
        <p>Connecting to the WS Server...</p>
      </div>
    )
  }

  return (
    <div className="asg61">
      <BackToHome />
      <h1 className="assignment-title">Assignment-61</h1>
      <hr />
      <br />

      <Container className="chat-container" style={{ backgroundImage: 'url(/asg61/chat_asg61.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="chat-header">Chat Room</div>
        <Row>
          <Col>
            <div className="chat-messages">
              {messages.slice().reverse().map((msg, index) => (
                <div key={index} className={`message-bubble ${msg.type}`}>
                  <div className="message-text">{msg.text}</div>
                  <div className="message-time">{msg.time}</div>
                </div>
              ))}
            </div>
            <Form className="chat-input-form">
              <div className="input-container">
                <Form.Control
                  as="textarea"
                  placeholder="Type your message..."
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="message-input"
                  rows={1}
                  style={{ resize: 'vertical', minHeight: '40px', maxHeight: '120px' }}
                />
                {userMessage.trim() && (
                  <div className="circle-button" onClick={sendMessage} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ background: isHovered ? 'linear-gradient(135deg, #218838 0%, #155724 100%)' : 'linear-gradient(135deg, #28a745 0%, #1e7e34 100%)' }}>
                    <div className="send-image" style={{ backgroundImage: 'url(/asg61/send.png)', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}></div>
                  </div>
                )}
              </div>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

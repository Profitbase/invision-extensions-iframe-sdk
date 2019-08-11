# invision-extensions-iframe-sdk

## Installation

Using npm:
```
npm i invision-extensions-iframe-sdk
```

## Example
1) Import invision from 'invision-extensions-iframe-sdk'
2) Call invision.sendMessage(...);
``` TSX
import React, { useState, useEffect } from 'react';
import invision from 'invision-extensions-iframe-sdk';

const App: React.FC = () => {

  const [message, setMessage] = useState();
  const [receivedMessage, setReceivedMessage] = useState();

  const onMessageReceived = (evt: MessageEvent) => {
    setReceivedMessage(evt.data);
  }

  useEffect(() => {
    window.addEventListener('message', onMessageReceived);
    return () => window.removeEventListener('message', onMessageReceived);
  });

  const sendMessage = () => {
    invision.sendMessage({
      message: message
    });
  }

  return (
    <div style={{border: '1px solid gainsboro', padding:10}}>
      <p style={{fontWeight:'bold'}}>
        This is our iframe extension
      </p>
      <div>
        <p>We received:</p>
        <span>{receivedMessage}</span>
      </div>
      <p>
        Type a message and press 'Send Message'
        </p>
      <input onChange={e => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}

export default App;
```
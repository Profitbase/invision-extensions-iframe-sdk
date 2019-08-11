# invision-extensions-iframe-sdk

## Installation

Using npm:
```
npm i invision-extensions-iframe-sdk
```

Using yarn:
```
yarn add invision-extensions-iframe-sdk
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
  
  // Receives the message sent from the Workbook.
  // We recommend that you always check the event origin and message format to ensure that you
  // are are not processing malicious data.
  const onMessageReceived = (evt: MessageEvent) => {
    setReceivedMessage(evt.data);
  }

  useEffect(() => {
    // The (Workbook) iframe component that hosts this app will send messages using the window.postMessage() API,
    // so we need to set up a listener to receive messages.
    // Note! We do not provide an API for receiving messages through window.postMessage(), 
    // because that may trip up features of you app if you are using window messaging elsewhere.
    window.addEventListener('message', onMessageReceived);
    return () => window.removeEventListener('message', onMessageReceived);
  });

  const sendMessage = () => {
    // Use invision.sendMessage(...) to send a message to the iframe Workbook component
    // that hosts this app, so that it can be handled by the Workbook business logic.
    // Using this API ensures that the message is sent to the correct receiver.
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
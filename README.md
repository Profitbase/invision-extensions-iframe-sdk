# invision-iframe-api

## Installation

Using npm:
```
npm i invision-extensions-iframe-sdk
```

## Example
1) Import invision from 'invision-extensions-iframe-sdk'
2) Call invision.sendMessage(...);
``` TSX
import React, { useState } from 'react';
import './App.css';
import invision from 'invision-extensions-iframe-sdk';

const App: React.FC = () => {

  const [message, setMessage] = useState();

  const sendMessage = () =>{    
    invision.sendMessage({
      message: message
    })
  }

  return (
    <>     
       <p>
         Type a message and press 'Send Message'
       </p>
       <input onChange={e => setMessage(e.target.value)}/>
       <button onClick={sendMessage}>Send Message</button>      
    </>
  );
}

export default App;
```
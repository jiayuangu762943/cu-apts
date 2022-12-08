import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';
// import { colors } from '../colors';
import axios from 'axios';

type Props = {
  senderName: string;
  receiverName: string;
};

const ChatInput = ({ senderName, receiverName }: Props) => {
  const [msgText, setMsgText] = useState('');
  // const socket = io();

  const handleSend = async () => {
    // createAuthHeaders(token)
    let msg = {
      sender: senderName,
      receiver: receiverName,
      message: msgText,
    };
    const res = await axios.post('/send', msg);
    if (res.status !== 201) {
      throw new Error('Failed to send message');
    }
  };

  return (
    <div className="chat-input-container">
      <TextField
        id="outlined-basic"
        label="Outlined"
        variant="outlined"
        multiline={true}
        onChange={(event) => {
          const value = event.target.value;
          if (value !== '' || value !== null) {
            setMsgText(value);
          }
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            handleSend();
            setMsgText('');
          }
        }}
      />
      <Button
        color="primary"
        variant="contained"
        disableElevation
        onClick={() => {
          handleSend();
          setMsgText('');
        }}
      >
        Send
      </Button>
    </div>
  );
};
export default ChatInput;

import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Container, Typography, makeStyles, TextField } from '@material-ui/core';
// import { colors } from '../colors';
import { IoSend } from 'react-icons/io5';
import axios from 'axios';

// type Props = {
//   handleSend: (event: React.SyntheticEvent) => void; //suspicious
// };
const handleSend = async (msg: String) => {
  // createAuthHeaders(token)
  const res = await axios.post('/send-msg', msg);
  if (res.status !== 201) {
    throw new Error('Failed to send message');
  }
};
const ChatInput = () => (
  <div className="chat-input-container">
    <TextField
      id="outlined-basic"
      label="Outlined"
      variant="outlined"
      multiline={true}
      onChange={(event) => {
        const value = event.target.value;
        if (value !== '' || value !== null) {
          handleSend(value);
        }
      }}
    />
    <IoSend />
    {/*  onClick={handleSend}  */}
  </div>
);
export default ChatInput;

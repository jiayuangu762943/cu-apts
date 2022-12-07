import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
type Props = {
  message: string;
  profilePic: string;
};
const ChatReceive = ({ message, profilePic }: Props) => {
  return (
    <>
      <div className="chat-receive-text">
        <Avatar src={profilePic} />
        <div className="chat-bubble-container ">
          <div className="chat-bubble sm">{message}</div>
        </div>
      </div>
    </>
  );
};

export default ChatReceive;

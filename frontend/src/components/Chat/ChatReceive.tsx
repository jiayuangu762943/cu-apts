import React from 'react';
import { Avatar } from '@material-ui/core';
type Props = {
  message: string;
  profilePic: string;
  name: string;
};
const ChatReceive = ({ message, name, profilePic }: Props) => {
  return (
    <>
      <div className="chat-box">
        <div className="chat-left">
          <Avatar src={profilePic} /> {name}
        </div>
        <div className="chat-right ">
          <div className="chat-bubble sm">{message}</div>
        </div>
      </div>
    </>
  );
};

export default ChatReceive;

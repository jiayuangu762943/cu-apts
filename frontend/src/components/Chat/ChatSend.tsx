import React, { useEffect, useState } from 'react';

type Props = {
  message: string;
};

const ChatSend = ({ message }: Props) => {
  return (
    <>
      <div className="chat-send-text">
        <div className="chat-bubble-container ">
          <div className="chat-bubble sm">{message}</div>
        </div>
      </div>
    </>
  );
};

export default ChatSend;

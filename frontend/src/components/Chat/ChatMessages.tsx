import React, { useEffect, useState } from 'react';
import ChatReceive from './ChatReceive';
import chatClient from './client';
import { Button } from '@material-ui/core';

type Message = {
  message: string;
  sender: string;
  receiver: string;
};
type Props = {
  senderProfilePic: string;
  senderName: string;
  receiverProfilePic: string;
  receiverName: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  // setReceiverName:React.Dispatch<React.SetStateAction<number>>;
};

const ChatMessages = ({
  senderProfilePic,
  senderName,
  receiverProfilePic,
  receiverName,
  messages,
  setMessages,
}: // setReceiverName,
Props) => {
  const [add, setAdd] = useState<Message[]>([]);
  useEffect(() => {
    chatClient.startRealtimeNotifications().then(() => {
      // subscribe to new notification
      chatClient.on('chatMessageReceived', (e) => {
        const msgArr = e.message.split(',');
        const msgObj = {
          message: msgArr[0],
          sender: msgArr[1],
          receiver: msgArr[2],
        };
        setAdd([...add, msgObj]);
        // your code here
      });
    });
  }, [add]);

  // .concat(add)
  const formated_msgs = messages.map((m: Message, i: number) =>
    // console.log(m.sender == senderName.split(' ').join('_')),
    m.sender === senderName.split(' ').join('_') || m.sender === senderName ? (
      <div key={i}>
        <ChatReceive message={m.message} name={senderName} profilePic={senderProfilePic} />
      </div>
    ) : (
      <div key={i}>
        <ChatReceive message={m.message} name={receiverName} profilePic={receiverProfilePic} />
      </div>
    )
  );

  return (
    <div className="chat-messages">
      {!messages ? null : formated_msgs}
      <div style={{ float: 'left', clear: 'both' }}></div>
      <Button
        color="secondary"
        variant="contained"
        disableElevation
        onClick={() => {
          setMessages([...messages, ...add]);
        }}
      >
        Refresh
      </Button>
    </div>
  );
};

export default ChatMessages;

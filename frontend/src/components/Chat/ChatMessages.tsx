import React, { useEffect, useState } from 'react';
import ChatReceive from './ChatReceive';
import ChatSend from './ChatSend';
import { get } from '../../utils/call';
import { LinearProgress } from '@material-ui/core';
import { io } from 'socket.io-client';
import consumerStream from './consumer';
import chatClient from './client';
interface ConsumerMessage {
  value: Buffer;
  size: number;
  topic: string;
  offset: number;
  partition: number;
  key: string;
  timestamp: Date;
}

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
  const senderNameNoSpace = senderName.split(' ').join('_');
  const receiverNameNoSpace = receiverName.split(' ').join('_');
  const [add, setAdd] = useState<Message[]>([]);
  useEffect(() => {
    console.log(`messages:`);
    console.log(messages);
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
      // const messages = chatClient.listMessages();
      // your code here
    });
  }, []);
  useEffect(() => {
    setMessages([...messages, ...add]);
  }, [add]);
  // consumerStream.on('data', (message: ConsumerMessage) => {
  //   const msg = message.value.toString();
  //   const msgLst = msg.split(',');
  //   const msgObj: Message = {
  //     message: msg[0],
  //     sender: msg[1],
  //     receiver: msg[2],
  //   };
  //   if (msgLst[1] === senderName && msgLst[2] === receiverName) {
  //     setMessages([...messages, msgObj]);
  //   }
  // });
  // let senderIdentityResponse = await identityClient.createUser();
  // const senderCommId = senderIdentityResponse.communicationUserId;
  // let receiverIdentityResponse = await identityClient.createUser();
  // const receiverCommId = receiverIdentityResponse.communicationUserId;
  // const createChatThreadRequest = {
  //   topic: `${req.body.sender},${req.body.receiver}`,
  // };
  // const createChatThreadOptions = {
  //   participants: [
  //     {
  //       id: { communicationUserId: senderCommId },
  //       displayName: req.body.sender,
  //     },
  //     {
  //       id: { communicationUserId: receiverCommId },
  //       displayName: req.body.receiver,
  //     },
  //   ],
  // };
  // const createChatThreadResult = await chatClient.createChatThread(
  //   createChatThreadRequest,
  //   createChatThreadOptions
  // );
  // const threadId = createChatThreadResult.chatThread!.id;
  // let chatThreadClient = chatClient.getChatThreadClient(threadId);
  // const msgs = chatThreadClient.listMessages();
  const formated_msgs = messages.map((m: Message, i: number) =>
    m.sender === senderName ? (
      <div key={i}>
        <ChatSend message={m.message} />
      </div>
    ) : (
      <div key={i}>
        <ChatReceive message={m.message} profilePic={receiverProfilePic} />
      </div>
    )
  );

  return (
    <div className="chat-messages">
      {!messages ? null : formated_msgs}
      <div style={{ float: 'left', clear: 'both' }}></div>
    </div>
  );
};

export default ChatMessages;

import React, { ReactElement, useState, useEffect } from 'react';
import { Box, Container, Typography, makeStyles } from '@material-ui/core';
import { get } from '../utils/call';
import styles from './ChatRoomPage.module.scss';
import { colors } from '../colors';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatContacts from '../components/Chat/ChatContacts';
import ChatInput from '../components/Chat/ChatInput';
import LinearProgress from '../components/utils/LinearProgress';
import { createAuthHeaders, subscribeLikes, getUser } from '../utils/firebase';
import Toast from '../components/LeaveReview/Toast';
import axios from 'axios';

const SOCKET_URL = 'http://localhost:8080/chat/';
type Contact = {
  name: string;
  profilePic: string;
};

const ChatRoomPage = (): ReactElement => {
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([
    { name: 'melinda', profilePic: '' },
    { name: 'ken_birman', profilePic: '' },
  ]);
  const [user, setUser] = useState<any>(null);
  type Message = {
    message: string;
    sender: string;
    receiver: string;
  };
  const toastTime = 4750;
  const [selected, setSelected] = useState<number>(-1);
  const [messages, setMessages] = useState<Message[]>([]);

  const showToast = (setState: (value: React.SetStateAction<boolean>) => void) => {
    setState(true);
    setTimeout(() => {
      setState(false);
    }, toastTime);
  };
  const [showSignInError, setShowSignInError] = useState(false);
  const showSignInErrorToast = () => {
    showToast(setShowSignInError);
  };

  useEffect(() => {
    (async () => {
      if (!user) {
        let user = await getUser(true);
        setUser(user);
        if (!user) {
          showSignInErrorToast();
          return;
        }
      }
    })();
    get<Contact[]>(`/getContacts/${senderNameNoSpace}`, {
      callback: setContacts,
    });
  }, []);
  const senderName = user?.displayName == null ? '' : user?.displayName;
  const receiverName = selected === -1 ? '' : contacts[selected].name;
  console.log(receiverName);
  const senderNameNoSpace = senderName.split(' ').join('_');
  const receiverNameNoSpace = receiverName.split(' ').join('_');
  useEffect(() => {
    if (receiverName !== '') {
      get<Message[]>(`/getMsgs/${senderNameNoSpace}/${receiverNameNoSpace}`, {
        callback: setMessages,
      });
    }
  }, [receiverNameNoSpace]);

  console.log('contacts');
  console.log(contacts);
  // console.log(user?.displayName);
  return (
    <section className={styles.chatBox}>
      <div className={styles.chatLeft}>
        {loading ? (
          <LinearProgress />
        ) : (
          <ChatContacts setSelected={setSelected} contacts={contacts} />
        )}
      </div>
      <div className={styles.chatRight}>
        <ChatHeader
          receiverProfilePic={selected === -1 ? '' : contacts[selected].profilePic}
          // setSelectedChat={setSelectedChat}
          receiverName={receiverName}
        />
        <ChatMessages
          senderProfilePic={user?.photoURL == null ? '' : user?.photoURL}
          senderName={senderName}
          receiverProfilePic={selected === -1 ? '' : contacts[selected].profilePic}
          receiverName={receiverName}
          messages={messages}
          setMessages={setMessages}
        />
        <ChatInput senderName={senderName} receiverName={receiverName} />
      </div>
    </section>
  );
};
export default ChatRoomPage;

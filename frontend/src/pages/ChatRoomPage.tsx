import React, { ReactElement, useState, useEffect } from 'react';
import { get } from '../utils/call';
import styles from './ChatRoomPage.module.scss';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatContacts from '../components/Chat/ChatContacts';
import ChatInput from '../components/Chat/ChatInput';
import LinearProgress from '../components/utils/LinearProgress';
import { getUser } from '../utils/firebase';
import Toast from '../components/LeaveReview/Toast';

type Contact = {
  name: string;
  profilePic: string;
};

const ChatRoomPage = (): ReactElement => {
  const [loading, setLoading] = useState(true);
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

  const [showSignInError, setShowSignInError] = useState(false);

  let senderName = user?.displayName == null ? '' : user?.displayName;
  let senderNameNoSpace = senderName.split(' ').join('_');
  useEffect(() => {
    const showToast = (setState: (value: React.SetStateAction<boolean>) => void) => {
      setState(true);
      setTimeout(() => {
        setState(false);
      }, toastTime);
    };
    const showSignInErrorToast = () => {
      showToast(setShowSignInError);
    };
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
  }, [user]);

  useEffect(() => {
    if (senderNameNoSpace !== '') {
      get<Contact[]>(`/getContacts/${senderNameNoSpace}`, {
        callback: setContacts,
      });
      setLoading(false);
    }
    // get<Contact[]>(`/getContacts/${senderNameNoSpace}`, {
    //   callback: setContacts,
    // });
    // setLoading(false);
  }, [senderNameNoSpace]);

  // const receiverName = selected === -1 ? '' : contacts[selected].name;
  let receiverName = selected === -1 ? '' : String(contacts[selected]);

  // const receiverNameNoSpace = receiverName.split(' ').join('_');
  useEffect(() => {
    if (receiverName !== '' && receiverName !== undefined) {
      const receiverNameNoSpace = receiverName.split(' ').join('_');
      get<Message[]>(`/getMsgs/${senderNameNoSpace}/${receiverNameNoSpace}`, {
        callback: setMessages,
      });
    }
  }, [receiverName, senderNameNoSpace]);

  // console.log(user?.displayName);
  return (
    <section className={styles.chatBox}>
      {showSignInError && (
        <Toast
          isOpen={showSignInError}
          severity="error"
          message="Error: Please sign in with a Cornell email."
          time={toastTime}
        />
      )}
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

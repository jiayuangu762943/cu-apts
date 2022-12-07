import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

// Your unique Azure Communication service endpoint
let endpointUrl = 'https://azure-chat-app.communication.azure.com/';
// The user access token generated as part of the pre-requisites
let userAccessToken =
  'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjFkOWRjNmVmLTNiYmEtNDRmMy1hZjg0LTU0ODYzYmZhYzgxOV8wMDAwMDAxNS04YWI3LTM3ZmYtYjRmMS05YzNhMGQwMGJkNzUiLCJzY3AiOjE3OTIsImNzaSI6IjE2NzAzODcxNzYiLCJleHAiOjE2NzA0NzM1NzYsImFjc1Njb3BlIjoiY2hhdCIsInJlc291cmNlSWQiOiIxZDlkYzZlZi0zYmJhLTQ0ZjMtYWY4NC01NDg2M2JmYWM4MTkiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNjcwMzg3MTc2fQ.d0qpS0KHdEmXU90SEuEAct9HYrUmk79TXKAJ-W1EvB4OnyHF25AShipCSEloi-sE2ZzPu3Wmxiu89XsgQd52UMbS8X8jkBix4Km1nPHruJMhnH15ngZYRUn9vDF983mWIcBd700NFcc5uMmJ62SWaB-WdlvJDM1xtf1YmGGt8OAQHz3bofGi0-ZNX1rOd0zxEykvkXFxg0ydU0YmeqDO6fR1PEwytuZBB1q-c5gC4sRfIQZcEZ9FcTVsnNj2Eor7Inyw5IAz7WZY9UEQSPlscVUrpXDzAmXUUO_1YqvJAr5Qy4fiVfWWsWm3rqTsgA9UOS6D4Thi7qLad5XuhEEoIg';

let chatClient = new ChatClient(
  endpointUrl,
  new AzureCommunicationTokenCredential(userAccessToken)
);
console.log('Azure Communication Chat client created!');

// async function createChatThread() {

//   let senderIdentityResponse = await chatClient.createUser();
//   const senderCommId = senderIdentityResponse.communicationUserId;
//   let receiverIdentityResponse = await chatClient.createUser();
//   const receiverCommId = receiverIdentityResponse.communicationUserId;
//   const createChatThreadOptions = {
//       participants: [
//           {
//               id: { communicationUserId: '<USER_ID>' },
//               displayName: '<USER_DISPLAY_NAME>'
//           }
//       ]
//   };
//   const createChatThreadResult = await chatClient.createChatThread(
//       createChatThreadRequest,
//       createChatThreadOptions
//   );
//   const threadId = createChatThreadResult.chatThread.id;
//   return threadId;
// }

// createChatThread().then(async threadId => {
//   console.log(`Thread created:${threadId}`);

//   // <Get a chat thread client>
//   let chatThreadClient = chatClient.getChatThreadClient(threadId);
//   console.log(`Chat Thread client for threadId:${threadId}`);

//   // <List all chat threads>
//   const threads = chatClient.listChatThreads();
//   for await (const thread of threads) {
//       console.log(`Chat Thread item:${thread.id}`);
//   }

//   // <Receive chat messages from a chat thread>
//   chatClient.startRealtimeNotifications();
//   chatClient.on("chatMessageReceived", async (e) => {
//       console.log("Notification chatMessageReceived!");
//   });

//   // <Send a message to a chat thread>
//   const sendMessageRequest =
//   {
//       content: 'Hello Geeta! Can you share the deck for the conference?'
//   };
//   let sendMessageOptions =
//   {
//       senderDisplayName: 'Jack',
//       type: 'text'
//   };

//   const sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
//   const messageId = sendChatMessageResult.id;

//   // <LIST MESSAGES IN A CHAT THREAD>
//   const messages = chatThreadClient.listMessages();
//   for await (const message of messages) {
//       console.log(`Chat Thread message id:${message.id}`);
//   }

export default chatClient;

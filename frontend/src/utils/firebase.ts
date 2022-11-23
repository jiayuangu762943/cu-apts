import firebase from 'firebase';
import { config } from 'dotenv';
import { AxiosRequestConfig } from 'axios';
import { Likes } from '../../../common/types/db-types';
// import { v4 as uuid } from 'uuid';
import { BlobServiceClient, BlockBlobClient, ContainerClient } from '@azure/storage-blob';

config();
const sasToken =
  'sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2023-11-22T08:01:02Z&st=2022-11-21T20:01:02Z&spr=https&sig=Oiowv9nzGjharitqzX%2BBcuII8pMdjbEnxN3r2lQeass%3D';
const containerName = `img`;
const storageAccountName = 'cuaptblob';

const firebaseConfig = {
  apiKey: 'AIzaSyBmx_WKvFWwpxs1QmV7ZJN5Hux2HsUIPds',
  authDomain: 'cuapts-2bdbb.firebaseapp.com',
  projectId: 'cuapts-2bdbb',
  // storageBucket: 'cuapts-68201.appspot.com',
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const blobService = new BlobServiceClient(
  `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
);

const containerClient = blobService.getContainerClient(containerName);

const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account',
});

const getUser = async (promptSignIn = false) => {
  if (!auth.currentUser && promptSignIn) {
    await auth.signInWithPopup(provider);
  }
  const user = auth.currentUser;
  if (user?.email?.endsWith('@cornell.edu')) {
    return user;
  }
  await auth.signOut();
  return null;
};

const createAuthHeaders = (token: string): AxiosRequestConfig => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const subscribeLikes = (callback: (data: Likes) => void) => {
  return auth.onAuthStateChanged(async (user) => {
    if (!user) return;
    const doc = await firestore.collection('likes').doc(user.uid).get();
    const data = doc.data();
    console.log(data);
    if (!data) return;
    callback(data);
  });
};

const createBlobInContainer = async (containerClient: ContainerClient, file: File) => {
  // create blobClient for container
  const blobClient = containerClient.getBlockBlobClient(file.name);

  // set mimetype as determined from browser with file upload control
  const options = { blobHTTPHeaders: { blobContentType: file.type } };

  // upload file
  await blobClient.uploadData(file, options);
  return blobClient.url;
};
// return list of blobs in container to display
const getBlobsInContainer = async (containerClient: ContainerClient) => {
  const returnedBlobUrls: string[] = [];

  // get list of blobs in container
  for await (const blob of containerClient.listBlobsFlat()) {
    returnedBlobUrls.push(
      `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
    );
  }

  return returnedBlobUrls;
};

const uploadFile = async (file: File) => {
  // const storageRef = storage.ref();
  // const result = await storageRef.child(uuid()).put(file);
  return await createBlobInContainer(containerClient, file);
  // return getBlobsInContainer(containerClient);
  // return await result.ref.getDownloadURL();
};

export { createAuthHeaders, getUser, uploadFile, subscribeLikes };

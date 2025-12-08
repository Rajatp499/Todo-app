import { Client, Account, Databases} from 'appwrite';
// import { Client, Account, Databases} from 'react-native-appwrite';

export const client = new Client();

client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
  // .setPlatform(import.meta.env.VITE_APPWRITE_PLATFORM)
  ;

export const account = new Account(client);
export const databases = new Databases(client)
export { ID } from 'appwrite';
// export { ID } from 'react-native-appwrite';

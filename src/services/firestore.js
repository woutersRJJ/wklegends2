import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

//this is executed when this file is imported
const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID
};
console.log({firebaseConfig});

// if already initialized, use that one
if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export const firestoreDatabase = firebaseConfig.projectId && firebase.firestore();
if (firestoreDatabase)
    console.log(`connection to database is ok`);
else
    console.log(`ERROR: no connection to database`);

export async function getCollection(collection) {
    if (!firestoreDatabase) return [];
    const result = await firestoreDatabase.collection(collection).orderBy("name", "asc").get();
    if (result.empty) return [];

    // De id (AUTO-ID) zit niet in doc.data maar in doc.id apart dus
    // Deze heb je nodig voor CRUDS UPDATE en DELETE, niet ADD
    return result.docs.map(doc => ({...doc.data(), id: doc.id}));
}

export async function update(player){
    if (!firestoreDatabase) return;
    console.log(player)

    const doc=firestoreDatabase.collection('legends').doc(player.id);
    await doc.update(player)
}


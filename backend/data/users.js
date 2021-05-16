const passwordHash = require("password-hash");

//connect to firebase
const firebaseConnections = require("../config/firebaseConnections");
const db = firebaseConnections.initializeCloudFirebase();
 
module.exports = {
    /* gets all documents in users */
    async getAllUsers() {
      const snapshot = await db.collection('users').get();
      let arr = [];
      snapshot.forEach(doc => {
        arr.push(doc.data());
      });
      return arr;
    },
    
  /*  gets individual user */
    async getUser(username) {
        const userRef = db.collection('users').doc(username);
        const doc = await userRef.get();
        if (!doc.exists) {
          throw "User does not exist";
        } else {
          return doc.data();
        }
    },
    
    /* adds user */
  async addUser(username, userID) {
      //check if user exists
      const userRef = db.collection('users').doc(username);
      const doc = await userRef.get();
      if (doc.exists) {
        throw "User already exists";
      }

      let newUser = {
        username: username,
        userID: userID,
        favorites: []
      };

      const res = await db.collection('users').doc(username).set(newUser);
      return this.getUser(username);
    },

  checkUsername: async (username) => {
      const userRef = db.collection('users').doc(username);
      const doc = await userRef.get();
      if (doc.exists) {
        return true;
      }
      return false;
    }
};
    
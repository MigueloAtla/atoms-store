const functions = require('firebase-functions')

const admin = require('firebase-admin')
const cors = require('cors');

admin.initializeApp()

exports.addAdminRole = functions.https.onCall(data => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        admin: true
      })
    })
    .then(() => {
      return {
        message: `Success! ${data.email} has been made an admin`
      }
    })
    .catch(err => {
      return err
    })
})

exports.getAllUsers = functions.https.onRequest((req, res) => {
  cors()(req, res, () => {
    const maxResults = 1; // optional arg.
    return admin.auth().listUsers(maxResults).then((userRecords) => {
      const users = userRecords.users.map((user) => user);
      console.log(users)
      res.send({data: users})
    }).catch((error) => console.log(error));
  });

})

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

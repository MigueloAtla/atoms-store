const functions = require('firebase-functions')

const admin = require('firebase-admin')
const cors = require('cors');

// const loadStripe= require( "@stripe/stripe-js").loadStripe
const Stripe = require('stripe')
const stripe = Stripe('sk_test_Oz5IrBn2NyuVl50BBg2mxjuV')

admin.initializeApp()

exports.addAdminRole = functions.https.onCall(data => {
  return admin
    .auth()
    .getUserByEmail(data.email)
    .then(user => {
      return admin.auth().setCustomUserClaims(user.uid, {
        role: 'admin'
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
    const maxResults = 1000; // optional arg.
    return admin.auth().listUsers(maxResults).then((userRecords) => {
      const users = userRecords.users.map((user) => user)
      res.send({data: users})
    }).catch((error) => console.log(error));
  })
})

exports.retrievePaymentIntent = functions.https.onRequest((req, res) => {
  cors()(req, res, () => {
    return stripe.paymentIntents.list({
      limit: 15
    }).then(data => {
      res.send({data})
    }).catch((error) => {console.log(error)})
  })
})

// exports.updateUser = functions.https.onCall(data => {
//   return admin
//     .auth()
//     .getUserByEmail(data.email)
//     .then(userRecord => {
//       console.log(data.newdata.role)
//       if(data.newdata.role !== '' || data.newdata.role !== undefined) {
//         return admin.auth().setCustomUserClaims(userRecord.uid, {
//             role: data.newdata.role
//         }).then(() => {
//           if(data.newdata.photoURL !== '') { 
//             return admin.auth()
//               .updateUser(userRecord.uid, {
//                 displayName: data.newdata.displayName, 
//                 photoURL: data.newdata.photoURL
//             }).then((result) => {
//               return result
//             })
//           }
//           else {
//             return admin.auth() 
//               .updateUser(userRecord.uid, {
//                 displayName: data.newdata.displayName
//               }).then((result) => {
//                 return result
//               })
//           }
//         })
//       }
//     })
//     .catch((error) => console.log(error.message))
//   })

  exports.updateUserCustomClaimsRole = functions.https.onCall(data => {
    return admin
      .auth()
      .getUserByEmail(data.email)
      .then(userRecord => {
        console.log(data.role)
          return admin.auth().setCustomUserClaims(userRecord.uid, {
              role: data.role
          }).then(() => {
            console.log('custom claim set to ', data.role)
          }).catch((error) => {
            console.log(error.message)
          })
      })
      .catch((error) => console.log(error.message))
    })
  

exports.createUser = functions.firestore
  .document('/users/{documentId}')
  .onCreate(async (snapshot, context) => {
    const userId = context.params.documentId;
    const photoURL = snapshot.get('photoURL') || ''
    console.log(photoURL)
    let newUser
    if(photoURL === '') {
      newUser = await admin.auth().createUser({
        email: snapshot.get('email'),
        password: snapshot.get('password'),
        displayName: snapshot.get('displayName')
      })
    }
    else await admin.auth().createUser({
      email: snapshot.get('email'),
      password: snapshot.get('password'),
      displayName: snapshot.get('displayName'),
      photoURL
    })
    admin.auth().setCustomUserClaims(newUser.uid, {
      role: snapshot.get('role')
    })
    admin.firestore().collection('users').doc(userId).delete()
  })

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

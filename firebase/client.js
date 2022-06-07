// import * as firebaseall from 'firebase'
import { event } from '../events'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import _ from 'lodash'

// Utils
import { sortDoc, sortSchema } from 'utils'
import { getTypes } from '@/admin/utils/utils'

// var emitter = new EventEmitter()

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_ANALYTICS_ID_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_ANALYTICS_ID_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_ANALYTICS_ID_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_ANALYTICS_ID_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_ANALYTICS_ID_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_ANALYTICS_ID_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_ANALYTICS_ID_MEASUREMENT_ID
}

// initializeApp(firebaseConfig)
// firebase.initializeApp(firebaseConfig)
// firebase.initializeApp(firebaseConfig)
!firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()

const db = firebase.firestore()
const functions = firebase.functions()
const auth = firebase.auth()
const storage = firebase.storage()

const EMULATORS_STARTED = 'EMULATORS_STARTED';
function startEmulators() {
  if (!global[EMULATORS_STARTED]) {
    global[EMULATORS_STARTED] = true;
    auth.useEmulator('http://localhost:9099')
    db.useEmulator('localhost', '8081')
    functions.useEmulator('localhost', '5001')
    storage.useEmulator('localhost', '9199')
  }
  // if(typeof window === 'undefined' || !window['_init']) {
  //   auth.useEmulator('http://localhost:9099')
  //   db.useEmulator('localhost', '8081')
  //   functions.useEmulator('localhost', '5001')
  //   storage.useEmulator('localhost', '9199')
  //   if(typeof window !== 'undefined') {
  //     window['_init'] = true;
  //  }
  // }
}

if(process.env.NODE_ENV === 'development') {
  // auth.useEmulator('http://localhost:9099')
  // db.useEmulator('localhost', '8081')
  // functions.useEmulator('localhost', '5001')
  // storage.useEmulator('localhost', '9199')

  startEmulators()
}

const mapUserFromFirebaseAuthToUser = user => {
  const { displayName, email, photoURL } = user
  return {
    avatar: photoURL,
    username: displayName,
    email
  }
}

export const loginWithGithub = () => {
  const githubProvider = new firebase.auth.GithubAuthProvider()
  return firebase.auth().signInWithPopup(githubProvider)
}

export const onAuthStateChange = ({ setUser, setRole, setLoading }) => {
  return firebase.auth().onAuthStateChanged(user => {
    console.log('auth state changed')
    if (user) {
      user
      .getIdTokenResult()
      .then(idTokenResult => {
          console.log(idTokenResult.claims.role)
          setRole(idTokenResult.claims.role)
          setLoading(false)
        })
        .catch(error => {
          console.log('error onAuthStateChange', error)
        })
      const normalizeUser = mapUserFromFirebaseAuthToUser({ ...user })
      setUser(normalizeUser)
    } else {
      setLoading(false)
    }
  })
}

export const signInWithEmailAndPassword = (email, password) => {
  return firebase.auth().createUserWithEmailAndPassword(email, password)
}

export const signUpWithEmailAndPassword = (email, password) => {
  return firebase.auth().signInWithEmailAndPassword(email, password)
}
export const signOut = () => {
  return firebase.auth().signOut()
}

export const addByCollectionTypeWithCustomID = (type, ids, content) => {
  return db
    .collection(type)
    .doc(ids)
    .set(content)
}

export const getPayments = () => {
  const retrievePaymentIntent = functions.httpsCallable('retrievePaymentIntent')
  return retrievePaymentIntent().then(res => {
    return res.data.data
  })
}

export const deleteRelatedDoc = (collection, id) => {
  db.collection(collection)
    .doc(id)
    .delete()
}

export const addPost = ({ content }) => {
  return db.collection('posts').add({
    content,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  })
}

export const uploadImage = file => {
  const ref = firebase.storage().ref(`images/${file.name}`)
  const task = ref.put(file)

  return task
}

export const uploadImages = ({
  imageFile,
  setProgress,
  setUpload,
  setCurrent,
  setCompleted,
  i,
  total
}) => {
  return new Promise(function (resolve, reject) {
    const ref = firebase.storage().ref(`images/${imageFile.name}`)
    const task = ref.put(imageFile)

    let u = []
    u[i] = true
    setUpload(u)

    setCurrent(i)

    task.on(
      'state_changed',
      snapshot => {
        let p = []
        p[i] = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setProgress(p)

        if (p[i] === 100) {
          let u = []
          u[i] = false

          setTimeout(() => {
            setUpload(u)
            if (i === total) {
              setCompleted(true)
            }
          }, 200)
        }
      },
      () => {},
      () => {}
    )
    resolve(task)
  })
}

export const getImages = async () => {
  const storageRef = firebase.storage().ref(`images`)

  let result = await storageRef.listAll()
  let urlPromises = result.items.map(imageRef => imageRef.getDownloadURL())

  // return all resolved promises
  return Promise.all(urlPromises)
}
export const getImagesData = async () => {
  const storageRef = firebase.storage().ref(`images`)

  let result = await storageRef.listAll()
  let urlPromises = result.items.map(imageRef => imageRef.getDownloadURL())
  let metadataPromises = result.items.map(imageRef => imageRef.getMetadata())
  let metadata = await Promise.all(metadataPromises)
  let urls = await Promise.all(urlPromises)
  event.dispatch('onImagesLoaded')
  return { metadata, urls }
}

export const deleteImage = name => {
  var storageRef = firebase.storage().ref('images')
  var imageRef = storageRef.child(`${name}`)
  imageRef
    .delete()
    .then(function () {
      console.log('deleted')
    })
    .catch(function (error) {
      console.log('error: ', error)
    })
}

export const getByPeriod = (collection, date1, date2) => {
  return db
    .collection(collection)
    .where('created', '>=', date1)
    .where('created', '<=', date2)
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => {
        return doc.data()
      })
    })
}

export const fetchPosts = () => {
  return db
    .collection('posts')
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => {
        const data = doc.data()
        const id = doc.id
        return {
          id,
          ...data
        }
      })
    })
}


// export const getRelationsListByType = type => {
//   return db
//     .collection('collectionList')
//     .get()
//     .then(snapshot => {
//       return snapshot.docs.map(doc => {
//         let data = doc.data()
//         return data[type].relations
//       })
//     })
// }

// export const getCollectionSchema = collection => {
//   console.log(collection)
//   return db
//     .collection('collectionList')
//     .doc()
//     .get()
//     .then(snapshot => {
//       let data = doc.data()
//       console.log(snapshot.data())
//       return snapshot.data()
//     })
//   // .then(snapshot => {
//   //   return snapshot.docs.map(doc => {
//   //     const data = doc.data()
//   //     const id = doc.id
//   //     console.log(data)
//   //     return {
//   //       id,
//   //       ...data
//   //     }
//   //   })
//   // })
// }


export const fetchPost = id => {
  return db
    .collection('posts')
    .doc(id)
    .get()
    .then(snapshot => {
      // console.log(snapshot)
      return snapshot.data()
    })
}

export const makeAdmin = adminEmail => {
  console.log('making an admin...')
  const addAdminRole = functions.httpsCallable('addAdminRole')
  addAdminRole({ email: adminEmail }).then(result => {
    console.log(result)
  })
}

export const updateUserProfile = (email, newdata, setUser, setRole) => {

  const user = firebase.auth().currentUser

  user.updateProfile({
    displayName: newdata.displayName,
    photoURL: newdata.photoURL
  }).then(() => {
    console.log(user)
    const normalizeUser = mapUserFromFirebaseAuthToUser({ ...user })
    setUser(normalizeUser)
  }).catch((error) => {
    console.log(error.message)
  })
  
  // const updateProfile = functions.httpsCallable('updateUser')
  // updateProfile({ email: email, newdata })
  //   .then((result) => {
  //     console.log('user updated')
  //     console.log(result)
  //     const normalizeUser = mapUserFromFirebaseAuthToUser({ ...result.data })
  //     console.log(normalizeUser)
  //     setUser(normalizeUser)
  //     setRole(result.data.customClaims.role)
  // })
}

export const updateUserCustomClaimsRole = async (data, setRole) => {
  const updateCustomClaimsRole = functions.httpsCallable('updateUserCustomClaimsRole')
  await updateCustomClaimsRole(data)
  const user = firebase.auth().currentUser
  await user.getIdToken(true)
  user
    .getIdTokenResult()
      .then(idTokenResult => {
        console.log(idTokenResult.claims.role)
        setRole(idTokenResult.claims.role)
      })
      .catch(error => {
        console.log('error onAuthStateChange', error)
      })
}

export const updateOneByType = (id, type, formData) => {
  db.collection(type)
    .doc(id)
    .update(formData)
}

export const updateSeenFieldByType = (id, type) => {
  db.collection(type)
    .doc(id)

    // TESTING FIELD
    // .update({'seen': true})
}

// substract amount of product
export const updateDocFieldByType = async (id, type, formData, qty) => {
  let amount = await db
    .collection(type)
    .doc(id)
    .get()
    .then(doc => {
      return doc.data().amount.value
    })
  db.collection(type)
    .doc(id)
    .update({ ['amount.value']: amount - qty })
}

// export const signIn = () => {
//   const auth = getAuth()
//   createUserWithEmailAndPassword(auth, email, password)
//     .then(userCredential => {
//       // Signed in
//       const user = userCredential.user
//     })
//     .catch(error => {
//       const errorCode = error.code
//       const errorMessage = error.message
//     })
// }

// Updates the schema, not the docs
export const updateSchema = async data => {
  await db
    .collection('collectionList')
    .doc('OjUAtyfsIW6ECoryEovP')
    .update(data)
}
// Update docs
export const updateDocs = async (new_data, old_data, type) => {
  // update Schema
  console.log(new_data)
  await db
    .collection('collectionList')
    .limit(1)
    .get()
    .then(snapshot => {
      snapshot.docs[0].ref.update({ [type]: new_data[type] })
    })

  // batched update of the Docs
  const users = await db.collection(type).get()

  const batches = _.chunk(users.docs, 500).map(userDocs => {
    const batch = db.batch()
    userDocs.forEach(doc => {
      console.log(doc.data())
      Object.keys(old_data[0].schema).map(f => {
        console.log(f)
        if (
          old_data[0].schema[f].isRequired !==
          new_data[type].schema[f].isRequired
        ) {
          console.log('if passed')
          batch.set(
            doc.ref,
            {
              [f]: {
                ...old_data[0].schema[f],
                isRequired: new_data[type].schema[f].isRequired
              }
            },
            { merge: true }
          )
        }
      })
    })
    return batch.commit()
  })

  await Promise.all(batches)
}

export const deleteFields = async (name, type) => {
  console.log(`deleting field ${name} on ${type} docs...`)

  const deleted = await db
    .collection('collectionList')
    // .doc('OjUAtyfsIW6ECoryEovP')
    // .get()
    .limit(1)
    .get()
    .then(snapshot => {
      return snapshot.docs[0]
    })

  const deleted_data = deleted.data()[type].schema

  console.log(deleted_data)

  delete deleted_data[name]

  const new_data = {
    name: type,
    schema: deleted_data
  }

  // update test ** need to update test.schema
  await db
    .collection('collectionList')
    // .doc('OjUAtyfsIW6ECoryEovP')
    // .update({
    //   [type]: new_data
    // })
    .limit(1)
    .get()
    .then(snapshot => {
      snapshot.docs[0].ref.update({
        [type]: new_data
      })
    })

  const users = await db.collection(type).get()

  const batches = _.chunk(users.docs, 500).map(userDocs => {
    const batch = db.batch()
    userDocs.forEach(doc => {
      batch.set(
        doc.ref,
        {
          [name]: firebase.firestore.FieldValue.delete()
        },
        { merge: true }
      )
    })
    return batch.commit()
  })

  await Promise.all(batches)
}

// Create Junction: When link two docs
// export const createJunction = async (fromId, toId, junction) => {
//   const junctionRef = db.doc(`${junction}/${fromId}_${toId}`)
//   await junctionRef.set({ studentId, courseId })
// }

// CLIENT

export const getDocByID = (collection, id) => {
  return db
    .collection(collection)
    .doc(id)
    .get()
    .then(snapshot => {
      return {
        id: snapshot.id,
        ...snapshot.data()
      }
    })
}

export const getCollectionClient = async collection => {
  if (collection) {
    let response = []
    const data = await getCollection(collection)
    data.map((d, i) => {
      let entry = {}
      for (let [key, value] of Object.entries(d)) {
        if (key === 'id') {
          entry[key] = value
        }
        if (value.value) {
          entry[key] = value.value
        }
      }
      response.push(entry)
    })
    return response
  }
}

export const getDocByIDClient = async (collection, id) => {
  const data = await getDocByID(collection, id)

  let response = {}

  for (let [key, value] of Object.entries(data)) {
    if (key === 'id') {
      response[key] = value
    }
    if (value.value) {
      response[key] = value.value
    }
  }

  return response
}


// DOCUMENTED-----------------------------------------------------------------------------

/**
 * Get all users.
 * @return {array} - The users list.
 */
export const getAllUsers = async () => {
  const getUsers = functions.httpsCallable('getAllUsers')
  console.log('before users are loaded')
  const users = await getUsers()
  event.dispatch('onUsersLoaded')
  return users
}

/**
 * Get the list of collections.
 * @return {object} Schema of the requested collection.
 */
export const getCollections = () => {
  return db
    .collection('collectionList')
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => {
        const result = doc.data()
        // const names = Object.keys(result)
        let collections = []
        for (const [key, value] of Object.entries(result)) {
          collections.push({ name: key, page: value.page })
        }
        event.dispatch('onCollectionsListLoaded')
        return collections
      })
    })
}

/**
 * Get the Docs in a collection.
 * @param {string} Collection - Name of the collection.
 * @return {array} Docs in collection.
 */
export const getCollection = async collection => {
  const snapshot = await db.collection(collection).get()
  const docs = snapshot.docs.map(doc => {
    const data = doc.data()
      const id = doc.id
      return {
        id,
        ...data
      }
  })
  event.dispatch('onCollectionLoaded')
  return docs
}

/**
 * Get the Schema (types info) of a collection by given type.
 * @param {string} type - Type of the requested collection.
 * @return {object} Schema of the requested collection.
 */
export const getSchemaByType = type => {
  return db
    .collection('collectionList')
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => {
        let data = doc.data()
        event.dispatch('onSchemaLoaded')
        return sortSchema(data[type].schema)
      })
    })
}

/**
 * Get the Schema (types and metadata) of a collection by given type.
 * @param {string} type - Type of the requested collection.
 * @return {object} Schema of the requested collection.
 */
export const getFullSchemaByType = async type => {
  const snapshot = await db.collection('collectionList').get()
  const schema = snapshot.docs.map(doc => {
    let data = doc.data()
    return data[type]
  })
  event.dispatch('onSchemaLoaded')
  return schema
  // return db
  //   .collection('collectionList')
  //   .get()
  //   .then(snapshot => {
  //     return snapshot.docs.map(doc => {
  //       let data = doc.data()
  //       return data[type]
  //     })
  // })
}

/**
 * Get One Doc by the given id and type.
 * @param {string} id - Id of the Doc.
 * @param {string} type - Type of the requested collection.
 * @return {object} the Doc data.
 */
export const getDoc = (id, type) => {
  return db
    .collection(type)
    .doc(id)
    .get()
    .then(snapshot => {
      event.dispatch('onDocLoaded')
      return sortDoc(snapshot.data())
      // return snapshot.data()
    })
}

/**
 * Deletes a Document.
 * @param {string} id - Id of the Document.
 * @param {string} collection - Name of the collection.
 */
export const deleteDoc = (id, collection) => {
  db.collection(collection)
    .doc(id)
    .delete()
    .then(() => {
      console.log('Document successfully deleted!')
    })
    .catch(error => {
      console.error('Error removing document: ', error)
    })
}

/**
 * Deletes a list of Documents.
 * @param {array} docs - List of Documents.
 * @param {string} collection - Name of the collection.
 */
export const deleteDocs = (docs, collection) => {
  docs.forEach(id => {
    deleteDoc(id, collection)
  })
  event.dispatch('onDocsDeleted')
}

/**
 * Creates a Collection.
 * @param {object} collection - The object with the schema to create the new collection.
 */
 export const createCollection = async collection => {
  const collection_exists = await db
    .collection('collectionList')
    .limit(1)
    .get()

  console.log(collection_exists.empty)

  // if true create the collection -> "CollectionList"
  if (collection_exists.empty) {
    await db.collection('collectionList').add(collection)
  } else {
    // else update the collectionList:
    await db
      .collection('collectionList')
      .limit(1)
      .get()
      .then(snapshot => {
        snapshot.docs[0].ref.update(collection)
      })
  }

  db.collection(collection[Object.keys(collection)[0]].name)
}

/**
 * Adds the relation data to the schema (in collectionList).
 * @param {string} collection - Type name of the related collection.
 * @param {object} relation - Data of the junction ({
 *  display: {boolean} if related docs are displayed by default in the doc, 
 *  name: {string} name of the junction,
 * }).
 */
 export const addRelationToCollection = async (collection, relation) => {
  await db
    .collection('collectionList')
    .limit(1)
    .get()
    .then(snapshot => {
      snapshot.docs[0].ref.update({
        [`${collection}.relations`]: firebase.firestore.FieldValue.arrayUnion(
          relation
        )
      })
    })

  // db.collection(collection[Object.keys(collection)[0]].name)
}

/**
 * Create a collection with relation data.
 * See @func createCollection and @func addRelationToCollection for more info.
 * @param {object} collection - The object with the schema to create the new collection.
 * @param {array} relation_entries - The array with the relations for the collection.
 */
export const createCollecitonWithRelations = async (collection, relation_entries) => {
  createCollection(collection)
  relation_entries.map(relation => {
    const spliceRelations = relation.name.split('_')
    let type2 = spliceRelations[2]
    addRelationToCollection(type2, relation)
  })
  event.dispatch('onCollectionCreated')
}

/**
 * Create a doc in a collection by the specified type.
 * @param {string} type - Type of the collection.
 * @param {object} content - The content of the collection.
 */
export const addByCollectionType = (type, content) => {
  content = {
    ...content, 

    // TESTING THIS FIELD
    // seen: false,

    // TESTING THIS FIELD *uncomment to test
    // created: firebase.firestore.Timestamp.now()
  }
  const doc = db.collection(type).add(
    content
    // createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  )
  event.dispatch('onDocCreated', doc)
  return doc

}

/**
 * TODO: better explanation.
 * Adds an array of docs from a related collection to the current doc. )
 * @param {string} type - Type of the collection.
 * @param {string} ids - The content of the collection.
 * @param {object} content - The content of the collection.
 */
export const addByCollectionTypeWithCustomIDBatched = (type, ids, content) => {
  const batch = db.batch()
  ids.map((id, i) => {
    let docRef = db.collection(type).doc(id)
    batch.set(docRef, content[i])
  })
  batch.commit()
}

/**
 * Create a doc in a collection by the specified type, 
 * and add the previous selected doc from a related collection.
 * See @func addByCollectionType and @func addByCollectionTypeWithCustomIDBatched for more info.
 * @param {string} type - Type of the collection.
 * @param {object} content - The content of the collection.
 * @param {array} selectedRowIds - Array with the related doc in the collection.
 */
export const addByCollectionTypeWithRelatedDocs = (type, content, selectedRowIds) => { 
  // Create the Doc and get the generated ID
  addByCollectionType(type, content).then(function (docRef) {
    let newId = docRef.id

    // map selectedRowIds
    console.log('selectedRowIds: ', selectedRowIds)
    selectedRowIds.map(s => {
      let idsArr = []
      let docsContent = []
      Object.keys(s).map(entry => {
        const spliceRelations = entry.split('_')
        s[entry].map(({ id: currentId }) => {
          let type1
          let type2
          let composedId

          // Compose ids
          if (spliceRelations[1] === type) {
            composedId = `${newId}_${currentId}`
            type1 = spliceRelations[1]
            type2 = spliceRelations[2]
          } else {
            composedId = `${currentId}_${newId}`
            type1 = spliceRelations[2]
            type2 = spliceRelations[1]
          }
          idsArr.push(composedId)

          // Prepare content of Doc
          docsContent.push({
            [`${type1}Id`]: newId,
            [`${type2}Id`]: currentId
          })
        })

        // Create Doc and junction collection if no exists yet
        addByCollectionTypeWithCustomIDBatched(entry, idsArr, docsContent)
      })
    })
  })
}

/**
 * Updates a doc in a collection by the specified type and id, 
 * and the list of selected docs from a related collection.
 * See @func updateOneByType and @func addByCollectionTypeWithCustomIDBatched for more info.
 * @param {string} id - Id of the Doc to update.
 * @param {string} type - Type of the collection.
 * @param {object} content - The content of the collection.
 * @param {array} selectedRowIds - Array with the related doc in the collection.
 */
export const updateDocByTypeWithRelatedDocs = (id, type, content, selectedRowIds) => {
  let updateDoc = new Promise((resolve, reject) => {
    updateOneByType(id, type, content)

    selectedRowIds.map(s => {
      let idsArr = []
      let docsContent = []
      Object.keys(s).map(entry => {
        const spliceRelations = entry.split('_')
        s[entry].map(({ id: currentId }) => {
          let type1
          let type2
          let composedId

          // Compose ids
          if (spliceRelations[1] === type) {
            composedId = `${id}_${currentId}`
            type1 = spliceRelations[1]
            type2 = spliceRelations[2]
          } else {
            composedId = `${currentId}_${id}`
            type1 = spliceRelations[2]
            type2 = spliceRelations[1]
          }
          idsArr.push(composedId)

          // Prepare content of Doc
          docsContent.push({
            [`${type1}Id`]: id,
            [`${type2}Id`]: currentId
          })
        })

        // Create doc and junction collection if no exists yet
        addByCollectionTypeWithCustomIDBatched(entry, idsArr, docsContent)
      })
    
    })
    resolve("update")
  })
  updateDoc.then(() => {
    event.dispatch('onDocUpdated', 'Document updated')
  })
  .catch((error) => {
    console.log('error: ', error)
  })
}

/**
 * Fetches related docs from a doc by the specified type and id. 
 * @param {string} id - Id of the Doc to update.
 * @param {string} junction - Name of the junction.
 * @param {string} type - Type of the collection.
 * @param {string} type2 - Type of the related collection.
 */
export const fetchRelatedDocs = async (id, junction, type, type2) => {
  const junctions = await db
    .collection(`${junction}`)
    .where(`${type}Id`, '==', id)
    .get()

  const relatedDocs = await Promise.all(
    junctions.docs
      .filter(doc => doc.exists)
      .map(doc => {
        return db.doc(`${type2}/${doc.data()[`${type2}Id`]}`).get()
      })
  )

  return relatedDocs
    .filter(doc => doc.exists)
    .map(doc => {
      return { id: doc.id, ...doc.data() }
    })
}

/**
 * Controller: Add hidden relations to the current relations when pushes show relation button. 
 * @param {string} id - Id of the current Doc.
 * @param {string} junction - Name of the junction.
 * @param {string} type - Type of the collection.
 * @param {array} relations - State with the current relations.
 * @return {array} newState - New state with the new relations.
 */
export const getAndMapHiddenRelatedDocs = async (id, junction, type, relations) => {
  const { type1, type2 } = getTypes(junction, type)
  const relationsFetched = await fetchRelatedDocs(id, junction, type1, type2)
  const prevState = relations
  const newState = prevState.map(collection => {
    if (collection.collection === type2) {
      return {
        content: [...relationsFetched],
        collection: type2,
        junctionName: junction
      }
    } else return collection
  })
  return newState
}

/**
 * Controller: gets the related docs from the schema data. 
 * @param {array} relations - relations schema part.
 * @param {string} id - Id of the current Doc.
 * @param {string} type - Type of the collection.
 * @return {promises array} resolved - related docs.
 */
export const getRelatedDocsFromSchema = async (relations, id, type) => {
  if (relations?.length > 0) {
    let relatedDocs = []
    const promises = []
    relations.forEach((junction, i) => {
      const { type2 } = getTypes(junction.name, type)
      if (junction.display === true) {
        const promise = new Promise(async (resolve, reject) => {
          const { type1, type2 } = getTypes(junction.name, type)
          relatedDocs = await fetchRelatedDocs(
            id,
            junction.name,
            type1,
            type2
          )
          resolve({
            content: [...relatedDocs],
            collection: type2,
            junctionName: junction.name
          })
        })
        promises.push(promise)
      } else {
        const promise = new Promise(async (resolve, reject) => {
          resolve({ junctionName: junction.name, collection: type2 })
        })
        promises.push(promise)
      }
    })
    if (promises.length > 0) {
      return await Promise.all(promises)
    }
  }
}

/**
 * Controller: gets the relations from the schema data. 
 * @param {string} type - Type of the collection.
 * @return {promises array} relatedCollections - schema data about relations.
 */
export const getRelationsSchema = async (type) => {
  const data = await getFullSchemaByType(type)
  if (data.length > 0 && data[0].relations?.length > 0) {
    const relatedCollections = []
    data[0].relations.forEach((junction) => {
      const { type2 } = getTypes(junction.name, type)
      relatedCollections.push({ type: type2, junction: junction.name })
    })
    console.log(relatedCollections)
    return relatedCollections
  }
}
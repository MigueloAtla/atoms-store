// import * as firebaseall from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'
import _ from 'lodash'

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

export const onAuthStateChange = ({ setUser, setAdmin, setLoading }) => {
  return firebase.auth().onAuthStateChanged(user => {
    if (user) {
      user
        .getIdTokenResult()
        .then(idTokenResult => {
          setAdmin(idTokenResult.claims.admin)
          setLoading(false)
        })
        .catch(error => {
          console.log('error onAuthStateChange', error)
        })
      const normalizeUser = mapUserFromFirebaseAuthToUser({ ...user })
      console.log(normalizeUser)
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

export const addByCollectionType = (type, content) => {
  return db.collection(type).add(
    content
    // createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  )
}
export const addByCollectionTypeWithCustomID = (type, ids, content) => {
  return db
    .collection(type)
    .doc(ids)
    .set(content)
}

export const deleteRelatedDoc = (collection, id) => {
  console.log('collection', collection)
  console.log('id', id)
  db.collection(collection)
    .doc(id)
    .delete()
}

export const addByCollectionTypeWithCustomIDBatched = (type, ids, content) => {
  console.log(type)
  console.log(ids)
  console.log(content)
  const batch = db.batch()
  ids.map((id, i) => {
    let docRef = db.collection(type).doc(id)
    batch.set(docRef, content[i])
  })
  batch.commit()
}
export const addPost = ({ content }) => {
  return db.collection('posts').add({
    content,
    createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  })
}
export const deletePost = (id, collection) => {
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

export const getCollection = collection => {
  return db
    .collection(collection)
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
        return collections
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

export const fetchRelatedDocs = async (id, junction, type, type2) => {
  const junctions = await db
    .collection(`${junction}`)
    .where(`${type}Id`, '==', id)
    .get()

  const products = await Promise.all(
    junctions.docs
      .filter(doc => doc.exists)
      .map(doc => {
        return db.doc(`${type2}/${doc.data()[`${type2}Id`]}`).get()
      })
  )

  return products
    .filter(doc => doc.exists)
    .map(doc => {
      return { id: doc.id, ...doc.data() }
    })
}

export const getSchemaByType = type => {
  return db
    .collection('collectionList')
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => {
        let data = doc.data()
        return data[type].schema
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
export const getFullSchemaByType = type => {
  return db
    .collection('collectionList')
    .get()
    .then(snapshot => {
      return snapshot.docs.map(doc => {
        let data = doc.data()
        return data[type]
      })
    })
}

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

export const fetchOneByType = (id, type) => {
  return db
    .collection(type)
    .doc(id)
    .get()
    .then(snapshot => {
      return snapshot.data()
    })
}
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

export const updateOneByType = (id, type, formData) => {
  db.collection(type)
    .doc(id)
    .update(formData)
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

export const addRelationToCollection = async (collection, relation) => {
  console.log(collection)
  console.log(relation)
  await db
    .collection('collectionList')
    // .doc('OjUAtyfsIW6ECoryEovP')
    // .update({
    //   [`${collection}.relations`]: firebase.firestore.FieldValue.arrayUnion(
    //     relation
    //   )
    // })
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

export const createCollection = async collection => {
  const collection_exists = await db
    .collection('collectionList')
    .limit(1)
    .get()

  console.log(collection_exists.empty)

  // if true create the collection -> CollectionList
  if (collection_exists.empty) {
    await db.collection('collectionList').add(collection)
  } else {
    // else update:
    await db
      .collection('collectionList')
      // .doc('OjUAtyfsIW6ECoryEovP')
      // .update(collection)
      .limit(1)
      .get()
      .then(snapshot => {
        snapshot.docs[0].ref.update(collection)
      })
  }

  db.collection(collection[Object.keys(collection)[0]].name)
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

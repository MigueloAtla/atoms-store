// import * as firebaseall from 'firebase'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'
import 'firebase/functions'

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
      setUser(normalizeUser)
    } else {
      setLoading(false)
    }
  })
}

export const addByCollectionType = (type, content) => {
  return db.collection(type).add(
    content
    // createdAt: firebase.firestore.Timestamp.fromDate(new Date())
  )
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
        const data = Object.keys(result)
        return data
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
  // const { content } = formData
  db.collection(type)
    .doc(id)
    .update(formData)
}
export const updatePost = (id, formData) => {
  const { content } = formData
  db.collection('posts')
    .doc(id)
    .update({ content })
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

export const createCollection = async collection => {
  await db
    .collection('collectionList')
    .doc('OjUAtyfsIW6ECoryEovP')
    .update(collection)

  db.collection(collection[Object.keys(collection)[0]].name)
}

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

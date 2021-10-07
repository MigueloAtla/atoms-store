
# AtomsCMS

## Getting Started:

### Configuration of __Firebase project__

1. Create a firebase project.

2. Create a __firestore__ instance.

3. Go to __Storage__: create a folder called "images".

4. Update project to __Blaze plan__.  
A credit card is needed, but plan is free.

5. Replace __.env.local.example__ with __.env.local__ and introduce your firebase project data.

    5.1. To be able of use Generators you need to replace the __.env.example__ with __.env__ file with the project id. (Optional).  

6. Activate firebase functions.  

### Configuration of __Firebase functions__

In terminal install: 

```
npm install -g firebase-tools
```
Log into your firebase account:
```
firebase login  
```
Go to functions folder: 

```
npm install
```

Deploy the functions to firebase:

```
firebase deploy --only functions
```

### 7. Run the project

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Register user with de signup option in home, and use that email to register as admin in the bottom input.

### 9. Go to [http://localhost:3000/admin](http://localhost:3000/admin)

### 10. Create collections types in admin.

### 11. *Optional - Front Scaffolding (Generators)  

```bash
yarn generate:pages
```
This creates the folders and files to create the static pages for your web.

And it'll generate this folder structure.

```
.
└── pages                         
    ├── posts
    │   └── [id].js              
    └── projects
        └── [id].js              
```

With this components: 
```js
// ./pages/projects/[id].js
import React from 'react'
import { getCollection, getDocByID } from '@/firebase/client'

import { withTheme, PostWrapperStyled } from '@/theme'

import styled from 'styled-components'
import { LayoutStyled } from '@/layouts/postLayout'

export default function Project ({ project }) {
  const { Title, Description, Image, Content } = withTheme(project)

  return (
    <>
    <h1>Projects</h1>
    </>
  )
}

export async function getStaticProps ({ params: { id } }) {
  const project = await getDocByID('project', id)

  return {
    props: {
      project
    }
  }
}

export async function getStaticPaths () {
  const projects = await getCollection('projects')
  return {
    paths:
      projects &&
      projects.map(el => ({
        params: { id: String(el.id) }
      })),
    fallback: false
  }
}
```

Each time you create a collection type in the admin or firebase you can run: 
```bash
yarn generate:pages
```
And it'll generate pages for the new types.
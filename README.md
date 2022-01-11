# AtomsCMS

## Getting Started:

### Configuration of **Firebase project**

1. Create a firebase project.

2. Create a **firestore** instance.

3. Go to **Storage**: create a folder called "images".

4. Update project to **Blaze plan**.  
   A credit card is needed, but plan is free.

5. Replace **.env.local.example** with **.env.local** and introduce your firebase project data. \*Data project is in sidebar -> gear icon -> project configuration -> your app -> </> button, it'll generate the api keys, when ready, select the config option on SDK config.

   5.1. To be able of use Generators you need to replace the **.env.example** with **.env** file with the project id. (Optional).

6. Add an authentication method. Select github. En github:

- Registra tu app como aplicación de desarrollador en [https://github.com/settings/applications/new] y obtén el ID de cliente y el Secreto de cliente de OAuth 2.0.

- Asegúrate de que tu URI de redireccionamiento de OAuth de Firebase (p. ej., my-app-12345.firebaseapp.com/\_\_/auth/handler) esté configurado como URL de devolución de llamada de autorización en la página de configuración de tu app en GitHub.

- Introduce the Client Id and push the button to generate the client secret.

6. In root folder of your project run:

```
yarn install
```

7. Activate firebase functions.

### Configuration of **Firebase functions**

In terminal install (if you don't have yet):

```
npm install -g firebase-tools
```

Log into your firebase account:

```
firebase login
```

Init functions and no overwrite files when cli asks, and install packages:

```
firebase init functions
```

Go to functions folder and
deploy the functions to firebase (and wait...):

```
firebase deploy --only functions
```

Go back to root folder.

### 7. Run the project

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

### 8. Register user with de signup option in home, and use that email to register as admin in the bottom input.

### 9. Go to [http://localhost:3000/admin](http://localhost:3000/admin)

### 10. Create collections types in admin.

### 11. \*Optional - Front Scaffolding (Generators)

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
import React from "react";
import { getCollection, getDocByID } from "@/firebase/client";

import { withTheme, PostWrapperStyled } from "@/theme";

import styled from "styled-components";
import { LayoutStyled } from "@/layouts/postLayout";

export default function Project({ project }) {
  const { Title, Description, Image, Content } = withTheme(project);

  return (
    <>
      <h1>Projects</h1>
    </>
  );
}

export async function getStaticProps({ params: { id } }) {
  const project = await getDocByID("project", id);

  return {
    props: {
      project,
    },
  };
}

export async function getStaticPaths() {
  const projects = await getCollection("projects");
  return {
    paths:
      projects &&
      projects.map((el) => ({
        params: { id: String(el.id) },
      })),
    fallback: false,
  };
}
```

Each time you create a collection type in the admin or firebase you can run:

```bash
yarn generate:pages
```

And it'll generate pages for the new types.


# AtomsCMS

## Getting Started:

### Configuration of __Firebase project__

1. Create a firebase project.

2. Create a __firestore__ instance.

3. Go to __Storage__: create a folder called "images".

4. Update project to __Blaze plan__.  
A credit card is needed, but plan is free.

5. Replace .env.example with .env.local and introduce your firebase project data.

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

### Run the project

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000)


#### Prepare for Deployment

- in client remove build and node_modules
- in server remove node_modules

package.json

```json

"scripts":{
  "setup-production":"npm run install-client && npm run build-client && npm install",
  "install-client":"cd client && npm install",
}



```

- node server
- APP NEEDS TO WORK LOCALLY !!!

#### Github Repo

- create new repo
- remove all existing repos (CHECK CLIENT !!!)
- in the root
- git init
- git add .
- git commit -m "first commit"
- push up to Github

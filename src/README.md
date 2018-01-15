# Getting Setup
## Preamble
*NOTE: The information in this section is no longer correct as the hosted site is no longer running*
A much easier method than installing and running the site locally is to access the hosted version at [https://synergyims.me](https://synergyims.me).

An existing user account that has good sample data in it is:
> email: josh@company.com
>
> password: josh123

For a properly formatted CSV that you can test the importing function with, look in the folder [../Doc/FinalPresentation/](Doc/FinalPresentation) for the file `test.csv`

---
## Running The Site Locally
### Dependencies
 - **NodeJS v8.9.1**
   
   This version of Node can be downloaded from [nodejs.org](https://nodejs.org/en/download/) for Windows or Mac. For installing on Linux, follow the instructions given [here](http://nodesource.com/blog/installing-node-js-8-tutorial-linux-via-package-manager/).

 - **Yarn**

   This can be installed after NodeJS has been installed (and added to PATH) by running this command as Administrator/sudo `npm install -g yarn`.

### Setting Up
After all the dependencies are installed, open a terminal in the `src` folder in the root of the project.

Once in `src`, run the command `yarn install` to get the properly updated dependencies for the website. This may take a few seconds depending on internet connection and computer hardware.

> *Note: if this fails saying "cannot find yarn.lock", then you're attempting to run this command in a folder other than the `src` folder. Make sure that you are in the `src` folder.*

After the dependencies are install, build the distribution files by running the command `npm build`. After that has completed, run `node server.js` to start the server. *You need an internet connection as the site references a remote database.*

*NOTE: You will need to enter in your relevant database connection information in [./server/db/database.json](database.json), as well as put in a token secret in [./.env](.env).*
***
***

# Developers
## Development server
*Note this section is for people who are developing the software.*

### Fullstack
Run `npm start` for a live reloading version of the full site, which will run on `http://localhost:3000`.

### Front end
Run `ng serve` for a front end dev server, which will start the Angular app at `http://localhost:4200`. It will automatically restart when it detects any changes.

### Back end
Run `node server.js` to run the backend and `/dist` build of the front end, which will run on `http://localhost:3000`.

## Build
Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

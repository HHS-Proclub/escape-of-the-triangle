# Escape of the Triangle

Contains all code for the "Escape of the Triangle" workshop. The code is split into two sections: Frontend and backend.

## Workshop Info

This is a group-based version of "Triangle Adventures", designed to encourage collaboration and to provide a gentler introduction to programming. It's meant for groups of 3 or 4, although the workshop can be played with fewer people. There are 10 main levels, along with a bonus level and a "winner" level.

The frontend was made using HTML/CSS/JS and put on the HHS Programming Club website. It's where people go to play the game.

The backend was made using Express (NodeJS) and socket.io, and it was hosted on Heroku. It keeps track of all the rooms / game states. It also has a very very basic admin panel.

Officers: See this [Google Doc](https://docs.google.com/document/d/13p5BoC7BIf2VXVYe0BNuxkO0PCirLQuqS0x1D6GOsP4/edit?usp=sharing) for more detailed info.

## Development Instructions

1. Make sure [Node.js](https://nodejs.org/en/) is installed.
2. Clone the Github repository.
3. Open the repository using a code editor, such as VS Code.
4. Open a terminal, navigate to the `frontend` folder, and run the command `npx live-server`.
5. Open another terminal, navigate to the `server` folder, and run the command `npx nodemon server.js`.

## Deployment Instructions

1. Deploy all files in the `server` folder onto a [Heroku app](https://devcenter.heroku.com/articles/deploying-nodejs).
2. Edit the `frontend/js/index.js` file. Below the comment that says `CHANGE THIS`, change the URL to point to the Heroku app deployed in step 1.
3. Copy all files in the `frontend` folder to a folder on a web server.

Workshop made by Giantpizzahead (Kyle), with help from other Programming Club officers

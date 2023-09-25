This project started as a programming challenge for a job interview to make a scrolling map in Gl ES2. 
So I wrote a shader that renders an entire tiled scrolling playfield with a single shander call.
(for some reason the interviewer expected me to make a shader call per
map tile, iterating the map on the processor side, but that would be far
less efficient).  
I spent a few more days on it as a side project after the interview.

This is also an experiment in whether it is possible & clean to keep all game state in a redux store. 
Parts are pretty good, but object interactions become messy, since one cannot (or shouldn't)
initiate a message from inside of a reducer.
This shows one way to do it, more experimentation is needed before a conclusion can be drawn. 

The running code can be viewed at http://tenetti.org/kts/gameOnRedux/
(note that it uses react router, which automatically updates the URL as one
navigates, but it is not backed by a server that supports that, so the URLs 
won't work if copied).

There are several pages on the nav bar at the top, each of which demonstrate/test portions of the game engine I wrote. 

* First was just the first page I created, it generates a bunch of objects and moves them around. 
* Generator demonstrates creating new objects during run time
* Shooter is a simple galaga style game to bring the concepts together. 
  controls are: Enter to start, a & d to move left and right, space bar to fire
* Scroller is a map tile based 4 way scrolling platform game. My focus
  was on the engine, not playability of the game. But it wouldn't take
  much tuning to make a few playable levels of a Mario style game. 
  controls are: a & d to move left & right, space bar to jump.


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Intro
This project contains custom styling and components for the Boomi PII dashboard app.

## Testing

You can start the local development server with `yarn start`. This will serve the compiled javascript and css at `http://localhost:3000/public`.

To implement, create a custom player then add references to the `boomi-pii-components.js` and `boomi-pii.css` as custom resources.  More information on loading custom resources can be found here: https://docs.manywho.com/adding-custom-javascript-and-stylesheets/

The local development server won't be accessible from `flow.manywho.com`, you can workaround this by using a tunnel like https://ngrok.com/download

Run ngrok with: 

```
ngrok http 3000 -host-header="localhost:3000"
```

ngrok will provide a url like `https://ad7c2b13.ngrok.io` that will point to `http://localhost:300`, for example you would add the following as custom resources in a player:

```
https://ad7c2b13.ngrok.io/boomi-pii-components.js,
https://ad7c2b13.ngrok.io/boomi-pii.css
```

After making changes to your custom component you can refresh the browser running the flow for the changes to be picked up.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Deploying

Run the `yarn build` command to create a production build to the `build` folder. You can then host these two files using the built in Assets support (more information can be found here: https://docs.manywho.com/everything-you-want-to-know-about-assets/) or a 3rd party file hosting environment.

After the `.js` and `.css` files are available from a file host you can reference them in a custom player as custom resources.

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)


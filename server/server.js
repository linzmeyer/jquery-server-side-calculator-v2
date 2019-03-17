/* jslint node: true */
/*******************************************************************************
*** File Sourcing **************************************************************
*******************************************************************************/

const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const inputsHistory = require( './modules/inputs-history' );
const evaluateExpression = require( './modules/evaluate-expression' );
const resultsHistory = require( './modules/results-history' );


/*******************************************************************************
*** NODE & EXPRESS SETUP *******************************************************
*******************************************************************************/

// Get an instance of Express
const app = express();
// This is the port number the server will listen on.
const PORT = 5000;

// Use the public directory we made for static files
app.use(express.static( 'server/public' ));

// Parse the request using body parser
app.use( bodyParser.urlencoded( {extended: true} ));
app.use( bodyParser.json());

/*******************************************************************************
*** Globals ********************************************************************
*******************************************************************************/

// Store current result of last calculation
let answer = 0;

/*******************************************************************************
*** Get Requests ***************************************************************
*******************************************************************************/

// - Create object called domInfo
// - Put answer inside domInfo
// - Put inputHistory and resultHistory in an object,
//   - then put that object inside of domInfo object with answer
// - Respond with domInfo object
app.get( '/get-DOMInfo', ( req, res ) => {
  console.log( 'in get-DOMInfo' );
  let domInfo = {
    currentAnswer: answer,
    history: { inputs: inputsHistory, results: resultsHistory }
  };
  console.log( 'responding', domInfo );
  // Good servers always respond!!!
  res.send( domInfo );
});

/*******************************************************************************
*** Post Requests **************************************************************
*******************************************************************************/

// - Store the inputs of this calculation in inputHistory[]
// - Perform calculation using inputs and store result in global var (answer)
// - Store the result of this calculation in resultsHistory[]
// - Respond status 201
app.post( '/post-input', ( req, res ) => {
  console.log( 'in post-input' );
  let inputs = req.body;
  inputsHistory.push( inputs );
  answer = evaluateExpression( inputs );
  resultsHistory.push( answer );
  console.log( 'responding', 201 );
  res.sendStatus(201);
});

/*******************************************************************************
*** FUNCTION DEFINITIONS * A-Z * Will be modules eventually ********************
*******************************************************************************/

/*******************************************************************************
*** LISTEN FOR CLIENT REQUESTS ON THIS PORT ************************************
*******************************************************************************/

app.listen( PORT, () => {
  console.log( `Listening on port ${PORT}...`);
});

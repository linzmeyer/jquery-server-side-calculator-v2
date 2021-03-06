/*******************************************************************************
*** Globals ********************************************************************
*******************************************************************************/

// Array to hold stuff
let charArray = [];
// Object to hold userInput data
let userInputs = {
  in1: '',
  operator: '',
  in2: ''
};

/*******************************************************************************
*** Application Start **********************************************************
*******************************************************************************/

// Initialize the page
$( document ).ready( readyNow );

/*******************************************************************************
*** FUNCTION DEFINITIONS * A-Z *************************************************
*******************************************************************************/

// - Listen for click on .equal class els, run hndlPostInput
// - Listen for click on #btn-clear-fields, run hndlClearFields
// - Listen for click on the .operator class, run hndlSetUserInputs
// - Listen for click on the .operator class, run hndlSetUserInputs
function addEventListeners() {
  $( '.equal' ).on( 'click', hndlPostInput );
  $( '#btn-clear-fields' ).on( 'click', hndlClearFields );
  $( '.operator' ).on( 'click', hndlSetUserInputs );
  $( '.in' ).on( 'click', hndlAddInputChar );
}

// - Push character into global array (charArray)
// - Create a string from the array of chars
function addInputChar ( ch ) {
  charArray.push( ch );
  // Init accumulator to hold a string value
  let result = '';
  for ( let character of charArray ) {
    // Accumulate string from charArray
    result += character;
  }
  // Return string
  return result;
}

// Clear DOM result header & history list
function clearDOM() {
  $( '#h2-result' ).empty();
  $( '#header-history' ).empty();
  $( '#ul-history' ).empty();
}

// - Reset input values to ''
// - Clear charArray
// - Focus on first input field
// - Reset property values of global object (userInputs)
function clearFields() {
  $( '#in-1' ).val('');
  charArray = [];
  userInputs.in1 = '';
  userInputs.in2 = '';
  userInputs.operator = '';
}

// AJAX GET REQUEST
// - Execute a GET request for domInfo server-generated object
//   - { currentAnswer: answer, history: {inputsHistory[], resultsHistory[]} }
//   - THEN ...
//     - Put request property values in variables to be used in renderDOM
//     - Run renderDOM with variables to empty and append info of server req object
function getDOMInfo() {
  // - Execute a GET request for domInfo server-generated object
  $.ajax({
    type: 'GET',
    url: '/get-DOMInfo'
  }).then(function ( domInfo ) {
    // - Put request property values in variables to be used in renderDOM
    let answer = domInfo.currentAnswer;
    let inputsArr = domInfo.history.inputs;
    let resultsArr = domInfo.history.results;
    // - Run renderDOM with variables to empty and append info of server req object
    renderDOM( answer, inputsArr, resultsArr );
  }).catch(function ( error ) {
    alert( 'Something went wrong. Check client console' );
  });
}

// EVENT HANDLER
// - Validate the button clicked
// - Add input char to current array of chars & store resulting string in a 
//    variable (mathExpression)
// - Reset input box value to value of mathExpression.
function hndlAddInputChar( e ) {
  e.preventDefault();

  // If button dosn't pass validation tests
  if ( validateButton( this ) === false ) {
    return;
  }
  // Add input char to current array of chars & store resulting string
  let mathExpression = addInputChar( $(this).attr('id') );
  // Display string of chars in input field
  $( '#in-1' ).val( mathExpression );
}

// EVENT HANDLER
// - Run clearFields to reset DOM info
// - Remove
function hndlClearFields( e ) {
  e.preventDefault();
  clearFields();
  // Remove handler from .num class els
  $( '.num' ).off( 'click', hndlsetInput2 );
}

// EVENT HANDLER
// - Put user inputs into an object for post request
// - If input validation fails, leave this function
// - Execute a POST request with the input data object
// - THEN ...
//   - Reset the value of global variable (operator)
//   - Execute a get request (see getDOMInfo())
function hndlPostInput( e ) {
  e.preventDefault();
  removeHnld();
  // If input validation fails, leave this function
  if ( validate( userInputs ) === false ) {
    return;
  }
  console.log( 'start post request' );
  // Execute a post request of input data
  $.ajax({
    method: 'POST',
    url: '/post-input',
    data: userInputs
  }).then( function( response ) {
    console.log( 'Post Request Successful!' );
    // Execute a get request that returns data to render to the DOM
    getDOMInfo();
  }).catch( function( error ) {
    console.log( `Error adding item`, error );
    console.log( 'Somthing went wrong with hndlPostInput post request.' );
    alert( 'Something went wrong with. Could not handle post request. Check client console' );
  });
}

// EVENT HANDLER
// - Get current value of input field
// - Get value of attribute id of button clicked
// - Execute a POST request with the input data object
function hndlSetUserInputs( e ) {
  e.preventDefault();

  // Get current value of input field
  let input1 = $( '#in-1' ).val();
  // Get value of attribute id of button clicked
  let operation = $( this ).attr( 'id' );

  $( '.num' ).on( 'click', hndlsetInput2 );
  setUserInputs( input1, operation);
}

function hndlsetInput2( e ) {
  e.preventDefault();
  userInputs.in2 += $(this).attr('id');
}

// - Execute a GET request to render DOM with info from server
// - Listen for events
function readyNow() {
  console.log( 'in readyNow' );
  // Execute a GET request to render DOM with info from server
    //  getDOMInfo();

  // EVENT LISTENERS
  addEventListeners();

}

function removeHnld() {
  
}

// - Clear inputs, focus, & reset the value of global variable (operator)
// - Clear DOM result header and history list
// - Append elements to render page
function renderDOM( finalEval, insArr, resultsArr ) {
  console.log( 'inputs history:', insArr );
  console.log( 'results history:', resultsArr );
  console.log( 'final answer:', finalEval );

  // Clear inputs, focus, & reset the value of global variable (operator)
  clearFields();
  // Clear DOM result header and history list
  clearDOM();

  // Append result
  $( '#h2-result' ).append( `<h2>Last Calculation: ${finalEval}</h2>` );
  // Append history header
  $( '#header-history' ).append( `<h2>History Of Your Calculations</h2>` );
  // Append history list
  for ( let i = 0; i < insArr.length; i++ ) {
    $( '#ul-history' ).append(
      `<li><h3>${
        insArr[i].in1 + ' ' +
        insArr[i].operator + ' ' +
        insArr[i].in2
      } = ${resultsArr[i]}</h3></li>`
    );
  }
}

function setUserInputs( v1, operator, v2 ) {
  // Store values in global variable
  userInputs.in1 = v1;
  userInputs.operator = operator;
}

// User input validation tests for input fields and button click
function validate( inObj ) {

  let failedMessage = 'user input validation test failed';


  if ( inObj.operator === '' ) {
    console.log( failedMessage );
    alert( 'Please make sure to select an operator to perform a mathematical evaluation.' );
    return false;
  }

  // If input is empty string
  if ( inObj.in1 === '' || inObj.in2 === '' ) {
    console.log( failedMessage );
    alert( 'You did not enter 2 numbers to be evaluated.');
    return false;
  }// If input is 0
  else if ( inObj.operator === '/' && inObj.in2 === 0 ) {
    console.log( failedMessage );
    alert( `If you leave an input field empty, it will be interpreted as '0'. If you want to divide by zero you will have to go to another universe to do so.`);
    return false;
  }// If input is undefined
  else if ( inObj.in1 === undefined || inObj.in2 === undefined ) {
    console.log( failedMessage );
    alert( 'One of your values is undefined.' );
    return false;
  }// If input is null
  else if ( inObj.in1 === null || inObj.in2 === null ) {
    alert( 'One of your values is null.' );
    return false;
  }// If input is NaN
  else if ( isNaN(inObj.in1) || isNaN(inObj.in2) ) {
    console.log( failedMessage );
    alert( 'One of your values is not a number.' );
    return false;
  }
  // Test if an operator was not selected
}

function validateButton( btnClicked ) {
  // store id attribute of button
  let id = $( btnClicked ).attr( 'id' );

  // if this el has the no-multiple class
  if ( $(btnClicked).hasClass('no-multiple') ) {
    // if this character is not in charArr already
    if ( !charArray.includes(id) ){
      return true;
    }
    else {
      return false;
    }
  }
  else { // if el doesn't have the no-multiple class
    // add the id of this button to the array
    return true;
  }
}

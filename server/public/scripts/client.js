/*******************************************************************************
*** Globals ********************************************************************
*******************************************************************************/

// Array to hold stuff
let charArray = [];

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

function addInputChar ( ch ) {
  console.log( 'in addInputChar' );
  charArray.push( ch );
  let result = '';
  for ( let character of charArray ) {
    //create string from array of chars
    result += character;
  }
  // return string
  return result;
}

// Clear DOM result header & history list
function clearDOM() {
  $( '#h2-result' ).empty();
  $( '#header-history' ).empty();
  $( '#ul-history' ).empty();
}

// - Reset input values to ''
// - Focus on first input field
function clearFields() {
  console.log( 'in clearFields' );
  $( '#in-1' ).val('');
  charArray = [];
  userInputs.in1 = '';
  userInputs.in2 = '';
  userInputs.operator = '';
}

// - Execute a GET request for domInfo server-generated object
//   - { currentAnswer: answer, history: {inputsHistory[], resultsHistory[]} }
//   - THEN ...
//     - Run renderDOM( domInfo ) to empty and append info of server req object
function getDOMInfo() {
  console.log( 'in getDOMInfo' );
  console.log( 'start get request' );
  $.ajax({
    type: 'GET',
    url: '/get-DOMInfo'
  }).then(function ( domInfo ) {
    console.log( domInfo );
    renderDOM( domInfo );
    console.log( 'end get request' );
    console.log( 'end post request.' );
  }).catch(function ( error ) {
    console.log( 'Somthing went wrong with getDOMInfo get request' );
    alert( 'Something went wrong. Check client console' );
  });
}

function hndlAddInputChar( e ) {
  e.preventDefault();
  console.log( 'in hndlAddInputChar' );

  // if button dosn't pass validation tests
  if ( validateButton( this ) === false ) {
    return;
  }
  // add input char to current array of chars
  let expression = addInputChar( $(this).attr('id') );
  // display string of chars
  $( '#in-1' ).val( expression );
}

// EVENT HANDLER
// - Run clearFields to reset DOM info
function hndlClearFields( e ) {
  console.log( 'in hndlClearFields' );
  e.preventDefault();
  clearFields();
  removeHnld();
  console.log( 'exit hndlClearFields' );
}

function hndlsetInput2( e ) {
  e.preventDefault();
  console.log( 'in get input2' );
  userInputs.in2 += $(this).attr('id');
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
  console.log( 'in hndlPostInput' );
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
    // Execute a get request that returns data to render to the DOM
    getDOMInfo();
  }).catch( function( error ) {
    console.log( `Error adding item`, error );
    console.log( 'Somthing went wrong with hndlPostInput post request.' );
    alert( 'Something went wrong. Check client console' );
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

// - Execute a GET request to render DOM with info from server
// - Listen for events
function readyNow() {
  console.log( 'in readyNow' );
  // Execute a GET request to render DOM with info from server
    //  getDOMInfo();

  // EVENT LISTENERS
  // - Listen for click on .equal class els, run hndlPostInput
  $( '.equal' ).on( 'click', hndlPostInput );
  // - Listen for click on #btn-clear-fields, run hndlClearFields
  $( '#btn-clear-fields' ).on( 'click', hndlClearFields );
  // - Listen for click on the .operator class, run hndlSetUserInputs
  $( '.operator' ).on( 'click', hndlSetUserInputs );

  $( '.in' ).on( 'click', hndlAddInputChar );
}

function removeHnld() {
  $( '.num' ).off( 'click', hndlsetInput2 );
}

// - Clear inputs, focus, & reset the value of global variable (operator)
// - Clear DOM result header and history list
// - Append elements to render page
function renderDOM( info ) {
  console.log( 'in renderDOM' );
  console.log( 'info:', info );

  // Clear inputs, focus, & reset the value of global variable (operator)
  clearFields();
  // Clear DOM result header and history list
  clearDOM();

  // Append result
  $( '#h2-result' ).append( `<h2>Last Calculation: ${info.currentAnswer}</h2>` );
  // Append history header
  $( '#header-history' ).append( `<h2>History Of Your Calculations</h2>` );
  // Append history list
  for ( let i = 0; i < info.history.inputs.length; i++ ) {
    $( '#ul-history' ).append(
      `<li><h3>${
        info.history.inputs[i].input1 + ' ' +
        info.history.inputs[i].operator + ' ' +
        info.history.inputs[i].input2
      } = ${info.history.results[i]}</h3></li>`
    );
  }
  console.log( 'exit renderDOM' );
}

function setUserInputs( v1, operator, v2 ) {
  console.log( 'in setUserInputs');
  // Store values in global variable
  userInputs.in1 = v1;
  userInputs.operator = operator;
}

// User input validation tests for input fields and button click
function validate( inObj ) {
  console.log( 'in validate' );

  let failedMessage = 'user input validation test failed';
  // If input is empty string
  if ( inObj.input1 === '' || inObj.input2 === '' ) {
    console.log( failedMessage );
    alert( 'One of your values is empty text.');
    console.log( 'exit validate' );
    return false;
  }// If input is 0
  else if ( inObj.input2 === 0 ) {
    console.log( failedMessage );
    alert( `If you leave an input field empty, it will be interpreted as '0'. If you want to divide by zero you will have to go to another universe to do so.`);
    console.log( 'exit validate' );
    return false;
  }// If input is undefined
  else if ( inObj.input1 === undefined || inObj.input2 === undefined ) {
    console.log( failedMessage );
    alert( 'One of your values is undefined.' );
    console.log( 'exit validate' );
    return false;
  }// If input is null
  else if ( inObj.input1 === null || inObj.input2 === null ) {
    alert( 'One of your values is null.' );
    console.log( 'exit validate' );
    return false;
  }// If input is NaN
  else if ( isNaN(inObj.input1) || isNaN(inObj.input2) ) {
    console.log( failedMessage );
    alert( 'One of your values is not a number.' );
    console.log( 'exit validate' );
    return false;
  }
  // Test if an operator was not selected
  if ( inObj.operator === '' ) {
    console.log( failedMessage );
    alert( 'Please make sure to select an operator to perform a mathematical evaluation.' );
    console.log( 'exit validate' );
    return false;
  }
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

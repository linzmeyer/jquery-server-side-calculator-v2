/* jslint node: true */

// - Change data type of first input to number
// - Store operator
// - Change data type of second input to number
// - Based on the operattor chosen, make an operation, and return the result.
function evaluateExpression( inputObj ) {
  console.log( 'in evaluateExpression' );

  let in1 = Number( inputObj.input1 );
  let op = inputObj.operator;
  let in2 = Number( inputObj.input2 );

  // Based on the operattor chosen, make an operation, and return the result.
  if ( op === '+' ) {
    return ( in1 + in2 );
  }
  else if ( op === '-' ) {
    return ( in1 - in2 );
  }
  else if ( op === '*' ) {
    return ( in1 * in2 );
  }
  else if ( op === '/' ) {
    return ( in1 / in2 );
  }
  console.log( 'exit evaluateExpression' );
}

module.exports = evaluateExpression;

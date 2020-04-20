//------------------------------------------------------------------------
//! Error class
//NOTE: Not using class to extend inbuilt classes due to a babel shortcoming: https://stackoverflow.com/questions/33870684/why-doesnt-instanceof-work-on-instances-of-error-subclasses-under-babel-node
//This should then allow MatrixError to be subclassed using class as normal.

export function MatrixError(message){
  const instance = Error.call(this, message);
  instance.name = "MatrixError";
  instance.message = message;
  return instance;
}
MatrixError.prototype = Object.create(Error.prototype, {
  constructor: {
    value: Error,
    enumerable: false,
    writable: true,
    configurable: true,
  },
});
Object.setPrototypeOf(MatrixError, Error);

export const InvalidDimensions = 'Invalid matrix dimensions for the operation.',
             IsSingular='Matrix is singular to working precision.',
             Assignment = 'Assignment error, matrix dimensions do not match.';
// Native Error Types
const nativeExceptions = [
  EvalError,
  RangeError,
  ReferenceError,
  SyntaxError,
  TypeError,
  URIError
].filter((except) => typeof except === 'function');

// Throw Native Errors
const throwNative = (error) => {
  for (const Exception of nativeExceptions) {
    if (error instanceof Exception) throw error;
  }
};

// Helper Buddy For Removing async/await try/catch Litter
const catchAsync = (promise, finallyFunc) =>
  promise
    .then((data) => {
      if (data instanceof Error) {
        throwNative(data);
        return [data];
      }
      return [undefined, data];
    })
    .catch((error) => {
      throwNative(error);
      return [error];
    })
    .finally(() => {
      if (finallyFunc && typeof finallyFunc === 'function') {
        finallyFunc();
      }
    });

export default catchAsync;

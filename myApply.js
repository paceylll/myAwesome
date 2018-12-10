// 手动实现call
Function.prototype.myCall = function(...args) {
  const context = args[0] || window;
  context.fn = this;

  let result;
  if (args[1]) {
    result = context.fn(...args.slice(1));
  } else {
    result = context.fn();
  }

  return result;
}

// 手动实现apply
Function.prototype.myApply = function(...args) {
  const context = args[0] || window;
  context.fn = this;

  let result;
  if (args[1]) {
    result = context.fn(...args[1]);
  } else {
    result = context.fn();
  }

  return result;
}

// 手动实现bind
Function.prototype.bind = function(...args) {
  const context = args[0] || window;
  context.fn = this;
  
  return function(...argv) {
    return context.fn(...args.slice(1), ...argv);
  }
}
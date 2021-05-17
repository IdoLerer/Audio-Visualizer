const throttle = (func, limit) => {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = setTimeout(() => inThrottle = false, limit);
    }
  }
}
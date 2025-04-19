const logger = {
  info: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`ℹ️ ${message}`);
    }
  },
  error: (message, error) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`❌ ${message}`, error);
    }
  },
  success: (message) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`✅ ${message}`);
    }
  }
};

module.exports = logger;
const logger = {
  info: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`ℹ️ ${message}`, meta);
    }
  },
  warn: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(`⚠️ ${message}`, meta);
    }
  },
  error: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.error(`❌ ${message}`, meta);
    }
  },
  success: (message, meta = {}) => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`✅ ${message}`, meta);
    }
  }
};

module.exports = logger;


module.exports = {
    webpack: {
      configure: {
        resolve: {
          fallback: {
            "crypto": require.resolve("crypto-browserify"),
            "http": require.resolve("stream-http"),
            "https": require.resolve("https-browserify"),
            "stream": require.resolve("stream-browserify"),
            "buffer": require.resolve("buffer/"),
            // Add other required modules as needed
          }
        }
      }
    }
  };
  
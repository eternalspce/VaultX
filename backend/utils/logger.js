const fs = require("fs");
const path = require("path");

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const LOG_COLORS = {
  ERROR: "\x1b[31m", // Red
  WARN: "\x1b[33m", // Yellow
  INFO: "\x1b[36m", // Cyan
  DEBUG: "\x1b[35m", // Magenta
  RESET: "\x1b[0m",
};

class Logger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || "info";
    this.logFile = path.join(logsDir, `${new Date().toISOString().split("T")[0]}.log`);
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message, data = null) {
    const timestamp = this.getTimestamp();
    const color = LOG_COLORS[level] || "";
    const reset = LOG_COLORS.RESET;
    
    let formattedMsg = `[${timestamp}] ${color}[${level}]${reset} ${message}`;
    if (data) {
      formattedMsg += `\n${JSON.stringify(data, null, 2)}`;
    }
    return formattedMsg;
  }

  write(level, message, data = null) {
    const formattedMsg = this.formatMessage(level, message, data);
    
    // Console output
    console.log(formattedMsg);
    
    // File output (skip debug in production)
    if (process.env.NODE_ENV !== "production" || level !== "DEBUG") {
      const fileMsg = `[${this.getTimestamp()}] [${level}] ${message}${data ? "\n" + JSON.stringify(data, null, 2) : ""}`;
      fs.appendFileSync(this.logFile, fileMsg + "\n");
    }
  }

  error(message, data = null) {
    this.write(LOG_LEVELS.ERROR, message, data);
  }

  warn(message, data = null) {
    this.write(LOG_LEVELS.WARN, message, data);
  }

  info(message, data = null) {
    this.write(LOG_LEVELS.INFO, message, data);
  }

  debug(message, data = null) {
    if (process.env.LOG_LEVEL === "debug") {
      this.write(LOG_LEVELS.DEBUG, message, data);
    }
  }
}

module.exports = new Logger();

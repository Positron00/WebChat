type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  requestId?: string;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatTimestamp(): string {
    return new Date().toISOString();
  }

  private addLog(level: LogLevel, message: string, data?: any, requestId?: string) {
    const logEntry: LogEntry = {
      timestamp: this.formatTimestamp(),
      level,
      message,
      data,
      requestId,
    };

    // Add to internal logs with rotation
    this.logs.push(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output with color
    const coloredLevel = this.getColoredLevel(level);
    const requestIdStr = requestId ? ` [${requestId}]` : '';
    console.log(
      `${logEntry.timestamp} ${coloredLevel}${requestIdStr}: ${message}`,
      data ? data : ''
    );

    // If error, also log to error monitoring service (if available)
    if (level === 'error' && typeof window !== 'undefined') {
      // Here you could integrate with error monitoring services like Sentry
      // For now, we'll just ensure it's logged to console.error
      console.error(message, data);
    }
  }

  private getColoredLevel(level: LogLevel): string {
    const colors = {
      debug: '\x1b[36m', // Cyan
      info: '\x1b[32m',  // Green
      warn: '\x1b[33m',  // Yellow
      error: '\x1b[31m', // Red
      reset: '\x1b[0m',  // Reset
    };

    return `${colors[level]}${level.toUpperCase()}${colors.reset}`;
  }

  debug(message: string, data?: any, requestId?: string) {
    this.addLog('debug', message, data, requestId);
  }

  info(message: string, data?: any, requestId?: string) {
    this.addLog('info', message, data, requestId);
  }

  warn(message: string, data?: any, requestId?: string) {
    this.addLog('warn', message, data, requestId);
  }

  error(message: string, data?: any, requestId?: string) {
    this.addLog('error', message, data, requestId);
  }

  getLogs(level?: LogLevel, limit = 100): LogEntry[] {
    let filteredLogs = this.logs;
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    return filteredLogs.slice(-limit);
  }

  clearLogs() {
    this.logs = [];
  }

  getErrorRate(): number {
    const totalLogs = this.logs.length;
    const errorLogs = this.logs.filter(log => log.level === 'error').length;
    return totalLogs > 0 ? errorLogs / totalLogs : 0;
  }
}

export const logger = Logger.getInstance(); 
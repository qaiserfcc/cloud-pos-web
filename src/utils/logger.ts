import winston from 'winston'

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  userId?: string
  sessionId?: string
  userAgent?: string
  url?: string
}

class LoggerService {
  private logs: LogEntry[] = []
  private maxLogs = 1000 // Keep last 1000 logs in memory
  private sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadLogsFromStorage()
    this.setupGlobalErrorHandler()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadLogsFromStorage() {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem('server_log')
      if (stored) {
        this.logs = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Failed to load logs from storage:', error)
    }
  }

  private saveLogsToStorage() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('server_log', JSON.stringify(this.logs))
    } catch (error) {
      console.error('Failed to save logs to storage:', error)
    }
  }

  private setupGlobalErrorHandler() {
    if (typeof window === 'undefined') return
    
    // Global error handler for uncaught errors
    window.addEventListener('error', (event) => {
      this.error('Uncaught error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      })
    })

    // Global promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.error('Unhandled promise rejection', {
        reason: event.reason,
        promise: event.promise
      })
    })
  }

  private createLogEntry(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      sessionId: this.sessionId,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
      url: typeof window !== 'undefined' ? window.location.href : undefined
    }
  }

  private addLog(entry: LogEntry) {
    this.logs.push(entry)
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs)
    }
    
    this.saveLogsToStorage()
    
    // Also log to console for development
    const consoleMethod = entry.level === LogLevel.ERROR ? 'error' : 
                         entry.level === LogLevel.WARN ? 'warn' : 
                         entry.level === LogLevel.INFO ? 'info' : 'debug'
    
    console[consoleMethod](`[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`, entry.data || '')
  }

  error(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.ERROR, message, data))
  }

  warn(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.WARN, message, data))
  }

  info(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.INFO, message, data))
  }

  debug(message: string, data?: any) {
    this.addLog(this.createLogEntry(LogLevel.DEBUG, message, data))
  }

  // User action logging
  userAction(action: string, details?: any) {
    this.info(`User Action: ${action}`, details)
  }

  // API logging
  apiCall(method: string, url: string, status?: number, duration?: number, error?: any) {
    const level = status && status >= 400 ? LogLevel.ERROR : LogLevel.INFO
    const message = `API ${method} ${url} - ${status || 'pending'}`
    
    this.addLog({
      ...this.createLogEntry(level, message, { method, url, status, duration, error }),
      level
    })
  }

  // Authentication logging
  authEvent(event: string, details?: any) {
    this.info(`Auth Event: ${event}`, details)
  }

  // Performance logging
  performance(metric: string, value: number, details?: any) {
    this.info(`Performance: ${metric}`, { value, ...details })
  }

  // Get all logs
  getLogs(): LogEntry[] {
    return [...this.logs]
  }

  // Get logs by level
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level)
  }

  // Get logs within date range
  getLogsInRange(startDate: Date, endDate: Date): LogEntry[] {
    return this.logs.filter(log => {
      const logDate = new Date(log.timestamp)
      return logDate >= startDate && logDate <= endDate
    })
  }

  // Clear all logs
  clearLogs() {
    this.logs = []
    this.saveLogsToStorage()
  }

  // Download logs as file
  downloadLogs(filename: string = 'server_logs') {
    if (typeof window === 'undefined') return
    
    const logsText = this.logs.map(log => 
      `[${log.timestamp}] ${log.level.toUpperCase()}: ${log.message}${log.data ? ' ' + JSON.stringify(log.data) : ''}`
    ).join('\n')

    const blob = new Blob([logsText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Export logs as JSON
  exportLogsAsJSON() {
    if (typeof window === 'undefined') return
    
    const dataStr = JSON.stringify(this.logs, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `server_logs_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }
}

export const logger = new LoggerService()

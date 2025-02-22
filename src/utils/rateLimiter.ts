import { CHAT_SETTINGS } from '@/config/chat';
import { logger } from '@/utils/logger';

class RateLimiter {
  private timestamps: number[] = [];
  private readonly windowMs = CHAT_SETTINGS.rateLimitWindowMs;
  private readonly maxRequestsPerWindow = CHAT_SETTINGS.rateLimitPerMinute;
  private backoffMultiplier = 1;

  isRateLimited(): boolean {
    const now = Date.now();
    const windowStart = now - (this.windowMs * this.backoffMultiplier);
    
    // Remove timestamps older than the window
    this.timestamps = this.timestamps.filter(t => t > windowStart);
    
    // Check if we're over the limit
    const isLimited = this.timestamps.length >= this.maxRequestsPerWindow;
    
    if (isLimited) {
      logger.warn('Rate limit reached', {
        currentRequests: this.timestamps.length,
        maxRequests: this.maxRequestsPerWindow,
        windowMs: this.windowMs,
        backoffMultiplier: this.backoffMultiplier
      });
      // Increase backoff if we're hitting limits frequently
      this.backoffMultiplier = Math.min(this.backoffMultiplier * 1.5, 4);
    } else {
      // Gradually reduce backoff when we're under limit
      this.backoffMultiplier = Math.max(1, this.backoffMultiplier * 0.9);
    }

    return isLimited;
  }

  addRequest(): void {
    const now = Date.now();
    this.timestamps.push(now);
    
    // Keep only the most recent timestamps within our window
    const windowStart = now - (this.windowMs * this.backoffMultiplier);
    this.timestamps = this.timestamps.filter(t => t > windowStart);
    
    logger.debug('Added request to rate limiter', {
      currentRequests: this.timestamps.length,
      maxRequests: this.maxRequestsPerWindow,
      remainingRequests: this.getRemainingRequests()
    });
  }

  getTimeUntilNextAllowed(): number {
    if (this.timestamps.length === 0) return 0;
    if (this.timestamps.length < this.maxRequestsPerWindow) return 0;
    
    const now = Date.now();
    const windowStart = now - (this.windowMs * this.backoffMultiplier);
    const sortedTimestamps = [...this.timestamps].sort((a, b) => a - b);
    const oldestRelevantTimestamp = sortedTimestamps[
      Math.max(0, sortedTimestamps.length - this.maxRequestsPerWindow)
    ];
    
    const timeUntilExpiry = (oldestRelevantTimestamp + (this.windowMs * this.backoffMultiplier)) - now;
    const waitTime = Math.max(0, timeUntilExpiry);
    
    logger.debug('Calculated wait time', {
      waitTime,
      currentRequests: this.timestamps.length,
      oldestTimestamp: new Date(oldestRelevantTimestamp).toISOString()
    });
    
    return waitTime;
  }

  getRemainingRequests(): number {
    const now = Date.now();
    const windowStart = now - (this.windowMs * this.backoffMultiplier);
    this.timestamps = this.timestamps.filter(t => t > windowStart);
    return Math.max(0, this.maxRequestsPerWindow - this.timestamps.length);
  }

  handleRateLimitError(): void {
    // Increase backoff when we hit an actual rate limit error
    this.backoffMultiplier = Math.min(this.backoffMultiplier * 2, 8);
    logger.warn('Rate limit error occurred, increasing backoff', {
      newBackoffMultiplier: this.backoffMultiplier,
      windowMs: this.windowMs * this.backoffMultiplier
    });
  }

  clear(): void {
    this.timestamps = [];
    this.backoffMultiplier = 1;
    logger.info('Rate limiter cleared');
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter(); 
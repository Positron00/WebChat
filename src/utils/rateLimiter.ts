import { CHAT_SETTINGS } from '@/config/chat';

class RateLimiter {
  private timestamps: number[] = [];
  private readonly windowMs = 60000; // 1 minute window

  isRateLimited(): boolean {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    
    // Remove timestamps older than the window
    this.timestamps = this.timestamps.filter(t => t > windowStart);
    
    // Check if we're over the limit
    if (this.timestamps.length >= CHAT_SETTINGS.rateLimitPerMinute) {
      return true;
    }
    
    // Add new timestamp
    this.timestamps.push(now);
    return false;
  }

  getTimeUntilNextAllowed(): number {
    if (this.timestamps.length === 0) return 0;
    
    const oldestTimestamp = this.timestamps[0];
    const timeUntilExpiry = (oldestTimestamp + this.windowMs) - Date.now();
    
    return Math.max(0, timeUntilExpiry);
  }

  getRemainingRequests(): number {
    const now = Date.now();
    const windowStart = now - this.windowMs;
    this.timestamps = this.timestamps.filter(t => t > windowStart);
    return Math.max(0, CHAT_SETTINGS.rateLimitPerMinute - this.timestamps.length);
  }

  clear(): void {
    this.timestamps = [];
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter(); 
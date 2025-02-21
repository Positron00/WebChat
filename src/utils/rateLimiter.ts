import { CHAT_SETTINGS } from '@/config/chat';

class RateLimiter {
  private timestamps: number[] = [];

  isRateLimited(): boolean {
    const now = Date.now();
    const windowStart = now - 60000; // 1 minute window
    
    // Remove old timestamps
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
    const timeUntilExpiry = (oldestTimestamp + 60000) - Date.now();
    
    return Math.max(0, timeUntilExpiry);
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter(); 
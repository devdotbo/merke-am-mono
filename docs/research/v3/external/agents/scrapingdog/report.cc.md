# Scrapingdog Research Report - X/Twitter Content Access

## Executive Summary

- Scrapingdog offers dedicated X (Twitter) Scraper API with post and profile endpoints
- Pricing: 5 credits per request; plans from $40/month (40K requests) to $350/month (1.2M requests)
- [Vendor-claimed] 99% monthly uptime SLA with credit compensation for downtime
- Provides structured JSON responses for tweets including engagement metrics, user data, and media
- Limited documentation available for Twitter-specific features; no search/timeline endpoints documented

## Research Methodology

Comprehensive web research conducted using Tavily search API, focusing on official Scrapingdog documentation, pricing pages, and technical implementation details. All information retrieved on 2025-01-24.

## Key Findings

### 1. Coverage & Features for X/Twitter

**Available Endpoints** [Vendor-claimed]:
- **X Post Scraper API** (`/x/post`): Extract individual tweet data by tweet ID
- **X Profile Scraper API** (`/x/profile`): Extract user profile information by username

**Data Points Available** [Vendor-claimed]:
- Posts: views, retweets, quotes, likes, bookmarks, tweet text, creation date, tweet ID, URL
- Profiles: followers count, following count, bio, likes count, media count, verification status, profile picture
- User metadata: blue verification status, affiliates labels, location, pinned tweets

**Notable Limitations**:
- No documented search functionality
- No timeline/feed scraping endpoints
- No thread extraction capabilities documented
- No media download endpoints specified

### 2. Rate Limits and Latency

**Concurrency Limits** [Vendor-claimed]:
- Lite Plan: 5 concurrent connections
- Standard Plan: 50 concurrent connections  
- Pro Plan: 100 concurrent connections
- Premium Plan: 150 concurrent connections

**Request Handling** [Vendor-claimed]:
- Automatic retry mechanism for failed requests (up to 60 seconds)
- 429 status code returned when exceeding concurrent connection limit
- Only charged for successful requests (200 and 404 status codes)

**Latency**: No specific latency metrics documented or independently verified

### 3. Pricing Model and Tiers

**Credit System** [Vendor-claimed]:
- X/Twitter API: 5 credits per request
- 1,000 free credits for new users (200 Twitter requests)

**Monthly Plans** [Vendor-claimed]:

| Plan | Monthly Price | Annual Price | Twitter Requests | Price per 1K | Concurrency |
|------|--------------|--------------|------------------|--------------|-------------|
| Lite | $40 | $33.33 | 40,000 | $1.00 | 5 |
| Standard | $90 | $75 | 200,000 | $0.45 | 50 |
| Pro | $200 | $166.66 | 600,000 | $0.33 | 100 |
| Premium | $350 | $291.66 | 1,200,000 | $0.29 | 150 |

**1M Posts/Month Scenario**:
- Would require Premium plan ($350/month) which provides 1.2M requests
- Cost: $290 per million requests at Premium tier
- Assumptions: Single API call per post, no retries needed

### 4. Reliability & SLA

**Service Level Agreement** [Vendor-claimed]:
- 99% monthly uptime target
- Service credit compensation for unexpected downtime
- Credits only (no monetary refunds)
- Maintenance notifications via dashboard and email

**Error Handling** [Vendor-claimed]:
- 410 error for requests failing after 60 seconds (not charged)
- Automatic retry mechanism built-in
- 98-99% success rate claimed for Twitter scraping

**Monitoring**: 
- Status page available at stats.uptimerobot.com/SAQkQwbOYj (Retrieved 2025-01-24)

### 5. Compliance Posture

**Terms of Service Alignment** [Vendor-claimed]:
- States "Scraping publicly available data like views, retweets, profile handle is considered legal"
- Uses residential proxies to avoid detection
- Automatic IP rotation to prevent blocking

**Data Handling**:
- GDPR compliance page available
- Data Processing Agreement offered
- Privacy policy documented

**Anti-Abuse Measures** [Vendor-claimed]:
- Automatic header management
- IP anonymization through proxy rotation
- Rate limiting to prevent server overload

### 6. Implementation Notes

**Authentication**:
- API key-based authentication
- Keys available via user dashboard

**Request Format**:
```bash
# Post endpoint example
curl "https://api.scrapingdog.com/x/post?api_key=YOUR_KEY&tweetId=1655608985058267139"

# Profile endpoint example  
curl "https://api.scrapingdog.com/x/profile?api_key=YOUR_KEY&profileId=elonmusk"
```

**Response Format**: 
- JSON structured data
- Includes nested user object with comprehensive profile data

**SDK Support** [Vendor-claimed]:
- Code examples provided for: Python, JavaScript/Node.js, Ruby, PHP, Java
- No official SDK packages documented

**Pagination**: Not documented for Twitter endpoints

**Error Handling Best Practices** [Vendor-claimed]:
- Set timeout to 60 seconds for retry mechanism
- Implement handling for 429 (rate limit) responses
- Monitor 410 errors (1-2% expected failure rate)

## Analysis & Insights

Scrapingdog provides basic Twitter/X scraping capabilities focused on individual posts and profiles. The service appears more oriented toward general web scraping with Twitter as an add-on feature rather than a comprehensive Twitter data solution. The lack of search, timeline, and thread capabilities significantly limits its utility for comprehensive Twitter analysis.

Pricing is credit-based and relatively expensive for high-volume Twitter scraping compared to specialized Twitter API providers. The 5 credits per request model means effective costs are higher than the advertised per-request pricing for general web scraping.

## Areas of Uncertainty

- Actual success rates and latency metrics not independently verified
- No information on handling of private accounts or login-required content
- Unclear how the service handles Twitter's dynamic content loading
- No documentation on rate limiting from Twitter's side
- Limited information on data freshness and caching policies

## Sources & References

1. [Scrapingdog Twitter Scraper API Page](https://www.scrapingdog.com/twitter-scraper-api/) - Retrieved 2025-01-24
2. [Scrapingdog X Scraper API Documentation](https://docs.scrapingdog.com/x-scraper-api) - Retrieved 2025-01-24
3. [Scrapingdog X Post Scraper API Docs](https://docs.scrapingdog.com/x-scraper-api/x-post-scraper-api) - Retrieved 2025-01-24
4. [Scrapingdog X Profile Scraper API Docs](https://docs.scrapingdog.com/x-scraper-api/x-profile-scraper-api) - Retrieved 2025-01-24
5. [Scrapingdog Pricing Page](https://www.scrapingdog.com/#pricing) - Retrieved 2025-01-24
6. [Scrapingdog SLA](https://www.scrapingdog.com/sla/) - Retrieved 2025-01-24
7. [Scrapingdog General Documentation](https://docs.scrapingdog.com/) - Retrieved 2025-01-24
8. [How to Scrape X Using Python - Scrapingdog Blog](https://www.scrapingdog.com/blog/scrape-twitter/) - Retrieved 2025-01-24

## Appendix

### Sample API Response Structure

**Post Endpoint Response**:
```json
{
  "views": "78802082",
  "retweets": 35858,
  "quotes": 16507,
  "likes": 370782,
  "bookmarks": 2934,
  "tweet": "Tweet text content",
  "created_at": "Mon May 08 16:21:56 +0000 2023",
  "tweet_id": "1655608985058267139",
  "post_url": "https://www.x.com/elonmusk/status/1655608985058267139",
  "user": {
    "profile_name": "Elon Musk",
    "profile_handle": "elonmusk",
    "followers_count": 219187202,
    "following_count": 1108,
    "is_blue_verified": true
  }
}
```

### Competitor Positioning

Scrapingdog positions itself as an alternative to ScraperAPI, Scrapingbee, and SerpAPI, emphasizing:
- 5+ years in market [Vendor-claimed]
- Residential proxy infrastructure
- Multi-language documentation
- 24/7 customer support via chat, email, and video calls [Vendor-claimed]
# twscrape - OSS Twitter/X Scraper Research Report

## Executive Summary
- Python-based Twitter/X scraper with 1,869 GitHub stars actively maintained through January 2025
- Supports authentication via username/password or cookies with multi-account pooling for rate limit management
- Provides both GraphQL and Search API access with async/await architecture
- Implements automatic account switching but requires managing multiple accounts and handling authentication challenges
- Latest version v0.17.0 released April 29, 2025, with ongoing updates for X API changes

## Research Methodology
Research conducted on 2025-01-24 using GitHub API analysis, repository documentation review, issue tracker examination, and web search for implementation patterns and user experiences. Primary focus on official repository (vladkens/twscrape) and related community discussions.

## Key Findings

### Scope and Capabilities

twscrape provides comprehensive X/Twitter data access capabilities [GitHub Repository](https://github.com/vladkens/twscrape) (Retrieved: 2025-01-24):

**Core Features:**
- Search API with tabs support (Top, Latest, Media)
- User profile data (followers, following, tweets, media)
- Tweet details (replies, retweeters, favoriters)
- List timelines and trends
- Verified followers and subscriptions
- Support for both parsed data models and raw API responses

**Data Models:**
- SNScrape-compatible data models for consistency
- JSON/dict conversion support
- Pagination handling with automatic continuation

**API Coverage:**
- GraphQL endpoints for user data and tweet details
- Search API for content discovery
- Trends API for topic monitoring
- List API for curated content streams

### Maintenance and Health

**Repository Activity** [GitHub Repository](https://github.com/vladkens/twscrape) (Retrieved: 2025-01-24):
- Created: May 5, 2023
- Last push: January 29, 2025
- Stars: 1,869
- Forks: 217
- Open issues: 58
- License: MIT

**Recent Development:**
- v0.17.0 released April 29, 2025
- Regular updates for X API changes (GraphQL endpoint updates)
- Active issue response from maintainer
- Updates addressing x-client-transaction-id requirements

**Community Engagement:**
- 58 open issues indicating active usage
- Community contributions and discussions
- Published on PyPI with regular releases

### Typical Throughput

Performance characteristics based on user reports and documentation [Medium Article](https://medium.com/@vladkens/how-to-still-scrape-millions-of-tweets-in-2023-using-twscrape-97f5d3881434) (Retrieved: 2025-01-24):

- **Estimated throughput**: 8-16 tweets per second depending on query complexity
- **Bulk operations**: 5,000 tweets in 5-10 minutes reported
- **Concurrency support**: Async/await allows parallel scrapers
- **Account rotation**: Automatic switching maintains continuous data flow

**Performance Factors:**
- Number of available accounts
- Rate limit status per account
- Query complexity and filters
- Network latency and proxy overhead

### Setup and Authentication

**Account Options** [Vendor-claimed] [GitHub Repository](https://github.com/vladkens/twscrape) (Retrieved: 2025-01-24):

1. **Cookie-based Authentication** (Recommended):
```python
cookies = "abc=12; ct0=xyz"  # or JSON format
await api.pool.add_account("user", "pass", "email", "email_pass", cookies=cookies)
```

2. **Username/Password Authentication**:
- Requires email for verification codes
- IMAP support needed for automatic verification
- Manual verification option available with --manual flag

**Account Management CLI**:
```bash
# Add accounts from file
twscrape add_accounts accounts.txt username:password:email:email_password:_:cookies

# Login accounts
twscrape login_accounts

# Check account status
twscrape accounts
```

**Third-party Account Sources** [Vendor-claimed]:
- Ready-to-use accounts with cookies available from providers
- Cookie-based accounts reported as more stable
- Reduces setup complexity but adds dependency

### Pagination Approach

**Implementation Details** [GitHub Repository](https://github.com/vladkens/twscrape) (Retrieved: 2025-01-24):

- **Cursor-based pagination**: Automatic handling of continuation tokens
- **Limit parameter**: Specifies desired object count, tool attempts to return no less than requested
- **Generator pattern**: Memory-efficient streaming of results
```python
async for tweet in api.search("query", limit=100):
    # Process each tweet
```

- **Gather helper**: Collects all results as list
```python
tweets = await gather(api.search("query", limit=100))
```

- **Break handling**: Special syntax required for proper account release
```python
async with aclosing(api.search("query")) as gen:
    async for tweet in gen:
        if condition:
            break
```

### Retries and Backoff

**Rate Limit Handling** [GitHub Repository](https://github.com/vladkens/twscrape) (Retrieved: 2025-01-24):

- **Automatic account switching**: QueueClient switches context when account is rate limited
- **Account pool rotation**: Continues with next available account
- **No explicit backoff**: Relies on account rotation rather than waiting
- **Rate limit windows**: 15-minute reset periods per endpoint per account

**Error Handling**:
- Session expiration detection
- Ban detection with account marking
- Automatic retry with different account
- Error logging for debugging

### Anti-Bot and Ban Handling Considerations

**Detection Mitigation Strategies**:

1. **Multi-account approach**: Distributes requests across accounts to avoid single-account limits
2. **Cookie support**: More stable than password auth, reduces login detection
3. **Proxy support**: Multiple configuration options for IP rotation
4. **Human-like patterns**: Async operations allow request spacing

**Known Challenges** (Based on issue reports):
- "Session expired or banned" errors reported by users
- Accounts can become inactive despite successful login
- Email verification requirements increasing
- X-client-transaction-id header requirements (addressed in v0.17.0)

### Proxy Requirements

**Configuration Options** [GitHub Repository](https://github.com/vladkens/twscrape) (Retrieved: 2025-01-24):

1. **Per-account proxy**:
```python
proxy = "http://login:pass@example.com:8080"
await api.pool.add_account("user", "pass", "email", "mail_pass", proxy=proxy)
```

2. **Global proxy**:
```python
api = API(proxy="http://login:pass@example.com:8080")
```

3. **Environment variable**:
```bash
TWS_PROXY=socks5://user:pass@127.0.0.1:1080 twscrape command
```

4. **Runtime changes**:
```python
api.proxy = "socks5://user:pass@127.0.0.1:1080"
```

**Priority System**:
- api.proxy (highest priority)
- env.proxy (medium priority)  
- acc.proxy (lowest priority)

**Supported Protocols**:
- HTTP/HTTPS proxies with authentication
- SOCKS5 proxies with authentication

### Observability

**Logging Capabilities** [GitHub Repository](https://github.com/vladkens/twscrape) (Retrieved: 2025-01-24):

```python
from twscrape.logger import set_log_level
set_log_level("DEBUG")  # Options: DEBUG, INFO, WARNING, ERROR
```

**Available Metrics**:
- Account login status
- Active/inactive account state
- Last used timestamp per account
- Total requests per account
- Error messages and types

**CLI Monitoring**:
```bash
twscrape accounts
# Shows: username, logged_in, active, last_used, total_req, error_msg
```

**Limitations**:
- No built-in metrics export
- No performance monitoring
- No request tracing
- Limited to console logging

### Maintenance Burden

**Ongoing Requirements**:

1. **Account Management**:
   - Regular account health monitoring
   - Replacement of banned/limited accounts
   - Cookie refresh for expired sessions
   - Email account maintenance for verification

2. **API Updates**:
   - GraphQL endpoint changes require updates
   - Header requirement changes (e.g., x-client-transaction-id)
   - Rate limit adjustments
   - Authentication flow changes

3. **Operational Tasks**:
   - Proxy rotation and monitoring
   - Database backup of account sessions
   - Log monitoring for errors
   - Performance tuning for throughput

4. **Development Overhead**:
   - Dependency updates
   - Compatibility with X API changes
   - Issue triage and bug fixes
   - Testing across Python versions

**Complexity Factors**:
- Multi-account coordination
- Email provider compatibility for IMAP
- Proxy infrastructure management
- Session persistence and recovery

## Analysis and Insights

### Strengths
- Active maintenance with recent updates addressing X API changes
- Flexible authentication options supporting both credentials and cookies
- Comprehensive API coverage including GraphQL endpoints
- Strong async/await support for concurrent operations
- Automatic account rotation for continuous data flow

### Limitations
- Requires multiple accounts to achieve reasonable throughput
- Account management overhead with regular maintenance needs
- Limited built-in observability beyond basic logging
- No automatic exponential backoff, relies solely on account switching
- Dependency on third-party account providers for easier setup

### Use Case Fit
- **Best for**: Research projects, data collection with moderate volume requirements, users comfortable managing multiple accounts
- **Less suitable for**: High-volume production systems, real-time monitoring, users seeking zero-maintenance solutions

## Areas of Uncertainty

- Exact rate limits per account per endpoint (varies and undocumented)
- Long-term stability of cookie-based authentication
- Impact of X's ongoing API changes on functionality
- Account longevity and ban rates under different usage patterns
- Actual throughput limits with optimal account pool size

## Sources and References

1. [GitHub - vladkens/twscrape](https://github.com/vladkens/twscrape) - Primary repository (Retrieved: 2025-01-24)
2. [twscrape PyPI Package](https://pypi.org/project/twscrape/) - Package distribution (Retrieved: 2025-01-24)
3. [How to still scrape millions of tweets in 2023](https://medium.com/@vladkens/how-to-still-scrape-millions-of-tweets-in-2023-using-twscrape-97f5d3881434) - Author's guide (Retrieved: 2025-01-24)
4. GitHub Issues #27, #250, #251, #257, #259, #261, #262, #263, #265, #267, #268 - User reports and discussions (Retrieved: 2025-01-24)
5. GitHub Releases - v0.17.0 latest release information (Retrieved: 2025-01-24)

## Appendix

### Version History
- v0.17.0 (2025-04-29): x-request-client-id support, GQL updates
- v0.16.0 (2025-03-09): Trends support added
- Previous versions: Regular updates for API compatibility

### Common Issues Reported
- Session expired or banned errors
- Account showing logged in but not active
- Email verification challenges with certain providers
- Pagination stopping early for some endpoints
- Rate limiting despite account rotation
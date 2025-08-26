# Smartproxy Research Report: X/Twitter Content Access Alternative

## Executive Summary
- Smartproxy (now Decodo) offers Social Media Scraping API starting at $0.08/1K requests with support for social platforms
- Limited specific X/Twitter support - focuses on TikTok, Instagram, Reddit but X/Twitter capabilities unclear
- Rate limits: 10-50 requests/second depending on tier [Vendor-claimed]
- GDPR/CCPA compliant with ethical data sourcing [Vendor-claimed]
- 7-day free trial available for scraping APIs

## Research Methodology
Conducted comprehensive web research using Tavily search API focusing on Smartproxy's social media scraping capabilities, pricing models, performance metrics, and compliance posture. All information sourced from external websites and vendor documentation as of 2025-01-24.

## Key Findings

### 1. Coverage & Features for X/Twitter

Based on available documentation, Smartproxy's X/Twitter support appears limited:

**Confirmed Social Media Support:**
- TikTok posts and profiles
- Instagram posts and profiles  
- Reddit content
- YouTube data

**X/Twitter Status:**
- General mention of "Twitter proxies" for account management [Source: smartproxy.org/application/, retrieved 2025-01-24]
- No specific X/Twitter endpoints documented in Social Media Scraping API
- Comparison tables show competitors (Bright Data, Apify) support X.com posts/profiles while Smartproxy marked as "❌" [Source: research.aimultiple.com/social-media-scraping/, retrieved 2025-01-24]

**API Features:**
- Structured JSON output
- Automatic proxy rotation
- CAPTCHA solving [Vendor-claimed]
- Cookie management
- Realistic header injection

### 2. Rate Limits and Latency

**Rate Limits:** [Vendor-claimed]
- Starter plans: 10 requests/second
- Higher tiers: Up to 50 requests/second  
- HTTP 429 returned when exceeding limits
[Source: smartproxy.org/faq/, retrieved 2025-01-24]

**Response Time:** [Vendor-claimed]
- Residential proxies: <0.6 seconds average response time
- Datacenter proxies: <0.3 seconds average response time
[Source: blackdown.org/smartproxy-review/, decodo.com/integrations/shadowrocket, retrieved 2025-01-24]

**Success Rate:** [Vendor-claimed]
- 99.99% success rate for scraping APIs
- 99.86% success rate for residential proxies

### 3. Pricing Model and Tiers

**Social Media Scraping API Pricing:**
Starting at $0.08 per 1,000 requests [Vendor-claimed]

**Pricing Tiers for Scraping APIs:** [Vendor-claimed]
- Entry level: $50/month (estimated ~625K requests)
- Mid-tier plans: Scale up to millions of requests
- Enterprise: Custom pricing

**1M Posts/Month Cost Calculation:**
- Base rate: $0.08 per 1K requests
- 1,000,000 posts = 1,000K requests
- **Estimated cost: $80/month** (assuming 1 request = 1 post)

**Additional Costs:**
- May require residential proxy subscription for enhanced reliability
- Residential proxies: Starting at $1.50/GB with RESI50 promo code

**Free Trial:**
- 7-day free trial for scraping APIs [Vendor-claimed]
- 3-day free trial for residential proxies
- 1,000 free results to test

### 4. Reliability & SLA

**Uptime:** [Vendor-claimed]
- 99.99% network uptime guarantee for datacenter proxies
- No specific SLA documentation found for scraping APIs

**Infrastructure:**
- 115M+ residential IPs across 195+ locations [Vendor-claimed]
- Scalable infrastructure for large volumes
- 24/7 technical support

**Track Record:**
- Founded in 2018 (operating 7+ years)
- Part of larger comparison studies showing $50/month entry pricing
[Source: research.aimultiple.com/social-media-scraping/, retrieved 2025-01-24]

### 5. Compliance Posture

**Data Protection:** [Vendor-claimed]
- GDPR compliant
- CCPA compliant  
- User consent for residential IP sourcing
- "Industry-Leading Ethics and Compliance"
[Source: smartproxy.ca/scraper-api/, smartproxy.org/faq/, retrieved 2025-01-24]

**Terms of Service:**
- Users must respect target site terms
- PayPal connections blocked for compliance reasons
- Requires adherence to robots.txt policies

### 6. Implementation Notes

**Authentication:**
- Username/password authentication
- API key-based access for scraping APIs

**SDK Support:**
- Python SDK available
- Node.js SDK available
- Go SDK available
- REST API for any language with HTTPS support

**Request Structure:**
```
Base endpoint: Not publicly documented
Auth: API key in header
Response format: JSON or HTML
```

**Pagination:**
- Implementation details not publicly documented
- Standard REST patterns expected

**Retry/Backoff:**
- Automatic retries built into API [Vendor-claimed]
- Rate limiting returns HTTP 429
- Recommended to implement exponential backoff

**Session Management:**
- Session duration: 5-120 minutes typical [Vendor-claimed]
- Session ID for sticky sessions
- Automatic session rotation available

### 7. References

All information retrieved on 2025-01-24:

1. Smartproxy FAQ - smartproxy.org/faq/
2. Smartproxy Applications - smartproxy.org/application/
3. Smartproxy/Decodo Scraper API - smartproxy.ca/scraper-api/
4. AIMultiple Social Media Scraping Comparison - research.aimultiple.com/social-media-scraping/
5. Blackdown Smartproxy Review - blackdown.org/smartproxy-review/
6. Decodo Integrations - decodo.com/integrations/shadowrocket
7. Smartproxy Product Pages - decodo.com/scraping/web, decodo.com/proxies/features

## Analysis & Insights

**Strengths:**
- Competitive entry pricing at $0.08/1K requests
- Strong compliance framework with GDPR/CCPA
- Multiple SDK options for easy integration
- Established player since 2018

**Limitations:**
- **Critical: No clear X/Twitter support in Social Media Scraping API**
- Limited public documentation on API endpoints
- No detailed SLA commitments found
- Rate limits may be restrictive for high-volume scenarios

**Suitability for X/Twitter Access:**
Based on available evidence, Smartproxy appears to have **limited or no specific X/Twitter scraping capabilities** in their Social Media API product. While they offer general proxy services that could theoretically access X/Twitter, their scraping API seems focused on TikTok, Instagram, and Reddit. Organizations requiring X/Twitter data should verify current capabilities directly with Smartproxy or consider alternatives with documented X/Twitter support.

## Areas of Uncertainty

1. **X/Twitter Support:** No concrete documentation found confirming X/Twitter endpoints in Social Media Scraping API
2. **Actual API Endpoints:** Specific endpoint URLs and request structures not publicly documented
3. **SLA Details:** No formal SLA documentation located beyond uptime claims
4. **Enterprise Pricing:** Custom pricing not transparent for high-volume scenarios
5. **Data Freshness:** Real-time vs cached data not specified

## Recommendation

Smartproxy/Decodo may not be suitable for X/Twitter data collection based on current documentation. Their Social Media Scraping API appears to focus on other platforms. For X/Twitter access, consider:
1. Requesting direct confirmation from Smartproxy sales about X/Twitter capabilities
2. Evaluating competitors with documented X/Twitter support (Bright Data, Apify)
3. Using their general proxy infrastructure with custom scraping solution if X/Twitter access is critical
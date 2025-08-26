## TwitterAPI.io — Real‑World User Feedback (External Forums)

Date retrieved: 2025‑08‑24

Scope: Anecdotal user experiences gathered from Reddit and the n8n community. Use as qualitative signal alongside primary evaluation.

### Quick takeaways
- Pricing sentiment: described as "generous" compared to official X API. [Anecdotal]
- Pagination: reports of low page size (~20 tweets/page) when paginating user timelines; may impact throughput/cost. [Anecdotal]
- Operability: used successfully in n8n workflows; some caveats around retweets and multi‑account posting. [Anecdotal]
- Community template claims: fast per‑thread extraction (~3s for 15 tweets) and very low per‑thread cost (~$0.0027). [Vendor/community‑claimed]

### Verbatim snippets and sources
- r/DataHoarder (2025‑04):
  > "It seems fine. User tweets are paginated. The tweets/page is very low (20) which makes me a little concerned." [Anecdotal]
  
  Link: https://www.reddit.com/r/DataHoarder/comments/1jx1iea/xtwitter_scraping_options_2025/

- r/SaaS (2025‑08):
  > "For X I'm using this one (they have more generous pricing) — https://twitterapi.io/." [Anecdotal]
  
  Link: https://www.reddit.com/r/SaaS/comments/1mugxr2/what_are_you_building_right_now_ill_find_people/

- n8n community (2025‑06):
  > "Try twitterapi.io — i used it to parse tweets (hope help you), but now have problem with retweets and custom http node to publish from 2+ accounts." [Anecdotal]
  
  Link: https://community.n8n.io/t/need-help-scraping-tweets-replies-from-about-10-x-twitter-users-free-api/137455

- n8n workflow template (2025‑07):
  > Uses twitterapi.io for all Twitter API requests. Benefits claim: "Fetches a 15‑tweet thread in just 3 seconds" and "Processes a 15‑tweet thread for only $0.0027". [Community template; vendor‑claimed]
  
  Link: https://n8n.io/workflows/4088-extract-and-merge-twitter-x-threads-using-twitterapiio/

### Risks and unknowns
- These are anecdotal and not independently verified; treat as directional input.
- Unofficial access may carry ToS/legal considerations; see `framework_compliance`.
- Operational characteristics (pagination, QPS, costs) can change; validate during pilot.

### Cross‑references
- See consolidated evaluation at `docs/research/v3/external/evaluation.md` ("Real‑world user feedback (anecdotal)" subsection) for integrated notes.

### Web research (vendor‑claimed, independent pages)
- Docs overview lists key metrics: 700–800ms avg response time; cost: $0.15/1k tweets; min $0.00015 per request; up to 200 QPS per client (docs), with balance‑tiered limits (QPS page shows 3→20 QPS by credit balance). [Vendor‑claimed]
  - `https://docs.twitterapi.io/`
  - `https://twitterapi.io/pricing`
  - `https://twitterapi.io/qps-limits`
- Readme/marketing page claims 1000+ QPS and 99.99% uptime. Treat as marketing until verified. [Vendor‑claimed]
  - `https://twitterapi.io/readme`

### External web signals and usage (non‑forum)
- GitHub repos integrating `twitterapi.io` (SDKs, MCP servers, bots) indicate developer adoption. [Signals]
  - `https://github.com/yolleygit/twitter-mcp-js`
  - `https://github.com/kinhunt/twitterapi-mcp`
  - `https://github.com/si-klyde/twitterapi.io-list-scraper-module`
  - `https://github.com/kargarisaac/telegram_link_summarizer_agent`
- Dev.to/DevHunt mentions: launch and marketing posts; treat as promotional unless corroborated. [Signals]
  - `https://dev.to/kaito2046/how-i-built-twitterapiio-in-30-minutes-for-0-a-developers-journey-3edd`
  - `https://devhunt.org/tool/twitterapiio`



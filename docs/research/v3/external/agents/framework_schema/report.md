## Normalized Schema for X/Twitter Content (External‑Only)

Date: 2025‑08‑24

### Scope and conventions
- **Purpose**: Neutral, provider‑agnostic schema covering posts, users, threads, media, and rate‑limit metadata gathered via external sources only.
- **ID shape**: All identifiers are strings. Preserve provider‑native IDs, do not coerce to integers.
- **Time**: ISO‑8601 with timezone (UTC recommended). Fields ending with `_at` are timestamps.
- **Text**: Store raw text in `text`; optionally a normalized form in `text_normalized` (stripped of URLs/whitespace) for search/dedup.
- **Metrics**: Counts are non‑negative integers and may be partial or stale depending on provider.
- **Provenance**: Every record links to an `ingestion` and `provider` for auditability. Keep original payload in cold storage keyed by `raw_payload_sha256`.

### Entity model (high‑level)
- **providers** 1—* **ingestions**
- **users** 1—* **posts**
- **threads** 1—* **posts**
- **posts** *—* **media** via **post_media**
- **posts** *—* **posts** via **post_references** (reply/quote/retweet)
- **posts** *—* **entities** via specialized tables (mentions/hashtags/urls/cashtags)
- **rate_limit_observations** linked to **ingestions** and **providers**

### Relational schema (proposed)

#### providers
- **provider_id** (pk)
- **name** (e.g., "X API", "Apify", "Bright Data", "snscrape")
- **type**: `official_api` | `proxy_api` | `headless_browser` | `proxy_network` | `oss_library`
- **version** (free text)
- **base_url**

#### ingestions
- **ingestion_id** (pk)
- **provider_id** (fk → providers)
- **source_endpoint** (e.g., `/2/tweets/search/recent`, GraphQL op name, web URL)
- **request_params_hash** (sha256 of canonicalized request)
- **cursor** (pagination token/cursor used)
- **started_at**, **completed_at**, **status** (`ok` | `partial` | `error`)
- **error_message** (nullable)
- **raw_payload_sha256** (pointer to blob store)

#### users
- **user_id** (pk) — provider‑native user ID
- **handle** (screen_name without `@`)
- **display_name**
- **bio** (nullable)
- **location** (nullable)
- **url** (nullable)
- **is_verified** (boolean, any verification)
- **is_protected** (boolean)
- **created_at** (nullable)
- **profile_image_url**, **profile_banner_url** (nullable)
- **followers_count**, **following_count**, **listed_count**, **statuses_count** (nullable int)
- **entities_json** (JSON, nullable) — raw link entities from provider
- **ingestion_id** (fk) — most recent provenance

Indexes: unique (`handle`) optionally per time partition; frequent lookups on `handle` and `user_id`.

#### threads
- **thread_id** (pk) — equals X `conversation_id`
- **root_post_id** (fk → posts)
- **author_id** (fk → users) — expected same author for most threads but allow mixed
- **post_count** (int, nullable)
- **is_partial** (boolean) — true when assembly is incomplete
- **assembled_at**

#### posts
- **post_id** (pk) — X `id`
- **author_id** (fk → users)
- **thread_id** (fk → threads) — X `conversation_id`
- **in_reply_to_post_id** (fk → posts, nullable)
- **created_at**
- **text** (raw)
- **lang** (BCP‑47 code, nullable)
- **source_label** (nullable, e.g., "Twitter for iPhone")
- **possibly_sensitive** (boolean, nullable)
- **reply_settings** (nullable; enum if available)
- **place_id** (fk → places, nullable)
- **like_count**, **retweet_count**, **reply_count**, **quote_count**, **bookmark_count**, **view_count** (nullable int)
- **card_json** (JSON, nullable) — link card summary if available
- **entities_json** (JSON, nullable) — provider entities if not fully normalized
- **ingestion_id** (fk)

Indexes: (`author_id`, `created_at`), (`thread_id`, `created_at`), GIN on `entities_json` if used.

#### post_references
- **post_id** (fk → posts)
- **referenced_post_id** (fk → posts)
- **reference_type**: `reply` | `retweet` | `quote` | `mention`
Primary key: (`post_id`, `referenced_post_id`, `reference_type`)

#### media
- **media_id** (pk) — X `media_key` if known, else stable hash of URL
- **type**: `photo` | `video` | `animated_gif`
- **url** (canonical/original)
- **preview_image_url** (nullable)
- **width**, **height** (nullable int)
- **duration_ms** (nullable)
- **alt_text** (nullable)
- **content_type** (nullable, e.g., `image/jpeg`)
- **variants_json** (JSON) — e.g., video bitrates
- **ingestion_id** (fk)

#### post_media
- **post_id** (fk → posts)
- **media_id** (fk → media)
- **order_index** (int)
Primary key: (`post_id`, `media_id`)

#### entities (normalized)
- `post_mentions`: (post_id, user_id, handle)
- `post_hashtags`: (post_id, tag)
- `post_urls`: (post_id, url, expanded_url, display_url)
- `post_cashtags`: (post_id, symbol)

#### places (optional but supported)
- **place_id** (pk)
- **full_name**, **country_code**, **geo_json** (JSON bbox/coordinates)

#### rate_limit_observations
- **rate_limit_id** (pk)
- **provider_id** (fk)
- **ingestion_id** (fk)
- **resource** (e.g., endpoint/op name)
- **scope** (`app` | `user` | `ip` | `account`) — as applicable
- **limit** (int, nullable)
- **remaining** (int, nullable)
- **reset_at** (nullable timestamp)
- **window_seconds** (nullable)
- **observed_at** (timestamp)
- **raw_headers_json** (JSON, nullable)

### JSON shape (for interchange)
A compact JSON representation aligned to the relational model:

```json
{
  "provider": {"provider_id": "twitter_api_v2", "type": "official_api"},
  "ingestion": {"ingestion_id": "ing_20250824_123456", "source_endpoint": "/2/tweets"},
  "users": [
    {"user_id": "2244994945", "handle": "TwitterDev", "display_name": "Twitter Dev"}
  ],
  "threads": [
    {"thread_id": "1720000000000000000", "root_post_id": "1720000000000000001"}
  ],
  "posts": [
    {
      "post_id": "1720000000000000001",
      "author_id": "2244994945",
      "thread_id": "1720000000000000000",
      "created_at": "2025-08-24T12:34:56Z",
      "text": "Example tweet with photo",
      "lang": "en",
      "metrics": {"like_count": 10, "retweet_count": 2, "reply_count": 1, "quote_count": 0},
      "entities": {
        "mentions": [{"user_id": "12", "handle": "jack"}],
        "hashtags": ["example"],
        "urls": [{"url": "https://t.co/abc", "expanded_url": "https://example.com"}]
      },
      "media": [{"media_id": "3_1720000000000000001"}]
    }
  ],
  "media": [
    {"media_id": "3_1720000000000000001", "type": "photo", "url": "https://pbs.twimg.com/media/xyz.jpg"}
  ],
  "rate_limits": [
    {"resource": "/2/tweets", "limit": 450, "remaining": 449, "reset_at": "2025-08-24T12:45:00Z"}
  ]
}
```

### Normalization rules
- **Threading**: Use X `conversation_id` as `thread_id`. `root_post_id` is the earliest post in the conversation we have observed; mark `is_partial` if gaps remain.
- **References**: Represent replies, quotes, retweets in `post_references`. Also store `in_reply_to_post_id` on the child for fast traversal.
- **Entities**: Prefer normalized tables; keep the original entity arrays in `entities_json` when full normalization is not possible.
- **Media**: Prefer X `media_key` as `media_id` when available. If only URLs exist, derive `media_id` as `sha256(url)` and record the canonical URL.
- **Metrics**: Treat as snapshots at `ingestion.completed_at`. Do not attempt temporal aggregation unless explicitly computed.
- **Language**: Store provider language if given; otherwise leave null or store detector result with `lang_source` if you add one.
- **Provenance**: Every `users`, `posts`, and `media` row links to the `ingestion` that produced/updated it.

### Mapping notes by provider type

#### Official X API (v2/vNext; also vendor relays of it)
- **IDs**: Map `tweet.id` → `posts.post_id`, `user.id` → `users.user_id`, `conversation_id` → `threads.thread_id`.
- **References**: `referenced_tweets[]` with `type` in {replied_to, retweeted, quoted} → `post_references.reference_type` (`reply`/`retweet`/`quote`). Also set `in_reply_to_post_id` when `replied_to` exists.
- **Entities**: `entities.mentions`/`hashtags`/`urls` → normalized entity tables; also copy to `entities_json`.
- **Media**: `includes.media[]` with `media_key` → `media.media_id`; variants to `variants_json`; alt text to `alt_text`.
- **Users**: `includes.users[]` and `user.*` fields → `users` with counts from `public_metrics`.
- **Metrics**: `public_metrics` → counts; views/impressions often unavailable → leave null.
- **Pagination**: `next_token` → `ingestions.cursor`.
- **Rate limits**: HTTP headers `x-rate-limit-limit`/`remaining`/`reset` → `rate_limit_observations`.

#### Proxy API aggregators (e.g., RapidAPI listings, twitterapiio‑style relays)
- **Shape**: Often mirror X API but may rename fields; retain semantics and map accordingly.
- **Includes**: Some omit `includes`. If absent, assemble users/media from inline fields or perform secondary fetches; mark `is_partial` when incomplete.
- **Rate limits**: Vendor‑specific quotas; not always exposed via headers → record plan limits if provided and set `raw_headers_json`.
- **Pagination**: Token names may vary (`cursor`, `nextPageToken`) → store raw in `ingestions.cursor`.

#### Web scraping proxy networks (Zyte, Smartproxy, ScraperAPI, Oxylabs, Bright Data)
- **Payload**: You may receive HTML or internal GraphQL JSON. Extract post/user/media fields into the normalized schema.
- **IDs**: Tweet ID and user ID are present in DOM/JSON; map directly as strings.
- **Threads**: Conversation assembly requires additional fetches (navigate to root and replies). Set `is_partial` when not fully crawled.
- **Media**: Use resolved media URLs; no `media_key` — derive `media_id` from URL hash.
- **Metrics**: Counts on the web UI can be abbreviated (e.g., 1.2K). Normalize to integers when resolvable; else leave null.
- **Rate limits**: Capture provider concurrency/QPS and HTTP status/backoff events as `rate_limit_observations` with `scope=ip` or `account`.

#### Headless browser automation (Apify actors, OSS headless stealth)
- **Extraction**: DOM‑based; same mapping as proxy networks. Record screenshot/log links in ingestion metadata if available.
- **Stability**: Expect layout shifts; keep robust selectors and tolerate nulls.
- **Rate limits**: Model concurrency and backoff (e.g., 429/420) as observations; window may be empirical.

#### Open‑source libraries (snscrape, twscrape)
- **Shape**: Library objects provide tweet/user/media with Pythonic names (e.g., `retweetCount`, `replyCount`). Map to counts accordingly.
- **Threads**: Conversation IDs often available; otherwise reconstruct via reply chains.
- **Media**: Lists of photos/videos/animated GIFs with direct URLs; derive `media_id` from URL hash.
- **Rate limits**: No formal headers; capture throttling/sleep behavior as observations with `scope=ip`.

### Validation and constraints
- **Primary keys**: `users.user_id`, `posts.post_id`, `threads.thread_id`, `media.media_id` must be globally unique strings.
- **Foreign keys**: Enforce referential integrity; allow deferred creation for late‑arriving references.
- **Uniqueness**: (`post_id`, `author_id`) unique; (`post_id`, `media_id`) unique in `post_media`.
- **Nullability**: Prefer null over sentinel values when a provider does not supply a field.
- **Deduplication**: Upsert on primary keys; prefer latest `ingestion.completed_at` on conflict.

### Minimal field checklist by entity
- **posts**: `post_id`, `author_id`, `created_at`, `text`
- **users**: `user_id`, `handle` (if available) or `display_name` fallback
- **threads**: `thread_id` (= `conversation_id`), `root_post_id`
- **media**: `media_id`, `type`, `url`
- **rate_limit_observations**: `provider_id`, `resource`, `observed_at` (+ any of limit/remaining/reset)

### Implementation notes (extraction/storage)
- **Storage**: Columnar JSON fields (`entities_json`, `variants_json`, `raw_headers_json`) enable flexibility; normalize core joins for analytics.
- **Backfill**: Populate `threads` after initial loads by scanning `posts.thread_id` and earliest `created_at`.
- **Quality**: Mark `is_partial` threads; track missing includes; retain raw payload hashes for reproducibility.

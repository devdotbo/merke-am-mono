# Normalized Data Schema for X/Twitter Content Across Multiple Providers

## Executive Summary

- **Primary Finding**: Twitter API v2 provides the most comprehensive data model with Tweet, User, Media, Poll, Place, and Space objects that should serve as the foundation for normalization
- **Key Challenge**: Different providers return varying field names, data types, and nested structures requiring extensive mapping and transformation logic
- **Recommended Approach**: Implement a versioned schema with core required fields and provider-specific extensions to maintain flexibility
- **Critical Success Factor**: Use JSON Schema validation with strict typing while supporting null handling for missing fields across providers
- **Schema Evolution Strategy**: Adopt semantic versioning with backward compatibility through optional field additions and deprecated field retention

## Research Methodology

Comprehensive analysis conducted on 2025-01-24 examining Twitter API v2 documentation, open-source client implementations, social media data warehouse patterns, and provider API specifications. Research included analysis of normalization best practices, schema evolution patterns, and data quality considerations from multiple authoritative sources.

## Key Findings

### 1. Normalized Schema Design

#### Core Entities Architecture

Based on Twitter API v2 and industry best practices, the normalized schema should consist of six primary entities:

**Primary Entities:**
1. **Post/Tweet** - Core content entity with text, metrics, and relationships
2. **User/Profile** - Author and user information with social metrics
3. **Media** - Attached images, videos, and GIFs with metadata
4. **Engagement** - Likes, retweets, replies, and interaction metrics
5. **Thread** - Conversation structure and reply chains
6. **Metadata** - Source tracking, versioning, and provider information

**Supporting Entities:**
- **Poll** - Poll options and voting data
- **Place** - Geographic location information
- **Space** - Audio space/room data
- **Mention** - User mentions and references
- **Hashtag** - Topic tags and trends

#### Field Classification Strategy

Fields are categorized into three tiers based on availability and importance:

**Required Fields** (Always present):
- Unique identifiers (id)
- Content text
- Creation timestamp
- Author reference

**Standard Fields** (Usually available):
- Engagement metrics
- Media attachments
- Reply relationships
- User profile data

**Extended Fields** (Provider-specific):
- Advanced analytics
- Platform-specific features
- Premium data points

### 2. Entity Schemas

#### Post/Tweet Schema

```json
{
  "id": "string",                    // Unique tweet identifier
  "text": "string",                   // Tweet content (up to 280 chars)
  "author_id": "string",              // Reference to User entity
  "conversation_id": "string",        // Thread grouping identifier
  "created_at": "datetime",           // ISO 8601 timestamp
  "lang": "string",                   // Language code (ISO 639-1)
  "source": "string",                 // Client application
  
  "metrics": {
    "reply_count": "integer",
    "retweet_count": "integer",
    "like_count": "integer",
    "quote_count": "integer",
    "bookmark_count": "integer",
    "impression_count": "integer"
  },
  
  "referenced_tweets": [{
    "type": "enum",                  // replied_to, quoted, retweeted
    "id": "string"
  }],
  
  "entities": {
    "hashtags": [{
      "start": "integer",
      "end": "integer",
      "tag": "string"
    }],
    "mentions": [{
      "start": "integer",
      "end": "integer",
      "username": "string",
      "id": "string"
    }],
    "urls": [{
      "start": "integer",
      "end": "integer",
      "url": "string",
      "expanded_url": "string",
      "display_url": "string"
    }]
  },
  
  "attachments": {
    "media_keys": ["string"],
    "poll_ids": ["string"]
  },
  
  "geo": {
    "place_id": "string",
    "coordinates": {
      "type": "Point",
      "coordinates": [longitude, latitude]
    }
  },
  
  "context_annotations": [{
    "domain": {
      "id": "string",
      "name": "string"
    },
    "entity": {
      "id": "string",
      "name": "string"
    }
  }],
  
  "possibly_sensitive": "boolean",
  "reply_settings": "enum",          // everyone, mentionedUsers, following
  "withheld": {
    "copyright": "boolean",
    "country_codes": ["string"]
  }
}
```

#### User/Profile Schema

```json
{
  "id": "string",                     // Unique user identifier
  "username": "string",               // @handle (screen_name)
  "name": "string",                   // Display name
  "description": "string",            // Bio text
  "location": "string",               // User-defined location
  "url": "string",                    // Profile URL
  "created_at": "datetime",           // Account creation date
  
  "public_metrics": {
    "followers_count": "integer",
    "following_count": "integer",
    "tweet_count": "integer",
    "listed_count": "integer",
    "like_count": "integer"
  },
  
  "profile_image_url": "string",
  "profile_banner_url": "string",
  
  "verified": "boolean",              // Legacy verification
  "verified_type": "enum",            // blue, government, business
  "protected": "boolean",             // Private account flag
  
  "entities": {
    "url": {
      "urls": [{
        "url": "string",
        "expanded_url": "string",
        "display_url": "string"
      }]
    },
    "description": {
      "hashtags": [],
      "mentions": [],
      "urls": []
    }
  },
  
  "pinned_tweet_id": "string",
  "subscription_type": "string",      // Premium tier
  
  "withheld": {
    "country_codes": ["string"]
  }
}
```

#### Thread Schema

```json
{
  "conversation_id": "string",        // Thread identifier
  "root_tweet_id": "string",          // Original tweet
  "participant_ids": ["string"],      // Users in conversation
  "tweet_ids": ["string"],            // All tweets in thread
  "reply_count": "integer",
  "depth": "integer",                 // Max reply depth
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

#### Media Schema

```json
{
  "media_key": "string",              // Unique media identifier
  "type": "enum",                     // photo, video, animated_gif
  "url": "string",                    // Direct media URL
  "preview_image_url": "string",      // Thumbnail for videos
  
  "dimensions": {
    "width": "integer",
    "height": "integer"
  },
  
  "duration_ms": "integer",           // Video/GIF duration
  "alt_text": "string",               // Accessibility text
  
  "variants": [{                      // Different quality versions
    "bit_rate": "integer",
    "content_type": "string",
    "url": "string"
  }],
  
  "public_metrics": {
    "view_count": "integer"
  },
  
  "non_public_metrics": {
    "playback_0_count": "integer",
    "playback_25_count": "integer",
    "playback_50_count": "integer",
    "playback_75_count": "integer",
    "playback_100_count": "integer"
  }
}
```

#### Engagement Schema

```json
{
  "id": "string",                     // Unique engagement identifier
  "type": "enum",                     // like, retweet, reply, quote, bookmark
  "tweet_id": "string",               // Target tweet
  "user_id": "string",                // Acting user
  "created_at": "datetime",
  "metadata": {
    "client": "string",               // Source application
    "ip_hash": "string"               // Anonymized IP
  }
}
```

### 3. Provider Mapping Notes

#### Field Name Variations Across Providers

**Twitter API v2 → Normalized Mapping:**
- `id` → `id`
- `text` → `text`
- `author_id` → `author_id`
- `public_metrics` → `metrics`
- `created_at` → `created_at`

**Apify Scraper → Normalized Mapping:**
- `tweet_id` → `id`
- `content` → `text`
- `user.id` → `author_id`
- `favorite_count` → `metrics.like_count`
- `reply_count` → `metrics.reply_count`

**Bright Data → Normalized Mapping:**
- `postId` → `id`
- `description` → `text`
- `userId` → `author_id`
- `likes` → `metrics.like_count`
- `comments` → `metrics.reply_count`

**RapidAPI Providers → Normalized Mapping:**
- Variable field names requiring custom adapters
- Often use snake_case vs camelCase
- May nest metrics differently

#### Data Type Conversions Required

**Numeric Fields:**
- Some providers return counts as strings
- Ensure consistent integer typing
- Handle scientific notation for large numbers

**Timestamps:**
- Twitter API v2: ISO 8601 format
- Unix timestamps: Convert to ISO 8601
- String dates: Parse with timezone awareness

**Boolean Fields:**
- String "true"/"false" → boolean
- 0/1 → boolean
- Null handling for missing booleans

#### Missing Field Handling Strategies

**Default Values:**
```json
{
  "metrics": {
    "reply_count": 0,        // Default when missing
    "retweet_count": 0,
    "like_count": 0,
    "quote_count": null,     // Null when unknown
    "bookmark_count": null,
    "impression_count": null
  }
}
```

**Provider-Specific Extensions:**
```json
{
  "_provider": {
    "name": "apify",
    "version": "1.0",
    "extracted_at": "2025-01-24T10:00:00Z",
    "custom_fields": {
      "sentiment": "positive",
      "tone": "informative"
    }
  }
}
```

### 4. Data Quality Considerations

#### Validation Rules for Each Field

**Text Fields:**
```yaml
tweet_text:
  type: string
  minLength: 1
  maxLength: 280  # 4000 for premium
  pattern: "^[\\s\\S]*$"  # Allow all Unicode
  
username:
  type: string
  pattern: "^[A-Za-z0-9_]{1,15}$"
  
user_name:
  type: string
  maxLength: 50
```

**Numeric Fields:**
```yaml
metrics:
  type: object
  properties:
    reply_count:
      type: integer
      minimum: 0
    like_count:
      type: integer
      minimum: 0
```

**Timestamp Fields:**
```yaml
created_at:
  type: string
  format: date-time
  pattern: "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z$"
```

#### Null Handling Strategies

**Three-Tier Null Strategy:**

1. **Required Fields** - Never null, fail validation
2. **Optional Fields** - Null allowed, omit from output
3. **Unknown Fields** - Null indicates not available from provider

```json
{
  "id": "12345",                    // Never null
  "text": "Tweet content",          // Never null
  "metrics": {
    "like_count": 42,              // Default to 0 if missing
    "bookmark_count": null         // Null if not provided
  }
}
```

#### Enum Standardization

**Standardized Enums:**
```yaml
tweet_type:
  enum: [original, reply, retweet, quote]
  
verification_type:
  enum: [none, blue, government, business]
  
media_type:
  enum: [photo, video, animated_gif]
  
reply_settings:
  enum: [everyone, mentioned_users, following]
```

#### Date/Time Normalization

**Conversion Rules:**
1. All timestamps in UTC
2. ISO 8601 format with milliseconds
3. Missing timezone assumes UTC
4. Future dates trigger validation warning

```javascript
// Normalization function
function normalizeTimestamp(input) {
  if (typeof input === 'number') {
    // Unix timestamp
    return new Date(input * 1000).toISOString();
  }
  if (typeof input === 'string') {
    // Parse and convert to ISO 8601
    return new Date(input).toISOString();
  }
  return null;
}
```

#### Text Encoding Issues

**Common Issues and Solutions:**
- HTML entities: Decode before storage
- Unicode normalization: Use NFC form
- Emoji handling: Store as-is in UTF-8
- URL encoding: Decode for display URLs

### 5. Schema Evolution

#### Versioning Strategy

**Semantic Versioning Approach:**
```json
{
  "_meta": {
    "schema_version": "2.1.0",      // MAJOR.MINOR.PATCH
    "compatible_versions": ["2.0.0", "2.1.0"],
    "deprecated_fields": ["old_field"],
    "migration_notes": "Added bookmark_count to metrics"
  }
}
```

**Version Rules:**
- MAJOR: Breaking changes (field removal, type changes)
- MINOR: Backward compatible additions
- PATCH: Bug fixes, documentation updates

#### Backward Compatibility Approach

**Compatibility Guidelines:**

1. **Field Addition** - Always backward compatible
2. **Field Deprecation** - Mark deprecated, retain for 2 major versions
3. **Field Removal** - Only in major version with migration path
4. **Type Changes** - Require new field name

**Deprecation Example:**
```json
{
  "screen_name": "john_doe",        // Deprecated in v2.0
  "username": "john_doe",           // New field name
  "_deprecated": {
    "screen_name": "Use 'username' instead"
  }
}
```

#### Migration Patterns

**Migration Strategy Framework:**

```sql
-- SQL Migration Example
ALTER TABLE tweets ADD COLUMN bookmark_count INTEGER DEFAULT NULL;

-- Backfill from provider data
UPDATE tweets 
SET bookmark_count = 
  CASE 
    WHEN provider = 'twitter_v2' THEN 
      JSON_EXTRACT(raw_data, '$.public_metrics.bookmark_count')
    ELSE NULL
  END;
```

**ETL Pipeline Migration:**
```python
def migrate_schema_v1_to_v2(record):
    """Transform v1 record to v2 schema"""
    v2_record = record.copy()
    
    # Rename fields
    if 'screen_name' in v2_record:
        v2_record['username'] = v2_record.pop('screen_name')
    
    # Add new fields with defaults
    if 'metrics' in v2_record:
        v2_record['metrics']['bookmark_count'] = None
    
    # Update schema version
    v2_record['_meta']['schema_version'] = '2.0.0'
    
    return v2_record
```

#### Schema Registry Concepts

**Registry Implementation:**
```yaml
registry:
  schemas:
    - id: "twitter_post_v2"
      version: "2.1.0"
      format: "json-schema"
      compatibility: "BACKWARD"
      schema_url: "s3://schemas/twitter/post/v2.1.0.json"
      
  compatibility_modes:
    - BACKWARD      # New schema can read old data
    - FORWARD       # Old schema can read new data
    - FULL          # Both backward and forward
    - NONE          # No compatibility checking
```

## JSON/YAML Schema Examples

### Complete Post Schema (JSON Schema v7)

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "https://schemas.example.com/twitter/post/v2.1.0",
  "title": "Twitter Post",
  "type": "object",
  "required": ["id", "text", "author_id", "created_at"],
  "properties": {
    "id": {
      "type": "string",
      "pattern": "^[0-9]{10,20}$"
    },
    "text": {
      "type": "string",
      "minLength": 1,
      "maxLength": 4000
    },
    "author_id": {
      "type": "string",
      "pattern": "^[0-9]{10,20}$"
    },
    "created_at": {
      "type": "string",
      "format": "date-time"
    },
    "metrics": {
      "type": "object",
      "properties": {
        "reply_count": {"type": "integer", "minimum": 0},
        "retweet_count": {"type": "integer", "minimum": 0},
        "like_count": {"type": "integer", "minimum": 0},
        "quote_count": {"type": ["integer", "null"], "minimum": 0},
        "bookmark_count": {"type": ["integer", "null"], "minimum": 0},
        "impression_count": {"type": ["integer", "null"], "minimum": 0}
      },
      "additionalProperties": false
    },
    "entities": {
      "type": "object",
      "properties": {
        "hashtags": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["start", "end", "tag"],
            "properties": {
              "start": {"type": "integer"},
              "end": {"type": "integer"},
              "tag": {"type": "string"}
            }
          }
        },
        "mentions": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["start", "end", "username"],
            "properties": {
              "start": {"type": "integer"},
              "end": {"type": "integer"},
              "username": {"type": "string"},
              "id": {"type": "string"}
            }
          }
        },
        "urls": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["start", "end", "url"],
            "properties": {
              "start": {"type": "integer"},
              "end": {"type": "integer"},
              "url": {"type": "string", "format": "uri"},
              "expanded_url": {"type": "string", "format": "uri"},
              "display_url": {"type": "string"}
            }
          }
        }
      }
    },
    "_meta": {
      "type": "object",
      "properties": {
        "provider": {"type": "string"},
        "provider_version": {"type": "string"},
        "extracted_at": {"type": "string", "format": "date-time"},
        "schema_version": {"type": "string"},
        "rate_limit_remaining": {"type": "integer"},
        "rate_limit_reset": {"type": "string", "format": "date-time"}
      }
    }
  },
  "additionalProperties": false
}
```

### Provider Adapter Configuration (YAML)

```yaml
provider_adapters:
  twitter_api_v2:
    field_mappings:
      - source: "id"
        target: "id"
        transform: "direct"
      - source: "text"
        target: "text"
        transform: "direct"
      - source: "author_id"
        target: "author_id"
        transform: "direct"
      - source: "public_metrics.reply_count"
        target: "metrics.reply_count"
        transform: "nested_extract"
    
  apify:
    field_mappings:
      - source: "tweet_id"
        target: "id"
        transform: "direct"
      - source: "content"
        target: "text"
        transform: "html_decode"
      - source: "user.id"
        target: "author_id"
        transform: "nested_extract"
      - source: "favorite_count"
        target: "metrics.like_count"
        transform: "string_to_int"
    
  bright_data:
    field_mappings:
      - source: "postId"
        target: "id"
        transform: "direct"
      - source: "description"
        target: "text"
        transform: "direct"
      - source: "userId"
        target: "author_id"
        transform: "direct"
      - source: "likes"
        target: "metrics.like_count"
        transform: "string_to_int"
```

### Data Quality Validation Rules

```yaml
validation_rules:
  post:
    rules:
      - field: "id"
        type: "required"
        validators:
          - type: "regex"
            pattern: "^[0-9]{10,20}$"
            message: "Invalid tweet ID format"
      
      - field: "text"
        type: "required"
        validators:
          - type: "length"
            min: 1
            max: 4000
            message: "Tweet text must be 1-4000 characters"
          - type: "encoding"
            encoding: "utf-8"
            normalize: "NFC"
      
      - field: "created_at"
        type: "required"
        validators:
          - type: "datetime"
            format: "iso8601"
            timezone: "UTC"
          - type: "range"
            min: "2006-03-21T00:00:00Z"  # Twitter launch date
            max: "now"
      
      - field: "metrics.like_count"
        type: "optional"
        validators:
          - type: "numeric"
            min: 0
            max: 1000000000
          - type: "consistency"
            rule: "cannot_decrease"  # For time-series data
```

## Implementation Recommendations

### 1. Schema Validation Pipeline

```python
from jsonschema import validate, ValidationError
import json

class SchemaValidator:
    def __init__(self, schema_version="2.1.0"):
        self.schema = self.load_schema(schema_version)
    
    def validate_record(self, record, provider=None):
        """Validate a record against the schema"""
        try:
            # Apply provider-specific transformations
            if provider:
                record = self.transform_provider_data(record, provider)
            
            # Validate against JSON schema
            validate(instance=record, schema=self.schema)
            
            # Additional business rules
            self.validate_business_rules(record)
            
            return True, None
        except ValidationError as e:
            return False, str(e)
    
    def transform_provider_data(self, record, provider):
        """Transform provider-specific data to normalized schema"""
        adapter = self.get_provider_adapter(provider)
        return adapter.transform(record)
```

### 2. Rate Limit and Quota Tracking

```json
{
  "_meta": {
    "rate_limit": {
      "provider": "twitter_v2",
      "endpoint": "/tweets/search/recent",
      "requests_remaining": 450,
      "requests_limit": 450,
      "reset_at": "2025-01-24T11:00:00Z",
      "reset_in_seconds": 900
    },
    "quota": {
      "monthly_limit": 500000,
      "monthly_used": 125000,
      "daily_limit": 25000,
      "daily_used": 5000,
      "reset_date": "2025-02-01T00:00:00Z"
    }
  }
}
```

### 3. Error Handling and Recovery

```yaml
error_handling:
  strategies:
    missing_required_field:
      action: "reject"
      log_level: "error"
      notify: true
    
    invalid_data_type:
      action: "transform"
      fallback: "null"
      log_level: "warning"
    
    rate_limit_exceeded:
      action: "retry"
      backoff: "exponential"
      max_retries: 3
      
    provider_timeout:
      action: "fallback"
      fallback_provider: "secondary"
      cache_duration: 300
```

## Sources & References

All sources accessed on 2025-01-24:

1. **Twitter API v2 Documentation** - Official Twitter/X API reference with comprehensive field definitions and data models
2. **Node Twitter API v2 Library** - TypeScript implementation showing practical schema usage and helper methods
3. **Data Warehouse Design Patterns** - Best practices for social media data normalization and ETL pipelines
4. **Social Media Scraping Providers** - Analysis of Apify, Bright Data, and other provider response formats
5. **Schema Evolution Research** - MCP schema evolution patterns and backward compatibility strategies
6. **JSON Schema Validation** - Standards for data validation rules and type checking
7. **Data Quality in ETL Pipelines** - Strategies for handling missing data and ensuring consistency

## Appendix

### Sample Provider Response Transformations

```javascript
// Example: Transform Apify response to normalized schema
function transformApifyToNormalized(apifyData) {
  return {
    id: apifyData.tweet_id,
    text: decodeHTML(apifyData.content),
    author_id: apifyData.user?.id,
    created_at: new Date(apifyData.created_at).toISOString(),
    metrics: {
      reply_count: parseInt(apifyData.reply_count) || 0,
      retweet_count: parseInt(apifyData.retweet_count) || 0,
      like_count: parseInt(apifyData.favorite_count) || 0,
      quote_count: parseInt(apifyData.quote_count) || null,
      bookmark_count: parseInt(apifyData.bookmark_count) || null,
      impression_count: parseInt(apifyData.views_count) || null
    },
    entities: extractEntities(apifyData.entities),
    _meta: {
      provider: 'apify',
      provider_version: '1.0',
      extracted_at: new Date().toISOString(),
      schema_version: '2.1.0'
    }
  };
}
```

### Database Schema (PostgreSQL)

```sql
-- Core tables following normalized schema
CREATE TABLE posts (
  id VARCHAR(20) PRIMARY KEY,
  text TEXT NOT NULL,
  author_id VARCHAR(20) NOT NULL,
  conversation_id VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL,
  lang VARCHAR(10),
  source VARCHAR(100),
  metrics JSONB,
  entities JSONB,
  attachments JSONB,
  geo JSONB,
  context_annotations JSONB,
  possibly_sensitive BOOLEAN DEFAULT FALSE,
  reply_settings VARCHAR(20),
  withheld JSONB,
  _meta JSONB,
  CONSTRAINT fk_author FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE users (
  id VARCHAR(20) PRIMARY KEY,
  username VARCHAR(15) NOT NULL,
  name VARCHAR(50),
  description TEXT,
  location VARCHAR(100),
  url VARCHAR(200),
  created_at TIMESTAMPTZ NOT NULL,
  public_metrics JSONB,
  profile_image_url VARCHAR(500),
  profile_banner_url VARCHAR(500),
  verified BOOLEAN DEFAULT FALSE,
  verified_type VARCHAR(20),
  protected BOOLEAN DEFAULT FALSE,
  entities JSONB,
  pinned_tweet_id VARCHAR(20),
  subscription_type VARCHAR(20),
  withheld JSONB,
  _meta JSONB
);

CREATE TABLE media (
  media_key VARCHAR(50) PRIMARY KEY,
  type VARCHAR(20) NOT NULL,
  url VARCHAR(500),
  preview_image_url VARCHAR(500),
  dimensions JSONB,
  duration_ms INTEGER,
  alt_text TEXT,
  variants JSONB,
  public_metrics JSONB,
  non_public_metrics JSONB,
  _meta JSONB
);

-- Indexes for performance
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_conversation ON posts(conversation_id);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_metrics_gin ON posts USING GIN (metrics);
CREATE INDEX idx_entities_gin ON posts USING GIN (entities);
```
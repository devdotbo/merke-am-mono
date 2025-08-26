# Twitter/X Proxy Server - Deployment Guide

## Quick Start

### Local Development
```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Configure providers (edit .env)
TWITTERAPI_KEY=your_api_key
APIFY_TOKEN=your_apify_token
ZEROG_ENABLED=false
PORT=3000

# Run development server
npm run dev
```

### Docker Deployment
```bash
# Build image
docker build -t twitter-proxy .

# Run container
docker run -d \
  --name twitter-proxy \
  -p 3000:3000 \
  --env-file .env \
  --restart unless-stopped \
  twitter-proxy
```

## Environment Variables

```env
# Server Configuration
NODE_ENV=production
PORT=3000
LOG_LEVEL=info

# Provider: TwitterAPI.io
TWITTERAPI_KEY=tapi_xxxxxxxxxxxxx
TWITTERAPI_TIMEOUT=3000

# Provider: Apify
APIFY_TOKEN=apify_api_xxxxxxxxxxxxx
APIFY_ACTOR_ID=kaitoeasyapi/twitter-scraper

# Provider: Playwright
CAPTURE_SCREENSHOTS=false
HEADLESS_MODE=true
MAX_BROWSER_CONTEXTS=3

# Provider: Nitter
NITTER_INSTANCES=https://nitter.poast.org,https://nitter.net

# 0G Storage
ZEROG_ENABLED=false
ZEROG_ENDPOINT=https://api.0g.ai
ZEROG_PRIVATE_KEY=0x...

# Rate Limiting
RATE_LIMIT_GLOBAL_MAX=1000
RATE_LIMIT_WINDOW_MS=60000

# Cache
CACHE_TWEET_TTL=3600
CACHE_SEARCH_TTL=300
CACHE_USER_TTL=1800

# Security
API_KEY_REQUIRED=false
ALLOWED_ORIGINS=*
HASH_USER_IDS=false
SCRUB_PII=true

# Monitoring
METRICS_ENABLED=true
METRICS_PORT=9090
```

## Docker Configuration

### Dockerfile
```dockerfile
FROM node:20-slim

# Install Chrome dependencies for Playwright
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Install Playwright browsers
RUN npx playwright install chromium

# Copy application code
COPY . .

# Create non-root user
RUN useradd -m -u 1001 appuser && \
    chown -R appuser:appuser /app

USER appuser

EXPOSE 3000 9090

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/health').then(r => process.exit(r.ok ? 0 : 1))"

CMD ["node", "twitter-proxy-implementation.js"]
```

### Docker Compose
```yaml
version: '3.8'

services:
  twitter-proxy:
    build: .
    container_name: twitter-proxy
    restart: unless-stopped
    ports:
      - "3000:3000"
      - "9090:9090"  # Metrics
    environment:
      - NODE_ENV=production
      - PORT=3000
    env_file:
      - .env
    volumes:
      - ./logs:/app/logs
      - ./cache:/app/cache
    networks:
      - proxy-network
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  redis:
    image: redis:7-alpine
    container_name: twitter-proxy-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data
    networks:
      - proxy-network
    command: redis-server --appendonly yes

  prometheus:
    image: prom/prometheus:latest
    container_name: twitter-proxy-metrics
    restart: unless-stopped
    ports:
      - "9091:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-data:/prometheus
    networks:
      - proxy-network
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

networks:
  proxy-network:
    driver: bridge

volumes:
  redis-data:
  prometheus-data:
```

## Kubernetes Deployment

### deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: twitter-proxy
  labels:
    app: twitter-proxy
spec:
  replicas: 3
  selector:
    matchLabels:
      app: twitter-proxy
  template:
    metadata:
      labels:
        app: twitter-proxy
    spec:
      containers:
      - name: twitter-proxy
        image: twitter-proxy:latest
        ports:
        - containerPort: 3000
          name: http
        - containerPort: 9090
          name: metrics
        env:
        - name: NODE_ENV
          value: "production"
        - name: TWITTERAPI_KEY
          valueFrom:
            secretKeyRef:
              name: twitter-proxy-secrets
              key: twitterapi-key
        - name: APIFY_TOKEN
          valueFrom:
            secretKeyRef:
              name: twitter-proxy-secrets
              key: apify-token
        resources:
          requests:
            memory: "1Gi"
            cpu: "500m"
          limits:
            memory: "2Gi"
            cpu: "1000m"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: twitter-proxy-service
spec:
  selector:
    app: twitter-proxy
  ports:
  - port: 80
    targetPort: 3000
    name: http
  - port: 9090
    targetPort: 9090
    name: metrics
  type: LoadBalancer
---
apiVersion: v1
kind: Secret
metadata:
  name: twitter-proxy-secrets
type: Opaque
stringData:
  twitterapi-key: "your_key_here"
  apify-token: "your_token_here"
```

## Production Checklist

### Security
- [ ] Enable API key authentication
- [ ] Configure CORS properly
- [ ] Enable PII scrubbing
- [ ] Set up rate limiting per API key
- [ ] Use HTTPS/TLS termination
- [ ] Implement request signing
- [ ] Set up WAF rules

### Performance
- [ ] Enable Redis caching
- [ ] Configure CDN for static responses
- [ ] Set up horizontal autoscaling
- [ ] Optimize Playwright browser pool
- [ ] Enable response compression
- [ ] Implement request queuing

### Monitoring
- [ ] Set up Prometheus metrics
- [ ] Configure Grafana dashboards
- [ ] Implement error tracking (Sentry)
- [ ] Set up alerts for failures
- [ ] Monitor provider health
- [ ] Track rate limit usage
- [ ] Log aggregation (ELK stack)

### Reliability
- [ ] Configure circuit breakers
- [ ] Set up retry policies
- [ ] Implement graceful degradation
- [ ] Configure health checks
- [ ] Set up automated backups
- [ ] Document incident response

## Monitoring Setup

### Prometheus Configuration
```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'twitter-proxy'
    static_configs:
      - targets: ['twitter-proxy:9090']
    metrics_path: '/metrics'
```

### Grafana Dashboard
```json
{
  "dashboard": {
    "title": "Twitter Proxy Metrics",
    "panels": [
      {
        "title": "Request Rate",
        "targets": [
          {
            "expr": "rate(twitter_proxy_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Provider Success Rate",
        "targets": [
          {
            "expr": "rate(twitter_proxy_provider_success[5m]) / rate(twitter_proxy_provider_total[5m])"
          }
        ]
      },
      {
        "title": "Response Time",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, twitter_proxy_latency_seconds)"
          }
        ]
      },
      {
        "title": "Cache Hit Rate",
        "targets": [
          {
            "expr": "rate(twitter_proxy_cache_hits[5m]) / rate(twitter_proxy_cache_total[5m])"
          }
        ]
      }
    ]
  }
}
```

## Scaling Strategies

### Horizontal Scaling
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: twitter-proxy-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: twitter-proxy
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

### Load Balancing
```nginx
upstream twitter_proxy {
    least_conn;
    server proxy1:3000 weight=3;
    server proxy2:3000 weight=2;
    server proxy3:3000 weight=1;
    keepalive 32;
}

server {
    listen 443 ssl http2;
    server_name api.example.com;
    
    ssl_certificate /etc/ssl/certs/cert.pem;
    ssl_certificate_key /etc/ssl/private/key.pem;
    
    location /x/ {
        proxy_pass http://twitter_proxy;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 30s;
        
        proxy_cache twitter_cache;
        proxy_cache_valid 200 5m;
        proxy_cache_valid 404 1m;
        proxy_cache_use_stale error timeout updating;
        
        add_header X-Cache-Status $upstream_cache_status;
    }
}
```

## Backup & Recovery

### Data Backup
```bash
#!/bin/bash
# backup.sh

# Backup Redis
redis-cli --rdb /backup/redis-$(date +%Y%m%d).rdb

# Backup cache directory
tar -czf /backup/cache-$(date +%Y%m%d).tar.gz /app/cache

# Upload to S3
aws s3 cp /backup/ s3://backup-bucket/twitter-proxy/ --recursive

# Clean old backups (keep 7 days)
find /backup -type f -mtime +7 -delete
```

### Disaster Recovery
1. **Provider Failure**: Automatic failover to next provider
2. **Instance Failure**: Kubernetes automatically restarts pods
3. **Region Failure**: Multi-region deployment with DNS failover
4. **Data Loss**: Restore from hourly Redis snapshots

## Cost Optimization

### Provider Usage Strategy
```javascript
// Intelligent provider selection based on cost
const selectProvider = (requestType, volume) => {
  const hourlyVolume = getHourlyVolume();
  
  if (hourlyVolume < 1000) {
    // Low volume: Use free/cheap options
    return 'nitter';
  } else if (hourlyVolume < 10000) {
    // Medium volume: Balance cost and reliability
    return 'apify';
  } else {
    // High volume: Use most reliable
    return 'twitterapi';
  }
};
```

### Caching Strategy
- Cache popular content longer (up to 24 hours)
- Pre-fetch trending topics during off-peak
- Use CDN for frequently accessed data
- Implement cache warming for predictable requests

## Support & Maintenance

### Health Monitoring
```bash
# Monitor provider health
curl http://localhost:3000/health | jq .

# Check metrics
curl http://localhost:9090/metrics | grep twitter_proxy

# View logs
docker logs twitter-proxy --tail 100 -f

# Test specific endpoint
curl "http://localhost:3000/x/status/123456789"
```

### Common Issues

| Issue | Solution |
|-------|----------|
| High latency | Check provider health, increase cache TTL |
| Rate limits | Distribute requests, add more API keys |
| Memory leaks | Restart Playwright browsers periodically |
| Cache misses | Analyze patterns, adjust TTL values |
| Provider failures | Check API keys, verify network access |

### Updates & Maintenance
```bash
# Update dependencies
npm update

# Rebuild Docker image
docker build -t twitter-proxy:latest .

# Rolling update in Kubernetes
kubectl set image deployment/twitter-proxy twitter-proxy=twitter-proxy:latest

# Database maintenance
redis-cli BGREWRITEAOF
```

## License & Legal

- Ensure compliance with provider Terms of Service
- Respect robots.txt and rate limits
- Implement GDPR data handling
- Maintain audit logs for compliance
- Regular security audits recommended

## Contact & Support

For issues, feature requests, or questions:
- GitHub Issues: [your-repo/issues]
- Documentation: [docs-site]
- Security: security@example.com
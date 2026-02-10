# Twitter/X and Reddit Testing Guide

## Authentication Requirements ✅

**Good news!** Both Twitter and Reddit actors work without any special authentication:

- ✅ **Twitter/X**: No cookies, no API keys needed - just your Apify token
- ✅ **Reddit**: No cookies, no API keys needed - just your Apify token
- ✅ **LinkedIn**: Already working (requires li_at cookie)

---

## Current Configuration

### Twitter Actor
- **Actor ID**: `apidojo/twitter-scraper-lite`
- **Name**: Twitter Scraper Unlimited
- **Authentication**: None required (uses Apify token only)
- **Features**:
  - Advanced search queries
  - Event-based pricing
  - No rate limits
  - Supports filters (verified users, exclude retweets, min likes)

### Reddit Actor
- **Actor ID**: `harshmaur/reddit-scraper-pro`
- **Name**: Reddit Scraper Pro
- **Authentication**: None required (uses Apify token only)
- **Features**:
  - Fast Mode enabled (70% faster)
  - Community-specific search
  - No API keys needed
  - Supports sorting and time filters

---

## Testing Steps

### 1. Test Twitter/X

**Configuration:**
```
Apify Token: [Your token]
Platforms: ✓ Twitter/X
Keywords: 
  prior authorization pain management
  interventional pain billing
Max Items: 30
```

**Twitter Options:**
- Exclude retweets: ✓ (checked)
- Verified only: ☐ (unchecked)
- Minimum likes: 0

**Expected Results:**
- 30 tweets about pain management topics
- No retweets included
- Recent tweets (sorted by Latest)
- Author names, engagement metrics, URLs

**Cost Estimate:**
- ~$0.02 for 30 tweets

---

### 2. Test Reddit

**Configuration:**
```
Apify Token: [Your token]
Platforms: ✓ Reddit
Keywords:
  prior authorization pain management
  interventional pain billing
Max Items: 30
```

**Reddit Options:**
- Sort by: Hot
- Time range: Past Week
- Subreddits: medicine, healthcare (optional)

**Expected Results:**
- 30 Reddit posts about pain management
- From relevant subreddits
- Post titles, content, upvotes, comments
- Subreddit names included

**Cost Estimate:**
- ~$0.06 for 30 posts (actor start + items)

---

### 3. Test All Three Platforms

**Configuration:**
```
Apify Token: [Your token]
Platforms: ✓ LinkedIn ✓ Twitter/X ✓ Reddit
Keywords:
  prior authorization pain management
Max Items: 20 per platform
```

**Expected Results:**
- 60 total posts (20 from each platform)
- Mixed content from all 3 sources
- Platform badges showing source
- All filters work correctly

**Cost Estimate:**
- LinkedIn: ~$0.40
- Twitter: ~$0.02
- Reddit: ~$0.06
- **Total: ~$0.48**

---

## What to Check

### ✅ Data Quality
- [ ] Posts are relevant to keywords
- [ ] Author names are present
- [ ] Engagement metrics (likes, comments) are populated
- [ ] URLs are valid and clickable
- [ ] Dates are recent (within selected time range)
- [ ] Platform badges show correct platform

### ✅ Functionality
- [ ] Platform filter works (show only Twitter, only Reddit, etc.)
- [ ] Topic filter works
- [ ] Date range filter works
- [ ] Sorting by engagement works
- [ ] Bookmark feature works for all platforms
- [ ] Save influencer works for all platforms
- [ ] Trending keywords includes all platforms

### ✅ Performance
- [ ] Loading completes within reasonable time
- [ ] No errors in browser console
- [ ] Cache works (24-hour expiry)
- [ ] Demo mode still works with 3 platforms

---

## Troubleshooting

### Twitter Issues

**Problem**: No tweets returned
- **Check**: Keywords might be too specific
- **Solution**: Try broader terms like "pain management" or "prior authorization"

**Problem**: Getting old tweets
- **Check**: Twitter actor sorts by "Latest" by default
- **Solution**: Already configured correctly in code

**Problem**: Too many retweets
- **Check**: "Exclude retweets" checkbox
- **Solution**: Should be checked by default

### Reddit Issues

**Problem**: No posts returned
- **Check**: Subreddit filter might be too restrictive
- **Solution**: Leave subreddits empty to search all of Reddit

**Problem**: Slow performance
- **Check**: Fast Mode setting
- **Solution**: Already enabled in code (fastMode: true)

**Problem**: Getting NSFW content
- **Check**: NSFW filter
- **Solution**: Add `includeNSFW: false` to input if needed

### General Issues

**Problem**: "API Error" message
- **Possible causes**:
  - Invalid Apify token
  - Insufficient credits
  - Actor temporarily unavailable
- **Solution**: 
  - Verify token in Apify console
  - Check credit balance
  - Try again in a few minutes

**Problem**: Slow loading
- **Solution**: Reduce max items to 10-20 for testing

---

## Expected Data Structure

### Twitter Post
```javascript
{
  date: "2025-02-09T10:30:00.000Z",
  author: "@HealthcareUser",
  authorUrl: "https://twitter.com/HealthcareUser",
  content: "Just spent 3 hours on prior authorization...",
  platform: "twitter",
  likes: 45,
  comments: 12,
  shares: 8,
  url: "https://twitter.com/i/status/1234567890",
  topic: "prior authorization pain management"
}
```

### Reddit Post
```javascript
{
  date: "2025-02-08T15:20:00.000Z",
  author: "reddit_user_123",
  authorUrl: "https://reddit.com/user/reddit_user_123",
  content: "Question about prior authorization: Has anyone...",
  platform: "reddit",
  likes: 156,
  comments: 34,
  shares: 0,
  url: "https://reddit.com/r/medicine/comments/abc123",
  topic: "prior authorization pain management",
  subreddit: "medicine"
}
```

---

## Cost Breakdown

### Twitter Pricing (apidojo/twitter-scraper-lite)
- **Query cost**: $0.016 per query (includes first ~40 tweets)
- **Additional tweets**: $0.0004 per tweet (Tier 1)
- **Example**: 30 tweets = $0.016 + (0 × $0.0004) = ~$0.02

### Reddit Pricing (harshmaur/reddit-scraper-pro)
- **Actor start**: $0.02 per run
- **Per item**: $0.002 per post
- **Example**: 30 posts = $0.02 + (30 × $0.002) = $0.08

### LinkedIn Pricing (existing)
- **~$1-2 per 100 posts**
- **Example**: 30 posts = ~$0.30-0.60

---

## Next Steps After Testing

1. ✅ **Verify Twitter works** - Check data quality and relevance
2. ✅ **Verify Reddit works** - Check subreddit coverage
3. ✅ **Test all 3 platforms together** - Ensure no conflicts
4. ✅ **Test filters** - Platform, topic, date range
5. ✅ **Test saved features** - Bookmarks, keywords, influencers
6. ✅ **Test trending keywords** - Should include all 3 platforms
7. ✅ **Test demo mode** - Should show 50 posts (17+17+16)

---

## Success Criteria

Your dashboard is working correctly when:

- ✅ All 3 platforms fetch data successfully
- ✅ Data is relevant to keywords
- ✅ Platform badges show correctly
- ✅ Filters work for all platforms
- ✅ Saved features work across platforms
- ✅ No authentication errors
- ✅ Costs are reasonable
- ✅ Performance is acceptable

---

## Support Resources

### Twitter Actor
- **Documentation**: https://apify.com/apidojo/twitter-scraper-lite
- **Advanced search syntax**: Use Twitter's search operators
- **Examples**: See actor documentation for query examples

### Reddit Actor
- **Documentation**: https://apify.com/harshmaur/reddit-scraper-pro
- **Fast Mode**: Enabled by default for better performance
- **Community search**: Use `withinCommunity` for specific subreddits

### Apify Platform
- **API Docs**: https://docs.apify.com/api/v2
- **Pricing**: Check your usage in Apify Console
- **Support**: Contact Apify support for actor-specific issues

---

## Quick Test Command

**Minimal test (fastest, cheapest):**
```
Platforms: ✓ Twitter/X ✓ Reddit
Keywords: pain management
Max Items: 10
```

**Expected cost**: ~$0.05
**Expected time**: 1-2 minutes
**Expected results**: 20 posts total (10 Twitter + 10 Reddit)

---

**Ready to test?** Start with the minimal test above, then scale up once you confirm everything works!

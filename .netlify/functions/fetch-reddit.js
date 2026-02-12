const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { keyword, maxItems, sort, time, subreddits } = JSON.parse(event.body);

        // Build Reddit search URL
        let searchUrl = 'https://www.reddit.com/search.json';
        const params = new URLSearchParams({
            q: keyword,
            limit: Math.min(100, maxItems || 25),
            sort: sort || 'relevance',
            t: time || 'all',
            raw_json: 1,
            type: 'link'
        });

        // Add subreddit filter if specified
        if (subreddits) {
            const subredditList = subreddits.split(',').map(s => s.trim()).filter(s => s);
            if (subredditList.length > 0) {
                searchUrl = `https://www.reddit.com/r/${subredditList[0]}/search.json`;
                params.set('restrict_sr', 'true');
            }
        }

        const url = `${searchUrl}?${params.toString()}`;
        
        console.log('Fetching from Reddit:', url);

        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`Reddit API returned ${response.status}`);
        }

        const data = await response.json();
        
        // Extract posts
        const posts = data.data?.children || [];
        
        // Filter and return
        const results = posts
            .filter(item => {
                const post = item.data;
                return post && post.title && post.author !== '[deleted]';
            })
            .map(item => item.data);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(results)
        };

    } catch (error) {
        console.error('Reddit fetch error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: error.message || 'Failed to fetch Reddit data'
            })
        };
    }
};

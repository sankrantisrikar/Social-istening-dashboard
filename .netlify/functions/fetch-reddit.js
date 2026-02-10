exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { token, keyword, maxItems, sort, time, subreddits } = JSON.parse(event.body);

    const input = {
      searchTerms: [keyword],
      searchPosts: true,
      searchComments: false,
      searchSort: sort,
      searchTime: time,
      maxPostsCount: maxItems,
      fastMode: true,
      proxy: {
        useApifyProxy: true,
        apifyProxyGroups: ['RESIDENTIAL']
      }
    };

    // Add subreddit filter if specified
    if (subreddits) {
      const subredditList = subreddits.split(',').map(s => s.trim());
      if (subredditList.length > 0) {
        input.withinCommunity = `r/${subredditList[0]}`;
      }
    }

    const url = `https://api.apify.com/v2/acts/harshmaur/reddit-scraper-pro/runs?token=${token}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `Reddit API Error: ${response.status}`, details: errorText })
      };
    }

    const result = await response.json();
    const runId = result.data.id;

    // Wait for completion (with timeout)
    const maxWaitTime = 300000; // 5 minutes
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const statusUrl = `https://api.apify.com/v2/actor-runs/${runId}?token=${token}`;
      const statusResponse = await fetch(statusUrl);
      const statusData = await statusResponse.json();

      if (statusData.data.status === 'SUCCEEDED') {
        // Get results
        const datasetId = statusData.data.defaultDatasetId;
        const dataUrl = `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&format=json`;
        const dataResponse = await fetch(dataUrl);
        const rawData = await dataResponse.json();

        return {
          statusCode: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify(rawData)
        };
      } else if (statusData.data.status === 'FAILED' || statusData.data.status === 'ABORTED') {
        return {
          statusCode: 500,
          body: JSON.stringify({ error: `Run ${statusData.data.status}` })
        };
      }

      // Wait 2 seconds before checking again
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return {
      statusCode: 408,
      body: JSON.stringify({ error: 'Timeout waiting for results' })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};

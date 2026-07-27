const http = require('http');

const PORT = 3003;
const BASE_URL = `http://localhost:${PORT}/api`;

function makeRequest(urlPath, method = 'GET', postData = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, headers: res.headers, data });
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(JSON.stringify(postData));
    }
    req.end();
  });
}

async function runEndpointTests() {
  console.log('🧪 Starting CoastGuard Disaster Endpoint Automated Test Suite...');
  let passed = 0;
  let failed = 0;

  const tests = [
    {
      name: 'GET /api/emergency-contacts',
      run: async () => {
        const res = await makeRequest('/emergency-contacts');
        if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
        const parsed = JSON.parse(res.data);
        if (!parsed.success || !Array.isArray(parsed.data)) throw new Error('Invalid JSON response format');
      },
    },
    {
      name: 'POST /api/geofence/check-risk',
      run: async () => {
        const res = await makeRequest('/geofence/check-risk', 'POST', { lat: 10.05, lng: 79.52 });
        if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
        const parsed = JSON.parse(res.data);
        if (!parsed.success || !parsed.riskLevel) throw new Error('Missing risk level evaluation');
      },
    },
    {
      name: 'GET /api/relief-camps',
      run: async () => {
        const res = await makeRequest('/relief-camps');
        if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
        const parsed = JSON.parse(res.data);
        if (!parsed.success || !parsed.summary) throw new Error('Missing camp summary metrics');
      },
    },
    {
      name: 'GET /api/weather/advisories',
      run: async () => {
        const res = await makeRequest('/weather/advisories');
        if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
        const parsed = JSON.parse(res.data);
        if (!parsed.success || parsed.count === 0) throw new Error('Weather advisories list is empty');
      },
    },
    {
      name: 'GET /api/audio-alerts?lang=ta',
      run: async () => {
        const res = await makeRequest('/audio-alerts?lang=ta');
        if (res.statusCode !== 200) throw new Error(`Expected 200, got ${res.statusCode}`);
        const parsed = JSON.parse(res.data);
        if (!parsed.success || !parsed.audioPromptText) throw new Error('Tamil audio prompt text missing');
      },
    },
  ];

  for (const t of tests) {
    try {
      await t.run();
      console.log(`  ✅ [PASS] ${t.name}`);
      passed++;
    } catch (err) {
      console.log(`  ❌ [FAIL] ${t.name}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Test Results: ${passed} Passed, ${failed} Failed out of ${tests.length} assertions.`);
}

if (require.main === module) {
  runEndpointTests().catch(console.error);
}

module.exports = { runEndpointTests };

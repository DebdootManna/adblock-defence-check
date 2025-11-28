export const STATUS = {
  PENDING: 'PENDING...',
  PROTECTED: 'BLOCKED',
  VULNERABLE: 'ALLOWED',
};

// Extracted and merged from paileActivist/toolz and other sources
const newTests = [
  // --- Ad Networks ---
  { id: 'google-ads-1', title: 'Google Ads', category: 'Ads', target: 'pagead2.googlesyndication.com', type: 'network' },
  { id: 'google-ads-2', title: 'Google Ads', target: 'adservice.google.com', type: 'network' },
  { id: 'google-ads-3', title: 'Google Ads', target: 'googleadservices.com', type: 'network' },
  { id: 'doubleclick-1', title: 'Google DoubleClick', category: 'Ads', target: 'doubleclick.net', type: 'network' },
  { id: 'doubleclick-2', title: 'Google DoubleClick', target: 'static.doubleclick.net', type: 'network' },
  { id: 'doubleclick-3', title: 'Google DoubleClick', category: 'Ads', target: 'mediavisor.doubleclick.net', type: 'network' },
  { id: 'fastclick-1', title: 'FastClick', category: 'Ads', target: 'media.fastclick.net', type: 'network' },
  { id: 'amazon-ads-1', title: 'Amazon Ads', category: 'Ads', target: 'adtago.s3.amazonaws.com', type: 'network' },
  { id: 'amazon-ads-2', title: 'Amazon Ads', category: 'Ads', target: 'advertising-api-eu.amazon.com', type: 'network' },
  { id: 'criteo', title: 'Criteo', category: 'Ads', target: 'static.criteo.net', type: 'network' },
  { id: 'taboola', title: 'Taboola', category: 'Ads', target: 'cdn.taboola.com', type: 'network' },
  { id: 'adroll', title: 'AdRoll', category: 'Ads', target: 's.adroll.com', type: 'network' },
  { id: 'yahoo-ads-1', title: 'Yahoo Ads', category: 'Ads', target: 'ads.yahoo.com', type: 'network' },
  { id: 'yahoo-ads-2', title: 'Yahoo Ads', category: 'Ads', target: 'global.adserver.yahoo.com', type: 'network' },
  
  // --- Analytics & Tracking ---
  { id: 'google-analytics', title: 'Google Analytics', category: 'Analytics', target: 'google-analytics.com', type: 'network' },
  { id: 'hotjar', title: 'Hotjar', category: 'Analytics', target: 'static.hotjar.com', type: 'network' },
  { id: 'mouseflow', title: 'MouseFlow', category: 'Analytics', target: 'a.mouseflow.com', type: 'network' },
  { id: 'luckyorange', title: 'Lucky Orange', category: 'Analytics', target: 'cdn.luckyorange.com', type: 'network' },
  { id: 'stats-wp', title: 'Stats WP Plugin', category: 'Analytics', target: 'stats.wp.com', type: 'network' },
  { id: 'bugsnag', title: 'Bugsnag', category: 'Analytics', target: 'notify.bugsnag.com', type: 'network' },
  { id: 'sentry', title: 'Sentry', category: 'Analytics', target: 'browser.sentry-cdn.com', type: 'network' },
  { id: 'yandex-metrica', title: 'Yandex Metrica', category: 'Analytics', target: 'appmetrica.yandex.com', type: 'network' },
  
  // --- Social Media Trackers ---
  { id: 'facebook-pixel-1', title: 'Facebook Pixel', category: 'Social', target: 'pixel.facebook.com', type: 'network' },
  { id: 'facebook-pixel-2', title: 'Facebook Analytics', category: 'Social', target: 'analytics.facebook.com', type: 'network' },
  { id: 'twitter-ads', title: 'Twitter Ads', category: 'Social', target: 'static.ads-twitter.com', type: 'network' },
  { id: 'linkedin-ads', title: 'LinkedIn Ads', category: 'Social', target: 'ads.linkedin.com', type: 'network' },
  { id: 'pinterest-analytics', title: 'Pinterest Analytics', category: 'Social', target: 'analytics.pinterest.com', type: 'network' },
  { id: 'reddit-events', title: 'Reddit Events', category: 'Social', target: 'events.redditmedia.com', type: 'network' },
  { id: 'tiktok-analytics', title: 'TikTok Analytics', category: 'Social', target: 'analytics.tiktok.com', type: 'network' },

  // --- OEM / Device Trackers ---
  { id: 'xiaomi-ad', title: 'Xiaomi Ads', category: 'OEM', target: 'api.ad.xiaomi.com', type: 'network' },
  { id: 'xiaomi-tracking', title: 'Xiaomi Tracking', category: 'OEM', target: 'data.mistat.xiaomi.com', type: 'network' },
  { id: 'huawei-metrics', title: 'Huawei Metrics', category: 'OEM', target: 'metrics.data.hicloud.com', type: 'network' },
  { id: 'huawei-logs', title: 'Huawei Logs', category: 'OEM', target: 'logservice.hicloud.com', type: 'network' },
  { id: 'oneplus-analytics', title: 'OnePlus Analytics', category: 'OEM', target: 'open.oneplus.net', type: 'network' },
  { id: 'samsung-ads', title: 'Samsung Ads', category: 'OEM', target: 'ad.samsungadhub.com', type: 'network' },
  { id: 'samsung-metrics', title: 'Samsung Metrics', category: 'OEM', target: 'smetrics.samsung.com', type: 'network' },
  { id: 'samsung-knox', title: 'Samsung Knox', category: 'OEM', target: 'analytics.samsungknox.com', type: 'network' },
  { id: 'apple-metrics', title: 'Apple Metrics', category: 'OEM', target: 'metrics.apple.com', type: 'network' },
  { id: 'apple-icloud-metrics', title: 'Apple iCloud Metrics', category: 'OEM', target: 'metrics.icloud.com', type: 'network' },
  
  // --- Cosmetic Filters ---
  {
    id: 'banner-class',
    title: 'Banner Ad Class',
    category: 'Cosmetic',
    target: '.ad.banner_ad',
    type: 'cosmetic',
  },
  {
    id: 'sponsored-id',
    title: 'Sponsored Link ID',
    category: 'Cosmetic',
    target: '#sponsored-links',
    type: 'cosmetic',
  },
  {
    id: 'nuisance-banner',
    title: 'Anti-AdBlock Banner',
    category: 'Cosmetic',
    target: '.block-adblock-wrapper',
    type: 'cosmetic',
  },
];


// Final export processing to build out the full test objects
export const tests = newTests.map(test => {
  const description = test.type === 'network'
    ? `Attempts to connect to ${test.target}`
    : `Checks for cosmetic rule hiding ${test.target}`;

  const base = { ...test, description };

  if (test.type === 'network') {
    return {
      ...base,
      check: async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500); // 2.5 second timeout
        try {
          await fetch(`https://${base.target}`, {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal,
          });
          // If fetch resolves, it means a response (of any kind) was received.
          // In no-cors mode, this indicates the request was NOT blocked by the network stack.
          clearTimeout(timeoutId);
          return STATUS.VULNERABLE;
        } catch (error) {
          // If fetch throws an error (e.g., 'Failed to fetch'), it was likely blocked by an ad-blocker or failed to resolve.
          clearTimeout(timeoutId);
          return STATUS.PROTECTED;
        }
      },
    };
  }
  
  if (test.type === 'cosmetic') {
      return {
          ...base,
          bait: { tag: 'div', attrs: { id: test.id, style: { position: 'absolute', left: '-9999px', top: '-9999px', height: '1px', width: '1px' } } },
          check: (element) => {
              // Add a specific class to the cosmetic test elements
              if(element) element.className = test.target.replace(/#/g, '').replace(/\./g, ' ');
              
              return (!element || window.getComputedStyle(element).display === 'none') 
                ? STATUS.PROTECTED 
                : STATUS.VULNERABLE
          }
      }
  }

  return base;
});
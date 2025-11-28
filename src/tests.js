export const STATUS = {
  PENDING: 'PENDING...',
  PROTECTED: 'BLOCKED',
  VULNERABLE: 'ALLOWED',
};

// Extracted and merged from paileActivist/toolz and other sources
const newTests = [
  // --- Ad Networks ---
  { id: 'google-ads-1', title: 'Google Ads', category: 'Ads', target: 'pagead2.googlesyndication.com', type: 'network' },
  { id: 'google-ads-2', title: 'Google Ads', category: 'Ads', target: 'adservice.google.com', type: 'network' },
  { id: 'google-ads-3', title: 'Google Ads', category: 'Ads', target: 'googleadservices.com', type: 'network' },
  { id: 'doubleclick-1', title: 'Google DoubleClick', category: 'Ads', target: 'doubleclick.net', type: 'network' },
  { id: 'doubleclick-2', title: 'Google DoubleClick', category: 'Ads', target: 'static.doubleclick.net', type: 'network' },
  { id: 'medianet-1', title: 'Media.net', category: 'Ads', target: 'static.media.net', type: 'network' },
  { id: 'amazon-ads-1', title: 'Amazon Ads', category: 'Ads', target: 'adtago.s3.amazonaws.com', type: 'network' },
  { id: 'amazon-ads-2', title: 'Amazon Ads', category: 'Ads', target: 'advertising-api-eu.amazon.com', type: 'network' },
  { id: 'criteo', title: 'Criteo', category: 'Ads', target: 'static.criteo.net', type: 'network' },
  { id: 'taboola', title: 'Taboola', category: 'Ads', target: 'cdn.taboola.com', type: 'network' },
  { id: 'adroll', title: 'AdRoll', category: 'Ads', target: 's.adroll.com', type: 'network' },

  // --- Analytics & Tracking ---
  { id: 'google-analytics', title: 'Google Analytics', category: 'Analytics', target: 'google-analytics.com', type: 'network' },
  { id: 'hotjar', title: 'Hotjar', category: 'Analytics', target: 'static.hotjar.com', type: 'network' },
  { id: 'mouseflow', title: 'MouseFlow', category: 'Analytics', target: 'a.mouseflow.com', type: 'network' },
  { id: 'luckyorange', title: 'Lucky Orange', category: 'Analytics', target: 'cdn.luckyorange.com', type: 'network' },
  { id: 'stats-wp', title: 'Stats WP Plugin', category: 'Analytics', target: 'stats.wp.com', type: 'network' },
  { id: 'bugsnag', title: 'Bugsnag', category: 'Analytics', target: 'notify.bugsnag.com', type: 'network' },
  { id: 'sentry', title: 'Sentry', category: 'Analytics', target: 'browser.sentry-cdn.com', type: 'network' },

  // --- Social Media Trackers ---
  { id: 'facebook-pixel', title: 'Facebook Pixel', category: 'Social', target: 'pixel.facebook.com', type: 'network' },
  { id: 'twitter-ads', title: 'Twitter Ads', category: 'Social', target: 'static.ads-twitter.com', type: 'network' },
  { id: 'linkedin-ads', title: 'LinkedIn Ads', category: 'Social', target: 'ads.linkedin.com', type: 'network' },
  { id: 'pinterest-analytics', title: 'Pinterest Analytics', category: 'Social', target: 'analytics.pinterest.com', type: 'network' },
  { id: 'reddit-events', title: 'Reddit Events', category: 'Social', target: 'events.redditmedia.com', type: 'network' },
  { id: 'tiktok-analytics', title: 'TikTok Analytics', category: 'Social', target: 'analytics.tiktok.com', type: 'network' },

  // --- OEM / Device Trackers ---
  { id: 'xiaomi-ad', title: 'Xiaomi Ads', category: 'OEM', target: 'api.ad.xiaomi.com', type: 'network' },
  { id: 'xiaomi-tracking', title: 'Xiaomi Tracking', category: 'OEM', target: 'tracking.miui.com', type: 'network' },
  { id: 'huawei-metrics', title: 'Huawei Metrics', category: 'OEM', target: 'metrics.data.hicloud.com', type: 'network' },
  { id: 'oneplus-analytics', title: 'OnePlus Analytics', category: 'OEM', target: 'open.oneplus.net', type: 'network' },
  { id: 'samsung-ads', title: 'Samsung Ads', category: 'OEM', target: 'ad.samsungadhub.com', type: 'network' },
  { id: 'samsung-metrics', title: 'Samsung Metrics', category: 'OEM', target: 'smetrics.samsung.com', type: 'network' },
  { id: 'apple-metrics', title: 'Apple Metrics', category: 'OEM', target: 'metrics.apple.com', type: 'network' },
  
  // --- Mixed / Other ---
  { id: 'yahoo-ads', title: 'Yahoo Ads', category: 'Mixed', target: 'ads.yahoo.com', type: 'network' },
  { id: 'yandex-metrica', title: 'Yandex Metrica', category: 'Mixed', target: 'appmetrica.yandex.com', type: 'network' },
  { id: 'yandex-ads', title: 'Yandex Ads', category: 'Mixed', target: 'adsdk.yandex.ru', type: 'network' },
  
  // --- Cosmetic Filters ---
  {
    id: 'banner-class',
    title: 'Banner Ad Class',
    category: 'Cosmetic',
    target: '.ad.banner_ad',
    type: 'cosmetic',
    bait: { tag: 'div', attrs: { className: 'ad banner_ad ad-container', style: { position: 'absolute', left: '-9999px' } } },
    check: (element) => (window.getComputedStyle(element).display === 'none' ? STATUS.PROTECTED : STATUS.VULNERABLE),
  },
  {
    id: 'sponsored-id',
    title: 'Sponsored Link ID',
    category: 'Cosmetic',
    target: '#sponsored-links',
    type: 'cosmetic',
    bait: { tag: 'div', attrs: { id: 'sponsored-links', style: { position: 'absolute', left: '-9999px' } } },
    check: (element) => (!document.getElementById('sponsored-links') || window.getComputedStyle(element).display === 'none' ? STATUS.PROTECTED : STATUS.VULNERABLE),
  },
  {
    id: 'nuisance-banner',
    title: 'Anti-AdBlock Banner',
    category: 'Cosmetic',
    target: '.block-adblock-wrapper',
    type: 'cosmetic',
    bait: { tag: 'div', attrs: { className: 'block-adblock-wrapper', style: { position: 'absolute', left: '-9999px' } } },
    check: (element) => (window.getComputedStyle(element).display === 'none' ? STATUS.PROTECTED : STATUS.VULNERABLE),
  },
];


// Final export processing
export const tests = newTests.map(test => {
  const description = test.type === 'network'
    ? `Attempts to connect to ${test.target}`
    : `Checks for cosmetic rule hiding ${test.target}`;

  const base = {
      ...test,
      description,
  };

  if (test.type === 'network') {
    return {
      ...base,
      bait: {
        tag: 'script',
        attrs: { 
          src: test.target.startsWith('http') ? test.target : `https://${test.target}` 
        }
      },
      check: (didLoad) => (didLoad ? STATUS.VULNERABLE : STATUS.PROTECTED),
    };
  }
  return base;
});

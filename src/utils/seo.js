// ============================================
// 🔍 SEO Helper Functions
// ============================================

export const updatePageMeta = (title, description) => {
  // টাইটেল আপডেট
  if (title) {
    document.title = `${title} | BAFI Topup`;
  }

  // মেটা ডেসক্রিপশন আপডেট
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }
};

export const SEO_DEFAULTS = {
  title: 'BAFI Topup - Fast & Secure Gaming Top-up',
  description: 'Top-up in Seconds, Play for Hours. Bangladesh\'s most trusted gaming top-up platform.',
  keywords: 'gaming top-up, free fire, pubg, cod mobile, bafi topup',
};

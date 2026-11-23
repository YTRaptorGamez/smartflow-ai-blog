import { AffiliateLink } from '@/types/database';

export function renderAffiliateCardHtml(product: AffiliateLink): string {
  const trackingUrl = `/api/affiliate/track?id=${encodeURIComponent(product.id)}&url=${encodeURIComponent(product.affiliate_url)}`;

  return `
<div class="my-8 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-slate-900 to-indigo-950/20 p-6 shadow-xl relative overflow-hidden not-prose">
  <div class="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none"></div>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
    <div class="space-y-2">
      <div class="flex items-center gap-2 flex-wrap">
        <span class="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
          <svg class="w-3.5 h-3.5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
          ${product.badge_text || 'Featured Recommendation'}
        </span>
        ${product.price_estimate ? `<span class="text-xs font-medium text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-500/20">${product.price_estimate}</span>` : ''}
      </div>
      <h4 class="text-lg font-bold text-white tracking-tight">${product.product_name}</h4>
      <p class="text-sm text-slate-300 leading-relaxed max-w-xl">${product.description || 'Tested and benchmarked for autonomous workflows and developer productivity.'}</p>
      <p class="text-[11px] text-slate-400 italic">${product.disclosure || 'Affiliate link: SmartFlow may earn a commission if you purchase through this link at no additional cost.'}</p>
    </div>
    <div class="sm:self-center shrink-0">
      <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer nofollow" class="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-500/40 transition-all duration-200">
        <span>${product.cta_text || 'View Best Deal'}</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
      </a>
    </div>
  </div>
</div>
`;
}

export function injectAffiliateLinksIntoMarkdown(
  markdown: string,
  affiliateProducts: AffiliateLink[],
  maxInjections = 2
): string {
  if (!affiliateProducts || affiliateProducts.length === 0) {
    return markdown;
  }

  let result = markdown;
  const usedProductIds = new Set<string>();

  // 1. First replace any explicit placeholders like :::affiliate-card:slug:::
  for (const product of affiliateProducts) {
    const slugPattern = new RegExp(`:::affiliate-card:[\\w-]+:::`, 'gi');
    // If explicit placeholder matches any keyword
    if (result.match(slugPattern)) {
      result = result.replace(slugPattern, () => {
        usedProductIds.add(product.id);
        return renderAffiliateCardHtml(product);
      });
    }
  }

  // 2. Intelligently match product keywords against content
  if (usedProductIds.size < maxInjections) {
    const lowerContent = markdown.toLowerCase();

    // Find best matching products
    const matchedProducts: { product: AffiliateLink; matchCount: number }[] = [];

    for (const product of affiliateProducts) {
      if (usedProductIds.has(product.id)) continue;

      let matchCount = 0;
      for (const kw of product.keywords) {
        if (lowerContent.includes(kw.toLowerCase())) {
          matchCount += 1;
        }
      }

      if (matchCount > 0) {
        matchedProducts.push({ product, matchCount });
      }
    }

    // Sort by relevance (most keyword matches first)
    matchedProducts.sort((a, b) => b.matchCount - a.matchCount);

    // Inject after prominent H2 sections (around paragraph breaks)
    const sections = result.split(/(?=^##\s+)/m);
    if (sections.length > 2) {
      let injected = 0;
      for (let i = 1; i < sections.length && injected < maxInjections; i++) {
        const candidate = matchedProducts[injected];
        if (!candidate) break;

        // Append card at end of this section
        sections[i] = sections[i] + '\n\n' + renderAffiliateCardHtml(candidate.product) + '\n\n';
        usedProductIds.add(candidate.product.id);
        injected += 1;
      }
      result = sections.join('');
    } else {
      // If short post with few H2s, append before takeaways or at 60% mark
      const candidate = matchedProducts[0];
      if (candidate) {
        result = result + '\n\n' + renderAffiliateCardHtml(candidate.product) + '\n\n';
      }
    }
  }

  return result;
}

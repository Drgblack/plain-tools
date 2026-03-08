import Script from "next/script"

import { adsConfig, shouldLoadAdsScript } from "@/lib/ads"

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>> & {
      requestNonPersonalizedAds?: number
    }
    plainAdsConfig?: {
      cmpReady: boolean
      consentMode: string
      mode: string
    }
  }
}

export function AdsenseScript() {
  if (!shouldLoadAdsScript()) {
    return null
  }

  const bootstrapScript = `
window.plainAdsConfig = {
  cmpReady: ${adsConfig.cmpReady ? "true" : "false"},
  consentMode: "${adsConfig.consentMode}",
  mode: "${adsConfig.mode}"
};
window.adsbygoogle = window.adsbygoogle || [];
if (!window.plainAdsConfig.cmpReady) {
  window.adsbygoogle.requestNonPersonalizedAds = 1;
}
`

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: bootstrapScript }} />
      <Script
        id="adsense-script"
        strategy="afterInteractive"
        async
        crossOrigin="anonymous"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.clientId}`}
      />
    </>
  )
}

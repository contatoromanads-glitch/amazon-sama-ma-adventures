import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
}

const BASE_URL = "https://amazon-samauma-lodge.com.br";
const DEFAULT_IMAGE = `${BASE_URL}/fotos_reais_amazon/lodge.webp`;

export function SEOHead({ title, description, canonicalPath = "/", ogImage = DEFAULT_IMAGE }: SEOHeadProps) {
  const fullTitle = title.includes("Amazon Samaúma") ? title : `${title} | Amazon Samaúma Lodge`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  useEffect(() => {
    document.title = fullTitle;

    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        const attr = selector.includes("[name=") ? "name" : "property";
        const val = selector.match(/["']([^"']+)["']/)?.[1] ?? "";
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
    };

    setMeta('meta[name="description"]', description);
    setLink("canonical", canonicalUrl);

    setMeta('meta[property="og:title"]', fullTitle);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonicalUrl);
    setMeta('meta[property="og:image"]', ogImage);

    setMeta('meta[name="twitter:title"]', fullTitle);
    setMeta('meta[name="twitter:description"]', description);
    setMeta('meta[name="twitter:image"]', ogImage);
  }, [fullTitle, description, canonicalUrl, ogImage]);

  return null;
}

export default SEOHead;

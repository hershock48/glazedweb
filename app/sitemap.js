export default function sitemap() {
  const now = new Date();
  return [
    { url: "https://www.glazedweb.com", lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: "https://www.glazedweb.com/do", lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: "https://www.glazedweb.com/order", lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: "https://www.glazedweb.com/restaurant-website-design-michigan", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.glazedweb.com/online-ordering-website-michigan", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.glazedweb.com/small-business-web-design-michigan", lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: "https://www.glazedweb.com/agreement", lastModified: now, changeFrequency: "yearly", priority: 0.4 },
  ];
}

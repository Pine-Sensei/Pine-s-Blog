// 全部文章的匹配路径（三个板块共用）
const POST_GLOB = "src/{tech,essays,photography}/*.md";
const CATEGORIES = ["tech", "essays", "photography"];
// 分类显示名（与 src/_data/cats.json 保持一致，用于在 Shortcuts 中排除同名标签）
const CAT_NAMES = Object.values(require("./src/_data/cats.json"));

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-rss"));
  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-syntaxhighlight"));

  // 静态资源直通复制
  eleventyConfig.addPassthroughCopy("src/static/");

  // 日期格式化：YYYY-MM-DD
  eleventyConfig.addFilter("isoDate", (d) => {
    const date = new Date(d);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  });

  // 集合按日期倒序（用于标签页的自动集合）
  const byDateDesc = (a, b) => b.date - a.date;
  eleventyConfig.addFilter("byDateDesc", (arr) => [...arr].sort(byDateDesc));

  // 全站文章（按日期倒序）
  eleventyConfig.addCollection("postList", (c) =>
    c.getFilteredByGlob(POST_GLOB).sort(byDateDesc)
  );

  // 三个内容板块（各自排除板块入口页 index.md）
  for (const cat of CATEGORIES) {
    eleventyConfig.addCollection(cat, (c) =>
      c.getFilteredByGlob(`src/${cat}/*.md`).filter((p) => !p.data.indexPage).sort(byDateDesc)
    );
  }

  // 首页 Shortcuts：按出现频次取高频标签（最多 15 个，同频按拼音排序，排除与分类同名的标签）
  eleventyConfig.addCollection("shortcuts", (c) => {
    const counts = new Map();
    for (const p of c.getFilteredByGlob(POST_GLOB)) {
      for (const t of p.data.tags || []) {
        if (CAT_NAMES.includes(t)) continue; // 分类名已有专属入口，不进 Shortcuts
        counts.set(t, (counts.get(t) || 0) + 1);
      }
    }
    return [...counts.entries()]
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh"))
      .slice(0, 15);
  });

  // 全部标签（供 /tags/ 分页）
  eleventyConfig.addCollection("tagList", (c) => {
    const tags = new Set();
    for (const p of c.getFilteredByGlob(POST_GLOB)) {
      for (const t of p.data.tags || []) tags.add(t);
    }
    return [...tags].sort((a, b) => a.localeCompare(b, "zh"));
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
  };
};

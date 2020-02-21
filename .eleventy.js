// docs: https://www.11ty.io/docs/config/

module.exports = function(eleventyConfig) {

  // eleventyConfig.addFilter( "myFilter", function() {});

  eleventyConfig.addPassthroughCopy("css")
  eleventyConfig.addPassthroughCopy("documents")
  eleventyConfig.addPassthroughCopy("fonts")
  eleventyConfig.addPassthroughCopy("images")
  eleventyConfig.addPassthroughCopy("img")
  eleventyConfig.addPassthroughCopy("js")
  eleventyConfig.addPassthroughCopy("mailchimp")
  eleventyConfig.addPassthroughCopy("favicon.ico")

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};

module Jekyll
  class AuthorPageGenerator < Generator
    safe true
    priority :low

    PER_PAGE = 10

    def generate(site)
      default_author = site.config.dig('author', 'id') || 'digitalblake'

      # Collect posts per author slug
      authors = Hash.new { |h, k| h[k] = [] }
      site.posts.docs.each do |post|
        slug = post.data['author'] || default_author
        authors[slug] << post
      end

      authors.each do |author_slug, posts|
        sorted = posts.sort_by(&:date).reverse
        total_pages = [(sorted.length.to_f / PER_PAGE).ceil, 1].max

        total_pages.times do |i|
          page_num   = i + 1
          page_posts = sorted.slice(i * PER_PAGE, PER_PAGE) || []
          site.pages << AuthorPage.new(site, author_slug, page_num, total_pages, page_posts)
        end
      end
    end
  end

  class AuthorPage < Page
    def initialize(site, author_slug, page_num, total_pages, posts)
      @site = site
      @base = site.source
      @dir  = page_num == 1 ? "author/#{author_slug}" : "author/#{author_slug}/page/#{page_num}"
      @name = 'index.html'

      process(@name)
      read_yaml(File.join(@base, '_layouts'), 'author.html')

      author_data = (site.data['authors'] || {})[author_slug] || {}

      data['title']        = author_data['name'] || author_slug
      data['description']  = author_data['description'] || ''
      data['author_slug']  = author_slug
      data['author_posts'] = posts
      data['author_pagination'] = {
        'page'          => page_num,
        'total_pages'   => total_pages,
        'previous_page' => page_num > 1 ? page_num - 1 : nil,
        'next_page'     => page_num < total_pages ? page_num + 1 : nil,
        'base_path'     => "/author/#{author_slug}/"
      }
    end
  end
end

---
title:  "Jekyll is awesome!"
date:   2018-05-06 19:00:00 +0100
---
Jekyll is a fantastic tool to create static web pages from plain text files.
It is written in Ruby and forms part of a set of tools known as Static Site Generators like [Pelican](https://github.com/getpelican/pelican), [Hyde](https://github.com/hyde/hyde), [Sculpin](https://sculpin.io) and [much more](https://github.com/myles/awesome-static-generators).

These tools can generate a complete site using simple text files formatted in a certain way or stored in certain directories. This allows us to focus only on the content without worrying about how it is going to render or how to link the pages and assets to each other and gives the flexibility that the content generated after rendering the site will be a static site. 

We don't need to worry about programming, creating and mantaining a database or running an application server. A static site is fast (really fast since you can directly cache the entire site), it's very light and can be hosted practically anywhere, the only requirement is to "compile" the site before deploying it.

## How it works
Jekyll is perfect for blogs and simple pages that don't require a complex business logic: portfolios, documentation sites, landing pages...

Jekyll, mainly, works with three type of content:
  - Content organized by dates like posts.
  - Collections that aren't data-based.
  - Static pages.

All of them can be written in plain text using Markdown. Also, you can use HTML or other format with the appropriate converter installed.

These files can include some tags and filters provided by Jekyll to make common tasks easier: link pages, convert dates, escape content, filter content and [much more](https://jekyllrb.com/docs/templates).

Also, Jekyll support the use of layouts and includes to create common wrappers and sections where posts, pages and collections will be rendered when the site will be compiled.

When Jekyll build the site, its template engine takes all the above, processes it, assembles it and generates a HTML file inside the `_site` folder for each document. That directory will contain your complete static site compiled and ready to be deployed to a web server.

The best part of this is if all this seems very complicated to you or you don't want to waste your time making layouts and stylesheets, you can download a theme and use it. It will contain the base skeleton of your Jekyll site with layouts, styles, scripts and everything else it need, so you can focus only on the content.

## Where to host

Static sites can be hosted almost anywhere and there are a number of options, free and paid, to consider. Nevertheless, for open source sites that don't exotic features [GitHub Pages](https://pages.github.com) is the simplest option.

#### GitHub Pages
You can host Jekyll sites for free in GitHub using GitHub Pages on GitHub's `github.io` domain or on a custom domain name of your choice. 

GitHub Pages are powered by Jekyll behind the scenes and your site is automatically compiled by GitHub Pages when you push your changes to the repository, so they’re a great way to host your Jekyll-powered website for free.

The only drawback of GitHub Pages is that it only supports some plugins described in its [documentation](https://pages.github.com/versions).

#### Hosting services with Jekyll support
There are some SaaS that support natively Jekyll projects and work in a similar way as GitHub Pages does. Some of them offer interesting features for a static site like CDN and automatic backups.

At the end of this post there is a resource section where I list some of these services.

#### Amazon S3 and classic web hosting providers
Since once compiled the site is a set of static files (html, css, images...), Amazon S3 can be a good place to host your site.

First you must compile your site using the command `jekyll build` to render the entire site inside the `_site` directory. Then you can upload the content of that folder into your Amazon S3 bucket and [use a custom domain to point to your bucket](https://docs.aws.amazon.com/AmazonS3/latest/dev/website-hosting-custom-domain-walkthrough.html).

Of course, you can follow the same steps to host your site into a classic web hosting uplodaing files over FTP, SCP...

#### Custom web server
Besides the previous options you can also host a Jekyll site from your custom machine. 

Obviously, you must have installed and started a web server like Apache or Nginx, and, as in the case of Amazon S3, you must precompile the site before placing it in the appropriate directory of your web server.

However, you can simplify this process using [Git Hooks](https://git-scm.com/book/uz/v2/Customizing-Git-Git-Hooks). If you store your Jekyll site in Git, you can push your changes to your web server machine and add a git post-receive hook to build your site and move the generated files to the proper directory.

The [Jekyll official documentation](https://jekyllrb.com/docs/deployment-methods/#git-post-update-hook) explains the whole process.

## Resources

If you are old enough, you will remember the prehistoric era of the web of the late nineties and early 2000s, and possibly remember the popular CGI (Common Gateway Interface). At that time, most sites were static, and if they wanted to support some dynamic behavior they used to depend on external services to include visitor counters, contact forms, etc.

Nowadays, luckily, the world of the web has been modernized. However there are still SaaS for almost everything, and we can take advantage of this to make our Jekyll site more versatile including support for comments, contact forms, subscriptions to mailing lists, social buttons or almost anything that comes to mind.

Below I list some resources to enrich our site. I'll update it from time to time. If you know any more, leave a comment and I'll add it to the list :)

#### Contact forms
- [Formspree](https://formspree.io)
- [Simple Form](https://getsimpleform.com)
- [FormKeep](https://formkeep.com)
- [Google Forms](https://www.google.com/intl/en/forms/about)

#### Comment system
- [Disqus](https://disqus.com)
- [Isso](https://posativ.org/isso)

#### Social buttons
- [ShareThis](https://www.sharethis.com)
- [AddThis](http://www.addthis.com)

#### Mailing list
- [MailChimp](https://mailchimp.com)
- [SendinBlue](https://sendinblue.com)

#### Hosting
- [GitHub Pages](https://pages.github.com)
- [Netlify](https://www.netlify.com)
- [Aerobatic](https://www.aerobatic.com)

#### Themes
- [jekyllthemes.io](https://jekyllthemes.io)
- [jekyllthemes.org](http://jekyllthemes.org)
- [themes.jekyllrc.org](http://themes.jekyllrc.org)

#### More resources
- [Awesome Jekyll](https://github.com/planetjekyll/awesome-jekyll): curated list of resources, F.A.Q.s, articles, themes, plugins...
- [Jekyll official documentation](https://jekyllrb.com/docs/resources)

##### History
- 2018-05-06: added "more resources" section

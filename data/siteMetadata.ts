export let siteMetadata = {
  title: "Sean's blog - Sean's coding journey",
  author: 'Sean',
  fullName: 'Sean',
  headerTitle: "Sean's blog - Sean's coding journey",
  footerTitle: "Sean's blog - Sean's coding journey",
  description:
    "Sean's coding journey - work and life stories through the keyboard of an open-minded Software Engineer",
  language: 'en-us',
  siteUrl: 'https://www.Sean.me',
  siteRepo: 'https://github.com/mk965/Sean.me',
  siteLogo: '/static/images/logo.jpg',
  socialBanner: '/static/images/profile.jpg',
  email: 'me@Sean.me',
  github: 'https://github.com/mk965',
  twitter: 'https://twitter.com/ZoengMaangngo',
  facebook: 'https://facebook.com/maangngo',
  youtube: 'https://www.youtube.com/@Seane',
  juejin: 'https://juejin.cn/user/4037062430299912/posts',
  linkedin: 'https://www.linkedin.com/in/zhangmk/',
  instagram: 'https://www.instagram.com/_mk965/',
  locale: 'en-US',
  analyticsURL: 'https://analytics.eu.umami.is/share/EqvpZYPABxaQA3mr/Sean.me',
  analytics: {
    plausibleDataDomain: '', // e.g. tailwind-nextjs-starter-blog.vercel.app
    simpleAnalytics: false, // true or false
    umamiWebsiteId: '3d411e30-9376-4df4-9858-f54c8358d0d1', // e.g. 123e4567-e89b-12d3-a456-426614174000
    googleAnalyticsId: 'G-N8GYBZ8V57', // e.g. UA-000000-2 or G-XXXXXXX
    microsoftClarity: 'jteok7o6yj',
  },
  socialAccounts: {
    github: 'mk965',
    juejin: 'Sean',
    linkedin: 'Sean',
    instagram: '_mk965',
    twitter: '',
  },
  kofiName: 'Sean',
}

/**
 * Select a provider and use the environment variables associated to it
 * https://vercel.com/docs/environment-variables
 * --
 *
 * Visit each provider's documentation link and follow the instructions, then add the environment variable to your project.
 */
export let commentConfig = {
  provider: 'giscus', // 'giscus' | 'utterances' | 'disqus',
  // https://giscus.app/
  giscusConfig: {
    repo: '', // process.env.GISCUS_REPO
    repositoryId: '', // process.env.GISCUS_REPOSITORY_ID
    category: '', // process.env.GISCUS_CATEGORY
    categoryId: '', // process.env.GISCUS_CATEGORY_ID
    mapping: 'title',
    reactions: '1',
    metadata: '0',
    lightTheme: 'light',
    darkTheme: 'transparent_dark',
    themeURL: '',
  },
  // https://utteranc.es/
  utterancesConfig: {
    repo: '', // process.env.UTTERANCES_REPO
    issueTerm: '',
    label: '',
    lightTheme: '',
    darkTheme: '',
  },
  // https://help.disqus.com/en/articles/1717111-what-s-a-shortname
  disqus: {
    shortname: '', // process.env.DISQUS_SHORTNAME
  },
}

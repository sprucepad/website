import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getCollection } from "@/lib/custom-collection";
import { BlogFeed } from "atomfeed";
import { render } from "astro:content";
import mdx from "@astrojs/mdx/server.js";

export const getStaticPaths = (async ({ paginate }) => {
  const languages = ["pt", "en"];

  const result = (
    await Promise.all(
      languages.map(async (lang) => {
        const posts = await getCollection("posts", {
          locale: lang,
          imageKey: "image",
        });
        return paginate(posts, { params: { lang } });
      }),
    )
  ).flat();
  return result;
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ site, currentLocale, props }) => {
  const { page } = props as InferGetStaticPropsType<typeof getStaticPaths>;

  const feed = new BlogFeed({
    title: "sprucepad",
    description: "sprucepad's blog posts in an atom feed.",
    id: String(page.currentPage),
    language: currentLocale!,
    links: [`${site!.href}${currentLocale!}/feed.xml`],
    authors: [
      {
        name: "Forest",
        website: "https://sprucepad.net/",
        email: "sprucepadhq@gmail.com",
      },
    ],
    pagination: {
      current: `${site!.href}${currentLocale!}/${page.currentPage}.xml`,
      first: `${site!.href}${currentLocale!}/1.xml`,
      last: `${site!.href}${currentLocale!}/${page.lastPage}.xml`,
      next:
        page.lastPage === page.currentPage
          ? undefined
          : `${site!.href}${currentLocale!}/${page.currentPage + 1}.xml`,
      previous:
        page.currentPage === 1
          ? undefined
          : `${site!.href}${currentLocale!}/${page.currentPage - 1}.xml`,
    },
  });

  const container = await AstroContainer.create();
  container.addServerRenderer({ renderer: mdx });

  for (const post of page.data) {
    const { Content } = await render(post);

    feed.addPost({
      id: post.id,
      title: post.data.title,
      published: post.data.created,
      updated: post.data.updated,
      links: `${site!.href}${currentLocale!}/posts/${post.id}`,
      content: await container.renderToString(Content),
    });
  }

  return new Response(feed.generate(), {
    headers: {
      "Content-Type": "application/xml",
    },
  });
};

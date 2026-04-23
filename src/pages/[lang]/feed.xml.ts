import type { APIRoute, GetStaticPaths, InferGetStaticPropsType } from "astro";
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { BlogFeed } from "atomfeed";
import { getCollection } from "@/lib/custom-collection";
import { render } from "astro:content";
import mdx from "@astrojs/mdx/server.js";

const PAGE_SIZE = 10;

export const getStaticPaths = (async () => {
  const languages = ["pt", "en"];
  return await Promise.all(
    languages.map(async (lang) => ({
      params: { lang },
      props: { posts: await getCollection("posts", { locale: lang }) },
    })),
  );
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ site, currentLocale, props }) => {
  const { posts } = props as InferGetStaticPropsType<typeof getStaticPaths>;

  const currentPage = 1;

  const total = posts.length;
  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const page = {
    data: posts.slice(0, PAGE_SIZE),
    currentPage,
    lastPage,
  };

  const path = `${site!.href}${currentLocale!}/feed.xml`;
  const feed = new BlogFeed({
    title: "sprucepad",
    description: "sprucepad's blog posts in an atom feed.",
    id: path,
    language: currentLocale!,
    links: [path],
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

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import readingTime from "reading-time";

const postsDirectory = path.join(process.cwd(), "content/posts");

export interface Post {
    slug: string;
    title: string;
    description: string;
    date: string;
    author?: string;
    tags?: string[];
    content: string;
    readingTime: string;
}

export async function getPost(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const mdxSource = await serialize(content);
    const stats = readingTime(content);

    return {
        slug,
        ...data,
        content: mdxSource,
        readingTime: stats.text
    } as Post;
}

export function getAllPosts(): Post[] {
    const fileNames = fs.readdirSync(postsDirectory);

    const posts = fileNames.map(fileName => {
        const slug = fileName.replace(/\.mdx$/, "");
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);
        const stats = readingTime(content);

        return {
            slug,
            ...data,
            content,
            readingTime: stats.text
        } as Post;
    });

    return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

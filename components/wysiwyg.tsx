'use client'

import { Editor } from '@/components/mdx-editor'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useMediaQuery } from "@/hooks/use-media-query"
import { useMDXComponents } from '@/mdx-component'
import { evaluate } from '@mdx-js/mdx'
import { MDXProvider } from '@mdx-js/react'
import { HomeIcon } from 'lucide-react'
import Link from 'next/link'
import { createElement, Suspense, useCallback, useEffect, useState } from 'react'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import richtypo from "richtypo"
import { ellipses, numberUnits, quotes } from 'richtypo/rules/en'
import { ModeToggle } from './ui/mode-toggle'


const defaultTab = "both"

const customRules = [
    (text: string) => text.replace(/—/g, '-'),
    (text: string) => text.replace(/ & /g, 'and'),
    ...[ellipses, numberUnits, quotes]
];


export default function WYSIWYG() {
    const [tab, setTab] = useState(defaultTab);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [markdown, setMarkdown] = useState(`
    # The Ultimate Guide to Markdown Syntax

Markdown is a lightweight markup language that you can use to format text. It's especially popular among developers, writers, and content creators due to its simplicity and readability.

## Getting Started with Markdown

To write Markdown, you just need a basic text editor. For more advanced usage, editors like [Typora](https://typora.io/) or online platforms like [Dillinger](https://dillinger.io/) provide a user-friendly interface.

### Why Use Markdown?

- It\’s **lightweight** and easy to learn
- It\’s platform-independent
- Compatible with version control systems like Git
- Converts easily to HTML

> Markdown is not a replacement for HTML, but a syntax for writing for the web. \– John Gruber

## Basic Syntax

### Headings

Use \`#\` for headings:

- \`#\` for H1
- \`##\` for H2
- \`###\` for H3

### Emphasis

- *Italic* text using \`*asterisks*\`
- **Bold** text using \`**double asterisks**\`
- ***Bold and italic*** using \`***triple asterisks***\`

### Lists

Unordered List

- Apples
- Oranges
- Valencia
- Navel
- Bananas

Ordered List

1. First item
2. Second item
1. Sub-item
3. Third item

### Code

<p class="breakout">Use inline code like this: \`console.log('Hello, Markdown!')\` aoensth ansotehunsaoht es unaohsenuhaosn euhsaonethu nsaothe unstaoh eaonsheu nsaonseuhsaoneuh</p>
<p class="bleed">Use inline code like this: \`console.log('Hello, Markdown!')\` aoensth ansotehunsaoht es unaohsenuhaosn euhsaonethu nsaothe unstaoh eaonsheu nsaonseuhsaoneuh</p>


### Highlight (Custom HTML or extended Markdown)

You can use ==highlight== for emphasis with extended Markdown processors.

### Blockquote

> Markdown makes quoting content simple and readable.

## Tables

| Syntax      | Description     | Example                   |
|-------------|-----------------|---------------------------|
| \`**bold**\`  | Bold text       | **Bold**                  |
| \`*italic*\`  | Italic text     | *Italic*                  |
| \`[link]() \` | Hyperlink       | [OpenAI](https://openai.com) |

## Final Thoughts

Markdown is an invaluable tool for anyone who writes for the web. It allows for quick formatting without the complexity of HTML or rich text editors.

Want to practice? Try this [interactive Markdown tutorial](https://www.markdowntutorial.com/).

---

Happy writing in *Markdown*!
    `);

    const sanitizeMd = (markdown: string) => {
        const sanitized = richtypo(customRules, markdown);
        // console.log(sanitized);
        return setMarkdown(sanitized);
    }

    const [mdxContent, setMdxContent] = useState<(() => any) | null>(null);

    const parseMDX = useCallback(async (content: string) => {
        try {
            const { default: Content } = await evaluate(content, {
                ...runtime,
                useMDXComponents: () => useMDXComponents({}),
                remarkPlugins: [remarkGfm],
            });
            setMdxContent(() => Content);
        } catch (error) {
            console.error('MDX parsing error:', error);
            setMdxContent(() => () => <div>Error parsing markdown</div>);
        }
    }, []);

    // Parse markdown whenever it changes with debounce
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            parseMDX(markdown);
        }, 200);

        return () => clearTimeout(timeoutId);
    }, [markdown, parseMDX]);

    return (
        <main className='min-h-dvh flex flex-col'>
            <header className='border-b flex justify-between items-center h-16 px-4 relative'>
                <Breadcrumb>
                    <BreadcrumbList>
                        {isDesktop ?
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="/"><HomeIcon className='size-4' /></Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="#">AI</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link href="#">Module 1</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </> : <></>
                        }
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="#">Lesson 1</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Page 1</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className='absolute left-1/2 -translate-x-1/2'>
                    <ToggleGroup type="single" variant="outline" size="lg" defaultValue={defaultTab} onValueChange={(val) => { if (val) setTab(val) }}>
                        <ToggleGroupItem value="editor">Editor</ToggleGroupItem>
                        <ToggleGroupItem value="both">Both</ToggleGroupItem>
                        <ToggleGroupItem value="live">Live</ToggleGroupItem>
                    </ToggleGroup>
                </div>

                <ModeToggle />
                <Button>Save</Button>
            </header>
            <section className='flex flex-1 flex-col'>
                {
                    tab === "editor" ?
                        <div className='flex-1 flex-col'>
                            <Suspense fallback={null}>
                                <Editor
                                    markdown={markdown}
                                    className='flex-1'
                                    onChange={sanitizeMd}
                                />
                            </Suspense>
                        </div>
                        : tab === "both" ?
                            <ResizablePanelGroup
                                direction="horizontal"
                                className='flex-1'
                            >
                                <ResizablePanel defaultSize={50} className='flex flex-col'>
                                    <Suspense fallback={null}>
                                        <Editor
                                            markdown={markdown}
                                            className='flex-1'
                                            onChange={sanitizeMd}
                                        />
                                    </Suspense>
                                </ResizablePanel>

                                <ResizableHandle />


                                <ResizablePanel defaultSize={50} className='flex flex-col'>
                                    <MDXProvider>
                                        {mdxContent &&
                                            <article className='prose h-full'>
                                                {
                                                    createElement(mdxContent)
                                                }
                                            </article>
                                        }
                                    </MDXProvider>
                                </ResizablePanel>
                            </ResizablePanelGroup>
                            :

                            <MDXProvider>
                                {mdxContent &&
                                    <article className='prose h-full'>
                                        {
                                            createElement(mdxContent)
                                        }
                                    </article>
                                }
                            </MDXProvider>
                }
            </section>

        </main>
    )
}
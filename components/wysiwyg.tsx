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
import { createElement, Suspense, useEffect, useState } from 'react'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'

const defaultTab = "both"


export default function Home() {
    const [tab, setTab] = useState(defaultTab);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const [markdown, setMarkdown] = useState(`
    # Hello World
    
    This is **bold** text and this is *italic*.
  
    `);

    const [mdxContent, setMdxContent] = useState<(() => any) | null>(null);

    // Parse markdown whenever it changes
    useEffect(() => {
        const parseMDX = async () => {
            try {
                const { default: Content } = await evaluate(markdown, {
                    ...runtime,
                    useMDXComponents: () => useMDXComponents({}),
                    remarkPlugins: [remarkGfm],
                });
                setMdxContent(() => Content);
            } catch (error) {
                console.error('MDX parsing error:', error);
                setMdxContent(() => () => <div>Error parsing markdown</div>);
            }
        };

        parseMDX();
    }, [markdown]);

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

                <Button>Save</Button>
            </header>
            <section className='flex flex-1 flex-col'>
                {
                    tab === "editor" ?
                        <div className='flex-1 flex-col'>
                            <Suspense fallback={null}>
                                <Editor
                                    markdown={markdown}
                                    contentEditableClassName='prose'
                                    className='flex-1'
                                    onChange={setMarkdown}
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
                                            onChange={setMarkdown}
                                            contentEditableClassName='prose'
                                        />
                                    </Suspense>
                                </ResizablePanel>

                                <ResizableHandle />


                                <ResizablePanel defaultSize={50} className='flex flex-col'>
                                    <MDXProvider>
                                        {mdxContent &&
                                            <article className='prose'>
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
                                    <article className='prose'>
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
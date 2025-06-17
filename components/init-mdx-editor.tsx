'use client'

import {
    BlockTypeSelect,
    BoldItalicUnderlineToggles, CreateLink, diffSourcePlugin, DiffSourceToggleWrapper, headingsPlugin, imagePlugin, InsertImage, InsertTable, JsxComponentDescriptor, jsxPlugin, linkDialogPlugin, linkPlugin, listsPlugin,
    ListsToggle,
    markdownShortcutPlugin,
    MDXEditor, quotePlugin,
    Separator,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
    UndoRedo, type MDXEditorMethods,
    type MDXEditorProps
} from '@mdxeditor/editor'
import type { ForwardedRef } from 'react'

const jsxComponentDescriptors: JsxComponentDescriptor[] = [
    // {
    //     name: 'MyLeaf',
    //     kind: 'text', // 'text' for inline, 'flow' for block
    //     // the source field is used to construct the import statement at the top of the markdown document.
    //     // it won't be actually sourced.
    //     source: './external',
    //     // Used to construct the property popover of the generic editor
    //     props: [
    //         { name: 'foo', type: 'string' },
    //         { name: 'bar', type: 'string' },
    //         { name: 'onClick', type: 'expression' }
    //     ],
    //     // whether the component has children or not
    //     hasChildren: true,
    //     Editor: GenericJsxEditor
    // },
    //     {
    //         name: 'Marker',
    //         kind: 'text',
    //         source: './external',
    //         props: [{ name: 'type', type: 'string' }],
    //         hasChildren: false,
    //         Editor: () => {
    //             return (
    //                 <div style={{ border: '1px solid red', padding: 8, margin: 8, display: 'inline-block' }}>
    //                     <NestedLexicalEditor<MdastJsx>
    //                         getContent={(node) => node.children}
    //                         getUpdatedMdastNode={(mdastNode, children: any) => {
    //                             return { ...mdastNode, children }
    //                         }}
    //                     />
    //                 </div>
    //             )
    //         }
    //     },
    //     {
    //         name: 'BlockNode',
    //         kind: 'flow',
    //         source: './external',
    //         props: [],
    //         hasChildren: true,
    //         Editor: GenericJsxEditor
    //     }
]


// // a toolbar button that will insert a JSX element into the editor.
// const InsertMyLeaf = () => {
//     const insertJsx = usePublisher(insertJsx$)
//     return (
//         <Button
//             onClick={() =>
//                 insertJsx({
//                     name: 'MyLeaf',
//                     kind: 'text',
//                     props: { foo: 'bar', bar: 'baz', onClick: { type: 'expression', value: '() => console.log("Clicked")' } }
//                 })
//             }
//         >
//             Leaf
//         </Button>
//     )
// }


// Only import this to the next file
export default function InitializedMDXEditor({
    editorRef,
    ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
    return (
        <MDXEditor
            plugins={[
                // Example Plugin Usage
                headingsPlugin({
                    allowedHeadingLevels: [1, 2, 3]
                }),

                listsPlugin({
                    options: ["bullet", "number"]
                }),

                tablePlugin(),
                imagePlugin({
                    // ImageDialog: () => {

                    // },
                    imageUploadHandler: () => {
                        return Promise.resolve('https://picsum.photos/200/300')
                    },
                    imageAutocompleteSuggestions: ['https://picsum.photos/200/300', 'https://picsum.photos/200']
                }),

                linkPlugin(),
                linkDialogPlugin(),
                markdownShortcutPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                diffSourcePlugin(),
                jsxPlugin({ jsxComponentDescriptors }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <DiffSourceToggleWrapper>
                            <UndoRedo />
                            <Separator />
                            <BlockTypeSelect />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <Separator />
                            <CreateLink />
                            <Separator />
                            <ListsToggle options={["bullet", "number"]} />
                            <Separator />
                            <InsertTable />
                            <InsertImage />
                            {/* <InsertMyLeaf /> */}
                        </DiffSourceToggleWrapper>
                    )
                })

            ]}
            {...props}
            className='light'
            contentEditableClassName='editor-prose'
            ref={editorRef}
        />
    )
}

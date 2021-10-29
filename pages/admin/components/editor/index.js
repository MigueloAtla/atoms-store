// React / Next
import { useEffect } from 'react'

// TipTap
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Typography from '@tiptap/extension-typography'

// UI
import { Box, Button } from '@chakra-ui/react'
import ModalMediaLibrary from '@/admin/components/modals/modalMediaLibrary'
import ModalURL from '@/admin/components/modals/modalImageUrl'
import ModalShortcuts from '@/admin/components/modals/modalShortcuts'

// Styles
import { Styles, MenuStyled, EditorButton } from './styles'

// Store
import useStore from '@/admin/store/store'

const MenuBar = ({ editor }) => {
  const setSmallImageEditor = useStore(state => state.setSmallImageEditor)
  const smallImageEditor = useStore(state => state.smallImageEditor)

  if (!editor) {
    return null
  }

  const addImage = url => {
    if (url) {
      editor
        .chain()
        .focus()
        .setImage({ src: url })
        .run()
    }
  }

  return (
    <MenuStyled mb='15px'>
      <Box w='calc(100% - 30px)'>
        {/* <span>Formating text</span>
        <br /> */}

        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          {'<-'}
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          {'->'}
        </EditorButton>

        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          B
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          I
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          S-
        </EditorButton>
        {/* <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          C
        </EditorButton> */}
        {/* <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetAllMarks()
              .run()
          }
        >
          clear marks
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .clearNodes()
              .run()
          }
        >
          clear nodes
        </EditorButton> */}
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .setParagraph()
              .run()
          }
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          P
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 1 })
              .run()
          }
          className={
            editor.isActive('heading', { level: 1 }) ? 'is-active' : ''
          }
        >
          h1
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 2 })
              .run()
          }
          className={
            editor.isActive('heading', { level: 2 }) ? 'is-active' : ''
          }
        >
          h2
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 3 })
              .run()
          }
          className={
            editor.isActive('heading', { level: 3 }) ? 'is-active' : ''
          }
        >
          h3
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 4 })
              .run()
          }
          className={
            editor.isActive('heading', { level: 4 }) ? 'is-active' : ''
          }
        >
          h4
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 5 })
              .run()
          }
          className={
            editor.isActive('heading', { level: 5 }) ? 'is-active' : ''
          }
        >
          h5
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleHeading({ level: 6 })
              .run()
          }
          className={
            editor.isActive('heading', { level: 6 }) ? 'is-active' : ''
          }
        >
          h6
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBulletList()
              .run()
          }
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          ***
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleOrderedList()
              .run()
          }
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          123
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleCodeBlock()
              .run()
          }
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          C
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .toggleBlockquote()
              .run()
          }
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          BQ
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .setHorizontalRule()
              .run()
          }
        >
          HR
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .setHardBreak()
              .run()
          }
        >
          HB
        </EditorButton>
        <ModalMediaLibrary setImgURL={addImage} />
        <ModalURL setImgURL={addImage} />
      </Box>

      {/* <Box>
        <span>Images</span>
        <br />
        <ModalMediaLibrary setImgURL={addImage} />
        <ModalURL setImgURL={addImage} />
      </Box> */}

      <Box>
        {/* <span>Actions</span>
        <br />
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          {'<-'}
        </EditorButton>
        <EditorButton
          variant='outline'
          m='5px'
          onClick={() =>
            editor
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          {'->'}
        </EditorButton> */}
        <Button
          onClick={() => {
            setSmallImageEditor(!smallImageEditor)
          }}
        >
          small
        </Button>
        <ModalShortcuts />
      </Box>
    </MenuStyled>
  )
}

const TipTap = ({ value, editorContent, onSubmit }) => {
  const editor = useEditor({
    extensions: [StarterKit, Image, Typography],
    content: value
  })

  useEffect(() => {
    if (editor) {
      editorContent.current = editor.getHTML()
    }
  }, [onSubmit])

  return (
    <div style={{ position: 'relative' }}>
      <MenuBar editor={editor} />
      <Styles>
        <EditorContent editor={editor} />
      </Styles>
    </div>
  )
}

export default TipTap

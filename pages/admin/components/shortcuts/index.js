import React from 'react'

import { Flex, Kbd } from '@chakra-ui/react'

const Shortcuts = () => {
  return (
    <>
      <Flex direction='column'>
        <Shortcut action='Copy' keys={['ctrl', 'c']} />
        <Shortcut action='Cut' keys={['ctrl', 'x']} />
        <Shortcut action='Paste' keys={['ctrl', 'v']} />
        <Shortcut
          action='Paste without formatting'
          keys={['ctrl', 'shift', 'v']}
        />
        <Shortcut action='Undo' keys={['ctrl', 'z']} />
        <Shortcut action='Redo' keys={['ctrl', 'shift', 'z']} />
        <Shortcut action='Add a line break' keys={['shift', 'enter']} />

        <Shortcut action='Bold' keys={['ctrl', 'b']} />
        <Shortcut action='Italicize' keys={['ctrl', 'i']} />
        <Shortcut action='Underline' keys={['ctrl', 'u']} />
        <Shortcut action='Strikethrough' keys={['ctrl', 'shift', 'x']} />
        <Shortcut action='Highlight' keys={['ctrl', 'shift', 'h']} />
        <Shortcut action='Code' keys={['ctrl', 'e']} />

        <Shortcut
          action='Apply normal text style'
          keys={['ctrl', 'alt', '0']}
        />
        <Shortcut action='Apply heading style 1' keys={['ctrl', 'alt', '1']} />
        <Shortcut action='Apply heading style 2' keys={['ctrl', 'alt', '2']} />
        <Shortcut action='Apply heading style 3' keys={['ctrl', 'alt', '3']} />
        <Shortcut action='Apply heading style 4' keys={['ctrl', 'alt', '4']} />
        <Shortcut action='Apply heading style 5' keys={['ctrl', 'alt', '5']} />
        <Shortcut action='Apply heading style 6' keys={['ctrl', 'alt', '6']} />
        <Shortcut action='Ordered list' keys={['ctrl', 'shift', '7']} />
        <Shortcut action='Bullet list' keys={['ctrl', 'shift', '8']} />
        <Shortcut action='Task list' keys={['ctrl', 'shift', '9']} />
        <Shortcut action='Blockquote' keys={['ctrl', 'shift', 'b']} />
        <Shortcut action='Left Align' keys={['ctrl', 'shift', 'l']} />
        <Shortcut action='Center Align' keys={['ctrl', 'shift', 'e']} />
        <Shortcut action='Right Align' keys={['ctrl', 'shift', 'r']} />
        <Shortcut action='Justify Align' keys={['ctrl', 'shift', 'j']} />
        <Shortcut action='Code block' keys={['ctrl', 'alt', 'c']} />
        <Shortcut action='Subscript' keys={['ctrl', ',']} />
        <Shortcut action='Superscript' keys={['ctrl', '.']} />

        <Shortcut action='Select all' keys={['ctrl', 'a']} />
        <Shortcut
          action='Extend selection one character to left'
          keys={['ctrl', '<-']}
        />
        <Shortcut
          action='Extend selection one character to right'
          keys={['ctrl', '->']}
        />
        <Shortcut
          action='Extend selection one line up'
          keys={['ctrl', 'arrow up']}
        />
        <Shortcut
          action='Extend selection one line down'
          keys={['ctrl', 'arrow down']}
        />
        <Shortcut
          action='Extend selection to the beginning of the document'
          keys={['ctrl', 'shift', 'arrow up']}
        />
        <Shortcut
          action='Extend selection to the end of the document'
          keys={['ctrl', 'shift', 'arrow down']}
        />
      </Flex>
    </>
  )
}

export default Shortcuts

const Shortcut = ({ action, keys }) => {
  return (
    <Flex direction='row'>
      <span>{action}</span>
      {keys.map((key, i) => {
        return (
          <div key={i}>
            <Kbd>{key}</Kbd>
            {i < keys.length - 1 && <span>+</span>}
          </div>
        )
      })}
    </Flex>
  )
}

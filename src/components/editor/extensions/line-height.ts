import { Extension } from '@tiptap/core'

declare module '@tiptap/core' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface Commands<ReturnType> {
    lineHeight: {
      setLineHeight: (lineHeight: string) => ReturnType
      unsetLineHeight: () => ReturnType
    }
  }
}

export interface LineHeightOptions {
  types: string[]
  defaultLineHeight: string | null
}

export const LineHeight = Extension.create<LineHeightOptions>({
  name: 'lineHeight',

  addOptions() {
    return {
      types: ['paragraph', 'heading'],
      defaultLineHeight: null,
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          lineHeight: {
            default: null,
            parseHTML: (element) => element.style.lineHeight || null,
            renderHTML: (attributes) => {
              if (!attributes.lineHeight) {
                return {}
              }
              return {
                style: `line-height: ${attributes.lineHeight};`,
              }
            },
            keepOnSplit: true,
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setLineHeight:
        (lineHeight: string) =>
        ({ tr, dispatch }: { tr: any; dispatch?: any }) => {
          const { from, to } = tr.selection
          const types = this.options.types
          let applicable = false

          tr.doc.nodesBetween(from, to, (node: any, pos: any) => {
            if (types.includes(node.type.name)) {
              applicable = true
              if (dispatch) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  lineHeight,
                })
              }
            }
          })

          return applicable
        },
      unsetLineHeight:
        () =>
        ({ tr, dispatch }: { tr: any; dispatch?: any }) => {
          const { from, to } = tr.selection
          const types = this.options.types
          let applicable = false

          tr.doc.nodesBetween(from, to, (node: any, pos: any) => {
            if (types.includes(node.type.name)) {
              applicable = true
              if (dispatch) {
                const attrs = { ...node.attrs }
                delete attrs.lineHeight
                tr.setNodeMarkup(pos, undefined, attrs)
              }
            }
          })

          return applicable
        },
    }
  },
})

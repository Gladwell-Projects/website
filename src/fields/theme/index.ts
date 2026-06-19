import { Field, FieldHook, TextField, TextFieldSingleValidation } from 'payload'

export const colors = [
  { theme: 'default', code: '#FFFFFF', text: '#000000' },
  { theme: 'blue', code: 'hsla(241, 84%, 41%, 1)', text: '#FFFFFF' },
  { theme: 'midnight', code: 'hsla(133, 39%, 7%, 1)', text: 'hsla(234, 100%, 98%, 1)' },
  { theme: 'bone', code: 'hsla(27, 28%, 87%, 1)', text: 'hsla(133, 39%, 7%, 1)' },
  { theme: 'glow', code: 'hsla(234, 100%, 98%, 1)', text: 'hsla(241, 84%, 41%, 1)' },
  { theme: 'hi-vis', code: 'hsla(23, 100%, 50%, 1)', text: '#FFFFFF' },
  { theme: 'taxi', code: 'hsla(47, 100%, 50%, 1)', text: 'hsla(133, 39%, 7%, 1)' },
  { theme: 'brick', code: 'hsla(6, 79%, 33%, 1)', text: '#FFFFFF' },
  { theme: 'timber', code: 'hsla(36, 100%, 44%, 1)', text: '#FFFFFF' },
  { theme: 'cli', code: '#000000', text: 'hsla(135, 100%, 50%, 1)' },
  { theme: 'web3', code: 'hsla(257, 100%, 64%, 1)', text: '#FFFFFF' },
]
const themes = colors.map((c) => c.theme)

const defaultColor = colors.find((c) => c.theme === 'default') ?? colors[0]

/**
 * Resolve a theme name to its background color code. Falls back to the default
 * theme's code when the name is missing, unknown, or stale — never throws
 * (unlike `colors.find(...).code`, which blows up when no theme matches and
 * crashes prerender via generateViewport).
 */
export const themeCode = (theme?: string | null): string =>
  (colors.find((c) => c.theme === theme) ?? defaultColor).code

export const changeBg: FieldHook = ({ siblingData }) => {
  return themeCode(siblingData?.theme)
}

export const validateThemePicker: TextFieldSingleValidation = (
  value: string,
  { required }
) => {
  if (!required && !value) {
    return true
  }

  if (!themes.includes(value)) {
    return `${value} is not a valid theme`
  }

  return true
}

type ThemePickerArgs = (options?: { overrides?: Partial<TextField> }) => Field

export const themePicker: ThemePickerArgs = ({ overrides = {} } = {}) => {
  const textFieldResult: Field = {
    type: 'text',
    name: 'theme',
    // @ts-expect-error idk why this is happening
    validate: validateThemePicker,
    defaultValue: 'default',
    ...(overrides || {}),
    hasMany: false,
    admin: {
      ...(overrides?.admin || {}),
      position: 'sidebar',
      components: {
        Field: '@/fields/theme/ThemeComponent',
      },
    },
  }

  const themeBG: Field = {
    type: 'text',
    name: 'themeBG',
    admin: {
      hidden: true,
    },
    hooks: {
      beforeValidate: [changeBg],
    },
  }

  return { type: 'group', fields: [textFieldResult, themeBG] }
}

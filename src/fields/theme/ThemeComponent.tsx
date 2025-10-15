'use client'
import { useField } from '@payloadcms/ui'
import { colors } from '.'
import { FieldLabel } from '@payloadcms/ui'
import { fieldBaseClass } from '@payloadcms/ui'
import { TextFieldClientProps } from 'payload'

const ThemePicker = (props: TextFieldClientProps) => {
  const { path, field } = props

  const { value, setValue } = useField<string>({ path: path || field.name })

  return (
    <div className={`${fieldBaseClass} color-field`}>
      <FieldLabel label="Theme" />
      <ul className={`${fieldBaseClass}__colors w-full text-center`}>
        {colors.map((color, i) => (
          <li key={i} className={`${color.theme === value && 'has-selected'}`}>
            <button
              type="button"
              key={color.theme}
              className={`chip ${color.theme === value ? 'selected' : ''}`}
              style={{ backgroundColor: color.code, color: color.text }}
              aria-label={color.theme}
              onClick={() => setValue(color.theme)}
            >
              G
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ThemePicker

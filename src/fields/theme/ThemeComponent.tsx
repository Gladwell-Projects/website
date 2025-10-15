'use client'
import { useField } from '@payloadcms/ui'
import { colors } from '.'
import { FieldLabel } from '@payloadcms/ui'
import { fieldBaseClass } from '@payloadcms/ui'

const ThemePicker: React.FC<props> = (props) => {
  const { path, label, required, field } = props

  const { value, setValue } = useField<string>({ path: path || field.name })

  return (
    <div className={`${fieldBaseClass} color-field`}>
      <FieldLabel htmlFor={path} label={label} required={required} />
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

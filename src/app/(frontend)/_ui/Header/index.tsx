import Navigation from '../Navigation'
import { draftMode } from 'next/headers'
import { unstable_cache } from 'next/cache'
import { fetchGlobals } from '../../_data'

const Header = async (props: { navTemplate: 'condensed' | 'spread' | string | null }) => {
  const { isEnabled: draft } = await draftMode()
  const getGlobals = draft
    ? fetchGlobals
    : unstable_cache(fetchGlobals, ['branding', 'mainMenu'])

  const { mainMenu: nav } = await getGlobals()
  const { navTemplate } = props

  return <Navigation data={nav} navTemplate={navTemplate} />
}
export default Header

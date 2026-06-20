import Navigation from '../Navigation'
import { getMainMenu } from '../../_data'

const Header = async (props: { navTemplate: 'condensed' | 'spread' | string | null }) => {
  const nav = await getMainMenu()
  const { navTemplate } = props

  return <Navigation data={nav} navTemplate={navTemplate} />
}
export default Header

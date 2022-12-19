import classnames from 'classnames'
import { Link } from 'react-router-dom'

interface NavItemProps {
  children: React.ReactNode
  href: string
  isSelected: boolean
}

export const NavItem = ({ children, href, isSelected }: NavItemProps) => (
  <li>
    <Link
      className={classnames('inline-block font-semibold px-4 py-2 text-slate-600', {
        'bg-slate-200 rounded-full': isSelected,
      })}
      to={href}
    >
      {children}
    </Link>
  </li>
)

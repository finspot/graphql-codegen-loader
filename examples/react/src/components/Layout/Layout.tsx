import classnames from 'classnames'
import { Link } from 'react-router-dom'

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

export const Layout = ({ className, children, ...props }: LayoutProps) => (
  <div className={classnames('bg-white pb-20 min-h-full overflow-hidden rounded-t-lg', className)} {...props}>
    <nav className="p-4 mb-20 md:p-8">
      <Link to="/">
        <div className="bg-indigo-700 h-8 rounded-lg w-8" />
      </Link>
    </nav>

    {children}
  </div>
)

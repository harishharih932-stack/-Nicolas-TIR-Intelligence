
import { Route as RootRoute } from './routes/__root'
import { Route as IndexRoute } from './routes/index'
import { Route as SettingsRoute } from './routes/settings'
import { Route as SourceRoute } from './routes/source'

const IndexChild = IndexRoute.update({
  path: '/',
  getParentRoute: () => RootRoute,
} as any)

const SettingsChild = SettingsRoute.update({
  path: '/settings',
  getParentRoute: () => RootRoute,
} as any)

const SourceChild = SourceRoute.update({
  path: '/source',
  getParentRoute: () => RootRoute,
} as any)

export const routeTree = RootRoute.addChildren([
  IndexChild,
  SettingsChild,
  SourceChild,
])

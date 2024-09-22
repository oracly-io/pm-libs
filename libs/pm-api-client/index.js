export * from './ApiClient'

import { PriceFeedApi as _PriceFeedApi } from './PriceFeedApi'
import { ChatApi as _ChatApi } from './ChatApi'
import { UserApi as _UserApi } from './UserApi'

export const PriceFeedApi = new _PriceFeedApi()
export const UserApi = new _UserApi()
export const ChatApi = new _ChatApi()
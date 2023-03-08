import { useQuery } from 'react-query'
import healthApi from '../api/healthApi'

const ServerStatusCheck = () => {
  const serverStatusQuery = useQuery('serverStatus', healthApi.health)

  if (serverStatusQuery.isLoading) {
    return (
      <span>服务器状态：👀检查中</span>
    )
  }

  return (
    <span>服务器状态：{serverStatusQuery.isSuccess ? '⚡在线' : '🚫离线'}</span>
  )
}

export default ServerStatusCheck

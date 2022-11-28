import { useEffect, useState } from "react";
import healthApi from "../api/healthApi";

const ServerStatusCheck = () => {
  const [serverStatus, setServerStatus] = useState('👀检查中')

  useEffect(() => {
    healthApi.health()
      .then(response => {
        console.log('health response', response)
        setServerStatus('⚡在线')
      })
      .catch(e => {
        console.error('health error', e)
        setServerStatus('🚫离线')
      })
  }, [])

  return (
    <p>服务器状态：{serverStatus}</p>
  )
}

export default ServerStatusCheck

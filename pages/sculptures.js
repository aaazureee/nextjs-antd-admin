import { useState, useEffect } from 'react'
import { SculptureGrid } from '../components/sculpture-components/index'
import Layout from '../components/Layout'

export default () => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (document.readyState === 'complete') setLoading(false)
    else {
      window.onload = () => {
        console.log('hello world')
        setLoading(false)
      }
    }
  }, [])

  return <Layout>{loading ? 'Loading...' : <SculptureGrid />}</Layout>
}

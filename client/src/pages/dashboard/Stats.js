import { useEffect } from "react"
import { StatsContainer, Loading, ChartsContainer } from "../../components"
import { useAppContext } from "../../context/appContext"

const Stats = () => {
  const { isLoading, monthlyApplications, showStats } = useAppContext()
  useEffect(() => {
    showStats()
    // eslint-disable-next-line
  }, [])

  if (isLoading) return <Loading center />
  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  )
}
export default Stats
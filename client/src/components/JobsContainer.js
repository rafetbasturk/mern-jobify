import { useAppContext } from '../context/appContext';
import { useEffect } from 'react';
import Wrapper from '../assets/wrappers/JobsContainer';
import Loading from './Loading';
import PageBtnContainer from './PageBtnContainer';
import Job from './Job';
import Alert from "./Alert"

const JobsContainer = () => {
  const { isLoading, getJobs, jobs, totalJobs, page, numOfPages, search, searchStatus, searchType, sort, showAlert } = useAppContext()

  useEffect(() => {
    const delayForTyping = setTimeout(() => {
      getJobs()
    }, 500)
    return () => clearTimeout(delayForTyping)
    // eslint-disable-next-line
  }, [search, searchStatus, searchType, sort, page])

  if (isLoading) return <Loading center />

  if (!totalJobs) return <Wrapper><h2>No jobs to display...</h2></Wrapper>

  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {totalJobs} job{totalJobs > 1 && "s"} found
      </h5>
      <div className='jobs'>
        {jobs.map(job => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  )
}
export default JobsContainer
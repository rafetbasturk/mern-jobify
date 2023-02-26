import axios from 'axios';
import { useReducer, useContext, createContext, useEffect } from 'react';
import reducer from './reducer';
import {
  DISPLAY_ALERT,
  CLEAR_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUES,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  DELETE_JOB_ERROR,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
  GET_CURRENT_USER_BEGIN,
  GET_CURRENT_USER_SUCCESS,
  GET_CURRENT_USER_ERROR
} from "./actions";


const initialState = {
  userLoading: true,
  isLoading: false,
  showAlert: false,
  alertText: "",
  alertType: "",
  user: null,
  userLocation: "",
  showSidebar: false,
  isEditing: false,
  editJobId: '',
  position: '',
  company: '',
  jobLocation: "",
  jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
  jobType: 'full-time',
  statusOptions: ['pending', 'interview', 'declined'],
  status: 'pending',
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: '',
  searchStatus: 'all',
  searchType: 'all',
  sort: 'latest',
  sortOptions: ['latest', 'oldest', 'a-z', 'z-a'],
};

const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  //axios config
  const authFetch = axios.create({
    baseURL: '/api/v1'
  });

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT, });
    clearAlert();
  };

  const clearAlert = () => {
    setTimeout(() => {
      dispatch({ type: CLEAR_ALERT });
    }, 3000);
  };

  const setupUser = async (currentUser, endPoint) => {
    dispatch({ type: SETUP_USER_BEGIN });
    try {
      const response = await authFetch.post(`/auth/${endPoint}`, currentUser)
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: { ...response.data, endPoint },
      });
    } catch (error) {
      if (error.response.status === 429) {
        dispatch({
          type: SETUP_USER_ERROR,
          payload: { msg: 'Too many requests from this IP, please try again after 15 minutes' },
        });
      }
      else {
        dispatch({
          type: SETUP_USER_ERROR,
          payload: { msg: error.response.data.msg }
        })
      }
    }
    clearAlert();
  };

  const toggleSidebar = () => {
    dispatch({ type: TOGGLE_SIDEBAR })
  }

  const logoutUser = async () => {
    await authFetch.get('/auth/logout');
    dispatch({ type: LOGOUT_USER });
  };

  const updateUser = async (currentUser) => {
    dispatch({ type: UPDATE_USER_BEGIN })
    try {
      const { data } = await authFetch.patch('/auth/updateUser', currentUser);
      dispatch({ type: UPDATE_USER_SUCCESS, payload: { ...data } })
    } catch (error) {
      if (error.response.status === 400) {
        dispatch({ type: UPDATE_USER_ERROR, payload: { msg: error.response.data.msg } })
      }
      if (error.response.status === 401) {
        dispatch({ type: UPDATE_USER_ERROR, payload: { msg: error.response.data.msg } })
      }
    }
    clearAlert();
  };

  const handleChange = ({ name, value }) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: { name, value },
    })
  }

  const clearValues = () => {
    dispatch({ type: CLEAR_VALUES })
  }

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN })
    const { position, company, status, jobType, jobLocation } = state
    try {
      await authFetch.post("/jobs", { position, company, status, jobType, jobLocation })
      dispatch({ type: CREATE_JOB_SUCCESS })
      clearValues()
    } catch (error) {
      if (error.response.status === 401) return
      dispatch({ type: CREATE_JOB_ERROR, payload: { msg: error.response.data.msg } })
    }
    clearAlert()
  }

  const getJobs = async () => {
    const { page, searchStatus, searchType, sort, search } = state
    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`
    if (search) url = `${url}&search=${search}`
    dispatch({ type: GET_JOBS_BEGIN })
    try {
      const { data } = await authFetch(url)
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: { ...data }
      })
    } catch (error) {
      logoutUser()
    }
    clearAlert()
  }

  const setEditJob = (job) => {
    dispatch({ type: SET_EDIT_JOB, payload: job })
  }

  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN })
    try {
      const {
        position,
        company,
        jobLocation,
        jobType,
        status
      } = state

      await authFetch.patch(`/jobs/${state.editJobId}`, {
        company,
        position,
        jobLocation,
        jobType,
        status
      })
      dispatch({ type: EDIT_JOB_SUCCESS })
      clearValues()
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: EDIT_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert()
  }

  const deleteJob = async (id) => {
    dispatch({ type: DELETE_JOB_BEGIN })
    try {
      await authFetch.delete(`/jobs/${id}`)
      getJobs()
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: DELETE_JOB_ERROR,
        payload: { msg: error.response.data.msg },
      });
    }
    clearAlert()
  }

  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN })
    try {
      const { data } = await authFetch("/jobs/stats")
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: data.defaultStats,
          monthlyApplications: data.monthlyApplications
        }
      })
    } catch (error) {
      logoutUser()
    }
  }

  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS })
  }

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } })
  }

  const getCurrentUser = async () => {
    dispatch({ type: GET_CURRENT_USER_BEGIN });
    try {
      const { data } = await authFetch('/auth/getCurrentUser');
      dispatch({
        type: GET_CURRENT_USER_SUCCESS,
        payload: { ...data },
      });
    } catch (error) {
      dispatch({ type: GET_CURRENT_USER_ERROR })
    }
  }

  useEffect(() => {
    getCurrentUser()
    // eslint-disable-next-line
  }, [])

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        setupUser,
        toggleSidebar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        editJob,
        deleteJob,
        showStats,
        clearFilters,
        changePage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
// make sure use
const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, useAppContext, initialState };
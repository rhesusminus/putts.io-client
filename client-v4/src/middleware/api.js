import { CALL_API } from '../actions/action-types'
import { validateAction } from './validate'

const API_ROOT = process.env.REACT_APP_API_URI

const createHeaders = method => {
  if (method === 'POST') {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  } else {
    return null
  }
}

const callApi = method => (endpoint, payload) => {
  const fullUrl = endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint
  const addOptions = () => {
    if (method === 'POST') {
      return { method, headers: createHeaders(method), body: JSON.stringify(payload) }
    }
    return { method }
  }

  return fetch(fullUrl, addOptions())
    .then(response => {
      if (!response.ok) {
        return Promise.reject()
      }

      return response.json()
    })
    .then(json => Object.assign([], json))
}

export default state => next => action => {
  const callAPI = action[CALL_API]

  if (typeof callAPI === 'undefined') {
    return next(action)
  }
  console.log('callAPI:', callAPI)

  const { endpoint, types, payload, method = 'GET' } = callAPI

  validateAction(callAPI)

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data)
    delete finalAction[CALL_API]
    return finalAction
  }

  console.log('actionWith:', actionWith)

  const [requestType, successType, failureType] = types
  next(actionWith({ type: requestType }))

  return callApi(method.toUpperCase())(endpoint, payload).then(
    response =>
      next(
        actionWith({
          type: successType,
          payload: response
        })
      ),
    error =>
      next(
        actionWith({
          type: failureType,
          error: true,
          payload: error.message || 'Something bad happened'
        })
      )
  )
}

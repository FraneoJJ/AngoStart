import React from 'react'

import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
  const error = useRouteError()
  console.error(error)

  return (
    <div>
        <h1>Ops! Algo deu errado.</h1>
        <p>{error.error.message}</p>
    </div>
  )
}

export default ErrorPage
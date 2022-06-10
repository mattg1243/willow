import React from 'react';
import { Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function ProtectedRoute(props) {

  const user = useSelector(state => state.user);
  const { component: Component, ...rest } = props;
  const navigate = useNavigate();

  if (user) {
    return (
      (<Component {...props} />)
    )
  } else {
    return (
      <Navigate to='/' />
    )
  }

}
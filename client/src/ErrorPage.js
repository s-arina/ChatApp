import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage() {
  return (
    <div className='error'>
      <h3>Page not found!</h3>
      <Link to='/'>Go back</Link>
    </div>
  );
}

export default ErrorPage;

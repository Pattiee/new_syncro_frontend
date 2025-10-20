import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom';

export const CEO_Layout = () => {
  return (
        <Fragment>
          <main className="">
            <Outlet />
          </main>
        </Fragment>
      );
}

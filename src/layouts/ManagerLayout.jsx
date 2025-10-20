import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom';

export const ManagerLayout = () => {
  return (
          <Fragment>
            <main className="">
              <Outlet />
            </main>
          </Fragment>
        );
}

import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom';

export const PublicLayout = () => {
  return (
          <Fragment>
            <main className="pt-20 p-6">
              <Outlet />
            </main>
          </Fragment>
        );
}

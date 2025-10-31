import React, { Fragment } from 'react'
import { Outlet } from 'react-router-dom';

export const ShopLayout = () => {
  return (
      <Fragment>
        <main>
          <Outlet />
        </main>
      </Fragment>
    );
}

import React, { useEffect, useState } from 'react'
import { useAuth } from '../../../hooks/useAuth'
import { getRoles } from '../../../services/role.service';
import { CustomLoader2 } from '../../../components/loaders/CustomLoader2';

export const RolesTab = () => {
  const { user, loading } = useAuth();
  const [ roles, setRoles ] = useState([]);
  const [ loadingRoles, setLoadingRoles ] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      if (!loadingRoles) setLoadingRoles(true);
      await getRoles({}).then(res => {
        setRoles(res?.data);
        console.log(res?.data);
      }).catch(err => {
        console.error(err);
      }).finally(() => setLoadingRoles(false));
    }

    loadRoles();
  }, [user]);

  if (loadingRoles) return <CustomLoader2/>

  return (
    <div>
      <ul>
        {roles && roles.map((role, idx) => (
          <div 
            key={idx}
            className='flex flex-col bg-gray-50 dark:bg-gray-500 mx-auto my-3 px-4 py-2 rounded-xl'
          >
            <span className='text-gray-800 dark:text-gray-50'>{role.name}</span>
            <div className='flex gap-3'>
              <span>{role.createdAt}</span>
              <span>{role.default ? "Default" :  null}</span>
            </div>
          </div>
        ))}
      </ul>
    </div>
  )
}

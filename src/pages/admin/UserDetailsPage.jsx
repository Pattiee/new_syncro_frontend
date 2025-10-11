import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUsers } from '../../services/user.service'
import { patchUserRoles } from '../../services/auth.service'
import { getAllRoles } from '../../services/role.service';
import { useQuery } from '../../hooks/useQuery'

const UserDetailsPage = () => {
  const query = useQuery();
  const id = query.get('id');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true) // loading state
  const [updateRoleHidden, setUpdateRoleHidden] = useState(true);
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const roleOptions = roles.map(({ id, name }) => (
    <option disabled={userRoles.includes(name)} key={id} value={id}>{name}</option>
  ));

  useEffect(() => {
    const fetchRoles = async () => {
      if (!user || !user?.enabled) return;
      await getAllRoles({ }).then(res => {
        setRoles(res?.data || []);
      }).catch(err => {
        toast.error(err?.message);
      });
    }
    fetchRoles();
   }, [user]);


  const fetchUser = async (userId) => {
    await getUsers({ userId: userId }).then(res => {
      setUser(res.data?.details);
      setUserRoles(res.data?.roles);
    }).catch(err => {
      toast.error(err?.message || 'Failed to fetch user details')
    }).finally(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    if (!id) {
      const timeout = setTimeout(() => {
        navigate('/admin/users');
      }, 500);
      return () => clearTimeout(timeout); // cleanup if component unmounts
    } else {
      fetchUser(id);
    }
  }, [id, navigate]);

  const handleShowUpdateRole = async () => {
    setUpdateRoleHidden(!updateRoleHidden);
  }

  const handleCancelUpdateRole = async () => {
    setSelectedRoleId('');
    setUpdateRoleHidden(true);
    toast.success("Cancelled.");
  }

  const handleAcknowledgeAction = async () => {
    if (!selectedRoleId) return;
    await patchUserRoles({ userId: user.id, roleId: selectedRoleId }).then(res => {
      window.location.reload();
      console.log("RESPONSE: " + res);
    }).catch(err => {
      console.error("ERROR: " + err)
    }).finally(() => {
      setUpdateRoleHidden(true);
      window.location.reload();
    });
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full h-screen px-4 bg-white dark:bg-gray-900'>
        <div className="flex flex-col items-center">
          <div className='relative'>

            {/* Glow Pulse */}
            <div className='absolute inset-0 bg-orange-500 rounded-full opacity-50 dark:bg-gray-500 blur-lg animate-ping' />
            
            {/* Spinning ring */}
            <div className='w-16 h-16 border-4 border-orange-500 rounded-full border-t-transparent animate-spin'/>
          </div>
          <p className='mt-4 text-lg font-medium text-gray-700 dark:text-gray-300'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 sm:px-8">
      <div className="max-w-3xl p-6 mx-auto space-y-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
        <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
          User Details
        </h2>

        {userRoles && (
          <div className="mt-1">
            {userRoles.map((authority, idx) => (
              <span className="inline-block mx-2 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100 px-2 py-0.5 text-xs">
                {authority}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2 dark:text-gray-300">
          {user?.firstName && <div><strong>First Name:</strong> {user?.firstName}</div>}
          {user?.lastName && <div><strong>Last Name:</strong> {user?.lastName}</div>}
          {user?.username && <div><strong>Email:</strong> {user?.username}</div>}
          {user?.phoneNumber && <div><strong>Phone:</strong> {user?.phoneNumber}</div>}
          {user?.region && <div><strong>Region:</strong> {user?.region}</div>}
          <div>
            <strong>Status:</strong>{' '}
            <span className={`font-medium ${
              user?.enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {user?.enabled ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>

        <div>
          <div className={`${updateRoleHidden ? 'hidden' : ''}`}>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value || null)}
              className="w-full p-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value={""} disabled>Select a role</option>
              { roleOptions }
            </select>

            {/* Action buttons */}
            <div className='flex items-center justify-between p-2 my-2 rounded-full dark:bg-gray-900'>
              <button onClick={handleCancelUpdateRole} className='px-4 py-2 font-light text-red-500 bg-transparent rounded-full'>Cancel action</button>
              
              <button disabled={!selectedRoleId} onClick={handleAcknowledgeAction} className='px-4 py-2 font-light bg-orange-500 rounded-full disabled:dark:bg-orange-300'>Acknowledge action</button>
            </div>
          </div>

          {/* Show update roles button */}
          {user && user?.enabled && (
            <button
              onClick={handleShowUpdateRole}
              className={`${updateRoleHidden ? '' : 'hidden'} mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded shadow-md transition`}
            >
              Update Roles
            </button>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-orange-600 underline dark:text-orange-400"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default UserDetailsPage;

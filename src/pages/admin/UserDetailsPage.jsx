import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUsers, patchUserRoles } from '../../services/user.service'
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
  const [selectedRole, setSelectedRole] = useState('');

  const roleOptions = roles.map((role) => (
    <option disabled={userRoles.includes(role?.name)} key={role?.roleId} value={role?.name}>{ role?.name }</option>
  ))


  const fetchRoles = async () => {
    await getAllRoles({}).then(res => {
      setRoles(res?.data);
    }).catch(err => {
      toast.error(err?.message);
    })
  }


  const fetchUser = async (userId) => {
    await getUsers({ userId: userId }).then(res => {
      setUser(res.data?.details);
      setUserRoles(res.data?.roles)
    }).catch(err => toast.error(err?.message || 'Failed to fetch user details'));
  }

  useEffect(() => {
    if (!id) {
      const timeout = setTimeout(() => {
        navigate('/admin/users');
      }, 500);
      return () => clearTimeout(timeout); // cleanup if component unmounts
    } else {
      fetchRoles();
      fetchUser(id).finally(() => {
        setLoading(false);
      });
    }
  }, [id, navigate]);

  const handleShowUpdateRole = async () => {
    if (!roles) await fetchRoles();
    setUpdateRoleHidden(!updateRoleHidden);
  }

  const handleCancelUpdateRole = async () => {
    setSelectedRole('');
    setUpdateRoleHidden(true);
    toast.success("You cancelled the action");
  }

  const handleAcknowledgeAction = async () => {
    // if (!selectedRole) return toast.error(`Please choose a role to add for ${user?.firstName}`);
    await patchUserRoles({ userId: user?.userId, roleName: selectedRole }).then(res => {
      console.log("RESPONSE: " + res);
      toast.success(res?.data);
      navigate("/");
    }).catch(err => {
      console.error("ERROR: " + err)
      toast.error(err?.message);
    }).finally(() => {
      setUpdateRoleHidden(true);
    });
  }

  const handleUpdateRole = () => {
    axios.patch(`/api/v1/users/${id}/role`, { role: selectedRole })
      .then(() => {
        toast.success('Role updated successfully');
        setUser((prev) => ({ ...prev, role: selectedRole }));
      })
      .catch(() => toast.error('Failed to update role'));
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center w-full h-screen bg-white dark:bg-gray-900 px-4'>
        <div className="flex flex-col items-center">
          <div className='relative'>

            {/* Glow Pulse */}
            <div className='absolute inset-0 rounded-full bg-orange-500 dark:bg-gray-500 opacity-50 blur-lg animate-ping' />
            
            {/* Spinning ring */}
            <div className='w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin'/>
          </div>
          <p className='mt-4 text-gray-700 dark:text-gray-300 text-lg font-medium'>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
          User Details
        </h2>

        {userRoles && (
          <div>
            {userRoles.map((r, idx) => (
              <p className='text-orange-500 w-fit px-2' key={idx}>{r}</p>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
          <div><strong>First Name:</strong> {user?.firstName}</div>
          <div><strong>Last Name:</strong> {user?.lastName}</div>
          <div><strong>Email:</strong> {user?.email}</div>
          <div><strong>Phone:</strong> {user?.phoneNumber}</div>
          <div><strong>Region:</strong> {user?.region}</div>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value || null)}
              className="w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="" disabled>Select a role</option>
              { roleOptions }
            </select>

            {/* Action buttons */}
            <div className='flex justify-between rounded-full dark:bg-gray-900 p-2 my-2 items-center'>
              <button onClick={handleCancelUpdateRole} className='px-4 py-2 bg-transparent text-red-500 font-light rounded-full'>Cancel action</button>
              
              <button onClick={handleAcknowledgeAction} className='px-4 py-2 bg-orange-500 font-light rounded-full'>Acknowledge action</button>
            </div>
          </div>

          {/* Show update roles button */}
          <button
            onClick={handleShowUpdateRole}
            className={`${updateRoleHidden ? '' : 'hidden'} mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded shadow-md transition`}
          >
            Update Roles
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-orange-600 dark:text-orange-400 underline"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default UserDetailsPage;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRoles, updateAccountRoles } from '../../services/role.service';
import { useQuery } from '../../hooks/useQuery';
import { getAccounts } from '../../services/account.service';
import { CustomLoader2 } from '../../components/loaders/CustomLoader2';

// Structural interfaces for backend payloads
export interface RoleItem {
  id: string | number;
  name: string;
}

export interface AccountRecord {
  id: string | number;
  givenName?: string;
  familyName?: string;
  username: string;
  phone?: string;
  region?: string;
  usernameVerified: boolean;
  authorities: string[];
}

export const UserDetailsPage: React.FC = () => {
  const query = useQuery() as { get: (key: string) => string | null };
  const id = query.get('id');
  const navigate = useNavigate();
  
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [updateRoleHidden, setUpdateRoleHidden] = useState<boolean>(true);
  const [account, setAccount] = useState<AccountRecord | null>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');

  const roleOptions = roles.map(({ id, name }) => (
    <option disabled={userRoles.includes(name)} key={id} value={id}>
      {name}
    </option>
  ));

  useEffect(() => {
    let active = true;

    const loadData = async () => {
      if (!id) {
        const timeout = setTimeout(() => {
          if (active) navigate('/ceo/dashboard');
        }, 500);
        return;
      }

      try {
        setLoadingData(true);
  
        // Resolving promises sequentially inside the array wrapper to satisfy TypeScript settlement scopes
        const requests = [
          getRoles({}),
          getAccounts({ id: id }),
        ];
  
        const result = await Promise.allSettled(requests);
  
        const rolesResponse = result[0];
        const accountsResponse = result[1];
  
        if (rolesResponse.status === 'fulfilled' && active) {
          const resData = rolesResponse.value?.data;
          setRoles(resData?.content || []);
        } else if (rolesResponse.status === 'rejected') {
          console.error(rolesResponse.reason);
        }
  
        if (accountsResponse.status === 'fulfilled' && active) {
          const resData = accountsResponse.value?.data as AccountRecord | undefined;
          if (resData) {
            setAccount(resData);
            setUserRoles(resData.authorities || []);
          }
        } else if (accountsResponse.status === 'rejected') {
          console.error(accountsResponse.reason);
        }        
      } catch (err) {
        console.error("Data loading sequence failed:", err);
      } finally {
        if (active) setLoadingData(false);
      }
    };

    loadData();

    return () => {
      active = false;
    };
  }, [id, navigate]);

  const handleShowUpdateRole = async (): Promise<void> => {
    setUpdateRoleHidden(!updateRoleHidden);
  };

  const handleCancelUpdateRole = async (): Promise<void> => {
    setSelectedRoleId('');
    setUpdateRoleHidden(true);
    toast.success("Cancelled.");
  };

  const handleAcknowledgeAction = async (): Promise<void> => {
    if (!account) return;
    if (!selectedRoleId) {
      toast.error("Please select a role if needed");
      return;
    }

    try {
      const res = await updateAccountRoles({ accountId: account.id, roleId: selectedRoleId });
      if (res?.data) {
        setAccount(res.data as AccountRecord);
        toast.success("Roles updated successfully");
      }
    } catch (err) {
      console.error("Action acknowledgment failed:", err);
    } finally {
      setUpdateRoleHidden(true);
    }
  };

  if (loadingData) {
    return <CustomLoader2 />;
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 sm:px-8">
      <div className="max-w-3xl p-6 mx-auto space-y-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
        <h2 className="flex text-2xl rounded-lg px-4 py-2 tracking-wide items-center font-semibold text-orange-600 dark:text-orange-400">
          User Details
        </h2>

        {userRoles.length > 0 && (
          <div className="mt-1">
            {userRoles.map((role, idx) => (
              <span key={idx} className="inline-block mx-2 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100 px-2 py-0.5 text-xs">
                {role}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2 dark:text-gray-300 text-sm">
          {account?.givenName && <div><strong>Given Name:</strong> {account.givenName}</div>}
          {account?.familyName && <div><strong>Family Name:</strong> {account.familyName}</div>}
          {account?.username && <div><strong>Email:</strong> {account.username}</div>}
          {account?.phone && <div><strong>Phone:</strong> {account.phone}</div>}
          {account?.region && <div><strong>Region:</strong> {account.region}</div>}
          <div>
            <strong>Status:</strong>{' '}
            <span className={`font-medium ${
              account?.usernameVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {account?.usernameVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
        </div>

        <div>
          <div className={updateRoleHidden ? 'hidden' : ''}>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value || '')}
              className="w-full p-2 mt-1 text-gray-900 bg-white border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-700 dark:text-gray-100 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            >
              <option value="" disabled>Select a role</option>
              {roleOptions}
            </select>

            {/* Action buttons */}
            <div className='flex items-center justify-between p-2 my-2 rounded-full dark:bg-gray-900 mt-4'>
              <button type="button" onClick={handleCancelUpdateRole} className='px-4 py-2 font-medium text-sm text-red-500 bg-transparent rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors'>Cancel action</button>
              
              <button disabled={!selectedRoleId} type="button" onClick={handleAcknowledgeAction} className='px-4 py-2 font-medium text-sm text-white bg-orange-500 rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm'>Acknowledge action</button>
            </div>
          </div>

          {/* Show update roles button */}
          {account && account.usernameVerified && (
            <button
              type="button"
              onClick={handleShowUpdateRole}
              className={`${updateRoleHidden ? '' : 'hidden'} mt-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold text-sm py-2 px-4 rounded-lg shadow-md transition`}
            >
              Update Roles
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm text-orange-600 underline dark:text-orange-400 font-medium mt-4 block"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
};

export default UserDetailsPage;
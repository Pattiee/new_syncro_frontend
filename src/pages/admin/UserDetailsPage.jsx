import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRoles, updateAccountRoles } from '../../services/role.service';
import { useQuery } from '../../hooks/useQuery';
import { getAccounts } from '../../services/account.service';
import { useAuth } from '../../hooks/useAuth';
import { CustomLoader2 } from '../../components/loaders/CustomLoader2';

const UserDetailsPage = () => {
  const query = useQuery();
  const id = query.get('id');
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [loadingData, setLoadingData] = useState(true);
  const [updateRoleHidden, setUpdateRoleHidden] = useState(true);
  const [account, setAccount] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const roleOptions = roles.map(({ id, name }) => (
    <option disabled={userRoles.includes(name)} key={id} value={id}>{name}</option>
  ));

  useEffect(() => {
    const loadData = async () => {
      if (!id) { // only if has ceo in logged-in roles
        const timeout = setTimeout(() => {
          navigate('/ceo/dashboard');
        }, 500);
        return () => clearTimeout(timeout);
      }

      try {
        if(!loadingData) setLoadingData(false);
  
        const requests = [
          await getRoles({}),
          await getAccounts({ id: id }),
        ];
  
        const result = await Promise.allSettled(requests);
  
        const rolesResponse = result[0];
        const accountsResponse = result[1];
  
        if (rolesResponse.status === 'fulfilled') {
          setRoles(rolesResponse.value.data);
        } else {
          console.log(rolesResponse.reason);
        }
  
        if (accountsResponse.status === 'fulfilled') {
          const accountResValue = accountsResponse.value;
          setAccount(accountResValue.data);
          
          const accountRoles = [];
          accountResValue.data?.roles.map(r => accountRoles.push(r.authority));
          
          setUserRoles(accountRoles);
        } else {
          console.log(accountsResponse.reason);
        }        
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }

    }

    loadData();
   }, [id]);

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
    await updateAccountRoles({ accountId: account.id, roleId: selectedRoleId }).then(res => {
      setAccount(res?.data);
      console.log("RESPONSE: " + res?.data);
    }).catch(err => {
      console.error("ERROR: " + err)
    }).finally(() => {
      setUpdateRoleHidden(true);
    });
  }

  if (loadingData) return <CustomLoader2/>

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-50 dark:bg-gray-900 sm:px-8">
      <div className="max-w-3xl p-6 mx-auto space-y-6 bg-white shadow-lg dark:bg-gray-800 rounded-2xl">
        <h2 className="flex text-2xl rounded-lg px-4 py-2 tracking-wide items-center font-semibold text-orange-600 dark:text-orange-400">
          User Details
        </h2>

        {userRoles && (
          <div className="mt-1">
            {userRoles?.map((role, idx) => (
              <span key={idx} className="inline-block mx-2 rounded-full bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-orange-100 px-2 py-0.5 text-xs">
                {role}
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 text-gray-700 sm:grid-cols-2 dark:text-gray-300">
          {account?.givenName && <div><strong>Given Name:</strong> {account?.givenName}</div>}
          {account?.familyName && <div><strong>Family Name:</strong> {account?.familyName}</div>}
          {account?.username && <div><strong>Email:</strong> {account?.username}</div>}
          {account?.phone && <div><strong>Phone:</strong> {account?.phone}</div>}
          {account?.region && <div><strong>Region:</strong> {account?.region}</div>}
          <div>
            <strong>Status:</strong>{' '}
            <span className={`font-medium ${
              account?.enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
            }`}>
              {account?.usernameVerified ? 'Verified' : 'Not Verified'}
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
          {account && account?.usernameVerified && (
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

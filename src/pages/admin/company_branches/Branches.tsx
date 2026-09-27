import React, { useEffect, useState } from 'react';
import { getBranches } from '../../../services/branch.service';
import { CustomLoader2 } from '../../../components/loaders/CustomLoader2';
import { BranchCard } from './BranchCard';
import { Link } from 'react-router-dom';
import { ADMIN_LINKS_FRONTEND } from '../../../links';

// Structural interface defining an individual Company Branch data shape
export interface BranchRecordType {
  id: string | number;
  name: string;
  country?: string;
  county?: string;
  city?: string;
  street?: string;
  zip?: string;
  [key: string]: unknown; // Fallback mapping for dynamic parameters
}

export const Branches: React.FC = () => {
  const [loadingBranches, setLoadingBranches] = useState<boolean>(true);
  const [branches, setBranches] = useState<BranchRecordType[]>([]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async (): Promise<void> => {
      try {
        setLoadingBranches(true);
        
        // Uncomment and run the API call directly using standard async-await
        const response = await getBranches({});
        
        if (isMounted && response?.data) {
          // Unify content mapping based on typical paginated or direct array data payloads
          const content = Array.isArray(response.data) 
            ? response.data 
            : response.data.content || [];
            
          setBranches(content as BranchRecordType[]);
        }
      } catch (err) {
        console.error("ERROR FETCHING BRANCHES: ", err);
      } finally {
        if (isMounted) {
          setLoadingBranches(false);
        }
      }
    };
    
    loadData();

    return () => {
      isMounted = false;
    };
  }, []); // Fixed the infinite re-render pattern by switching from loadingBranches to an empty dependency array

  return (
    <>
      <section className="p-4">
        {/* Header */}
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Branches
            <span className='px-2'>{branches?.length || 0}</span>
          </h1>
          
          <Link
            to={ADMIN_LINKS_FRONTEND.ADD_BRANCH || ""}
            className="px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
          >
            + Add Branch
          </Link>
        </header>
  
        {/* Body */}
        {loadingBranches ? (
          <CustomLoader2 />
        ) : branches.length > 0 ? (
          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch, idx) => (
              <li key={branch?.id || idx}>
                <BranchCard branch={branch} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No branches found.</p>
        )}
      </section>
    </>
  );
};

export default Branches;
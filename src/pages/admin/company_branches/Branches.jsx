import React, { useEffect, useState } from 'react'
import { getBranches } from '../../../services/branch.service';
import { CustomLoader2 } from '../../../components/loaders/CustomLoader2';
import { BranchCard } from '../../admin/company_branches/BranchCard';
import { Link } from 'react-router-dom';
import { ADMIN_LINKS_FRONTEND } from '../../../links';

export const Branches = () => {
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [branches, setBranches] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            if (!loadingBranches) setLoadingBranches(true);
            const requests = [
                // await getBranches({}),
            ];

            await Promise.allSettled(requests).then(response => {
                // const [resBranches] = response.map(res => res.status === "fulfilled" ? res.value : []);
                // console.log("RES BRANCHES AGAIN: ", resBranches);
            }).catch(err => {
                console.error("ERROR BRANCHES AGAIN: ", err);
            }).finally(() => setLoadingBranches(false));
        };
        
        loadData();
    }, []);
    

    return (
        <>
            <section className="p-4">
                  {/* Header */}
                  <header className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      Branches
                      <span className='px-2'>{ branches?.length || '' }</span>
                    </h1>
                    
                    <Link
                      to={ADMIN_LINKS_FRONTEND.ADD_BRANCH}
                      className="px-3 py-1 text-sm font-medium text-white bg-orange-600 rounded hover:bg-orange-700"
                    >
                      + Add Branch
                    </Link>
                  </header>
            
                  {/* Body */}
                {loadingBranches
                    ? <CustomLoader2/>
                    : branches.length > 0
                        ? (
                            <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {branches.map((branch, idx) => (
                                    <li key={branch?.id || idx}>
                                        <BranchCard key={branch?.id || idx} branch={branch} />
                                    </li>
                                ))}
                            </ul>
                        )
                        : <p className="text-gray-500 dark:text-gray-400">No branches found.</p>
                }
                </section>
        </>
    );
}

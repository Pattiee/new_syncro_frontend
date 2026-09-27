import React from 'react';
import { BranchRecordType } from '../../pages/Branches'; // Update this import path to match your layout folder tree

interface BranchCardProps {
  branch: BranchRecordType;
}

export const BranchCard: React.FC<BranchCardProps> = ({ branch }) => {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-xl border border-gray-100 dark:border-gray-700">
      <h3 className="font-semibold text-gray-800 dark:text-gray-100">
        {branch?.name || "Unnamed Branch"}
      </h3>
      {branch?.city && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {branch.city}, {branch?.country || ""}
        </p>
      )}
    </div>
  );
};

export default BranchCard;
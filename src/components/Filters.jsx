import React, { useEffect, useState } from 'react';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import { transactionAPI } from '../services/api';

const Filters = ({ filters, onFiltersChange, onClear }) => {
  const [schoolIds, setSchoolIds] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadSchoolIds = async () => {
      try {
        const ids = await transactionAPI.getSchoolIds();
        setSchoolIds(ids);
      } catch (error) {
        console.error('Failed to load school IDs:', error);
      }
    };
    loadSchoolIds();
  }, []);

  const statusOptions = ['Success', 'Pending', 'Failed'];

  const handleStatusChange = (status) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFiltersChange({ ...filters, status: newStatus });
  };

  const handleSchoolIdChange = (schoolId) => {
    const newSchoolIds = filters.school_ids.includes(schoolId)
      ? filters.school_ids.filter(id => id !== schoolId)
      : [...filters.school_ids, schoolId];
    
    onFiltersChange({ ...filters, school_ids: newSchoolIds });
  };

  const hasActiveFilters = filters.status.length > 0 || filters.school_ids.length > 0 || filters.date_from || filters.date_to;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-4 animate-scaleIn hover:shadow-lg transition-all duration-300">
      {/* Search Bar */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-pulse-slow" />
        <input
          type="text"
          placeholder="Search by Collect ID, Custom Order ID, or School ID..."
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 focus:scale-100 transform"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 hover:shadow-md"
        >
          <FiFilter className="h-4 w-4 transition-transform duration-200 group-hover:rotate-12" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
              {filters.status.length + filters.school_ids.length + (filters.date_from ? 1 : 0) + (filters.date_to ? 1 : 0)}
            </span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="flex items-center space-x-1 px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-all duration-200 transform hover:scale-105 animate-slideIn"
          >
            <FiX className="h-4 w-4 transition-transform duration-200 hover:rotate-90" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Expanded Filters */}
      {showFilters && (
        <div className="space-y-6 pt-4 border-t border-gray-200 dark:border-gray-700 animate-slideIn">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((status, index) => (
                <label
                  key={status}
                  className="flex items-center space-x-2 cursor-pointer animate-slideIn hover:scale-105 transition-transform duration-200"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <input
                    type="checkbox"
                    checked={filters.status.includes(status)}
                    onChange={() => handleStatusChange(status)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-all duration-200 transform focus:scale-110"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* School ID Filter */}
          <div className=''>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              School IDs
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 max-h-40 overflow-auto lg:overflow-hidden sm:overflow-y-auto">
              {schoolIds.map((schoolId, index) => (
                <label
                  key={schoolId}
                  className="flex items-center space-x-2 cursor-pointer animate-slideIn hover:scale-105 transition-transform duration-200"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <input
                    type="checkbox"
                    checked={filters.school_ids.includes(schoolId)}
                    onChange={() => handleSchoolIdChange(schoolId)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 transition-all duration-200 transform focus:scale-110"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{schoolId}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                From Date
              </label>
              <input
                type="date"
                value={filters.date_from || ''}
                onChange={(e) => onFiltersChange({ ...filters, date_from: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:scale-105 transform"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                To Date
              </label>
              <input
                type="date"
                value={filters.date_to || ''}
                onChange={(e) => onFiltersChange({ ...filters, date_to: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 focus:scale-105 transform"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
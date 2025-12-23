'use client';

import { useMemo, useState } from 'react';      //this is actually needed for the Technicals of the Pagination since this
                                            //deals with the Search function, currentPage, startIndex, and other functions

import { Search, ArrowUpAZ, ArrowDownZA, Hash, Building2, Tag } from 'lucide-react'; //this is less necassery but its for the button icons

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

type SortKey = 'name' | 'id' | 'category';
type SortDirection = 'asc' | 'desc';
                                        //these lines are for the ACTUAL thing you wish to filter so, Sorting by Name or ID
                                    //Order either Name or ID by Ascending or Descending order.

interface DataItem {
  id: string;
  name: string;
  category: string;
}
                        //think of this part as just listing the item to be seen in the Frontend

interface TableProps {
  data: DataItem[];
}


// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ModernTableWithPagination({ data }: TableProps) {
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  // Search state - stores the user's search query
    // For example if you look for "Acme Corporation" in the search it will start filtering
    // Or search the ID number or Category of company
  const [search, setSearch] = useState('');
  
  // Sort state - what field to sort by (name or id or category)
    // This is the section were you can filter via buttons so, Name, ID, or Category
  const [sortKey, setSortKey] = useState<SortKey>('name');
  
  // Sort direction state - ascending or descending
    // This is the last 2 buttons where now you get to pick which way Users will sort by
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Pagination state - current page number (starts at 1)
    // Think of this as the Index, if this works as it should if you have 100 pages or 2 it will always start at Page 1
  const [currentPage, setCurrentPage] = useState(1);
  
  // Items per page - how many items to show on each page
    // Since by default (No search) the lowest item count in a page should be 10 but later can be changed
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ============================================================================
  // DATA PROCESSING (using useMemo for performance optimization)
  // ============================================================================


// This is the Filtering Section
    // If i understand this correctly this should be acting more like a query filter
    // If you know anything of SQL (data querying) you'd know that the correct query for this is: 

    /**
     * SELECT company.idCompany, company.nameCompany, company.categoryCompany
     * FROM company
     */

    // This query literally just looks for those three columns, which if you are paying attention
    // is exactly what our filter buttons are (ID, Name, & Category)

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();
    
    // If no search query, return all data      
        //since this isnt SQL we have to use actual Backend tech to deal with this
    if (!query) return data;
    
    // Filter items that match the search query in name or id or category
    return data.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    });
  }, [data, search]);

  // Now that we have queried all the items we wish to use (Id, Name, & Category)
  // We must now cut down the items found. In other words Filtering from our avaliable items

  // Returning back to SQL examples this section will be the Conditions after the FROM
  /**
   * SELECT company.idCompany, company.nameCompany, company.categoryCompany
   * FROM company
   * ORDER BY company.idCompany;
   * -- or ORDER BY company.nameCompany;
   * -- or ORDER BY company.categoryCompany;
   * 
   * Note: only one Order By can be used but point is that it can be ordered by either three
   */
  const sortedData = useMemo(() => {
    const sorted = [...filteredData].sort((a, b) => {
      // Compare based on the selected sort key
      if (sortKey === 'name') {                         
        return a.name.localeCompare(b.name);
      }
      if(sortKey == 'category'){
        return a.category.localeCompare(b.category);
      }
      return a.id.localeCompare(b.id);
    });
    
    // Reverse if descending direction
    return sortDirection === 'asc' ? sorted : sorted.reverse();
  }, [filteredData, sortKey, sortDirection]);


  // This is the Pagination section
  // Since to create pages it obviously has to start and end the smart way to structure this
    // would be by simply having the Start-Index 1 (currentPage - 1 (to force the count to actually be 1))
  // And for the End-Index you can simply just have the very next page be the end. Let the Start
    // -Index be the one doing all the work
  const paginatedData = useMemo(() => {
    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * itemsPerPage;    // The "currentPage" variable increases elsewhere but
                                                        // the point is that this one will be segmented by 10 items 
    const endIndex = startIndex + itemsPerPage;       // Since every page has a limit of 10 the end does not move unless currentPage moves

    
    // Return only the items for the current page
    return sortedData.slice(startIndex, endIndex);  //Slice is a cut of the item amount (10,10), (10,20)
  }, [sortedData, currentPage, itemsPerPage]);


  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  //this math part is the result of the amount of pages spat out. For example Math.ceil(10/10) = 1 thus 1 Page.
    // But another example is a length of 25 (25/10) = 2.5, ceil is Round Up so 3 Pages. 

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle sort key change (Name or ID)
   * Resets to page 1 when sort changes
   */
  const handleSortKeyChange = (key: SortKey) => {
    setSortKey(key);
    setCurrentPage(1); // Reset to first page
  };

  /**
   * Handle sort direction change (A→Z or Z→A)
   * Resets to page 1 when direction changes
   */
  const handleSortDirectionChange = (direction: SortDirection) => {
    setSortDirection(direction);
    setCurrentPage(1);
  };

  /**
   * Handle items per page change
   * Resets to page 1 to avoid showing empty pages
   */
  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  /**
   * Handle "Clear All" button
   * Resets all filters to default values
   */
  const handleClearFilters = () => {
    setSearch('');
    setSortKey('name');
    setSortDirection('asc');
    setCurrentPage(1);
  };

  /**
   * Navigate to previous page
   * Math.max ensures we don't go below page 1
   */
  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  /**
   * Navigate to next page
   * Math.min ensures we don't exceed total pages
   */
  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  // ============================================================================
  // COMPUTED VALUES FOR UI
  // ============================================================================

  // Check if any filters are active (not default state)
  const hasActiveFilters = search || sortKey !== 'name' || sortDirection !== 'asc';
  
  // Calculate which items are currently being shown
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, sortedData.length);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <>
      {/* ================================================================== */}
      {/* FILTERS SECTION */}
      {/* ================================================================== */}
      <section className="rounded-3xl border border-zinc-200 bg-white/80 p-6 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="space-y-4">
          
          {/* SEARCH BAR */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or ID..."
              className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
            />
          </div>

          {/* SORT CONTROLS */}
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Sort by:
            </span>
            
            {/* SORT KEY BUTTON GROUP (Name or ID) */}
            <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700">
              {/* Name Button */}
              <button
                type="button"
                onClick={() => handleSortKeyChange('name')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                  sortKey === 'name'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                } rounded-l-lg`}
              >
                <Building2 className="h-4 w-4" />
                Name
              </button>
              
              {/* ID Button */}
              <button
                type="button"
                onClick={() => handleSortKeyChange('id')}
                className={`flex items-center gap-2 border-l px-4 py-2 text-sm font-medium transition ${
                  sortKey == 'id'
                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                    : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-700'
                } rounded-r-lg`}
              >
                <Hash className="h-4 w-4" />
                ID
              </button>

              <button type="button" onClick ={() => handleSortKeyChange('category')}
                className={`flex items-center gap-2 border-l px-4 py-2 text-sm font-medium transition ${
                    sortKey === 'category'
                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                    : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-700'
                
                } rounded-r-lg`}>
                <Tag className="h-4 w-4"/>
                Category
              </button>
            </div>

            {/* SORT DIRECTION BUTTON GROUP (Ascending/Descending) */}
            <div className="flex rounded-lg border border-zinc-200 dark:border-zinc-700">
              {/* Ascending Button */}
              <button
                type="button"
                onClick={() => handleSortDirectionChange('asc')}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition ${
                  sortDirection === 'asc'
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'bg-white text-zinc-700 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800'
                } rounded-l-lg`}
                title="Ascending (A-Z)"
              >
                <ArrowUpAZ className="h-4 w-4" />
                A → Z
              </button>
              
              {/* Descending Button */}
              <button
                type="button"
                onClick={() => handleSortDirectionChange('desc')}
                className={`flex items-center gap-2 border-l px-4 py-2 text-sm font-medium transition ${
                  sortDirection === 'desc'
                    ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100'
                    : 'bg-white text-zinc-700 hover:bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:border-zinc-700'
                } rounded-r-lg`}
                title="Descending (Z-A)"
              >
                <ArrowDownZA className="h-4 w-4" />
                Z → A
              </button>
            </div>

            {/* ACTIVE FILTERS INDICATOR & CLEAR BUTTON */}
            {hasActiveFilters && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {search && 'Filtered'} {sortKey !== 'name' || sortDirection !== 'asc' ? '• Sorted' : ''}
                </span>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-700 transition hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
                >
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* DATA TABLE SECTION */}
      {/* ================================================================== */}
      <section className="rounded-3xl border border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-zinc-200 text-left text-sm dark:divide-zinc-800">
            {/* TABLE HEADER */}
            <thead className="bg-zinc-100/80 dark:bg-zinc-900/50">
              <tr>
                <th className="px-6 py-3 font-medium uppercase tracking-wide text-zinc-500">
                  ID
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wide text-zinc-500">
                  Name
                </th>
                <th className="px-6 py-3 font-medium uppercase tracking-wide text-zinc-500">
                  Category
                </th>
              </tr>
            </thead>
            
            {/* TABLE BODY */}
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {paginatedData.length > 0 ? (
                // Map through the paginated data (only current page items)
                paginatedData.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-zinc-600 dark:text-zinc-300">
                      {item.id}
                    </td>
                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-300">
                      {item.category}
                    </td>
                  </tr>
                ))
              ) : (
                // Empty state - shown when no results match filters
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-12 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ================================================================== */}
      {/* PAGINATION CONTROLS SECTION */}
      {/* ================================================================== */}
      {/* Only show pagination if there are items to display */}
      {sortedData.length > 0 && (
        <section className="flex items-center justify-between rounded-3xl border border-zinc-200 bg-white/80 px-5 py-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
          
          {/* LEFT SIDE: Item count and per-page selector */}
          <div className="flex items-center gap-4">
            {/* Shows "Showing X to Y of Z items" */}
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              Showing {startItem} to {endItem} of {sortedData.length} items
            </div>
            
            {/* Items per page dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:focus:border-zinc-500 dark:focus:ring-zinc-700"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {/* RIGHT SIDE: Page navigation buttons */}
          <div className="flex items-center gap-2">
            {/* Previous button - disabled on first page */}
            <button
              type="button"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Previous
            </button>
            
            {/* Current page indicator */}
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              Page {currentPage} of {totalPages}
            </span>
            
            {/* Next button - disabled on last page */}
            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              Next
            </button>
          </div>
        </section>
      )}
    </>
  );
}

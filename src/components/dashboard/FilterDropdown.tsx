"use client";
import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Filter, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ExecutionData, FilterOptions } from "@/lib/reportUtils";

interface FilterDropdownProps {
  data: ExecutionData[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  className?: string;
}

const FilterDropdown = ({
  data,
  filters,
  onFiltersChange,
  className,
}: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Get unique values for filter options
  const uniqueStates = [...new Set(data.map((item) => item.executionState))];
  const uniqueTypes = [...new Set(data.map((item) => item.type))];
  const uniqueExecutors = [...new Set(data.map((item) => item.executedBy))];

  const handleStateToggle = (state: ExecutionData["executionState"]) => {
    const currentStates = filters.executionState || [];
    const newStates = currentStates.includes(state)
      ? currentStates.filter((s) => s !== state)
      : [...currentStates, state];

    onFiltersChange({
      ...filters,
      executionState: newStates.length > 0 ? newStates : undefined,
    });
  };

  const handleTypeToggle = (type: string) => {
    const currentTypes = filters.type || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];

    onFiltersChange({
      ...filters,
      type: newTypes.length > 0 ? newTypes : undefined,
    });
  };

  const handleExecutorToggle = (executor: string) => {
    const currentExecutors = filters.executedBy || [];
    const newExecutors = currentExecutors.includes(executor)
      ? currentExecutors.filter((e) => e !== executor)
      : [...currentExecutors, executor];

    onFiltersChange({
      ...filters,
      executedBy: newExecutors.length > 0 ? newExecutors : undefined,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      timePeriod: filters.timePeriod,
      executionState: undefined,
      type: undefined,
      executedBy: undefined,
    });
  };

  const hasActiveFilters =
    (filters.executionState && filters.executionState.length > 0) ||
    (filters.type && filters.type.length > 0) ||
    (filters.executedBy && filters.executedBy.length > 0);

  const getStatusColor = (status: ExecutionData["executionState"]) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800 border-green-200";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "error":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Button
        variant="outline"
        size="sm"
        icon={Filter}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative",
          hasActiveFilters && "border-blue-500 bg-blue-50 text-blue-700"
        )}
      >
        Filter
        <ChevronDown className="w-4 h-4 ml-1" />
        {hasActiveFilters && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full" />
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20 p-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {/* Execution State Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Execution State
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueStates.map((state) => (
                      <button
                        key={state}
                        onClick={() => handleStateToggle(state)}
                        className={cn(
                          "px-3 py-1 text-xs font-medium rounded-full border transition-all",
                          filters.executionState?.includes(state)
                            ? getStatusColor(state)
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {state}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => handleTypeToggle(type)}
                        className={cn(
                          "px-3 py-1 text-xs font-medium rounded-full border transition-all",
                          filters.type?.includes(type)
                            ? "bg-blue-100 text-blue-800 border-blue-200"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Executed By Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Executed By
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {uniqueExecutors.map((executor) => (
                      <button
                        key={executor}
                        onClick={() => handleExecutorToggle(executor)}
                        className={cn(
                          "px-3 py-1 text-xs font-medium rounded-full border transition-all",
                          filters.executedBy?.includes(executor)
                            ? "bg-purple-100 text-purple-800 border-purple-200"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {executor}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export { FilterDropdown };

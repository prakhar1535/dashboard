import Fuse from "fuse.js";

export interface ExecutionData {
  id: string;
  hostName: string;
  hostIP: string;
  executionName: string;
  startDate: string;
  executionState: "success" | "warning" | "error";
  progress?: number;
  type: string;
  executedBy: string;
}

export type SortField = keyof ExecutionData;
export type SortDirection = "asc" | "desc";
export type TimePeriod = "Weekly" | "Monthly" | "Yearly" | "Custom";

export interface FilterOptions {
  timePeriod: TimePeriod;
  executionState?: ExecutionData["executionState"][];
  type?: string[];
  executedBy?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface SortOptions {
  field: SortField;
  direction: SortDirection;
}

// Fuzzy search configuration
const fuseOptions = {
  keys: [
    { name: "hostName", weight: 0.3 },
    { name: "executionName", weight: 0.3 },
    { name: "hostIP", weight: 0.2 },
    { name: "executedBy", weight: 0.1 },
    { name: "type", weight: 0.1 },
  ],
  threshold: 0.4, // Lower threshold = more strict matching
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
};

// Time period utilities
export const getDateRange = (
  period: TimePeriod,
  customRange?: { start: Date; end: Date }
) => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (period) {
    case "Weekly":
      const weekStart = new Date(startOfDay);
      weekStart.setDate(startOfDay.getDate() - startOfDay.getDay()); // Start of week (Sunday)
      return {
        start: weekStart,
        end: new Date(weekStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1), // End of week
      };

    case "Monthly":
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      return { start: monthStart, end: monthEnd };

    case "Yearly":
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { start: yearStart, end: yearEnd };

    case "Custom":
      return customRange || { start: new Date(0), end: now };

    default:
      return { start: new Date(0), end: now };
  }
};

// Date parsing utility
export const parseDate = (dateString: string): Date => {
  // Handle the format "2021-02-05 08:28:36"
  return new Date(dateString.replace(" ", "T"));
};

// Filter functions
export const filterByTimePeriod = (
  data: ExecutionData[],
  period: TimePeriod,
  customRange?: { start: Date; end: Date }
): ExecutionData[] => {
  const { start, end } = getDateRange(period, customRange);

  return data.filter((item) => {
    const itemDate = parseDate(item.startDate);
    return itemDate >= start && itemDate <= end;
  });
};

export const filterByExecutionState = (
  data: ExecutionData[],
  states: ExecutionData["executionState"][]
): ExecutionData[] => {
  if (!states || states.length === 0) return data;
  return data.filter((item) => states.includes(item.executionState));
};

export const filterByType = (
  data: ExecutionData[],
  types: string[]
): ExecutionData[] => {
  if (!types || types.length === 0) return data;
  return data.filter((item) => types.includes(item.type));
};

export const filterByExecutedBy = (
  data: ExecutionData[],
  executors: string[]
): ExecutionData[] => {
  if (!executors || executors.length === 0) return data;
  return data.filter((item) => executors.includes(item.executedBy));
};

// Main filter function
export const filterData = (
  data: ExecutionData[],
  filters: FilterOptions
): ExecutionData[] => {
  let filteredData = [...data];

  // Apply time period filter
  filteredData = filterByTimePeriod(
    filteredData,
    filters.timePeriod,
    filters.dateRange
  );

  // Apply execution state filter
  if (filters.executionState && filters.executionState.length > 0) {
    filteredData = filterByExecutionState(filteredData, filters.executionState);
  }

  // Apply type filter
  if (filters.type && filters.type.length > 0) {
    filteredData = filterByType(filteredData, filters.type);
  }

  // Apply executed by filter
  if (filters.executedBy && filters.executedBy.length > 0) {
    filteredData = filterByExecutedBy(filteredData, filters.executedBy);
  }

  return filteredData;
};

// Sort functions
export const sortData = (
  data: ExecutionData[],
  sortOptions: SortOptions
): ExecutionData[] => {
  const { field, direction } = sortOptions;

  return [...data].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];

    // Handle date sorting
    if (field === "startDate") {
      aValue = parseDate(a.startDate).getTime();
      bValue = parseDate(b.startDate).getTime();
    }

    // Handle numeric sorting
    if (typeof aValue === "number" && typeof bValue === "number") {
      return direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Handle string sorting
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();

    if (direction === "asc") {
      return aStr.localeCompare(bStr);
    } else {
      return bStr.localeCompare(aStr);
    }
  });
};

// Fuzzy search function
export const fuzzySearch = (
  data: ExecutionData[],
  query: string
): ExecutionData[] => {
  if (!query.trim()) return data;

  const fuse = new Fuse(data, fuseOptions);
  const results = fuse.search(query);

  return results.map((result) => result.item);
};

// Combined search, filter, and sort function
export const processReportsData = (
  data: ExecutionData[],
  searchQuery: string,
  filters: FilterOptions,
  sortOptions: SortOptions
): ExecutionData[] => {
  let processedData = [...data];

  // Apply filters first
  processedData = filterData(processedData, filters);

  // Apply search
  if (searchQuery.trim()) {
    processedData = fuzzySearch(processedData, searchQuery);
  }

  // Apply sorting
  processedData = sortData(processedData, sortOptions);

  return processedData;
};

// Utility functions for getting unique values for filter options
export const getUniqueExecutionStates = (
  data: ExecutionData[]
): ExecutionData["executionState"][] => {
  return [...new Set(data.map((item) => item.executionState))];
};

export const getUniqueTypes = (data: ExecutionData[]): string[] => {
  return [...new Set(data.map((item) => item.type))];
};

export const getUniqueExecutors = (data: ExecutionData[]): string[] => {
  return [...new Set(data.map((item) => item.executedBy))];
};

// Statistics utilities
export const getDataStatistics = (data: ExecutionData[]) => {
  const total = data.length;
  const successCount = data.filter(
    (item) => item.executionState === "success"
  ).length;
  const warningCount = data.filter(
    (item) => item.executionState === "warning"
  ).length;
  const errorCount = data.filter(
    (item) => item.executionState === "error"
  ).length;

  return {
    total,
    success: successCount,
    warning: warningCount,
    error: errorCount,
    successRate: total > 0 ? (successCount / total) * 100 : 0,
  };
};

// URL management utilities
export const parseArrayParam = (param: string | null): string[] => {
  if (!param) return [];
  return param.split(",").filter(Boolean);
};

export const stringifyArrayParam = (arr: string[]): string => {
  return arr.join(",");
};

export const parseFiltersFromURL = (
  searchParams: URLSearchParams
): FilterOptions => {
  const timePeriod = (searchParams.get("period") as TimePeriod) || "Yearly";
  const executionState = parseArrayParam(
    searchParams.get("states")
  ) as ExecutionData["executionState"][];
  const type = parseArrayParam(searchParams.get("types"));
  const executedBy = parseArrayParam(searchParams.get("executors"));

  return {
    timePeriod,
    executionState: executionState.length > 0 ? executionState : undefined,
    type: type.length > 0 ? type : undefined,
    executedBy: executedBy.length > 0 ? executedBy : undefined,
  };
};

export const parseSortFromURL = (
  searchParams: URLSearchParams
): SortOptions => {
  const field =
    (searchParams.get("sortField") as keyof ExecutionData) || "startDate";
  const direction = (searchParams.get("sortDir") as "asc" | "desc") || "desc";

  return { field, direction };
};

export const buildURLFromState = (
  baseURL: string,
  filters: FilterOptions,
  sortOptions: SortOptions,
  searchQuery: string
): string => {
  const params = new URLSearchParams();

  // Add search query
  if (searchQuery.trim()) {
    params.set("search", searchQuery);
  }

  // Add time period
  if (filters.timePeriod !== "Yearly") {
    params.set("period", filters.timePeriod);
  }

  // Add execution states
  if (filters.executionState && filters.executionState.length > 0) {
    params.set("states", stringifyArrayParam(filters.executionState));
  }

  // Add types
  if (filters.type && filters.type.length > 0) {
    params.set("types", stringifyArrayParam(filters.type));
  }

  // Add executors
  if (filters.executedBy && filters.executedBy.length > 0) {
    params.set("executors", stringifyArrayParam(filters.executedBy));
  }

  if (sortOptions.field !== "startDate") {
    params.set("sortField", sortOptions.field);
  }
  if (sortOptions.direction !== "desc") {
    params.set("sortDir", sortOptions.direction);
  }

  return params.toString() ? `${baseURL}?${params.toString()}` : baseURL;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand("copy");
      textArea.remove();
      return result;
    }
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    return false;
  }
};

// PDF Export functionality
export const exportToPDF = async (
  data: ExecutionData[],
  filters: FilterOptions,
  searchQuery?: string
): Promise<void> => {
  // Ensure this only runs on the client side
  if (typeof window === "undefined") {
    throw new Error("PDF export is only available on the client side");
  }

  try {
    // Dynamic import to avoid SSR issues
    const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
      import("jspdf"),
      import("jspdf-autotable"),
    ]);

    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    // Add title
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Execution Reports", 20, 20);

    // Add export date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const exportDate = new Date().toLocaleString();
    doc.text(`Exported on: ${exportDate}`, 20, 30);

    // Add filter information
    let yPosition = 40;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Applied Filters:", 20, yPosition);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPosition += 8;

    // Time Period
    doc.text(`Time Period: ${filters.timePeriod}`, 25, yPosition);
    yPosition += 6;

    // Search Query
    if (searchQuery && searchQuery.trim()) {
      doc.text(`Search: "${searchQuery}"`, 25, yPosition);
      yPosition += 6;
    }

    // Execution States
    if (filters.executionState && filters.executionState.length > 0) {
      doc.text(
        `Execution States: ${filters.executionState.join(", ")}`,
        25,
        yPosition
      );
      yPosition += 6;
    }

    // Types
    if (filters.type && filters.type.length > 0) {
      doc.text(`Types: ${filters.type.join(", ")}`, 25, yPosition);
      yPosition += 6;
    }

    // Executed By
    if (filters.executedBy && filters.executedBy.length > 0) {
      doc.text(`Executed By: ${filters.executedBy.join(", ")}`, 25, yPosition);
      yPosition += 6;
    }

    // Add summary statistics
    const stats = getDataStatistics(data);
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary:", 20, yPosition);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    yPosition += 8;
    doc.text(`Total Executions: ${stats.total}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Success Rate: ${stats.successRate.toFixed(1)}%`, 25, yPosition);
    yPosition += 6;
    doc.text(`Successful: ${stats.success}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Warnings: ${stats.warning}`, 25, yPosition);
    yPosition += 6;
    doc.text(`Errors: ${stats.error}`, 25, yPosition);

    // Prepare table data
    const tableHeaders = [
      "Execution ID",
      "Host Name",
      "Host IP",
      "Execution Name",
      "Start Date",
      "State",
      "Progress",
      "Type",
      "Executed By",
    ];

    const tableData = data.map((row) => [
      row.id,
      row.hostName,
      row.hostIP,
      row.executionName,
      row.startDate,
      row.executionState,
      `${row.progress || 0}%`,
      row.type,
      row.executedBy,
    ]);

    // Add table
    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY: yPosition + 15,
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [71, 85, 105], // slate-600
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252], // slate-50
      },
      columnStyles: {
        0: { cellWidth: 25 }, // Execution ID
        1: { cellWidth: 30 }, // Host Name
        2: { cellWidth: 25 }, // Host IP
        3: { cellWidth: 35 }, // Execution Name
        4: { cellWidth: 35 }, // Start Date
        5: { cellWidth: 20 }, // State
        6: { cellWidth: 15 }, // Progress
        7: { cellWidth: 20 }, // Type
        8: { cellWidth: 25 }, // Executed By
      },
      margin: { left: 20, right: 20 },
      tableWidth: "auto",
    });

    // Add footer with page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 30,
        doc.internal.pageSize.getHeight() - 10
      );
    }

    // Generate filename with timestamp
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[:.]/g, "-");
    const filename = `execution-reports-${timestamp}.pdf`;

    // Save the PDF
    doc.save(filename);
  } catch (error) {
    console.error("Failed to export PDF:", error);
    throw new Error("Failed to export PDF. Please try again.");
  }
};

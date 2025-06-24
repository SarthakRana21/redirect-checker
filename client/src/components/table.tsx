import { TableComponent } from "react-table-pagination-v1";
import type { tableData } from "./interfaces/interface";

const SimpleTable = ({ data }: { data: tableData[] }) => {
  
  const tableConfig = {
    tableClassName: "min-w-full bg-gray-800 rounded-lg",
    tHeadClassName: "text-white bg-gray-700 border border-gray-500 rounded-lg sticky top-0 z-10",
    thClassName: "py-2 px-4 text-left border border-gray-500 cursor-pointer gap-2",
    trClassName: {
      class: () => "cursor-pointer hover:bg-gray-900",
    },
    rows: {
        className: ""
    },
    thIconClassName: "flex flex-row items-center gap-2",
    tBodyClassName: "",
    tdClassname: "py-2 px-4 border border-b-gray-500 border-l-gray-500 border-r-gray-500 rounded-lg",
    columns: [
      { name: "JobId", keys: ["jobId"], sortable: true },
      { name: "Status", keys: ["status"], sortable: true },
      { name: "Created At", keys: ["createdAt"], sortable: true}
    ],
    emptyState: {
      text: () => "No History Available",
    }
  };

  const cellClickHandle = (cellData: string, row: Record<string, tableData>) => {
    console.log('cellData:', row[cellData])
    console.log('Row:', row)
  }

  return <TableComponent fullData={data} data={data} config={tableConfig} onCellClick={cellClickHandle} />;
};

export default SimpleTable;
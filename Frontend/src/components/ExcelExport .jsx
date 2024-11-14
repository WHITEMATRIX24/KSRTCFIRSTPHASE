import React from 'react'
import { saveAs } from 'file-saver';
import  * as XLSX from 'xlsx';

function ExcelExport ({ data,data1, fileName }) {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const worksheet1 = XLSX.utils.json_to_sheet(data1);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'CompletedTrip Details');
        XLSX.utils.book_append_sheet(workbook, worksheet1, 'All Vehicle Data');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
        saveAs(blob, `${fileName}.xlsx`);
      };
  return (
    <div className='w-100 d-flex justify-content-end align-items-center' > <button className='btn btn-outline-success m-2' onClick={exportToExcel}>Export to Excel</button> </div>
  )
}

export default ExcelExport 
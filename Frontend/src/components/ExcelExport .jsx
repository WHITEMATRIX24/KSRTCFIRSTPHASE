import React from 'react'
import { saveAs } from 'file-saver';
import  * as XLSX from 'xlsx';

function ExcelExport ({ data,data1,data2,data3,data4, fileName }) {
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const worksheet1 = XLSX.utils.json_to_sheet(data1);
        const worksheet2 = XLSX.utils.json_to_sheet(data2);
        const worksheet3 = XLSX.utils.json_to_sheet(data3);
        const worksheet4 = XLSX.utils.json_to_sheet(data4);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'CompletedTrip Details');
        XLSX.utils.book_append_sheet(workbook, worksheet1, 'All Vehicle Data');
        XLSX.utils.book_append_sheet(workbook, worksheet2, 'All Trip  Data by Depo');
        XLSX.utils.book_append_sheet(workbook, worksheet3, 'All Upcoming trip  Data by Depo');
        XLSX.utils.book_append_sheet(workbook, worksheet4, 'All Live trip  Data by Depo');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
        saveAs(blob, `${fileName}.xlsx`);
      };
  return (
    <div className='w-100 d-flex justify-content-end align-items-center' > <button className='btn btn-outline-success m-2' onClick={exportToExcel}>Export to Excel</button> </div>
  )
}

export default ExcelExport 
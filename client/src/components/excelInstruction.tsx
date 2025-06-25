
const ExcelInstructions = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 rounded-lg shadow-md space-y-4 bg-gray-800 text-[#eaeaea] border border-[#3b3b3b]">
      <h2 className="text-2xl font-semibold text-[#a786ff]">📄 Excel File Format Instructions</h2>
      <p>Please ensure your Excel file follows this structure with <strong>exact column names</strong>:</p>

      <ul className="list-disc pl-6 space-y-1">
        <li><code className="text-[#a786ff] font-medium">address</code> – The URL that needs to be checked</li>
        <li><code className="text-[#a786ff] font-medium">redirect_url</code> – The URL to which the address redirects</li>
      </ul>

      <p>🔽 Example:</p>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full text-sm border border-[#3b3b3b]">
          <thead className="bg-[#333333]">
            <tr>
              <th className="px-4 py-2 bg-gray-700 border border-[#3b3b3b] text-left">address</th>
              <th className="px-4 py-2 bg-gray-700 border border-[#3b3b3b] text-left">redirect_url</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-900">
              <td className="px-4 py-2 border border-[#3b3b3b] break-all text-[#eaeaea]">
                https://www.example.com/path-1/page.html
              </td>
              <td className="px-4 py-2 border border-[#3b3b3b] break-all text-[#eaeaea]">
                https://www.example.com/new-path-1/page.html
              </td>
            </tr>
            <tr className="hover:bg-gray-900">
              <td className="px-4 py-2 border border-[#3b3b3b] break-all text-[#eaeaea]">
                https://www.example.com/path-2/page.html
              </td>
              <td className="px-4 py-2 border border-[#3b3b3b] break-all text-[#eaeaea]">
                https://www.example.com/new-path-2/page.html
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm text-[#a0a0a0]">🛈 Save your file as <code className="text-[#a786ff]">.xlsx</code> format before uploading.</p>
    </div>
  );
};

export default ExcelInstructions;

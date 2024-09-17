import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const Record = ({ record, deleteRecord, toggleSelect, isSelected }) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle">
      <input
        type="checkbox"
        checked={isSelected}
        onChange={() => toggleSelect(record._id)}
      />
    </td>
    <td className="p-4 align-middle">
      {record.name}
    </td>
    <td className="p-4 align-middle">
      {record.position}
    </td>
    <td className="p-4 align-middle">
      {record.level}
    </td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${record._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => deleteRecord(record._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // This method fetches the records from the database.
  useEffect(() => {
    async function getRecords() {
      const response = await fetch(`http://localhost:5050/record/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    getRecords();
    return;
  }, [records.length]);

  // This method will delete a record
  async function deleteRecord(id) {
    await fetch(`http://localhost:5050/record/${id}`, {
      method: "DELETE",
    });
    const newRecords = records.filter((el) => el._id !== id);
    setRecords(newRecords);
    setSelectedRecords(selectedRecords.filter((recordId) => recordId !== id));
    navigate('/'); // Navigate back to the main page
  }

  // Handle checkbox select
  function toggleSelect(id) {
    setSelectedRecords((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((recordId) => recordId !== id)
        : [...prevSelected, id]
    );
  }

  // Delete all selected records
  async function deleteSelectedRecords() {
    for (const id of selectedRecords) {
      await fetch(`http://localhost:5050/record/${id}`, {
        method: "DELETE",
      });
    }
    const newRecords = records.filter((el) => !selectedRecords.includes(el._id));
    setRecords(newRecords);
    setSelectedRecords([]);
    navigate('/'); // Navigate back to the main page
  }

  // This method will map out the records on the table
  function recordList() {
    return records.map((record) => {
      return (
        <Record
          record={record}
          deleteRecord={() => deleteRecord(record._id)}
          toggleSelect={toggleSelect}
          isSelected={selectedRecords.includes(record._id)}
          key={record._id}
        />
      );
    });
  }

  // This following section will display the table with the records of individuals.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>
      <h2 className="text-lg font-semibold p-6">Select records using checkbox to delete</h2>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Select
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Position
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Level
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
      {selectedRecords.length > 0 && (
        <div className="p-4">
          <button
            className="bg-white text-black px-4 py-2 rounded-md hover:bg-red-600"
            onClick={deleteSelectedRecords}
          >
            Delete All Selected
          </button>
        </div>
      )}
    </>
  );
}

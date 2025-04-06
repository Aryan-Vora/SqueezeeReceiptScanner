import "./ReceiptInformationTable.css";
import PropTypes from "prop-types";
/**
 * Renders a table with receipt information.
 * @param {Object} text - The receipt information to be displayed.
 * @returns {JSX.Element} - The table with receipt information.
 */
export default function ReceiptInformationTable(text) {
  const Capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };
  return (
    <table className="recognized-table">
      <thead>
        <tr>
          <th colSpan="2">Receipt Information</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(text.text).map(([key, value]) => (
          <tr key={key}>
            <td>
              <strong>{Capitalize(key)}:</strong>
            </td>
            <td className="value">
              {Array.isArray(value) ? (
                <ul className="recognized-list">
                  {value.map((item, index) => (
                    <li key={index}>
                      {`${item.name} | ${item.count}ct | $${item.price}`}
                    </li>
                  ))}
                </ul>
              ) : (
                <span>{String(value)}</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
ReceiptInformationTable.propTypes = {
  text: PropTypes.object.isRequired,
};

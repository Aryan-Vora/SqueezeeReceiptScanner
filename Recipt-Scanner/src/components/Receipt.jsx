import PropTypes from "prop-types";
import "./Receipt.css";

export default function Receipt({ data }) {
  return (
    <div className="receipt-container">
      <img src={data.imageURL} alt="Product" className="receipt-image" />
      <div className="receipt-info">
        <div className="top-level">
          <div className="retailer">{data.retailer}</div>
          <div className="date">{data.date}</div>
        </div>
        <div className="bottom-level">
          <div className="value">{data.total}</div>
        </div>
      </div>
    </div>
  );
}

Receipt.propTypes = {
  data: PropTypes.object.isRequired,
};

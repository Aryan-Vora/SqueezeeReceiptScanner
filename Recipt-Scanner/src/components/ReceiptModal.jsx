import LoadingDots from "./LoadingDots";
import "./ReceiptModal.css";
import PropTypes from "prop-types"; // Import PropTypes
const ReceiptModal = ({
  isOpen,
  onClose,
  selectedImage,
  uploadSelectedImage,
  loading,
}) => {
  return isOpen ? (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &#10006;
        </button>
        {selectedImage && (
          <img
            className="uploaded-image"
            src={URL.createObjectURL(selectedImage)}
            alt="Uploaded Receipt"
          />
        )}
        {!loading ? (
          <button className="upload-button" onClick={uploadSelectedImage}>
            Upload
          </button>
        ) : (
          <LoadingDots />
        )}
      </div>
    </div>
  ) : null;
};
// Define PropTypes for the ReceiptModal component
ReceiptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, // isOpen should be a boolean and is required
  onClose: PropTypes.func.isRequired, // onClose should be a function and is required
  selectedImage: PropTypes.object, // selectedImage should be an object
  uploadSelectedImage: PropTypes.func.isRequired, // uploadSelectedImage should be a function and is required
  loading: PropTypes.bool.isRequired, // loading should be a boolean and is required
};
export default ReceiptModal;

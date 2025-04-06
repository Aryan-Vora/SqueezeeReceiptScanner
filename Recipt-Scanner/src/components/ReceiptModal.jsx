import LoadingDots from "./LoadingDots";
import "./ReceiptModal.css";
import PropTypes from "prop-types";
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

ReceiptModal.propTypes = {
  isOpen: PropTypes.bool.isRequired, 
  onClose: PropTypes.func.isRequired, 
  selectedImage: PropTypes.object, 
  uploadSelectedImage: PropTypes.func.isRequired, 
  loading: PropTypes.bool.isRequired,
};
export default ReceiptModal;

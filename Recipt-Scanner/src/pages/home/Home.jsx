import { useState, useRef, useEffect } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../../firebase";
import { OCR } from "../../OCR";
import Footer from "../../components/Footer";
import ReceiptModal from "../../components/ReceiptModal";
import Error from "../../components/Error";
import Receipt from "../../components/Receipt";
import "./Home.css";
import AddReceipt from "../../assets/AddReceipt.png";
import Bill from "../../assets/Bill.svg";
/**
 * Home component for the Receipt Scanner app.
 * @returns {JSX.Element} The Home component.
 */
function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [recognizedText, setRecognizedText] = useState("");
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [empty, setEmpty] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [receiptData, setReceiptData] = useState([]);

  useEffect(() => {
    const data = [
      {
        retailer: "Target",
        date: "2023-09-19",
        merchantInfo:
          "San Jose East - 408-238-7800\n3155 Silver Creek Rd\nSan Jose, California 95121-1730",
        items: [
          { name: "Goodfellow&C", count: 1, price: 28 },
          { name: "Disney", count: 1, price: 10 },
          { name: "Minnie Mouse", count: 1, price: 10 },
        ],
        subtotal: 48,
        tax: 4.28,
        discount: 2.4,
        total: 49.88,
        paymentMethod: "American Express",
        valid: true,
        imageURL:
          "https://firebasestorage.googleapis.com/v0/b/squeezee-df.appspot.com/o/reciptdata%2Fimg.jpeg1697491609920%2Fimg.jpg?alt=media&token=e795a73c-9577-463f-857e-f1c453964b0d",
      },
    ];

    setReceiptData(data);
    if (data.length > 0) {
      setEmpty(false);
    }
  }, []);

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Goated function
  const compressImage = (imageFile, maxSizeInBytes, quality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.src = event.target.result;

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          ctx.drawImage(image, 0, 0);

          // Calculate the new quality to achieve the desired file size
          let newQuality = quality || 0.7;
          let compressedDataUrl = canvas.toDataURL("image/jpeg", newQuality);
          let compressedFileSize = Math.round(compressedDataUrl.length * 0.75);

          // If the compressed file size is still above the limit, reduce quality
          while (compressedFileSize > maxSizeInBytes && newQuality >= 0.1) {
            newQuality -= 0.1;
            compressedDataUrl = canvas.toDataURL("image/jpeg", newQuality);
            compressedFileSize = Math.round(compressedDataUrl.length * 0.75);
          }

          // Convert the compressed data URL back to a Blob
          const byteCharacters = atob(compressedDataUrl.split(",")[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const compressedBlob = new Blob([byteArray], { type: "image/jpeg" });

          resolve(compressedBlob);
        };

        image.onerror = () => {
          reject("Error loading image.");
        };
      };

      reader.readAsDataURL(imageFile);
    });
  };
  const handleFileInputChange = (event) => {
    const selectedFile = event.target.files[0];
    setSelectedImage(selectedFile);
    setRecognizedText("");

    if (selectedFile) {
      console.log("Selected file:", selectedFile);
    }
    setModalIsOpen(true);
  };

  /**
   * Uploads the recognized text as a JSON file to Firebase.
   * @param {string} name - The name of the image file.
   * @returns {Promise} A promise that resolves when the upload is complete.
   */
  async function uploadJsonData(name, text, imageRef) {
    text.imageURL = imageRef;
    const jsonString = JSON.stringify(text);
    const jsonBlob = new Blob([jsonString], { type: "application/json" });
    const jsonRef = ref(storage, `reciptdata/${name}/data.json`);
    await uploadBytes(jsonRef, jsonBlob);
  }

  /*
   * Uploads the selected image to Firebase and performs OCR on it.
   */
  const uploadSelectedImage = async () => {
    if (selectedImage == null) return;
    const timestamp = new Date().getTime();
    const newImageName = selectedImage.name + timestamp;

    try {
      setIsLoading(true);
      const compressedImage = await compressImage(
        selectedImage,
        1024 * 1024,
        0.7
      );
      console.log("Compressed image size:", compressedImage.size, "bytes");

      const imageRef = ref(storage, `reciptdata/${newImageName}/img.jpg`);
      await uploadBytes(imageRef, compressedImage);

      console.log("Image uploaded:", newImageName);
      const url = await getDownloadURL(imageRef);
      const translated = await OCR(url);
      await uploadJsonData(newImageName, translated, url);
      setRecognizedText(translated);
      setIsLoading(false);
      setModalIsOpen(false);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  return (
    <div className="home">
      <h1 className="page-title">Your Receipts</h1>
      {empty && (
        <div className="empty">
          <img src={Bill} alt="Bill" />
          <h2>No Receipts</h2>
          <p>Add a receipt and your transaction details will appear here.</p>
        </div>
      )}
      <div className="receipts">
        {receiptData.map((receipt, index) => (
          <Receipt key={index} data={receipt} />
        ))}
      </div>

      <label className="add-receipt">
        <img src={AddReceipt} alt="Add Receipt" />
        <span>Add Receipt</span>
        <input
          style={{ display: "none" }}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          ref={fileInputRef}
        />
      </label>
      {
        <ReceiptModal
          isOpen={modalIsOpen}
          onClose={closeModal}
          selectedImage={selectedImage}
          uploadSelectedImage={uploadSelectedImage}
          loading={isLoading}
        />
      }
      {recognizedText.valid === false && <Error />}
      <Footer />
    </div>
  );
}

export default Home;

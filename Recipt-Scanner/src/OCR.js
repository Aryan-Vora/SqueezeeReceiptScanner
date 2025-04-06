export async function OCR(image) {
  try {
    const response = await fetch(
      `https://extractfromimage-fue2u63e7a-uc.a.run.app?image=${encodeURIComponent(
        image
      )}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.text();
    const parsedData = JSON.parse(data);
    parsedData.imageURL = image;
    console.log("Response from Firebase Function:", parsedData);
    return parsedData;
  } catch (error) {
    console.error("Error calling Firebase Function:", error);
    throw error;
  }
}

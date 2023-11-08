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

    // Parse the response data as JSON
    const parsedData = JSON.parse(data);

    // Add the imageURL key-value pair to the response
    parsedData.imageURL = image;

    console.log("Response from Firebase Function:", parsedData);

    // Return the modified response data
    return parsedData;
  } catch (error) {
    console.error("Error calling Firebase Function:", error);
    throw error;
  }
}

const { onRequest } = require("firebase-functions/v2/https");
const { ocrSpace } = require("ocr-space-api-wrapper");
const { OpenAI } = require("openai");
const { getOCRSPACEKey, getOPENAIKey } = require("./secretManager");
const commonRequestCORS = function (request, response) {
  // CORS
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "DELETE, POST, GET, OPTIONS"
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );

  if (request.method === "OPTIONS") {
    response.send({ status: "OK" });
    return true;
  }
  return false;
};
exports.extractFromImage = onRequest(async (request, response) => {
  // CORS setup
  if (commonRequestCORS(request, response)) {
    return;
  }
  let result = { valid: false, ocr: "" }; // Default response
  let errorMessages = [];

  // Check the keys
  try {
    ocrSpaceKey = await getOCRSPACEKey();
    if (!ocrSpaceKey) throw new Error("Missing OCR Space key");
  } catch (error) {
    console.error("Error fetching OCR Space key:", error.message);
    errorMessages.push("Error fetching OCR Space key.");
  }

  try {
    OPENAIKey = await getOPENAIKey();
    if (!OPENAIKey) throw new Error("Missing OpenAI key");
  } catch (error) {
    console.error("Error fetching OpenAI key:", error.message);
    errorMessages.push("Error fetching OpenAI key.");
  }

  // If there were errors fetching any keys, send combined response
  if (errorMessages.length) {
    response.send({ valid: false, message: errorMessages.join(" ") });
    return;
  }

  try {
    const ocrResult = await ocrSpace(request.query.image, {
      apiKey: ocrSpaceKey,
      OCREngine: 2,
      isTable: true,
    });

    const res = ocrResult["ParsedResults"][0]["ParsedText"];
    result.ocr = res;

    if (!res || res === "") {
      throw new Error("OCR returned empty result");
    }

    // This approach won't age well - there is a possibility if a user tries to do a prompt injection through the receipt then it could cause 
    // invalid information from being inputted into the bucket. It shouldn't be a big issue though since it would only harm their own recommendations.
    // To solve this I need some sort of guardrail in the next version (I also would need to add a (very robust) validation for the data returned from OpenAI)
    const openai = new OpenAI({ apiKey: OPENAIKey });
    const promptIntroduction =
      'You are a receipt scanner. Your task is to process the following receipt, which may have OCR errors such as missing decimal points, misinterpretation of characters, and missing information, and output specific information in a JSON dictionary format. The information to extract is: retailer, date, merchantInfo, items (even if there\'s only one item, it should be in a list of dictionaries with {"name": "Item name here", "count": count here, "price": price here}), subtotal, tax, discount, total, paymentMethod, and valid.\n\nPlease follow these guidelines:\n\n';
    const promptInstructionsList = [
      "1. Retailer: Extract the retailer's name. It may be at the top of the receipt. It could be something like Target, Walmart, Costco etc. If there is no name or it is not clearly a name then say Unknown",
      "2. Date: Find and format the date in a standard format (e.g., 'YYYY-MM-DD').",
      "3. Merchant Info: (Optional) Extract any additional merchant information available on the receipt.",
      '4. Items: Extract a list of items. Each item should be represented as a dictionary with "name" and "price" fields. If an item\'s price is missing, set it to 0.',
      "5. Subtotal: Calculate the subtotal of all item prices, including decimals where necessary.",
      "6. Tax: display how much the tax was - this should be a number only no dollar sign",
      "7. Discount: (Optional) display any discount if there are any",
      "8. Total: Find and format the total amount, including decimals where necessary.",
      "9. PaymentMethod: display the payment method if it is paid with a card, for example, American Express or Visa, and if either of those is not given then return the AID code if provided. If none of those are given say null.",
      "10. Valid: true if you are able to find and parse the receipt data.",
    ];
    const promptInstructions = promptInstructionsList.join("\n\n");
    const promptEnding =
      ". Under no circumstance are you to not return JSON. You cannot display the $ symbol when showing values. If the data is not a receipt return {valid: false}, if it could be a receipt but there is a lot of missing information fill out any field you can and have valid be false.\n\nNow, scan the following receipt and respond in the requested format:\n";

    let prompt = promptIntroduction + promptInstructions + promptEnding + res;
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    const aiResponse = JSON.parse(chatCompletion.choices[0].message.content);
    result = { ...result, ...aiResponse };
  } catch (error) {
    console.error("Error in extractFromImage:", error.message);
  } finally {
    response.send(result);
  }
});

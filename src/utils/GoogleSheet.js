/** @format */
import SHEET from "./googleSheet.json";

const { GoogleSpreadsheet } = require("google-spreadsheet");
const GOOGLE_PRIVATE_KEY = SHEET.privateKey;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = SHEET.clientEmail;

export const Sheet = async () => {
  const doc = new GoogleSpreadsheet(SHEET.sheetId);

  await doc.useServiceAccountAuth({
    client_email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: GOOGLE_PRIVATE_KEY,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  // await doc.updateProperties({ title: " Token Bulk send" });

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
  const rows = await sheet.getRows();

  return { sheet, rows };
};
// Sheet();

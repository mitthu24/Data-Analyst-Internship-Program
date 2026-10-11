import QRCode from "qrcode";

/** Generates a PNG data URL QR code for the given URL, for use in <img src>. */
export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 320,
    margin: 1,
    color: { dark: "#0a1128", light: "#ffffff" },
  });
}

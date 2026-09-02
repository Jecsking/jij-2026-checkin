import QRCode from "qrcode";

export async function genererQrPngBuffer(contenu: string): Promise<Buffer> {
  return QRCode.toBuffer(contenu, {
    type: "png",
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
  });
}

export async function genererQrDataUrl(contenu: string): Promise<string> {
  return QRCode.toDataURL(contenu, {
    errorCorrectionLevel: "M",
    margin: 2,
    width: 320,
  });
}

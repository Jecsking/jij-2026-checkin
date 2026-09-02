import "server-only";

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

interface PieceJointe {
  nom: string;
  contenuBase64: string;
}

interface EnvoyerEmailParams {
  destinataireEmail: string;
  destinataireNom?: string;
  sujet: string;
  htmlContent: string;
  piecesJointes?: PieceJointe[];
}

interface BrevoSuccessResponse {
  messageId: string;
}

export class BrevoError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly details: unknown
  ) {
    super(message);
    this.name = "BrevoError";
  }
}

export async function envoyerEmailTransactionnel({
  destinataireEmail,
  destinataireNom,
  sujet,
  htmlContent,
  piecesJointes,
}: EnvoyerEmailParams): Promise<BrevoSuccessResponse> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? "JIJ 2026";
  const replyToEmail = process.env.BREVO_REPLY_TO_EMAIL;

  if (!apiKey || !senderEmail) {
    throw new Error(
      "BREVO_API_KEY et BREVO_SENDER_EMAIL doivent être configurés."
    );
  }

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: destinataireEmail, name: destinataireNom }],
      subject: sujet,
      htmlContent,
      ...(replyToEmail ? { replyTo: { email: replyToEmail } } : {}),
      ...(piecesJointes && piecesJointes.length > 0
        ? {
            attachment: piecesJointes.map((p) => ({
              name: p.nom,
              content: p.contenuBase64,
            })),
          }
        : {}),
    }),
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new BrevoError(
      `Échec de l'envoi Brevo (${response.status})`,
      response.status,
      body
    );
  }

  return { messageId: body?.messageId ?? "" };
}

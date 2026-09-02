export function emailConfirmationHtml(params: {
  nomComplet: string;
  lienConfirmation: string;
}) {
  const { nomComplet, lienConfirmation } = params;
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
    <h2 style="color: #0f766e;">Journée Internationale de la Jeunesse 2026</h2>
    <p>Bonjour ${nomComplet},</p>
    <p>
      Merci pour votre inscription à la JIJ 2026, organisée par le Parlement des Jeunes du Bénin.
      Merci de bien vouloir confirmer votre présence en cliquant sur le bouton ci-dessous.
    </p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${lienConfirmation}"
         style="background:#0f766e;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Je confirme ma présence
      </a>
    </p>
    <p>Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :</p>
    <p style="word-break: break-all;"><a href="${lienConfirmation}">${lienConfirmation}</a></p>
    <p>À très bientôt,<br/>L'équipe d'organisation de la JIJ 2026</p>
  </div>`;
}

const LIBELLES_ROLE: Record<string, string> = {
  admin: "administrateur(rice)",
  staff: "membre du staff d'entrée (contrôle d'accès)",
  jury: "membre du jury du hackathon",
};

const DESTINATIONS_ROLE: Record<string, string> = {
  admin: "/admin",
  staff: "/staff/scan",
  jury: "/jury",
};

export function emailIdentifiantsEquipeHtml(params: {
  nomComplet: string;
  email: string;
  motDePasse: string;
  role: "admin" | "staff" | "jury";
  appUrl: string;
}) {
  const { nomComplet, email, motDePasse, role, appUrl } = params;
  const lienConnexion = `${appUrl}/login`;
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
    <h2 style="color: #0f766e;">Vos accès — JIJ 2026</h2>
    <p>Bonjour ${nomComplet},</p>
    <p>
      Un compte ${LIBELLES_ROLE[role] ?? "membre de l'équipe"} vient d'être créé pour vous
      sur la plateforme JIJ 2026. Voici vos identifiants de connexion :
    </p>
    <p>
      Email : <strong>${email}</strong><br/>
      Mot de passe temporaire : <strong>${motDePasse}</strong>
    </p>
    <p style="text-align: center; margin: 32px 0;">
      <a href="${lienConnexion}"
         style="background:#0f766e;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Me connecter
      </a>
    </p>
    <p>
      Une fois connecté(e), vous serez redirigé(e) automatiquement vers votre espace
      (${appUrl}${DESTINATIONS_ROLE[role] ?? ""}). Vous pourrez changer ce mot de passe
      après votre première connexion, depuis « Mon compte ».
    </p>
    <p>Merci pour votre implication,<br/>L'équipe d'organisation de la JIJ 2026</p>
  </div>`;
}

export function emailQrHtml(params: { nomComplet: string; qrDataUrl: string }) {
  const { nomComplet, qrDataUrl } = params;
  return `
  <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
    <h2 style="color: #0f766e;">Votre badge d'accès — JIJ 2026</h2>
    <p>Bonjour ${nomComplet},</p>
    <p>
      Votre présence est confirmée. Voici votre QR code personnel, à présenter (sur téléphone
      ou imprimé) à l'entrée de l'événement pour le contrôle d'accès. Il est aussi joint à cet
      email en pièce jointe.
    </p>
    <p style="text-align:center;">
      <img src="${qrDataUrl}" alt="QR code d'accès" style="width:220px;height:220px;" />
    </p>
    <p>Ce code est unique et personnel, merci de ne pas le transférer.</p>
    <p>À très bientôt,<br/>L'équipe d'organisation de la JIJ 2026</p>
  </div>`;
}

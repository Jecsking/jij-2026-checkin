const ANIMAUX = [
  "🦁", "🐯", "🐻", "🐨", "🦊", "🐰", "🐼", "🐸",
  "🦉", "🐢", "🦅", "🐧", "🐬", "🦋", "🐝", "🐙",
  "🦄", "🐺", "🦓", "🐘",
];

export function avatarAnimal(cle: string): string {
  let hash = 0;
  for (let i = 0; i < cle.length; i++) {
    hash = (hash * 31 + cle.charCodeAt(i)) >>> 0;
  }
  return ANIMAUX[hash % ANIMAUX.length];
}

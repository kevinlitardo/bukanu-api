export default function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD') // separa las tildes/acentos
    .replace(/[\u0300-\u036f]/g, '') // elimina tildes
    .replace(/[^a-z0-9\s-]/g, '') // elimina caracteres no válidos
    .trim()
    .replace(/\s+/g, '-') // espacios -> guiones
    .replace(/-+/g, '-'); // elimina guiones repetidos
}

// serve pra pegar a data LOCAL do aparelho no formato AAAA-MM-DD (toISOString usaria UTC)
export function dataLocal(d: Date = new Date()): string {
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}
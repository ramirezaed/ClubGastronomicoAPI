export interface IPaginationDTO {
  page: number;
  limit: number;
}

export interface IPaginatedResponseDTO<T> {
  data: T[]; // T[] = un array de elementos del tipo T, sirve para cualquier entidad,
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

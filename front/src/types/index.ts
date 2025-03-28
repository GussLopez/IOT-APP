export type DataType = {
  "id": number,
  "nombre": string,
  "ubicacion": string,
  "responsable": string,
  "tipo_cultivo": string,
  "ultimo_riego": string,
  "sensor": Object
  "latitud": number,
  "longitud": number,
}

export type User = {
  id: number,
  name: string,
  phone: string,
  email: string,
}

export type LoginForm = Pick<User, 'email'> & {
  password: string
}

export type RegisterForm = Pick<User, 'name' | 'phone' | 'email'> & {
  password: string,
  password_confirmation: string
}

export type CustomJwtPayload = {
  id: number;
  name: string;
  email: string;
  exp?: number;
  iat?: number;
}
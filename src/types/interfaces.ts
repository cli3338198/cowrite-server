export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
  getUsers: () => void;
}

export interface ClientToServerEvents {
  hello: () => void;
  textChange: (delta: string) => void;
  getUsers: () => void;
  selectUsers: (id: User["id"]) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}

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
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {}

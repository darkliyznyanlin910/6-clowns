export interface IAlert {
  set: boolean;
  status: "success" | "error" | "neutral";
  message: string;
}
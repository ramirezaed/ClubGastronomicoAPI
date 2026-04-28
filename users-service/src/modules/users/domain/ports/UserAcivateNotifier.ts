export interface UserActivateNotifier {
  notify(data: { id: string; name: string; lastname: string; email: string }): Promise<void>;
}

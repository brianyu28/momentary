export function preventNonDigits(event: React.KeyboardEvent) {
  if (event.key < '0' || event.key > '9') {
    event.preventDefault();
  }
}
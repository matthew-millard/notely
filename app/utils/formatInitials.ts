export default function formatInitials({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}): string {
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}

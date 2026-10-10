import { redirect } from 'next/navigation'

export default function HomePage() {
  // Automatically redirects the root domain to the Deep Ocean Team Directory
  redirect('/team')
}

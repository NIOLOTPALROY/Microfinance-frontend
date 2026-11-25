import { LockKeyhole } from 'lucide-react'
import BrandLogo from '../components/BrandLogo'
import BrandPanel from '../components/BrandPanel'
import SignInForm from '../components/SignInForm'
import '../styles/login-page.css'

function LoginPage() {
  return (
    <main className="login-shell">
      <BrandPanel />

      <section className="form-panel" aria-label="Sign in">
        <div className="form-panel__top">
          <BrandLogo className="mobile-brand" />
          <a className="help-link" href="mailto:support@doortodoor.com">Need help? <span>Contact support</span></a>
        </div>

        <SignInForm />

        <footer className="form-footer">
          <span>© 2025 DoorToDoor, Inc.</span>
          <nav aria-label="Legal">
            <a href="mailto:privacy@doortodoor.com">Privacy</a>
            <a href="mailto:legal@doortodoor.com">Terms</a>
          </nav>
          <span className="secure-note"><LockKeyhole size={13} /> SECURE ACCESS</span>
        </footer>
      </section>
    </main>
  )
}

export default LoginPage

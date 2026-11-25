import { useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from 'lucide-react'
import useAuth from '../hooks/useAuth'

function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [mode, setMode] = useState<'login' | 'forgot-password'>('login')
  const [feedback, setFeedback] = useState('')
  const [validationError, setValidationError] = useState('')
  const {
    login,
    forgotPassword,
    isAuthenticating,
    isSendingPasswordReset,
    error,
    clearError,
  } = useAuth()

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const identifier = String(formData.get('identifier') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const rememberMe = formData.get('rememberMe') === 'on'
    clearError()
    setValidationError('')
    setFeedback('')

    if (!identifier) {
      setValidationError('Enter your work email or mobile number.')
      return
    }

    await login({ identifier, password, rememberMe })
  }

  async function handleForgotPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const identifier = String(formData.get('identifier') ?? '').trim()
    clearError()
    setValidationError('')
    setFeedback('')

    if (!identifier) {
      setValidationError('Enter your work email or mobile number.')
      return
    }

    const sent = await forgotPassword({ identifier })
    if (sent) {
      setFeedback('If an account matches, recovery instructions will be sent using the contact details on file.')
    }
  }

  return (
    <div className="form-wrap">
      <div className="form-heading">
        <span className="form-heading__tag">{mode === 'login' ? 'YOUR WORKSPACE AWAITS' : 'ACCOUNT RECOVERY'}</span>
        <h2>{mode === 'login' ? <>Welcome back<span>.</span></> : <>Reset access<span>.</span></>}</h2>
        <p>{mode === 'login' ? 'Sign in to pick up right where you left off.' : 'Enter your work email or mobile number to request recovery instructions.'}</p>
      </div>

      {mode === 'login' ? (
        <>
          <form className="login-form" onSubmit={handleLogin} aria-busy={isAuthenticating}>
            <label className="field-label" htmlFor="identifier">Work email or mobile number</label>
            <div className="input-wrap">
              <Mail className="input-icon" size={18} aria-hidden="true" />
              <input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="you@company.com or mobile number"
                autoComplete="username"
                required
                disabled={isAuthenticating}
              />
            </div>

            <div className="password-label">
              <label className="field-label" htmlFor="password">Password</label>
              <button
                className="text-button"
                type="button"
                onClick={() => {
                  clearError()
                  setValidationError('')
                  setFeedback('')
                  setMode('forgot-password')
                }}
              >
                Forgot password?
              </button>
            </div>
            <div className="input-wrap">
              <LockKeyhole className="input-icon" size={18} aria-hidden="true" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                disabled={isAuthenticating}
              />
              <button
                className="visibility-button"
                type="button"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isAuthenticating}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label className="remember-option">
              <input type="checkbox" name="rememberMe" disabled={isAuthenticating} />
              <span className="custom-checkbox" aria-hidden="true" />
              <span>Keep me signed in</span>
            </label>

            <button className="submit-button" type="submit" disabled={isAuthenticating}>
              <span>{isAuthenticating ? 'Signing in…' : 'Sign in to workspace'}</span>
              {isAuthenticating ? <LoaderCircle className="auth-spinner" size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
            </button>
            {(validationError || error) && <p className="form-message form-message--error" role="alert">{validationError || error}</p>}
            <div className="auth-note">
              <strong>Secure sign-in</strong>
              <span>Your password is sent only to the configured authentication service and is never stored by this app.</span>
            </div>
          </form>

          <div className="signup-prompt">
            <span>New to DoorToDoor?</span>
            <a href="mailto:sales@doortodoor.com">Talk to our team <ArrowRight size={15} /></a>
          </div>
        </>
      ) : (
        <form className="login-form auth-recovery-form" onSubmit={handleForgotPassword} aria-busy={isSendingPasswordReset}>
          <label className="field-label" htmlFor="recovery-identifier">Work email or mobile number</label>
          <div className="input-wrap">
            <Mail className="input-icon" size={18} aria-hidden="true" />
            <input
              id="recovery-identifier"
              name="identifier"
              type="text"
              autoComplete="username"
              placeholder="you@company.com or mobile number"
              required
              disabled={isSendingPasswordReset}
            />
          </div>
          <button className="submit-button" type="submit" disabled={isSendingPasswordReset}>
            <span>{isSendingPasswordReset ? 'Sending request…' : 'Request recovery instructions'}</span>
            {isSendingPasswordReset ? <LoaderCircle className="auth-spinner" size={18} aria-hidden="true" /> : <ArrowRight size={18} aria-hidden="true" />}
          </button>
          {(validationError || error) && <p className="form-message form-message--error" role="alert">{validationError || error}</p>}
          {feedback && <p className="form-message form-message--success" role="status">{feedback}</p>}
          <button
            className="recovery-back"
            type="button"
            onClick={() => {
              clearError()
              setValidationError('')
              setFeedback('')
              setMode('login')
            }}
          >
            <ArrowLeft size={14} /> Back to sign in
          </button>
          <div className="auth-note">
            <strong>Privacy protected</strong>
            <span>We show the same confirmation whether or not an account matches the details entered.</span>
          </div>
        </form>
      )}
    </div>
  )
}

export default SignInForm

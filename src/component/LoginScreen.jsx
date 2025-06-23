export default function LoginScreen({
  post,
  error,
  success,
  showPassword,
  keepLoggedIn,
  setShowPassword,
  setKeepLoggedIn,
  handleInput,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login :</h2>
      {error && <div className="asg10-error">{error}</div>}
      {success && <pre className="asg10-success">{success}</pre>}

      <label className="asg10-label">Email :</label>
      <input
        className="asg10-input"
        placeholder="Enter the email"
        onChange={handleInput}
        value={post.email}
        name="email"
      />
      <label className="asg10-label">Password :</label>
      <input
        className="asg10-input"
        placeholder="Enter the password"
        onChange={handleInput}
        value={post.password}
        name="password"
        type={showPassword ? "text" : "password"}
      />
      <div className="asg10-checkbox-row">
        <input
          type="checkbox"
          id="showPassword"
          checked={showPassword}
          onChange={() => setShowPassword(!showPassword)}
          className="asg10-checkbox"
        />
        <label htmlFor="showPassword" className="asg10-checkbox-label">
          Show Password
        </label>
        <input
          type="checkbox"
          id="keepLoggedIn"
          checked={keepLoggedIn}
          onChange={() => setKeepLoggedIn(!keepLoggedIn)}
          className="asg10-checkbox"
        />
        <label htmlFor="keepLoggedIn" className="asg10-checkbox-label">
          Keep me logged in
        </label>
      </div>
      <button
        className="btn-login"
        type="submit"
        disabled={!post.email || !post.password}
      >
        Submit
      </button>
    </form>
  );
}

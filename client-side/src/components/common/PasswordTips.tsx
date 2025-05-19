export default function PasswordTips({ password }: { password: string }) {
  return (
    <div className="rounded-md bg-gray-50 p-3">
      <p className="mb-1 text-xs font-medium text-gray-700">
        Password must contain:
      </p>
      <ul className="flex flex-col gap-1 text-xs text-gray-600">
        <PasswordTip
          isValid={password.length >= 8}
          label="At least 8 characters"
        />
        <PasswordTip
          isValid={/[A-Z]/.test(password)}
          label="One uppercase letter"
        />
        <PasswordTip
          isValid={/[a-z]/.test(password)}
          label="One lowercase letter"
        />
        <PasswordTip isValid={/[0-9]/.test(password)} label="One number" />
      </ul>
    </div>
  );
}

function PasswordTip({ isValid, label }: { isValid: boolean; label: string }) {
  return (
    <li
      className={`flex items-center gap-1 ${isValid ? 'text-green-600' : ''}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isValid ? 'bg-green-600' : 'bg-gray-400'}`}
      ></span>
      {label}
    </li>
  );
}

import bcrypt from "bcryptjs";

export function checkCreds(username, name, email, password, cpassword) {
  if (!username || !name || !email || !password || !cpassword) return { ok: false, payload: "No field should be empty" };
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test()) return { ok: false, payload: "Email should be in correct format" };

  if (password !== cpassword) return { ok: false, payload: "Passwords do not match" };

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{8,}$/;
  if (passwordRegex.test(password)) return { ok: false, payload: "Password should contain at least one character, alphabet and a number and contain 8 characters" }

  return { ok: true }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

export async function comparePassword(password, hashedPassword) {
  try {
    const match = await bcrypt.compare(password, hashedPassword)
    if(!match) return { status: false, payload: "Enter correct password" };
    return { status: true };
  } catch (error) {
    return { status: false, payload: error.message };
  }
}
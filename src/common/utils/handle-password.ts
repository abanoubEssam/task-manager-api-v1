import * as bcrypt from 'bcryptjs';

export async function hashPassword(password: string) {
  const salt = bcrypt.genSaltSync();
  return await bcrypt.hash(password, salt);
}

export const comparePasswords = async ({ candidatePassword, userPassword }: { candidatePassword: string, userPassword: string }): Promise<boolean | null> => {
  const isMatched = await bcrypt.compareSync(candidatePassword, userPassword);
  if (!isMatched) return null;
  return isMatched;
}
-- Allow motDePasseHash to be NULL for invited users who haven't set a password yet
ALTER TABLE "Utilisateur" ALTER COLUMN "motDePasseHash" DROP NOT NULL;

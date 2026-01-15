import { registerUser, isEmailExist } from "@/lib/server-actions/index";
import { hash } from "bcryptjs";
import { prisma } from "@/db/prisma";
import { GENERIC_ERROR_MESSAGE } from "@/lib/helpers/messages-helpers";

/**
 * EXEMPLE: Tests Unitaires pour Server Actions (Next.js)
 *
 * Ce qu'on teste:
 * - Validation des données
 * - Logique métier
 * - Appels à la base de données
 * - Gestion des erreurs
 * - Retours de la fonction
 */

jest.mock("@/db/prisma", () => {
  return {
    prisma: {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    },
  };
});

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("Auth server actions", () => {
  let initialState = { errors: {}, message: null };
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("signUp", () => {
    const validUserData = {
      name: "Test User",
      email: "testuser@example.com",
      password: "SecurePass123",
      role: "CLIENT",
    };
    describe("Validation", () => {
      it("should reject with empty role", async () => {
        const formData = new FormData();
        formData.set("name", validUserData.name);
        formData.set("email", validUserData.email);
        formData.set("password", validUserData.password);
        formData.set("confirmPassword", validUserData.password);
        formData.set("role", "");
        const result = await registerUser(initialState, formData);

        expect(result.errors).toHaveProperty("role");
      });
      it("should reject empty name", async () => {
        const formData = new FormData();
        formData.set("name", "");
        formData.set("email", validUserData.email);
        formData.set("password", validUserData.password);
        formData.set("confirmPassword", validUserData.password);
        formData.set("role", validUserData.role);
        const result = await registerUser(initialState, formData);

        expect(result.errors).toHaveProperty("name");
      });
      it("should reject invalid email format", async () => {
        const formData = new FormData();
        formData.set("name", validUserData.name);
        formData.set("email", "invalid-email");
        formData.set("password", validUserData.password);
        formData.set("confirmPassword", validUserData.password);
        formData.set("role", validUserData.role);
        const result = await registerUser(initialState, formData);

        expect(result.errors).toHaveProperty("email");
      });
      it("should reject weak password", async () => {
        const formData = new FormData();
        formData.set("name", validUserData.name);
        formData.set("email", validUserData.email);
        formData.set("password", "weak");
        formData.set("confirmPassword", "weak");
        formData.set("role", validUserData.role);
        const result = await registerUser(initialState, formData);

        expect(result.errors).toHaveProperty("password");
      });
      it("should reject non-matching passwords", async () => {
        const formData = new FormData();
        formData.set("name", validUserData.name);
        formData.set("email", validUserData.email);
        formData.set("password", validUserData.password);
        formData.set("confirmPassword", "DifferentPass123");
        formData.set("role", validUserData.role);
        const result = await registerUser(initialState, formData);

        expect(result.errors).toHaveProperty("confirmPassword");
      });
    });
  });
});

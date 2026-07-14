/**
 * Valida si un número telefónico tiene el formato correcto para WhatsApp (E.164 con código de país y signo '+').
 * @param phone El número ingresado por el usuario.
 * @returns Un objeto con el resultado de la validación, el número formateado y el mensaje de error si aplica.
 */
export function validateWhatsappNumber(phone: string): {
  isValid: boolean;
  formatted: string;
  error?: string;
} {
  if (!phone) {
    return {
      isValid: false,
      formatted: "",
      error: "El número de WhatsApp es obligatorio.",
    };
  }

  // Quitar espacios, guiones y paréntesis
  const clean = phone.replace(/[\s\-\(\)]/g, "");

  // Debe comenzar con '+'
  if (!clean.startsWith("+")) {
    return {
      isValid: false,
      formatted: "",
      error:
        "El número debe comenzar con el signo '+' seguido del código de país (ej. +51 para Perú, +57 para Colombia).",
    };
  }

  // Quitar el '+' para contar dígitos
  const digits = clean.slice(1);

  // Validar que solo contenga números
  if (!/^\d+$/.test(digits)) {
    return {
      isValid: false,
      formatted: "",
      error: "El número solo debe contener dígitos después del signo '+'.",
    };
  }

  // Validar longitud del número internacional (generalmente entre 10 y 15 dígitos con el código de país)
  // Por ejemplo, +51987654321 tiene 11 dígitos de número
  if (digits.length < 10 || digits.length > 15) {
    return {
      isValid: false,
      formatted: "",
      error:
        "El número de teléfono internacional es demasiado corto o largo (debe tener entre 10 y 15 dígitos después del '+').",
    };
  }

  return {
    isValid: true,
    formatted: clean,
  };
}

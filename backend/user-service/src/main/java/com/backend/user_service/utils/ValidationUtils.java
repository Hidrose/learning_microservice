package com.backend.user_service.utils;

public class ValidationUtils {

  private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$";

  private static final String PHONE_REGEX =
      "^(0?)(3[2-9]|5[689]|7[06-9]|8[0-689]|9[0-46-9])[0-9]{7}$";

  public static boolean validateEmail(String email) {
    return email != null && email.matches(EMAIL_REGEX);
  }

  public static boolean validatePhone(String phone) {
    return phone != null && phone.matches(PHONE_REGEX);
  }
}
package com.backend.auth_service.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.backend.auth_service.exception.ExternalServiceException;

@Service
public class EmailService {

    @Value("${spring.mail.username}")
    private String emailSender;

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String email, String otp) {

        if (email.equals(emailSender)) {
            throw new IllegalArgumentException("Không thể gửi OTP đến email này");
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();

            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    true,
                    "UTF-8");

            helper.setFrom(emailSender);
            helper.setTo(email);
            helper.setSubject("Mã xác minh của bạn là " + otp);
            helper.setText(buildOtpHtml(otp), true);

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new ExternalServiceException("Không thể gửi OTP đến email" + e);
        }
    }

    private String buildOtpHtml(String otp) {
        return String.format("""
                <div style="
                    padding-bottom: 20px;
                    padding-top: 20px;
                    max-width: 480px;
                    width: 100%%;
                    margin: 0 auto;
                ">
                  <div style="
                        border-style: solid;
                        border-width: thin;
                        border-color: #dadce0;
                        border-radius: 8px;
                        padding: 40px 20px;
                      " align="center">
                    <img
                      src="https://trolyaothat.onrender.com/assets/logo.png"
                      width="100px"
                      aria-hidden="true"
                      style="margin-bottom: 16px"
                      alt="Aura"
                    />
                    <div style="
                        font-size: 16px;
                        line-height: 20px;
                        padding-top: 20px;
                        text-align: center;
                        font-family: Arial, sans-serif;
                        color: black;
                    ">
                      <p>Mã xác minh của bạn:</p>
                      <h2 style="letter-spacing:8px;text-align:center;">%s</h2>
                      <p>Mã này chỉ dùng được một lần.</p>
                      <p>Mã sẽ hết hạn sau 10 phút.</p>
                    </div>
                  </div>
                </div>
                """, otp);
    }
}
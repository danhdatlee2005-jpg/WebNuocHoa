package com.ecommerce.auth.config;

import com.ecommerce.auth.entity.UserAuth;
import com.ecommerce.auth.repository.UserAuthRepository;
import com.ecommerce.common.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthDataInitializer implements CommandLineRunner {

    private final UserAuthRepository userAuthRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userAuthRepository.existsByEmail("admin@perfume.com")) {
            UserAuth admin = UserAuth.builder()
                    .email("admin@perfume.com")
                    .phoneNumber("0901234567")
                    .fullName("System Administrator")
                    .password(passwordEncoder.encode("Admin@123"))
                    .role(Role.ADMIN)
                    .active(true)
                    .blocked(false)
                    .build();
            userAuthRepository.save(admin);
            log.info("Default Admin account created: admin@perfume.com / Admin@123");
        }

        if (!userAuthRepository.existsByEmail("customer@perfume.com")) {
            UserAuth customer = UserAuth.builder()
                    .email("customer@perfume.com")
                    .phoneNumber("0987654321")
                    .fullName("Nguyen Van A")
                    .password(passwordEncoder.encode("Customer@123"))
                    .role(Role.CUSTOMER)
                    .active(true)
                    .blocked(false)
                    .build();
            userAuthRepository.save(customer);
            log.info("Default Customer account created: customer@perfume.com / Customer@123");
        }
    }
}

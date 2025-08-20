package com.pahanaedu;

import com.pahanaedu.model.User;
import com.pahanaedu.repository.UserRepository;
import jakarta.servlet.MultipartConfigElement; // Import this
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Set;

@SpringBootApplication
public class PahanaEduApplication {

	public static void main(String[] args) {
		SpringApplication.run(PahanaEduApplication.class, args);
	}

	// --- ADD THIS BEAN FOR FILE UPLOADS ---
	@Bean
	public MultipartConfigElement multipartConfigElement() {
		return new MultipartConfigElement("");
	}
	// -----------------------------------------

	@Bean
	CommandLineRunner run(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			// Check if an admin user already exists
			if (userRepository.findByUsername("admin").isEmpty()) {
				// Create a new admin user with both ADMIN and USER roles
				User admin = new User("admin", "admin@pahanaedu.com", passwordEncoder.encode("password"));
				admin.setRoles(Set.of("ROLE_ADMIN", "ROLE_USER")); // Assign both roles
				userRepository.save(admin);
			}
		};
	}
}
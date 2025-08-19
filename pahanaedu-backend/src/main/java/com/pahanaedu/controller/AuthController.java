package com.pahanaedu.controller;

import com.pahanaedu.model.User;
import com.pahanaedu.payload.request.LoginRequest;
import com.pahanaedu.payload.request.SignupRequest;
import com.pahanaedu.payload.response.MessageResponse;
import com.pahanaedu.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

        @Autowired
        AuthenticationManager authenticationManager;

        @Autowired
        UserRepository userRepository;

        @Autowired
        PasswordEncoder encoder;

        // We have temporarily removed the ImageUploadService for this test

        @PostMapping("/signin")
        public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest, HttpServletRequest request) {
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),
                                                loginRequest.getPassword()));

                SecurityContextHolder.getContext().setAuthentication(authentication);
                HttpSession session = request.getSession(true);
                session.setAttribute("SPRING_SECURITY_CONTEXT", SecurityContextHolder.getContext());

                return ResponseEntity.ok(new MessageResponse("Login successful!"));
        }

        // --- START OF SIMPLIFIED SIGNUP METHOD ---
        @PostMapping("/signup")
        public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
                if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                        return ResponseEntity.badRequest()
                                        .body(new MessageResponse("Error: Username is already taken!"));
                }

                if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                        return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
                }

                User user = new User(
                                signUpRequest.getUsername(),
                                signUpRequest.getEmail(),
                                encoder.encode(signUpRequest.getPassword()));

                user.setRoles(Set.of("ROLE_USER"));
                user.setFirstName(signUpRequest.getFirstName());
                user.setLastName(signUpRequest.getLastName());
                user.setPhoneNumber(signUpRequest.getPhoneNumber());
                user.setDefaultAddressLine1(signUpRequest.getAddressLine1());
                user.setDefaultAddressLine2(signUpRequest.getAddressLine2());
                user.setDefaultCity(signUpRequest.getCity());
                user.setDefaultPostalCode(signUpRequest.getPostalCode());
                user.setDefaultCountry(signUpRequest.getCountry());

                // The image upload logic is removed for this test
                userRepository.save(user);

                return ResponseEntity
                                .ok(new MessageResponse("User registered successfully using simplified endpoint!"));
        }
        // --- END OF SIMPLIFIED SIGNUP METHOD ---

        @PostMapping("/signout")
        public ResponseEntity<?> logoutUser(HttpServletRequest request) {
                HttpSession session = request.getSession(false);
                if (session != null) {
                        session.invalidate();
                }
                SecurityContextHolder.clearContext();
                return ResponseEntity.ok(new MessageResponse("Logout successful!"));
        }
}
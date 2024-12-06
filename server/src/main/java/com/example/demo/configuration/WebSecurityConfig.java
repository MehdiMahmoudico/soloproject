package com.example.demo.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.servlet.util.matcher.MvcRequestMatcher;
import org.springframework.web.servlet.handler.HandlerMappingIntrospector;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

import com.example.demo.repository.JwtRequestFilter;

@Configuration
public class WebSecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;

    public WebSecurityConfig(JwtRequestFilter jwtRequestFilter) {
        this.jwtRequestFilter = jwtRequestFilter;
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, HandlerMappingIntrospector introspector) throws Exception {
        MvcRequestMatcher adminMatcher = new MvcRequestMatcher(introspector, "/api/trips/delete/**");
        MvcRequestMatcher adminMatcherCreate = new MvcRequestMatcher(introspector, "/api/trips/create");
        MvcRequestMatcher adminMatcherCreates = new MvcRequestMatcher(introspector, "/api/trips/{tripId}/images");
        MvcRequestMatcher adminMatchergetreser = new MvcRequestMatcher(introspector, "/api/reservations/getAll");
        MvcRequestMatcher adminMatcherdeletereser= new MvcRequestMatcher(introspector, "/api/reservations/delete/{id}");
        MvcRequestMatcher adminMatchereditreserv = new MvcRequestMatcher(introspector, "/api/reservations/{id}/status");
        MvcRequestMatcher adminMatcheredittrip = new MvcRequestMatcher(introspector, "/api/trips/edit/{id}");
        MvcRequestMatcher authenticatedMatcher = new MvcRequestMatcher(introspector, "/home");

        http
            .cors(Customizer.withDefaults())
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(adminMatcher,adminMatcherCreate,adminMatcherCreates,adminMatchergetreser,adminMatcherdeletereser,adminMatchereditreserv).hasRole("ADMIN")
                .requestMatchers(authenticatedMatcher).authenticated()
                .requestMatchers(
                    "/", 
                    "/api/payments/{paymentId}/status",
                    "/api/payments/initiate",
                    "/api/clients/create",
                    "/api/payments",
                    "/api/clients/{id}/payment-ref",
                    "/api/clients/{id}",
                    "/api/trips",
                    "/api/trips/{id}",
                    "/api/reservations",
                    "/api/users/register",
                    "/api/users/login",
                    "/api/clients/countByEmail",
                    "/email/send"
                    
                ).permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class)
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/home", true)
                
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .permitAll()
            );

        return http.build();
    }
}
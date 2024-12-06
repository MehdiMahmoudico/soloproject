package com.example.demo.configuration;

import java.nio.file.Paths;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
@Configuration
public class WebConfig implements WebMvcConfigurer {
	  @Override
	  public void addResourceHandlers(ResourceHandlerRegistry registry) {
	        String uploadDir = Paths.get("C:/Users/pc/uploads").toUri().toString(); // Absolute path to your uploads folder
	        registry.addResourceHandler("/uploads/**")
	                .addResourceLocations(uploadDir);
	    }
	    
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow all paths
                .allowedOrigins("http://localhost:3000") // Your React frontend URL
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Allowed HTTP methods
                .allowedHeaders("*") // Allow all headers
                .allowCredentials(true); // Allow credentials if needed
    }
    
}
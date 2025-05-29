package real_time_event.ticketing_system.config;

/**
 * CORS configuration to allow cross-origin requests from frontend
 */

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer coresConfigurer(){


        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {

                // Configure CORS for all /api endpoints
                registry.addMapping("/api/**")
                        .allowedOrigins("*") // Your React app's URL
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("Access-Control-Allow-Origin","Content-Type", "Authorization")
                        //.allowCredentials(true)
                        .maxAge(3600);
            }
        };
   }
}
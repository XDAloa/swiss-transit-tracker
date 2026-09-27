package com.transit.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.web.client.RestClient;

@Configuration
@EnableMongoAuditing
public class RestClientConfig {

    @Bean
    RestClient transportRestClient(
            RestClient.Builder builder,
            @Value("${transport.api.base-url:https://transport.opendata.ch/v1}") String baseUrl) {
        return builder.baseUrl(baseUrl).build();
    }
}

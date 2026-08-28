package com.ecommerce.common.event;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEvent implements Serializable {
    private static final long serialVersionUID = 1L;

    @lombok.Builder.Default
    private String eventId = UUID.randomUUID().toString();
    private String eventType;
    @lombok.Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
    private String correlationId;

    public String getEventId() {
        if (this.eventId == null) {
            this.eventId = UUID.randomUUID().toString();
        }
        return this.eventId;
    }

    public LocalDateTime getTimestamp() {
        if (this.timestamp == null) {
            this.timestamp = LocalDateTime.now();
        }
        return this.timestamp;
    }
}

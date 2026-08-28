FROM eclipse-temurin:17-jre-alpine
ARG SERVICE_NAME
WORKDIR /app
COPY ${SERVICE_NAME}/target/${SERVICE_NAME}-1.0.0.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
